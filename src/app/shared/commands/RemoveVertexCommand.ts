import { LatLng, Map, Polyline } from "leaflet";
import Command from "./Command"

export default class RemoveVertexCommand extends Command {
  path: Polyline;
  where: LatLng;
  vertexes?: LatLng[];

  /**
   * @param map Map concerned by the command.
   * @param where The position of the marker to add.
   */
  constructor(map: Map, path: Polyline, where: LatLng) {
    super(map);
    this.path = path;
    this.where = where;
    // @ts-ignore
    this.vertexes = [...this.path.editor.getLatLngs()];
  }

  execute() {
    // @ts-ignore
    this.path.editor.removeLatLng(this.where);
  }

  unExecute() {
    // @ts-ignore
    this.path.editor.deleteShapeAt(this.vertexes[0]);
    // @ts-ignore
    this.path.editor.appendShape(this.vertexes);
    // @ts-ignore
    this.vertexes = [...this.path.editor.getLatLngs()[0]];
  }
}