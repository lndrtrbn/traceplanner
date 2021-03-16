import * as L from "leaflet";
import AddMarkerCommand from "../commands/AddMarkerCommand";
import EditMarkerCommand from "../commands/EditMarkerCommand";
import RemoveCommand from "../commands/RemoveCommand";
import { GeomanCreateEvent, GeomanDrawstartEvent, GeomanRemoveEvent } from "../Geoman";
import HistoryService from "./HistoryService";

const MAP_CONFIG = {
  center: [47.0833, 2.4] as L.LatLngExpression, // Bourges (center of France)
  zoom: 6,
  layerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | TracePlanner by <a href="https://github.com/lndrtrbn">Landry Trebon</a>'
}

const GEOMAN_CONFIG = {
  tooltips: false,
  cursorMarker: false,
  markerEditable: false,
  continueDrawing: false,
  markerStyle: {
    icon: L.icon({
      iconUrl: 'marker.svg',
      iconSize:     [22, 30],
      iconAnchor:   [11, 30],
      popupAnchor:  [0, -20]
    })
  }
}

export default class LeafletService {
  actionsHistory: HistoryService;
  map: L.Map;

  /**
   * Creates a new leaflet map attached to a DOM Element.
   *
   * @param domID The ID of the DOM element to attach the leaflet map.
   */
  constructor(domID: string) {
    this.actionsHistory = new HistoryService();
    this.map = L.map(domID).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
    L.tileLayer(MAP_CONFIG.layerUrl, { attribution: MAP_CONFIG.attribution }).addTo(this.map);
    // @ts-ignore (because geoman typedef is incomplete and does not recognize it)
    this.map.pm.setGlobalOptions(GEOMAN_CONFIG);
  }

  spyGeomanEvents(markerAddedCallback: (m: L.Marker) => void) {
    // @ts-ignore (because geoman typedef is incomplete and does not recognize it)
    this.map.on("pm:create", (e: GeomanCreateEvent) => {
      // On marker creation.
      if (e.marker) {
        const addMarker = new AddMarkerCommand(this.map, e.marker);
        this.actionsHistory.insert(addMarker);
        markerAddedCallback(addMarker.marker);
      }
    });
    // On element remove.
    // @ts-ignore (because geoman typedef is incomplete and does not recognize it)
    this.map.on("pm:remove", (e: GeomanRemoveEvent) => {
      const removeElement = new RemoveCommand(this.map, e.layer);
      this.actionsHistory.insert(removeElement);
    });
    // @ts-ignore (because geoman typedef is incomplete and does not recognize it)
    this.map.on("pm:drawstart", ({ workingLayer }: GeomanDrawstartEvent) => {
      workingLayer.on("pm:vertexadded", (e: any) => {
        console.log("vertexadded", e);
      });
    });
  }

  editMarkerContent(marker: L.Marker, content: string) {
    const editMarker = new EditMarkerCommand(this.map, marker, content);
    this.actionsHistory.insert(editMarker, true);
  }
}