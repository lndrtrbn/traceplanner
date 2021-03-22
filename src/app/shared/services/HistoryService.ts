/**
 * Service to manage history of actions on the map.
 */
export default class HistoryService {
  readonly LOCAL_STORAGE_KEY = "TRACEPLANNER_STATE";

  history = new Array<string>();
  historyIndex = -1;

  constructor(initialState: string, public onStateChange: (state: string) => void) {
    const localState = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (localState) {
      initialState = localState;
      onStateChange(initialState);
    }
    this.insert(initialState); // Initial state of the map.
  }
  
  /**
   * Adds the current map state into the history.
   */
  insert(state: string) {
    // Remove the states that come after current index when inserting new state.
    if (this.historyIndex < this.history.length - 1) {
      this.history.splice(this.historyIndex + 1);
    };
    localStorage.setItem(this.LOCAL_STORAGE_KEY, state);
    this.history.push(state);
    this.historyIndex++;
  }

  /**
   * Undo the command pointed by the index.
   */
  undo() {
    if (this.historyIndex > 0) {
      const state = this.history[--this.historyIndex];
      localStorage.setItem(this.LOCAL_STORAGE_KEY, state);
      this.onStateChange(state);
    }
  }

  /**
   * Redo the last command that was undid.
   */
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      const state = this.history[++this.historyIndex];
      localStorage.setItem(this.LOCAL_STORAGE_KEY, state);
      this.onStateChange(state);
    }
  }
}