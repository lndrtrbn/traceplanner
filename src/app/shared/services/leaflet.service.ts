import * as L from "leaflet";

const MAP_CONFIG = {
  center: [47.0833, 2.4] as L.LatLngExpression, // Bourges (center of France)
  zoom: 6,
  layerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | TracePlanner by <a href="https://github.com/lndrtrbn">Landry Trebon</a>'
}

export default class LeafletService {
  map: L.Map;

  /**
   * Creates a new leaflet map attached to a DOM Element.
   *
   * @param domID The ID of the DOM element to attach the leaflet map.
   */
  constructor(domID: string) {
    this.map = L.map(domID).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
    L.tileLayer(MAP_CONFIG.layerUrl, { attribution: MAP_CONFIG.attribution }).addTo(this.map);
  }

  addMarker(where: L.LatLng): L.Marker {
    const icon = L.icon({
      iconUrl: 'marker.svg',
      iconSize:     [22, 30],
      iconAnchor:   [11, 30],
      popupAnchor:  [0, -20]
    });
    const marker = L.marker(where, { icon }).addTo(this.map);
    return marker;
  }

  editMarker(marker: L.Marker, content: string) {
    marker.bindPopup(content);
  }

  removeElement<T extends L.Layer>(element: T): void {
    this.map.removeLayer(element);
  }
}