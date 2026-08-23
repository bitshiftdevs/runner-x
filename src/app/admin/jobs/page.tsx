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
import { Briefcase } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline" = (() => {
    switch (status) {
      case "posted":
      case "accepted":
      case "heading_to_vendor":
      case "at_vendor":
      case "heading_to_delivery":
        return "secondary";
      case "delivered":
      case "confirmed":
        return "default";
      case "cancelled":
      case "disputed":
        return "destructive";
      default:
        return "outline";
    }
  })();

  return (
    <Badge variant={variant} className="capitalize">
      {status?.replace(/_/g, " ")}
    </Badge>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    api.admin.jobs
      .list({ status: statusFilter || undefined, limit: 50 })
      .then((d) => {
        setJobs(d.jobs);
        setTotal(d.total);
        setLoading(false);
      });
  }, [statusFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Briefcase className="size-6" />
          Jobs
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage all platform jobs
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <Select value={statusFilter || undefined} onValueChange={(v) => setStatusFilter(v ?? "")}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" >All Statuses</SelectItem>
                <SelectItem value="posted">Posted</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="heading_to_vendor">
                  Heading to Vendor
                </SelectItem>
                <SelectItem value="at_vendor">At Vendor</SelectItem>
                <SelectItem value="heading_to_delivery">
                  Heading to Delivery
                </SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{total} jobs</p>
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
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead className="text-right">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((j) => (
                    <TableRow key={j.id as string}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {j.title as string}
                      </TableCell>
                      <TableCell className="text-muted-foreground capitalize">
                        {j.category as string}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={j.status as string} />
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        {formatCurrency(j.total_fee as number)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {formatRelativeTime(j.created_at as string)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {jobs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No jobs found
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
