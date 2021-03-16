import { Map } from "leaflet";

/**
 * Abstract class to implement actions on the map.
 */
export default abstract class Command {
  map: Map;

  /**
   * @param map The map concerned by the command.
   */
  constructor(map: Map) {
    this.map = map;
  }

  /**
   * Execute the command.
   */
  abstract execute(): void;

  /**
   * Cancel the command.
   */
  abstract unExecute(): void;
}