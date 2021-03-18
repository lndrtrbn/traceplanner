import * as L from "leaflet";
import AddMarkerCommand from "../commands/AddMarkerCommand";
import AddVertexCommand from "../commands/AddVertexCommand";
import EditMarkerCommand from "../commands/EditMarkerCommand";
import RemoveCommand from "../commands/RemoveCommand";
import RemoveVertexCommand from "../commands/RemoveVertexCommand";
import { EditableEvent, VertexEvent, Feature } from "../LeafletEditable";
import { ToolsEnum } from "../Tools";
import HistoryService from "./HistoryService";

const MAP_CONFIG = {
  center: [47.0833, 2.4] as L.LatLngExpression, // Bourges (center of France)
  zoom: 6,
  layerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | TracePlanner by <a href="https://github.com/lndrtrbn">Landry Trebon</a>'
}

const MARKER_CONFIG = {
  icon: L.icon({
    iconUrl: 'marker.svg',
    iconSize:     [22, 30],
    iconAnchor:   [11, 30],
    popupAnchor:  [0, -20]
  })
}

interface LeafletCallback {
  onMarkerAdded: (marker: L.Marker) => void
}

export default class LeafletService {
  actionsHistory: HistoryService; // To allow undo/redo.
  currentTool: ToolsEnum; // Current tool selected.
  map: L.Map; // leaflet map instance.

  /**
   * @returns True if the current selected tool is Marker.
   */
  get isMarker(): boolean {
    return this.currentTool === ToolsEnum.Marker;
  }

  /**
   * @returns True if the current selected tool is Path.
   */
  get isPath(): boolean {
    return this.currentTool === ToolsEnum.Path;
  }

  /**
   * @returns An array containing all features drawn.
   */
  get features(): Feature[] {
    // @ts-ignore
    return Object.values(this.map.editTools.featuresLayer._layers);
  }

  /**
   * Creates a new leaflet map attached to a DOM Element.
   *
   * @param domID The ID of the DOM element to attach the leaflet map.
   * @param callbacks To do things after some specific events.
   */
  constructor(domID: string, callbacks: LeafletCallback) {
    // Init stuff
    this.actionsHistory = new HistoryService();
    this.currentTool = ToolsEnum.Movement;
    this.map = L.map(domID, { editable: true }).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
    L.tileLayer(MAP_CONFIG.layerUrl, { attribution: MAP_CONFIG.attribution }).addTo(this.map);
    // -----

    this.map.on("editable:drawing:commit", (e: EditableEvent) => {
      if (this.isMarker) {
        const marker: L.Marker = e.layer as L.Marker;
        const addMarker = new AddMarkerCommand(this.map, marker);
        this.actionsHistory.insert(addMarker);
        callbacks.onMarkerAdded(addMarker.marker);
        addMarker.marker.disableEdit();
      }
      e.layer.disableEdit();
      e.layer.on("click", (x: L.LeafletMouseEvent) => {
        if (this.currentTool === ToolsEnum.Bin) {
          const removeElement = new RemoveCommand(this.map, x.target);
          this.actionsHistory.insert(removeElement, true);
        }
      })
    });
    
    // @ts-ignore
    this.map.on("editable:vertex:new", (e: VertexEvent) => {
      if (this.isPath && !(this.actionsHistory.lastRedoIs(AddVertexCommand))) {
        const addVertex = new AddVertexCommand(this.map, e.layer, e.latlng);
        this.actionsHistory.insert(addVertex);
      }
    });

    // @ts-ignore
    this.map.on("editable:vertex:ctrlclick", (e: VertexEvent) => {
      if (e.vertex.latlngs) {
        const vertexes: L.LatLng[] = e.vertex.latlngs;
        const firstVertex = vertexes[0];
        const lastVertex = vertexes[vertexes.length - 1];
        // Removing first and last vertexes is a non sense, not usefull.
        if (e.latlng !== firstVertex && e.latlng !== lastVertex) {
          const removeVertex = new RemoveVertexCommand(this.map, e.layer, e.latlng);
          this.actionsHistory.insert(removeVertex, true);
        }
      }
    });
  }
  
  setTool(tool: ToolsEnum) {
    if (tool !== this.currentTool) {
      this.currentTool = tool;
      // Stop other active tools.
      this.map.editTools.commitDrawing();
      this.features.forEach(f => f.disableEdit());

      if (tool === ToolsEnum.Path) {
        this.map.editTools.startPolyline();
      } else if (tool === ToolsEnum.Marker) {
        this.map.editTools.startMarker(undefined, MARKER_CONFIG);
      } else if (tool === ToolsEnum.Editor) {
        this.features.forEach(f => f.enableEdit())
      }
    }
  }

  // spyGeomanEvents(markerAddedCallback: (m: L.Marker) => void) {
  //   this.map.on("pm:create", (e: GeomanCreateEvent) => {
  //     // On marker creation.
  //     if (e.marker) {
  //       const addMarker = new AddMarkerCommand(this.map, e.marker);
  //       this.actionsHistory.insert(addMarker);
  //       markerAddedCallback(addMarker.marker);
  //     }
  //   });
  //   // On element remove.
  //   this.map.on("pm:remove", (e: GeomanRemoveEvent) => {
  //     const removeElement = new RemoveCommand(this.map, e.layer);
  //     this.actionsHistory.insert(removeElement);
  //   });
  //   this.map.on("pm:drawstart", ({ workingLayer }: GeomanDrawstartEvent) => {
  //     workingLayer.on("pm:vertexadded", (e: any) => {
  //       console.log("vertexadded", e);
  //     });
  //   });
  // }

  editMarkerContent(marker: L.Marker, content: string) {
    const editMarker = new EditMarkerCommand(this.map, marker, content);
    this.actionsHistory.insert(editMarker, true);
  }
}