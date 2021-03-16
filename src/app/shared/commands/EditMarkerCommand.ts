import { Map, Marker } from "leaflet";
import Command from "./Command";

export default class EditMarkerCommand extends Command {
  marker: Marker;
  content: string;
  initialContent: string;

  /**
   * @param map Map concerned by the command.
   * @param marker The marker to edit.
   * @param content The content to set to marker.
   */
  constructor(map: Map, marker: Marker, content: string) {
    super(map);
    this.marker = marker;
    this.content = content;
    this.initialContent = this.marker.getPopup()?.getContent()?.toString() || "";
  }
  
  /**
   * Edit the content of the marker.
   */
  execute() {
    this.content ? this.marker.bindPopup(this.content) : this.marker.unbindPopup();
  }

  /**
   * Reset content of the marker with previous value.
   */
  unExecute() {
    this.initialContent ? this.marker.bindPopup(this.initialContent) : this.marker.unbindPopup();
  }
}