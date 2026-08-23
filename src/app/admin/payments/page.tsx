"use client";

import { useEffect, useState, useCallback } from "react";
import { api, formatCurrency, formatRelativeTime } from "@/lib";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type Column } from "@/components/admin/data-table";
import { CreditCard } from "lucide-react";

type PaymentRow = {
  id: string;
  external_ref: string;
  amount: number;
  channel: string;
  status: string;
  created_at: string;
};

const statusVariant = (s: string) => {
  switch (s) {
    case "success":
      return "default" as const;
    case "pending":
      return "secondary" as const;
    case "failed":
    case "refunded":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const pageSize = 20;

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    const d = await api.admin.payments.list({
      status: statusFilter || undefined,
      page,
      limit: pageSize,
    });
    setPayments(d.payments as PaymentRow[]);
    setTotal(d.total);
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    setPage(0);
  }, [statusFilter]);

  const columns: Column<PaymentRow>[] = [
    {
      key: "external_ref",
      header: "Ref",
      className: "font-mono text-sm",
      render: (p) => p.external_ref?.slice(0, 12) || "—",
    },
    {
      key: "amount",
      header: "Amount",
      className: "font-semibold text-primary",
      render: (p) => formatCurrency(p.amount),
    },
    {
      key: "channel",
      header: "Channel",
      className: "text-muted-foreground",
      render: (p) => p.channel || "—",
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <Badge variant={statusVariant(p.status)} className="capitalize">
          {p.status}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: "Date",
      className: "text-right text-muted-foreground text-sm",
      render: (p) => formatRelativeTime(p.created_at),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CreditCard className="size-6" />
          Payments
        </h1>
        <p className="text-sm text-muted-foreground">
          Transaction history and payment records
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <Select
              value={statusFilter || undefined}
              onValueChange={(v) => setStatusFilter(v ?? "")}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={payments}
            total={total}
            page={page}
            pageSize={pageSize}
            loading={loading}
            onPageChange={setPage}
            emptyMessage="No payments found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
