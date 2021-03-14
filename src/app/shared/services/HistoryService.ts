import Command from "../commands/Command";

/**
 * Service to manage history of actions on the map.
 */
export default class HistoryService {
  history = new Array<Command>();
  historyIndex = -1;
  
  /**
   * Adds and executes a command.
   *
   * @param command The command to execute and add in the history.
   */
  insertCommand(command: Command) {
    // Remove the commands that comes after current index when inserting new command.
    if (this.historyIndex < this.history.length - 1) {
      this.history.splice(this.historyIndex + 1);
    }
    command.execute();
    this.history.push(command);
    this.historyIndex++;
  }

  /**
   * Undo the command pointed by the index.
   */
  undo() {
    if (this.historyIndex > -1) {
      this.history[this.historyIndex--].unExecute();
    }
  }

  /**
   * Redo the last command that was undo.
   */
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.history[++this.historyIndex].execute();
    }
  }
}