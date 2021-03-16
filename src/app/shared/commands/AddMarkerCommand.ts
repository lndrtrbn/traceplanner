import { LatLng, Marker } from "leaflet";
import LeafletService from "../services/LeafletService";
import Command from "./Command";

export default class AddMarkerCommand extends Command {
  where: LatLng;
  marker: Marker;

  /**
   * @param leaflet To execute the command.
   * @param where The position of the marker to add.
   */
  constructor(leaflet: LeafletService, where: LatLng) {
    super(leaflet);
    this.where = where;
    this.marker = this.leaflet.createMarker(this.where);
  }

  /**
   * Add a new marker in the map.
   */
  execute() {
    this.leaflet.addElement(this.marker);
  }

  /**
   * Remove the marker added.
   */
  unExecute() {
    this.leaflet.removeElement(this.marker);
  }
}