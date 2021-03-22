import { LayerGroup } from "leaflet";
import { MARKER_CONFIG } from "../config";

function toGeoJSON(layerGroup: LayerGroup) {
  return layerGroup.toGeoJSON();
}

function fromGeoJSON(data: Object) {
  return L.geoJson(data, {
    pointToLayer: (point, latlng) => {
      const marker = L.marker(latlng, MARKER_CONFIG);
      if (point.properties.description) {
        marker.bindPopup(point.properties.description);
      }
      return marker;
    }
  })
}

export {
  toGeoJSON,
  fromGeoJSON
};