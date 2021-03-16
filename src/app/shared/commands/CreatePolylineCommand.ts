import { LatLng, Polyline } from "leaflet";
import LeafletService from "../services/LeafletService";
import Command from "./Command";

export default class CreatePolylineCommand extends Command {
  where: LatLng;
  polyline: Polyline;

  constructor(leaflet: LeafletService, where: LatLng) {
    super(leaflet);
    this.where = where;
    this.polyline = this.leaflet.createPolyline(this.where);
  }

  execute() {
    this.leaflet.addElement(this.polyline);
  }

  unExecute() {
    this.leaflet.removeElement(this.polyline);
  }
}