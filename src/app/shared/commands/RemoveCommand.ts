import LeafletService from "../services/LeafletService";
import Command from "./Command";

export default class RemoveCommand<T extends L.Layer> extends Command {
  element: T;

  /**
   * @param leaflet To execute the command.
   * @param element The element to remove from the map.
   */
  constructor(leaflet: LeafletService, element: T) {
    super(leaflet);
    this.element = element;
  }

  /**
   * Remove the element from the map.
   */
  execute() {
    this.leaflet.removeElement(this.element);
  }

  /**
   * Replace the element on the map.
   */
  unExecute() {
    this.element.addTo(this.leaflet.map);
  }
}