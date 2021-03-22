export const MAP_CONFIG = {
  center: [47.0833, 2.4] as L.LatLngExpression, // Bourges (center of France)
  zoom: 6,
  layerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | TracePlanner by <a href="https://github.com/lndrtrbn">Landry Trebon</a>'
};

export const MARKER_CONFIG = {
  icon: L.icon({
    iconUrl: 'marker.svg',
    iconSize:     [22, 30],
    iconAnchor:   [11, 30],
    popupAnchor:  [0, -20]
  })
};