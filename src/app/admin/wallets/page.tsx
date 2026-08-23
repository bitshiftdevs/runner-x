"use client";

import { useEffect, useState } from "react";
import { api, formatCurrency, formatRelativeTime } from "@/lib";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet } from "lucide-react";

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.wallets.list({ limit: 50 }).then((d) => {
      setWallets(d.wallets);
      setTotal(d.total);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Wallet className="size-6" />
          Wallets
        </h1>
        <p className="text-sm text-muted-foreground">
          Runner wallet balances and earnings
        </p>
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm text-muted-foreground">{total} runner wallets</p>
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
                    <TableHead>Runner</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Total Earned</TableHead>
                    <TableHead>Withdrawn</TableHead>
                    <TableHead className="text-right">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallets.map((w) => {
                    const profile = w.profiles as Record<string, unknown> | null;
                    return (
                      <TableRow key={w.id as string}>
                        <TableCell className="font-medium">
                          {(profile?.full_name as string) ?? "Unknown"}
                        </TableCell>
                        <TableCell className="font-semibold text-emerald-600">
                          {formatCurrency(w.available_balance as number)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatCurrency(w.pending_balance as number)}
                        </TableCell>
                        <TableCell className="font-semibold text-primary">
                          {formatCurrency(w.total_earned as number)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatCurrency(w.total_withdrawn as number)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">
                          {formatRelativeTime(w.updated_at as string)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {wallets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No wallets found
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
