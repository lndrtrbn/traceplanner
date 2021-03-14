import { Marker } from "leaflet";
import LeafletService from "../services/LeafletService";
import Command from "./Command";

export default class EditMarkerCommand extends Command {
  marker: Marker;
  content: string;
  initialContent: string;

  /**
   * @param leaflet To execute the command.
   * @param marker The marker to edit.
   * @param content The content to set to marker.
   */
  constructor(leaflet: LeafletService, marker: Marker, content: string) {
    super(leaflet);
    this.marker = marker;
    this.content = content;
    this.initialContent = this.marker.getPopup()?.getContent()?.toString() || "";
  }
  
  /**
   * Edit the content of the marker.
   */
  execute() {
    this.leaflet.editMarker(this.marker, this.content);
  }

  /**
   * Reset content of the marker with previous value.
   */
  unExecute() {
    this.leaflet.editMarker(this.marker, this.initialContent);
  }
}