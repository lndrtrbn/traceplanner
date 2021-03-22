import * as L from "leaflet";
import { MAP_CONFIG, MARKER_CONFIG } from "../config";
import { EditableEvent, VertexEvent, Feature } from "../LeafletEditable";
import { ToolsEnum } from "../Tools";
import { fromGeoJSON, toGeoJSON } from "./GeojsonService";
import HistoryService from "./HistoryService";

interface LeafletCallback {
  onMarkerAdded: (marker: L.Marker) => void,
  onStopEdit: () => void
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

  get featuresLayer(): L.LayerGroup {
    // @ts-ignore
    return this.map.editTools.featuresLayer;
  }

  /**
   * @returns An array containing all features drawn.
   */
  get features(): Feature[] {
    // @ts-ignore
    return Object.values(this.featuresLayer._layers);
  }

  /**
   * Creates a new leaflet map attached to a DOM Element.
   *
   * @param domID The ID of the DOM element to attach the leaflet map.
   * @param callbacks To do things after some specific events.
   */
  constructor(domID: string, callbacks: LeafletCallback) {
    // Init stuff
    this.currentTool = ToolsEnum.Movement;
    this.map = L.map(domID, { editable: true }).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
    L.tileLayer(MAP_CONFIG.layerUrl, { attribution: MAP_CONFIG.attribution }).addTo(this.map);
    this.actionsHistory = new HistoryService(this.getMapState(), (s) => this.setMapState(s));
    // -----

    this.map.on("editable:drawing:commit", (e: EditableEvent) => {
      if (this.isMarker) {
        const marker: L.Marker = e.layer as L.Marker;
        // To use GeoJSON features.
        marker.feature = { 
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: []
          },
          properties: {}
        };
        this.actionsHistory.insert(this.getMapState());
        callbacks.onMarkerAdded(marker);
      }
      e.layer.disableEdit();
      callbacks.onStopEdit();
      // Spy elements removal.
      e.layer.on("click", (x: L.LeafletMouseEvent) => {
        this.removeElement(x.target);
      });
    });
    
    // @ts-ignore
    this.map.on("editable:vertex:new", () => {
      this.actionsHistory.insert(this.getMapState());
    });
    // @ts-ignore
    this.map.on("editable:vertex:dragend", () => {
      this.actionsHistory.insert(this.getMapState());
    });

    // @ts-ignore
    this.map.on("editable:vertex:ctrlclick", (e: VertexEvent) => {
      if (e.vertex.latlngs) {
        const vertexes: L.LatLng[] = e.vertex.latlngs;
        const firstVertex = vertexes[0];
        const lastVertex = vertexes[vertexes.length - 1];
        // Removing first and last vertexes is a non sense, not usefull.
        if (e.latlng !== firstVertex && e.latlng !== lastVertex) {
          // const removeVertex = new RemoveVertexCommand(this.map, e.layer, e.latlng);
          // this.actionsHistory.insert(removeVertex, true);
        }
      }
    });
  }
  
  setTool(tool: ToolsEnum) {
    if (tool !== this.currentTool) {
      this.currentTool = tool;
      // Stop other active tools.
      this.map.editTools.stopDrawing();
      this.features.forEach(f => f.disableEdit());

      if (tool === ToolsEnum.Path) {
        this.map.editTools.startPolyline();
      } else if (tool === ToolsEnum.Marker) {
        this.map.editTools.startMarker(undefined, MARKER_CONFIG);
      } else if (tool === ToolsEnum.Editor) {
        this.features.forEach(f => f.enableEdit())
      } else if (tool === ToolsEnum.ExportGeoJson) {
        // @ts-ignore
        const geojson = toGeoJSON(this.map.editTools.featuresLayer);
        // @ts-ignore
        this.map.editTools.featuresLayer.clearLayers();
        // @ts-ignore
        Object.values(fromGeoJSON(geojson)._layers).forEach(l => l.addTo(this.map.editTools.featuresLayer));
      }
    }
  }

  /**
   * Removes an element from the map.
   *
   * @param element The element to remove.
   */
  removeElement(element: L.Layer) {
    if (this.currentTool === ToolsEnum.Bin) {
      this.featuresLayer.removeLayer(element);
      this.actionsHistory.insert(this.getMapState());
    }
  }

  /**
   * Binds a popup to a marker with given content.
   * 
   * @param marker The marker to edit.
   * @param content The content to set to the marker.
   */
  editMarkerContent(marker: L.Marker, content: string) {
    if (content) {
      marker.bindPopup(content);
      if (marker.feature) {
        marker.feature.properties.description = content;
      }
      this.actionsHistory.insert(this.getMapState());
    } else if (marker.getPopup()) {
      marker.unbindPopup();
      this.actionsHistory.insert(this.getMapState());
    }
  }

  /**
   * Gets state of the map in GeoJSON format as string.
   *
   * @returns The state of the map as a string.
   */
  private getMapState(): string {
    return JSON.stringify(toGeoJSON(this.featuresLayer));
  }

  /**
   * Reset the map to a specific state (GeoJSON format).
   *
   * @param state The state to use to reset the map.
   */
   private setMapState(state: string) {
    // @ts-ignore
    const layers: Layer[] = Object.values(fromGeoJSON(JSON.parse(state))._layers);
    this.featuresLayer.clearLayers();
    layers.forEach(l => {
      l.addTo(this.featuresLayer);
      // Spy elements removal.
      l.on("click", (x: L.LeafletMouseEvent) => this.removeElement(x.target))
    });
  }
}