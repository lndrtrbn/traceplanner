import { Map, Marker } from "leaflet";
import Command from "./Command";

export default class AddMarkerCommand extends Command {
  marker: Marker;

  /**
   * @param map Map concerned by the command.
   * @param where The position of the marker to add.
   */
  constructor(map: Map, marker: L.Marker) {
    super(map);
    this.marker = marker;
  }

  /**
   * Add a new marker in the map.
   */
  execute() {
    this.marker.addTo(this.map);
  }

  /**
   * Remove the marker added.
   */
  unExecute() {
    this.marker.remove();
  }
}