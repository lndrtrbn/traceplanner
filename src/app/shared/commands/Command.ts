import LeafletService from "../services/LeafletService";

/**
 * Abstract class to implement actions on the map.
 */
export default abstract class Command {
  leaflet: LeafletService;

  /**
   * @param leaflet Leaflet service containing the map.
   */
  constructor(leaflet: LeafletService) {
    this.leaflet = leaflet;
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