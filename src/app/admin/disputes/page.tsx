"use client";

import { useEffect, useState } from "react";
import { api, formatCurrency, formatRelativeTime } from "@/lib";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  MapPin,
  User,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

type Dispute = {
  id: string;
  title: string;
  description: string;
  disputeReason: string;
  totalFee: string;
  status: string;
  category: string;
  urgency: string;
  pickupAddress: string;
  deliveryAddress: string;
  requester: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
    rating: number;
  } | null;
  runner: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
    rating: number;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [refundRequester, setRefundRequester] = useState(false);

  useEffect(() => {
    api.admin.disputes.list().then((d) => {
      setDisputes(d.disputes ?? []);
      setLoading(false);
    });
  }, []);

  const handleResolve = (id: string) => {
    api.admin.disputes.resolve(id, {
      resolution: "resolved",
      refundRequester,
    });
    setDisputes((prev) => prev.filter((d) => d.id !== id));
    setSelected(null);
    setRefundRequester(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <AlertTriangle className="size-6" />
          Disputes
        </h1>
        <p className="text-sm text-muted-foreground">
          Review and resolve disputed errands
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Active Disputes
            {!loading && disputes.length > 0 && (
              <Badge variant="destructive">{disputes.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : disputes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="size-12 text-emerald-500 mb-3" />
              <p className="text-sm text-muted-foreground">
                No active disputes — all clear
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {disputes.map((d) => (
                <div
                  key={d.id}
                  className="rounded-lg border border-l-4 border-l-destructive p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelected(d);
                    setRefundRequester(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelected(d);
                      setRefundRequester(false);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{d.title}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="capitalize text-xs">
                          {d.category}
                        </Badge>
                        <span>{formatRelativeTime(d.createdAt)}</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {formatCurrency(d.totalFee)}
                    </span>
                  </div>
                  {d.disputeReason && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      <span className="font-medium text-foreground">Reason: </span>
                      {d.disputeReason}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {d.requester && (
                      <span className="flex items-center gap-1">
                        <User className="size-3" />
                        Requester: {d.requester.fullName}
                      </span>
                    )}
                    {d.runner && (
                      <span className="flex items-center gap-1">
                        <User className="size-3" />
                        Runner: {d.runner.fullName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dispute detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              {selected?.category} · Created {selected && formatRelativeTime(selected.createdAt)}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Errand details */}
            <div className="flex flex-col gap-2 text-sm">
              {selected?.description && (
                <p className="text-muted-foreground">{selected.description}</p>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Fee</span>
                  <span className="font-semibold">
                    {selected && formatCurrency(selected.totalFee)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <Badge variant="destructive" className="w-fit capitalize">
                    {selected?.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Locations */}
              {selected?.pickupAddress && (
                <div className="flex items-start gap-2 text-xs">
                  <MapPin className="size-3 mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Pickup: </span>
                    {selected.pickupAddress}
                  </div>
                </div>
              )}
              {selected?.deliveryAddress && (
                <div className="flex items-start gap-2 text-xs">
                  <MapPin className="size-3 mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Delivery: </span>
                    {selected.deliveryAddress}
                  </div>
                </div>
              )}

              <Separator />

              {/* Participants */}
              <div className="grid grid-cols-2 gap-3">
                {selected?.requester && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Requester</span>
                    <span className="text-sm font-medium">
                      {selected.requester.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Rating: {selected.requester.rating}
                    </span>
                  </div>
                )}
                {selected?.runner && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Runner</span>
                    <span className="text-sm font-medium">
                      {selected.runner.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Rating: {selected.runner.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Dispute reason */}
              {selected?.disputeReason && (
                <>
                  <Separator />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Dispute Reason
                    </span>
                    <p className="text-sm">{selected.disputeReason}</p>
                  </div>
                </>
              )}
            </div>

            {/* Refund toggle */}
            <Separator />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={refundRequester}
                  onChange={(e) => setRefundRequester(e.target.checked)}
                  className="rounded border-input"
                />
                <RotateCcw className="size-4 text-muted-foreground" />
                Refund requester
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelected(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => selected && handleResolve(selected.id)}
            >
              <CheckCircle2 data-icon="inline-start" />
              Resolve Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
