"use client";

import { useEffect, useState } from "react";
import { api, formatCurrency, formatRelativeTime } from "@/lib";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { CreditCard } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline" = (() => {
    switch (status) {
      case "success":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
      case "refunded":
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

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    api.admin.payments
      .list({ status: statusFilter || undefined, limit: 50 })
      .then((d) => {
        setPayments(d.payments);
        setTotal(d.total);
        setLoading(false);
      });
  }, [statusFilter]);

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
            <Select value={statusFilter || undefined} onValueChange={(v) => setStatusFilter(v ?? "")}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" >All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{total} payments</p>
          </div>
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
                    <TableHead>Ref</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id as string}>
                      <TableCell className="font-mono text-sm">
                        {(p.external_ref as string)?.slice(0, 12) ?? "—"}
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        {formatCurrency(p.amount as number)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {(p.channel as string) || "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={p.status as string} />
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {formatRelativeTime(p.created_at as string)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {payments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No payments found
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
