import Command from "../commands/Command";

/**
 * Service to manage history of actions on the map.
 */
export default class HistoryService {
  history = new Array<Command>();
  historyIndex = -1;
  
  /**
   * Adds a new command into the history.
   * 
   * The execution is optionnal because some commands are inserted
   * after being realized by Geoman and caught by an event like
   * the creation of markers.
   *
   * @param command The command to execute and add in the history.
   * @param execute True if the command should be executed, false otherwise.
   */
  insert(command: Command, execute = false) {
    // Remove the commands that comes after current index when inserting new command.
    if (this.historyIndex < this.history.length - 1) {
      this.history.splice(this.historyIndex + 1);
    }
    if (execute) {
      command.execute();
    }
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
   * Redo the last command that was undid.
   */
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.history[++this.historyIndex].execute();
    }
  }
}