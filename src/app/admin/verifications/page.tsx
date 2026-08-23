"use client";

import { useEffect, useState } from "react";
import { api, formatRelativeTime } from "@/lib";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShieldCheck, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

type Verification = {
  id: string;
  fullName: string;
  phone: string;
  studentIdUrl: string;
  campus: string;
  createdAt: string;
};

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Verification | null>(null);

  useEffect(() => {
    api.admin.verifications.list().then((d) => {
      setVerifications(d.users ?? []);
      setLoading(false);
    });
  }, []);

  const handleApprove = (id: string) => {
    api.admin.verifications.approve(id);
    setVerifications((prev) => prev.filter((u) => u.id !== id));
    setSelected(null);
  };

  const handleReject = (id: string) => {
    api.admin.verifications.reject(id);
    setVerifications((prev) => prev.filter((u) => u.id !== id));
    setSelected(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="size-6" />
          Verifications
        </h1>
        <p className="text-sm text-muted-foreground">
          Review and approve student ID submissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Pending Reviews
            {!loading && verifications.length > 0 && (
              <Badge variant="secondary">{verifications.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : verifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="size-12 text-emerald-500 mb-3" />
              <p className="text-sm text-muted-foreground">
                All caught up — no pending verifications
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {verifications.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelected(v)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelected(v);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex flex-col min-w-0 gap-1">
                    <span className="font-medium">{v.fullName}</span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{v.campus || "No campus"}</span>
                      <span>{v.phone || "No phone"}</span>
                      <span>{formatRelativeTime(v.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(v.id);
                      }}
                    >
                      <XCircle data-icon="inline-start" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(v.id);
                      }}
                    >
                      <CheckCircle2 data-icon="inline-start" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image preview dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.fullName}</DialogTitle>
            <DialogDescription>
              {selected?.campus} · {selected?.phone}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {selected?.studentIdUrl ? (
              <div className="relative overflow-hidden rounded-lg border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.studentIdUrl}
                  alt={`Student ID for ${selected.fullName}`}
                  className="w-full object-contain max-h-[500px]"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 rounded-lg border border-dashed text-muted-foreground text-sm">
                No student ID image submitted
              </div>
            )}

            <div className="flex items-center justify-between">
              <a
                href={selected?.studentIdUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                Open full size <ExternalLink className="size-3" />
              </a>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => selected && handleReject(selected.id)}
                >
                  <XCircle data-icon="inline-start" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => selected && handleApprove(selected.id)}
                >
                  <CheckCircle2 data-icon="inline-start" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
