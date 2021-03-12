import { useEffect } from "react";
import { TOOLS, ToolsEnum } from "../../shared/tools";
import "./MapTools.scss";

interface MapToolsProps {
  currentTool: ToolsEnum;
  onSetTool: (t: ToolsEnum) => void;
}

/**
 * Listens for keyboard events to select a tool.
 *
 * @param callback The action to call with the corresponding tool.
 */
function listenKeyboard(callback: (t: ToolsEnum) => void) {
  const toolsMap: Map<string, ToolsEnum> = new Map()
    .set("KeyD", ToolsEnum.Movement).set("KeyP", ToolsEnum.Path)
    .set("Semicolon", ToolsEnum.Marker).set("KeyE", ToolsEnum.Editor)
    .set("KeyR", ToolsEnum.Bin);
  document.addEventListener("keypress", (event) => {
    const tool = toolsMap.get(event.code);
    if (tool) {
      callback(tool);
    }
  });
}

export default function MapTools({ currentTool, onSetTool }: MapToolsProps) {
  // Listen for keyboard when component is mounted.
  useEffect(() => listenKeyboard(onSetTool), []);

  return (
    <div className="map__tools">
      {TOOLS.map(t => {
        return (
          <button
            key={t.tool}
            onClick={() => onSetTool(t.tool)}
            className={`map__tool ${currentTool === t.tool ? 'map__tool--selected' : ''}`}
            title={t.title}>
            <i className={`fas ${t.icon}`}></i>
          </button>
        );
      })}
    </div>
  );
}