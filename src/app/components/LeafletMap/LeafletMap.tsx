import { Component, Fragment, useEffect, useRef, useState } from "react";
import { LeafletMouseEvent } from "leaflet";
import { ToolsEnum } from "../../shared/tools";
import MapTools from "../MapTools/MapTools";
import TopInput from "../TopInput/TopInput";
import LeafletService from "../../shared/services/leaflet.service";
import "./LeafletMap.scss";

interface LeafletMapState {
  tool: ToolsEnum;
}

export default class LeafletMap extends Component<{}, LeafletMapState> {
  leaflet: LeafletService|null = null;

  constructor(props = {}) {
    super(props);
    this.state = { tool: ToolsEnum.Movement };
    // Bindings.
    this.onMapClick = this.onMapClick.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.handleSetTool = this.handleSetTool.bind(this);
  }

  componentDidMount() {
    this.leaflet = new LeafletService("leaflet__map");
    this.leaflet.map.on("click", this.onMapClick);
  }

  onMapClick(event: LeafletMouseEvent) {
    if (this.state.tool === ToolsEnum.Marker) {
      const marker = this.leaflet?.addMarker(event.latlng);
      marker?.on("click", this.onMarkerClick);
    }
  }

  onMarkerClick(event: LeafletMouseEvent) {
    if (this.state.tool === ToolsEnum.Bin) {
      this.leaflet?.removeElement(event.target);
    }
  }

  handleSetTool (tool: ToolsEnum) {
    this.setState({ tool })
  }

  render() {
    return (
      <Fragment>
        <TopInput
          value="ccsv"
          onSubmit={(b) => console.log(b)} />
        <MapTools
          currentTool={this.state.tool}
          onSetTool={this.handleSetTool} />
        <div className={`leaflet__container tool--${this.state.tool}`}>
          <div id="leaflet__map"></div>
        </div>
      </Fragment>
    );
  }
}

export function LeafletMapa() {
  // Keep a reference to the leaflet service to be able to use it.
  const leafletRef = useRef<LeafletService>();
  // Initialize the local state of the component.
  const [tool, setTool] = useState(ToolsEnum.Movement);

  // Creates the map when the component is mounted.
  useEffect(() => {
    function onMapClick(event: LeafletMouseEvent) {
      console.log(tool);
      // if (tool === ToolsEnum.Marker) {
      //   const marker = leafletRef.current?.addMarker(event.latlng, 'ccsv');
      // }
    }
    if (!leafletRef.current) {
      leafletRef.current = new LeafletService("leaflet__map");
      leafletRef.current.map.on("click", (e: LeafletMouseEvent) => onMapClick(e));
    }
  }, [tool, leafletRef]);

  /**
   * Sets the current tool.
   *
   * @param tool The new tool to set as current.
   */
  function handleSetTool(t: ToolsEnum) {
    setTool(t);
    console.log(t, tool)
  }


  return (
    <Fragment>
      <div className="log">
        {tool}
      </div>
      <TopInput
        value="ccsv"
        onSubmit={(b) => console.log(b)} />
      <MapTools
        currentTool={tool}
        onSetTool={handleSetTool} />
      <div className={`leaflet__container tool--${tool}`}>
        <div id="leaflet__map" onLoad={() => console.log("ccsv")}></div>
      </div>
    </Fragment>
  );
}