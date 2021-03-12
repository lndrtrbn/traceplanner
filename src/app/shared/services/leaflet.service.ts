import * as L from "leaflet";

const MAP_CONFIG = {
  center: [47.0833, 2.4] as L.LatLngExpression, // Bourges (center of France)
  zoom: 6,
  layerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | TracePlanner by <a href="https://github.com/lndrtrbn">Landry Trebon</a>'
}

// const MARKER_ICON = L.icon({
//   iconUrl: 'marker.svg',
//   iconSize:     [22, 30],
//   iconAnchor:   [11, 30],
//   popupAnchor:  [0, -20]
// });

class LeafletService {
  /**
   * Creates a new leaflet map attached to a DOM Element.
   *
   * @param domID The ID of the DOM element to attach the leaflet map.
   * @returns The newly created leaflet map.
   */
  createLeafletMap(domID: string): L.Map {
    const map = L.map(domID).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
    L.tileLayer(MAP_CONFIG.layerUrl, { attribution: MAP_CONFIG.attribution }).addTo(map);
    return map;
  }
}

const Leaflet = new LeafletService();
export default Leaflet;