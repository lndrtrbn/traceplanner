import { Fragment, KeyboardEvent, useState } from "react";
import "./TopInput.scss";

interface TopInputProps {
  value: string;
  onSubmit: (value: string) => void
}

export default function TopInput({ value, onSubmit }: TopInputProps) {
  const placeholder = "Marker content";
  // Initialize the local state of the component.
  const [state, setState] = useState(value);

  /**
   * Submits value if the key is "Enter".
   * 
   * @param event The keyboard event caught.
   */
  function handleKeyPress(event: KeyboardEvent) {
    if (event.code === "Enter") {
      handleSubmit();
    }
  }
  
  /**
   * Submits the value of the input and clear it.
   */
  function handleSubmit() {
    onSubmit(state);
    setState("");
  }

  /**
   * Cancels editing content.
   */
  function cancel() {
    onSubmit("");
    setState("");
  }

  return (
    <Fragment>
      <div className="top__input__overlay" onClick={cancel}>
      </div>
      <div className="top__input">
        <input
          type="text"
          placeholder={placeholder}
          value={state}
          onChange={(e) => setState(e.target.value)}
          onKeyPress={handleKeyPress} />
        <button onClick={handleSubmit}>
          <i className="fas fa-check"></i>
        </button>
      </div>
    </Fragment>
  );
}