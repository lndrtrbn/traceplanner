import { LatLng, Map, Polyline } from "leaflet";
import Command from "./Command";

export default class AddVertexCommand extends Command {
  path: Polyline;
  where: LatLng;

  /**
   * @param map Map concerned by the command.
   * @param where The position of the marker to add.
   */
  constructor(map: Map, path: Polyline, where: LatLng) {
    super(map);
    this.path = path;
    this.where = where;
  }

  /**
   * Add a new marker in the map.
   */
  execute() {
    // @ts-ignore
    if (!this.path.editor) {
      this.path.enableEdit();
      // @ts-ignore
      this.path.editor.startDrawingForward();
    }
    // @ts-ignore
    this.path.editor.push(this.where);
  }

  /**
   * Remove the marker added.
   */
  unExecute() {
    this.path.enableEdit();
    // @ts-ignore
    if (!this.path.editor.drawing()) {
      // @ts-ignore
      this.path.editor.startDrawingForward();
      // @ts-ignore
      this.path.editor.pop(this.where);
    } 
    // @ts-ignore
    else if (this.path.getLatLngs().length < 2) {
      this.path.disableEdit();
    } else {
      // @ts-ignore
      this.path.editor.pop(this.where);
    }
  }
}