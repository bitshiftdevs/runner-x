"use client";

import { useEffect, useState } from "react";
import { api, formatRelativeTime } from "@/lib";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Search } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline" = (() => {
    switch (status) {
      case "approved":
      case "verified":
      case "success":
      case "confirmed":
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
      case "failed":
      case "cancelled":
      case "disputed":
        return "destructive";
      default:
        return "outline";
    }
  })();

  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    api.admin.users
      .list({
        search: search || undefined,
        role: roleFilter || undefined,
        limit: 50,
      })
      .then((d) => {
        setUsers(d.users);
        setTotal(d.total);
        setLoading(false);
      });
  }, [search, roleFilter]);

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
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter || undefined} onValueChange={(v) => setRoleFilter(v ?? "")}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" >All Roles</SelectItem>
                <SelectItem value="runner">Runner</SelectItem>
                <SelectItem value="requester">Requester</SelectItem>
                <SelectItem value="both">Both</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">{total} users</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id as string}>
                      <TableCell className="font-medium">
                        {u.full_name as string}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {(u.role as string) || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {(u.default_campus as string) || "—"}
                      </TableCell>
                      <TableCell>{(u.rating as number) || 0}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={(u.student_id_status as string) || "pending"}
                        />
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {formatRelativeTime(u.created_at as string)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
