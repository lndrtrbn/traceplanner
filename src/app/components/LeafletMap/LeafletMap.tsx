import { useEffect, useState } from "react";
import Leaflet from "../../shared/services/leaflet.service";
import { ToolsEnum } from "../../shared/tools";
import MapTools from "../MapTools/MapTools";
import "./LeafletMap.scss";

interface LeafletMapState {
  currentTool: ToolsEnum;
}

export default function LeafletMap() {
  /**
   * Sets the current tool.
   *
   * @param tool The new tool to set as current.
   */
  function setTool(tool: ToolsEnum) {
    setState({ currentTool: tool });
  }

  // Initialize the local state of the component.
  const [state, setState] = useState<LeafletMapState>({
    currentTool: ToolsEnum.Movement
  });

  // Listen for keyboard when component is mounted.
  useEffect(() => {
    Leaflet.createLeafletMap("leaflet__map");
  }, []);

  return (
    <div className={`leaflet__container tool--${state.currentTool}`}>
      <MapTools
        currentTool={state.currentTool}
        onSetTool={setTool} />
      <div id="leaflet__map"></div>
    </div>
  );
}