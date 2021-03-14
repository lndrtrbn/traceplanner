import { Fragment, KeyboardEvent, useEffect, useRef, useState } from "react";
import "./TopInput.scss";

interface TopInputProps {
  value: string;
  onSubmit: (value: string) => void,
  onCancel: () => void
}

export default function TopInput({ value, onSubmit, onCancel }: TopInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Initialize the local state of the component.
  const [state, setState] = useState(value);

  // Focus the input field when component mounted.
  useEffect(() => inputRef.current?.focus(), []);

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
  }

  return (
    <Fragment>
      <div className="top__input__overlay" onClick={onCancel}>
      </div>
      <div className="top__input">
        <input
          ref={inputRef}
          type="text"
          placeholder="Marker content"
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