"use client";

import { CreditCard } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { type Column, DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, formatRelativeTime } from "@/lib";
import { formatCurrency } from "@/lib/formatters";

type PaymentRow = {
  id: string;
  external_ref: string;
  amount: number;
  channel: string | null;
  payer: string | null;
  runner_share: number;
  platform_share: number;
  paystack_fee: number;
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
      key: "payer",
      header: "Payer",
      className: "text-muted-foreground text-sm",
      render: (p) => p.payer || "—",
    },
    {
      key: "channel",
      header: "Channel",
      className: "text-muted-foreground capitalize",
      render: (p) => p.channel?.replaceAll("_", " ") || "—",
    },
    {
      key: "amount",
      header: "Total",
      className: "font-semibold",
      render: (p) => formatCurrency(p.amount),
    },
    {
      key: "runner_share",
      header: "Runner",
      className: "text-muted-foreground",
      render: (p) => {
        return formatCurrency(p.runner_share);
      },
    },
    {
      key: "platform_share",
      header: "Platform",
      className: "text-emerald-600 font-medium",
      render: (p) => formatCurrency(p.platform_share),
    },
    {
      key: "paystack_fee",
      header: "Paystack Fee",
      className: "text-muted-foreground",
      render: (p) => formatCurrency(p.paystack_fee),
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
              <SelectTrigger className="w-full sm:w-40">
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
