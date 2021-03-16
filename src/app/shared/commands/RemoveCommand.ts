import { Layer, Map } from "leaflet";
import Command from "./Command";

export default class RemoveCommand<T extends Layer> extends Command {
  element: T;

  /**
   * @param map Map concerned by the command.
   * @param element The element to remove from the map.
   */
  constructor(map: Map, element: T) {
    super(map);
    this.element = element;
  }
  
  /**
   * Remove the element from the map.
   */
  execute() {
    this.map.removeLayer(this.element);
  }
  
  /**
   * Replace the element on the map.
   */
  unExecute() {
    console.log(this.element);
    this.element.addTo(this.map);
  }
}