import { LayerGroup } from "leaflet";
import { MARKER_CONFIG } from "../config";

/**
 * Converts a Leaflet layer into GeoJSON object.
 * 
 * @param layerGroup The layer to convert into GeoJSON.
 * @returns An object representing the map in GeoJSON format.
 */
export function toGeoJSON(layerGroup: LayerGroup) {
  return layerGroup.toGeoJSON();
}

/**
 * Converts GeoJSON data into a leaflet layer.
 *
 * @param data The GeoJSON data to convert.
 * @returns A GeoJSON layer for leaflet.
 */
export function fromGeoJSON(data: Object) {
  return L.geoJson(data, {
    // Retrieve markers description to add it into a popup.
    pointToLayer: (point, latlng) => {
      const marker = L.marker(latlng, MARKER_CONFIG);
      if (point.properties.description) {
        marker.bindPopup(point.properties.description);
      }
      return marker;
    }
  })
}