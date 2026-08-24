"use client";

import { useEffect, useState, useCallback } from "react";
import { api, formatRelativeTime } from "@/lib";
import { gqlFetch } from "@/lib/gql-client-browser";
import { BAN_USER, UNBAN_USER } from "@/lib/graphql/operations";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type Column } from "@/components/admin/data-table";
import { AvatarUser } from "@/components/admin/avatar-user";
import { Users, Search, Ban, CheckCircle2 } from "lucide-react";

type UserRow = {
  id: string;
  full_name: string;
  role: string;
  default_campus: string | null;
  rating: number;
  student_id_status: string;
  banned: boolean;
  created_at: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const pageSize = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.admin.users.list({
        search: search || undefined,
        role: roleFilter || undefined,
        page,
        limit: pageSize,
      });
      setUsers(d.users as UserRow[]);
      setTotal(d.total);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setPage(0);
  }, [search, roleFilter]);

  const handleBanToggle = async (user: UserRow) => {
    if (user.banned) {
      await gqlFetch(UNBAN_USER, { userId: user.id });
    } else {
      await gqlFetch(BAN_USER, { userId: user.id, reason: "admin_ban" });
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, banned: !u.banned } : u)),
    );
  };

  const columns: Column<UserRow>[] = [
    {
      key: "full_name",
      header: "User",
      render: (u) => (
        <div className="flex flex-col gap-1">
          <AvatarUser name={u.full_name} subtitle={u.default_campus} />
          {u.banned && (
            <Badge variant="destructive" className="w-fit text-xs ml-11">
              Banned
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (u) => (
        <Badge variant="outline" className="capitalize">
          {u.role || "—"}
        </Badge>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (u) => String(u.rating ?? 0),
    },
    {
      key: "student_id_status",
      header: "Status",
      render: (u) => {
        const variant =
          u.student_id_status === "approved"
            ? "default"
            : u.student_id_status === "rejected"
              ? "destructive"
              : "secondary";
        return (
          <Badge variant={variant} className="capitalize">
            {u.student_id_status || "pending"}
          </Badge>
        );
      },
    },
    {
      key: "created_at",
      header: "Joined",
      className: "text-right text-muted-foreground text-sm",
      render: (u) => formatRelativeTime(u.created_at),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="size-6" />
          Users
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage platform users and verification status
        </p>
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={roleFilter || undefined}
              onValueChange={(v) => setRoleFilter(v ?? "")}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="runner">Runner</SelectItem>
                <SelectItem value="requester">Requester</SelectItem>
                <SelectItem value="both">Both</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            total={total}
            page={page}
            pageSize={pageSize}
            loading={loading}
            onPageChange={setPage}
            emptyMessage="No users found"
            actions={(u) =>
              u.banned ? (
                <Button size="sm" variant="outline" onClick={() => handleBanToggle(u)}>
                  <CheckCircle2 data-icon="inline-start" />
                  Unban
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => handleBanToggle(u)}
                >
                  <Ban data-icon="inline-start" />
                  Ban
                </Button>
              )
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
