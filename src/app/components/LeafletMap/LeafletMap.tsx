import { Component, Fragment } from "react";
import { Marker } from "leaflet";
import MapTools from "../MapTools/MapTools";
import TopInput from "../TopInput/TopInput";
import LeafletService from "../../shared/services/LeafletService";
import { ToolsEnum } from "../../shared/Tools";
import "./LeafletMap.scss";

interface LeafletMapState {
  tool: ToolsEnum;
  writing: boolean;
  inputContent: string;
}

export default class LeafletMap extends Component<{}, LeafletMapState> {
  leaflet: LeafletService|null = null;
  activeMarker: Marker|null = null;

  constructor(props = {}) {
    super(props);
    this.state = {
      tool: ToolsEnum.Movement,
      writing: false,
      inputContent: ""
    };
    // Bindings.
    this.handleSetTool = this.handleSetTool.bind(this);
    this.setMarkerContent = this.setMarkerContent.bind(this);
    this.stopWriting = this.stopWriting.bind(this);
    this.markerAdded = this.markerAdded.bind(this);
  }

  componentDidMount() {
    this.leaflet = new LeafletService("leaflet__map", {
      onMarkerAdded: this.markerAdded
    });
    // this.leaflet.spyGeomanEvents(this.onMarkerAdded);
  }

  markerAdded(marker: Marker) {
    this.setState({ writing: true, tool: ToolsEnum.Movement });
    this.leaflet?.setTool(this.state.tool);
    this.activeMarker = marker;
    // Spy click on markers to open input content.
    // marker.on("click", () => {
    //   if (this.state.tool === ToolsEnum.Editor) {
    //     this.activeMarker = marker;
    //     this.setState({
    //       writing: true,
    //       inputContent: marker.getPopup()?.getContent()?.toString() || ""
    //     });
    //   }
    // });
  }

  setMarkerContent(content: string) {
    if (this.activeMarker) {
      this.leaflet?.editMarkerContent(this.activeMarker, content);
    }
    this.stopWriting();
  }

  stopWriting() {
    this.setState({ writing: false, inputContent: "" });
    this.activeMarker = null;
  }

  handleSetTool (tool: ToolsEnum) {
    if (!this.state.writing) {
      if (tool === ToolsEnum.Redo) {
        this.leaflet?.actionsHistory.redo();
      } else if (tool === ToolsEnum.Undo) {
        this.leaflet?.actionsHistory.undo();
      } else {
        this.setState({ tool });
        this.leaflet?.setTool(tool);
      }
    }
  }

  render() {
    return (
      <Fragment>
        {this.state.writing && 
          <TopInput
            value={this.state.inputContent}
            onSubmit={this.setMarkerContent}
            onCancel={this.stopWriting} />
        }
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
