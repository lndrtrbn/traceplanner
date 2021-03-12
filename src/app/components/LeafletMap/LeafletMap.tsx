import { Component, Fragment } from "react";
import Leaflet from "../../shared/services/leaflet.service";
import { ToolsEnum } from "../../shared/tools";
import MapTools from "../MapTools/MapTools";
import "./LeafletMap.scss";

interface LeafletMapState {
  currentTool: ToolsEnum;
}

export default class LeafletMap extends Component<{}, LeafletMapState> {
  constructor(props: any) {
    super(props);
    this.state = { currentTool: ToolsEnum.Movement };
    this.setTool = this.setTool.bind(this);
  }

  componentDidMount() {
    Leaflet.createLeafletMap("leaflet__map");
  }

  setTool(tool: ToolsEnum) {
    this.setState({ currentTool: tool });
  }

  render() {
    return (
      <Fragment>
        <MapTools
          currentTool={this.state.currentTool}
          onSetTool={this.setTool} />
        <div id="leaflet__map"></div>
      </Fragment>
    );
  }
}