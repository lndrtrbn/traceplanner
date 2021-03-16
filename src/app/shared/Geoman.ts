import { Layer, LeafletEvent, Marker } from "leaflet";

export interface GeomanCreateEvent extends LeafletEvent {
  shape: string;
  marker?: Marker;
}

export interface GeomanRemoveEvent extends LeafletEvent {
  shape: string;
  layer: Layer;
}

export interface GeomanDrawstartEvent extends LeafletEvent {
  shape: string;
  workingLayer: Layer;
}