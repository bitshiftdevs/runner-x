"use client";

import { useEffect, useState, useCallback } from "react";
import { api, formatRelativeTime } from "@/lib";
import { gqlFetch } from "@/lib/gql-client-browser";
import {
  BAN_USER,
  UNBAN_USER,
  SEND_ADMIN_NOTIFICATION,
  SEND_BULK_ADMIN_NOTIFICATION,
} from "@/lib/graphql/operations";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/admin/data-table";
import { AvatarUser } from "@/components/admin/avatar-user";
import {
  Users,
  Search,
  MoreVertical,
  Bell,
  Ban,
  CheckCircle2,
} from "lucide-react";

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

type NotifTarget = "user" | "selected" | "all";

type NotifModal = {
  open: boolean;
  target: NotifTarget;
  userId?: string;
  userName?: string;
};

type SendStatus = "idle" | "sending" | "ok" | "error";

const CLOSED_MODAL: NotifModal = { open: false, target: "user" };

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<NotifModal>(CLOSED_MODAL);
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

  useEffect(() => {
    setPage(0);
    setSelected(new Set());
  }, [search, roleFilter]);

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleSelectAll = () => {
    const pageIds = users.map((u) => u.id);
    const allSelected = pageIds.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

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

  const openUserNotif = (user: UserRow) =>
    setModal({ open: true, target: "user", userId: user.id, userName: user.full_name });

  const openBulkNotif = () =>
    setModal({ open: true, target: selected.size > 0 ? "selected" : "all" });

  const allOnPageSelected =
    users.length > 0 && users.every((u) => selected.has(u.id));

  const columns: Column<UserRow>[] = [
    {
      key: "__check__",
      header: "",
      className: "w-0 pr-0",
      render: (u) => (
        <input
          type="checkbox"
          checked={selected.has(u.id)}
          onChange={() => toggleSelect(u.id)}
          className="size-4 cursor-pointer accent-primary"
          aria-label={`Select ${u.full_name}`}
        />
      ),
    },
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
      <div className="flex items-start justify-between gap-4">
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
        <Button size="sm" onClick={openBulkNotif}>
          <Bell className="size-4 mr-1.5" />
          {selected.size > 0 ? `Notify ${selected.size} Selected` : "Notify All Users"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allOnPageSelected}
                onChange={toggleSelectAll}
                className="size-4 cursor-pointer accent-primary"
                aria-label="Select all on page"
              />
            </div>
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
            actions={(u) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon-sm" variant="ghost" aria-label="Actions">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openUserNotif(u)}>
                    <Bell className="size-4" />
                    Send Notification
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {u.banned ? (
                    <DropdownMenuItem onClick={() => handleBanToggle(u)}>
                      <CheckCircle2 className="size-4" />
                      Unban
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => handleBanToggle(u)}
                    >
                      <Ban className="size-4" />
                      Ban
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </CardContent>
      </Card>

      <NotificationModal
        modal={modal}
        selectedCount={selected.size}
        selectedIds={Array.from(selected)}
        onClose={() => setModal(CLOSED_MODAL)}
      />
    </div>
  );
}

function NotificationModal({
  modal,
  selectedCount,
  selectedIds,
  onClose,
}: {
  modal: NotifModal;
  selectedCount: number;
  selectedIds: string[];
  onClose: () => void;
}) {
  const [target, setTarget] = useState<NotifTarget>(modal.target);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<SendStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (modal.open) {
      setTarget(modal.target);
      setTitle("");
      setBody("");
      setStatus("idle");
      setErrorMsg("");
    }
  }, [modal.open, modal.target]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      if (target === "all") {
        await gqlFetch(SEND_BULK_ADMIN_NOTIFICATION, { title, body });
      } else if (target === "user" && modal.userId) {
        await gqlFetch(SEND_ADMIN_NOTIFICATION, {
          userId: modal.userId,
          title,
          body,
        });
      } else {
        await Promise.all(
          selectedIds.map((userId) =>
            gqlFetch(SEND_ADMIN_NOTIFICATION, { userId, title, body }),
          ),
        );
      }
      setStatus("ok");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to send");
      setStatus("error");
    }
  };

  const targetLabel =
    target === "user"
      ? modal.userName ?? "User"
      : target === "selected"
        ? `${selectedCount} selected user${selectedCount !== 1 ? "s" : ""}`
        : "All users";

  return (
    <Dialog open={modal.open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSend} className="flex flex-col gap-4">
          {modal.target !== "user" && (
            <div className="flex gap-2">
              {selectedCount > 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant={target === "selected" ? "default" : "outline"}
                  onClick={() => setTarget("selected")}
                >
                  {selectedCount} Selected
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant={target === "all" ? "default" : "outline"}
                onClick={() => setTarget("all")}
              >
                All Users
              </Button>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Sending to:{" "}
            <span className="font-medium text-foreground">{targetLabel}</span>
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="notif-title">
              Title
            </label>
            <Input
              id="notif-title"
              placeholder="Notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="notif-body">
              Message
            </label>
            <textarea
              id="notif-body"
              placeholder="Notification body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              required
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>

          {status === "ok" && (
            <p className="text-sm text-green-600">Notification sent.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-destructive">{errorMsg}</p>
          )}

          <DialogFooter showCloseButton>
            <Button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
