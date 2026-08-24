"use client";

import { BarChart3, Layers, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib";
import { gqlFetch } from "@/lib/gql-client-browser";
import { ANALYTICS_STATS } from "@/lib/graphql/operations";

type DailyMetric = { date: string; count: number; amount: number };
type CategoryBreakdown = { category: string; count: number; revenue: number };

type AnalyticsData = {
  dailyRevenue: DailyMetric[];
  dailyErrands: DailyMetric[];
  dailyUsers: DailyMetric[];
  categoryBreakdown: CategoryBreakdown[];
};

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const errandsChartConfig = {
  errands: {
    label: "Errands",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const usersChartConfig = {
  users: {
    label: "New Users",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const categoryColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function formatDate(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    gqlFetch<{ analyticsStats: AnalyticsData }>(ANALYTICS_STATS)
      .then((d) => {
        setData(d.analyticsStats);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load analytics");
        setLoading(false);
      });
  }, []);

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const revenueData = data.dailyRevenue.map((d) => ({
    date: formatDate(d.date),
    revenue: formatCurrency(d.amount),
  }));

  const errandsData = data.dailyErrands.map((d) => ({
    date: formatDate(d.date),
    errands: d.count,
  }));

  const usersData = data.dailyUsers.map((d) => ({
    date: formatDate(d.date),
    users: d.count,
  }));

  const totalRevenue = data.dailyRevenue.reduce((s, d) => s + d.amount, 0);
  const totalErrands = data.dailyErrands.reduce((s, d) => s + d.count, 0);
  const totalUsers = data.dailyUsers.reduce((s, d) => s + d.count, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="size-6" />
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Platform insights for the last 30 days
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue (30d)
            </CardTitle>
            <BarChart3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Errands (30d)
            </CardTitle>
            <Layers className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalErrands}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Users (30d)
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue over time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No revenue data yet
              </p>
            ) : (
              <ChartContainer config={revenueChartConfig} className="h-62.5">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `₵${v}`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="revenue"
                      fill="var(--color-revenue)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Errand volume */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Errand Volume</CardTitle>
          </CardHeader>
          <CardContent>
            {errandsData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No errand data yet
              </p>
            ) : (
              <ChartContainer config={errandsChartConfig} className="h-62.5">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={errandsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="errands"
                      stroke="var(--color-errands)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* User growth */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Users</CardTitle>
          </CardHeader>
          <CardContent>
            {usersData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No user data yet
              </p>
            ) : (
              <ChartContainer config={usersChartConfig} className="h-62.5">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usersData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="users"
                      fill="var(--color-users)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Category breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {data.categoryBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No category data yet
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {data.categoryBreakdown.map((cat, i) => {
                  const maxCount = Math.max(
                    ...data.categoryBreakdown.map((c) => c.count),
                  );
                  const pct = maxCount > 0 ? (cat.count / maxCount) * 100 : 0;
                  return (
                    <div key={cat.category} className="flex items-center gap-3">
                      <div className="w-24 shrink-0">
                        <Badge variant="outline" className="capitalize text-xs">
                          {cat.category}
                        </Badge>
                      </div>
                      <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden">
                        <div
                          className="h-full rounded-md transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor:
                              categoryColors[i % categoryColors.length],
                          }}
                        />
                      </div>
                      <div className="w-16 text-right text-xs text-muted-foreground">
                        {cat.count}
                      </div>
                      <div className="w-20 text-right text-xs font-medium">
                        {formatCurrency(cat.revenue)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
