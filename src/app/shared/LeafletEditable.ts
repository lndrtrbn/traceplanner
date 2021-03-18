import { LatLng, LeafletEvent, Marker, Polyline } from "leaflet";

export type Feature = Polyline | Marker;

export interface EditableEvent extends LeafletEvent {
  layer: Feature;
}

export interface VertexEvent extends LeafletEvent {
  latlng: LatLng;
  vertex: any;
}