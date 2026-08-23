"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
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
import { Briefcase } from "lucide-react";

type JobRow = {
  id: string;
  title: string;
  category: string;
  status: string;
  total_fee: number;
  created_at: string;
};

const statusVariant = (s: string) => {
  switch (s) {
    case "posted":
    case "accepted":
    case "heading_to_vendor":
    case "at_vendor":
    case "heading_to_delivery":
      return "secondary" as const;
    case "delivered":
    case "confirmed":
      return "default" as const;
    case "cancelled":
    case "disputed":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const pageSize = 20;

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const d = await api.admin.jobs.list({
      status: statusFilter || undefined,
      page,
      limit: pageSize,
    });
    setJobs(d.jobs as JobRow[]);
    setTotal(d.total);
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    setPage(0);
  }, [statusFilter]);

  const columns: Column<JobRow>[] = [
    {
      key: "title",
      header: "Title",
      className: "font-medium max-w-[200px] truncate",
      render: (j) => (
        <Link
          href={`/admin/jobs/${j.id}`}
          className="hover:underline text-primary"
        >
          {j.title}
        </Link>
      ),
    },
    {
      key: "category",
      header: "Category",
      className: "text-muted-foreground capitalize",
      render: (j) => j.category,
    },
    {
      key: "status",
      header: "Status",
      render: (j) => (
        <Badge variant={statusVariant(j.status)} className="capitalize">
          {j.status?.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "total_fee",
      header: "Fee",
      className: "font-semibold text-primary",
      render: (j) => formatCurrency(j.total_fee),
    },
    {
      key: "created_at",
      header: "Created",
      className: "text-right text-muted-foreground text-sm",
      render: (j) => formatRelativeTime(j.created_at),
    },
  ];

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
            <Select
              value={statusFilter || undefined}
              onValueChange={(v) => setStatusFilter(v ?? "")}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
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
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={jobs}
            total={total}
            page={page}
            pageSize={pageSize}
            loading={loading}
            onPageChange={setPage}
            emptyMessage="No jobs found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
