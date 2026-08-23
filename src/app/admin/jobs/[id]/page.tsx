"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatCurrency, formatRelativeTime, formatDistance } from "@/lib";
import { gqlFetch } from "@/lib/gql-client-browser";
import { ERRAND_QUERY, UPDATE_ERRAND_STATUS } from "@/lib/graphql/operations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  MapPin,
  User,
  Clock,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

type ErrandDetail = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  urgency: string;
  status: string;
  totalFee: number;
  pickupAddress: string | null;
  deliveryAddress: string | null;
  pickupLat: number | null;
  pickupLng: number | null;
  deliveryLat: number | null;
  deliveryLng: number | null;
  createdAt: string;
  expiresAt: string | null;
  confirmedAt: string | null;
  runnerAcceptedAt: string | null;
  requester: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    rating: number;
  } | null;
  runner: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    rating: number;
  } | null;
};

const STATUS_OPTIONS = [
  "posted",
  "pending",
  "accepted",
  "heading_to_vendor",
  "at_vendor",
  "heading_to_delivery",
  "delivered",
  "confirmed",
  "cancelled",
  "disputed",
  "expired",
];

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

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [errand, setErrand] = useState<ErrandDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    gqlFetch<{ errand: ErrandDetail }>(ERRAND_QUERY, { id }).then((d) => {
      setErrand(d.errand);
      setNewStatus(d.errand.status);
      setLoading(false);
    });
  }, [id]);

  const handleForceStatus = async () => {
    if (!errand || newStatus === errand.status) return;
    setUpdating(true);
    const d = await gqlFetch<{
      updateErrandStatus: ErrandDetail;
    }>(UPDATE_ERRAND_STATUS, {
      errandId: errand.id,
      status: newStatus.toUpperCase(),
    });
    setErrand(d.updateErrandStatus);
    setNewStatus(d.updateErrandStatus.status);
    setUpdating(false);
    setShowConfirm(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!errand) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <AlertTriangle className="size-12 mb-3" />
        <p>Errand not found</p>
        <Button variant="link" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{errand.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant={statusVariant(errand.status)} className="capitalize">
              {errand.status?.replace(/_/g, " ")}
            </Badge>
            <span>·</span>
            <span className="capitalize">{errand.category}</span>
            <span>·</span>
            <span>{formatRelativeTime(errand.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main details */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Errand Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              {errand.description && (
                <p className="text-muted-foreground">{errand.description}</p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Fee</span>
                  <p className="font-semibold text-primary">
                    {formatCurrency(errand.totalFee)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Urgency</span>
                  <p className="font-medium capitalize">
                    {errand.urgency?.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Category</span>
                  <p className="font-medium capitalize">{errand.category}</p>
                </div>
              </div>

              <Separator />

              {/* Locations */}
              <div className="flex flex-col gap-2">
                {errand.pickupAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4 mt-0.5 shrink-0 text-emerald-600" />
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Pickup
                      </span>
                      <p>{errand.pickupAddress}</p>
                    </div>
                  </div>
                )}
                {errand.deliveryAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4 mt-0.5 shrink-0 text-destructive" />
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Delivery
                      </span>
                      <p>{errand.deliveryAddress}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Timestamps */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  Created {formatRelativeTime(errand.createdAt)}
                </div>
                {errand.confirmedAt && (
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    Confirmed {formatRelativeTime(errand.confirmedAt)}
                  </div>
                )}
                {errand.runnerAcceptedAt && (
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    Accepted {formatRelativeTime(errand.runnerAcceptedAt)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {errand.requester ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Requester
                    </span>
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" />
                      <span className="font-medium">
                        {errand.requester.fullName}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Rating: {errand.requester.rating}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No requester
                  </div>
                )}
                {errand.runner ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Runner</span>
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" />
                      <span className="font-medium">
                        {errand.runner.fullName}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Rating: {errand.runner.rating}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No runner assigned
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: force status */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <RotateCcw className="size-4" />
                Force Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground">
                Override the current errand status. Use with caution.
              </p>
              <Select value={newStatus} onValueChange={(v) => v && setNewStatus(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                disabled={newStatus === errand.status || updating}
                onClick={() => setShowConfirm(true)}
                variant={newStatus !== errand.status ? "destructive" : "outline"}
              >
                {updating ? "Updating..." : "Update Status"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Force Status Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to change this errand&apos;s status from{" "}
              <Badge variant={statusVariant(errand.status)} className="capitalize">
                {errand.status?.replace(/_/g, " ")}
              </Badge>{" "}
              to{" "}
              <Badge variant={statusVariant(newStatus)} className="capitalize">
                {newStatus?.replace(/_/g, " ")}
              </Badge>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleForceStatus}
              disabled={updating}
            >
              {updating ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
