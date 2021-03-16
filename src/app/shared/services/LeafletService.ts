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
    this.map.pm.addControls({  
      position: 'topright',  
      drawCircle: false,  
    }); 
    L.tileLayer(MAP_CONFIG.layerUrl, { attribution: MAP_CONFIG.attribution }).addTo(this.map);
  }

  /**
   * Creates a new marker element.
   *
   * @param where Position of the marker.
   * @returns The created marker.
   */
  createMarker(where: L.LatLng): L.Marker {
    const icon = L.icon({
      iconUrl: 'marker.svg',
      iconSize:     [22, 30],
      iconAnchor:   [11, 30],
      popupAnchor:  [0, -20]
    });
    return L.marker(where, { icon });
  }

  createPolyline(where: L.LatLng): L.Polyline {
    return L.polyline([where]);
  }

  addPointToPolyline(polyline: L.Polyline, where: L.LatLng) {
    polyline.addLatLng(where);
  }
  
  /**
   * Sets the content of a marker.
   *
   * @param marker The marker to edit.
   * @param content The content to set.
   */
  editMarker(marker: L.Marker, content: string) {
    content ? marker.bindPopup(content) : marker.unbindPopup();
  }

  /**
   * Adds an element in the map.
   *
   * @param element The element to add in the map.
   */
  addElement<T extends L.Layer>(element: T) {
    element.addTo(this.map);
  }

  /**
   * Removes an element from the map.
   *
   * @param element The element to remove.
   */
  removeElement<T extends L.Layer>(element: T): void {
    this.map.removeLayer(element);
  }
}