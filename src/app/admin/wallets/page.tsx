"use client";

import { useEffect, useState, useCallback } from "react";
import { api, formatCurrency, formatRelativeTime } from "@/lib";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Wallet } from "lucide-react";

type WalletRow = {
  id: string;
  profiles: { full_name: string } | null;
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  total_withdrawn: number;
  updated_at: string;
};

export default function WalletsPage() {
  const [wallets, setWallets] = useState<WalletRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 20;

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.admin.wallets.list({ page, limit: pageSize });
      setWallets(d.wallets as WalletRow[]);
      setTotal(d.total);
    } catch {
      setError("Failed to load wallets");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const columns: Column<WalletRow>[] = [
    {
      key: "profiles",
      header: "Runner",
      className: "font-medium",
      render: (w) => w.profiles?.full_name ?? "Unknown",
    },
    {
      key: "available_balance",
      header: "Available",
      className: "font-semibold text-emerald-600",
      render: (w) => formatCurrency(w.available_balance),
    },
    {
      key: "pending_balance",
      header: "Pending",
      className: "text-muted-foreground",
      render: (w) => formatCurrency(w.pending_balance),
    },
    {
      key: "total_earned",
      header: "Total Earned",
      className: "font-semibold text-primary",
      render: (w) => formatCurrency(w.total_earned),
    },
    {
      key: "total_withdrawn",
      header: "Withdrawn",
      className: "text-muted-foreground",
      render: (w) => formatCurrency(w.total_withdrawn),
    },
    {
      key: "updated_at",
      header: "Updated",
      className: "text-right text-muted-foreground text-sm",
      render: (w) => formatRelativeTime(w.updated_at),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Wallet className="size-6" />
          Wallets
        </h1>
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        <p className="text-sm text-muted-foreground">
          Runner wallet balances and earnings
        </p>
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm text-muted-foreground">
            {total} runner wallets
          </p>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={wallets}
            total={total}
            page={page}
            pageSize={pageSize}
            loading={loading}
            onPageChange={setPage}
            emptyMessage="No wallets found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
