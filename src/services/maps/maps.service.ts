import type { GeoLocation } from "@/types";

export type RouteInfo = {
  distanceKm: number;
  durationMinutes: number;
  polyline: string;
};

export abstract class MapsService {
  abstract geocode(address: string): Promise<GeoLocation | null>;
  abstract reverseGeocode(lat: number, lng: number): Promise<string>;
  abstract getRoute(
    origin: GeoLocation,
    destination: GeoLocation,
  ): Promise<RouteInfo>;
  abstract calculateDistance(
    origin: GeoLocation,
    destination: GeoLocation,
  ): number;
}
