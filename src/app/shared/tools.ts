export enum ToolsEnum {
  Movement = "movement",
  Marker = "marker",
  Path = "path",
  Bin = "bin",
  Editor = "editor",
  Undo = "undo",
  Redo = "redo",
  ExportGeoJson = "exportgeojson"
}

export interface Tool {
  tool: ToolsEnum;
  title: string;
  icon: string;
}

export const TOOLS: Tool[][] = [
  [
    { tool: ToolsEnum.Movement, title: "Move the map [D]", icon: "fa-hand-paper" },
    { tool: ToolsEnum.Marker, title: "Add a marker [M]", icon: "fa-map-marker-alt" },
    { tool: ToolsEnum.Path, title: "Draw a path [P]", icon: "fa-pen-nib" },
    { tool: ToolsEnum.Editor, title: "Edit elements [E]", icon: "fa-pencil-alt" },
    { tool: ToolsEnum.Bin, title: "Remove elements [R]", icon: "fa-trash-alt" },
  ],
  [
    { tool: ToolsEnum.Undo, title: "Undo last action [Ctrl-Z]", icon: "fa-undo" },
    { tool: ToolsEnum.Redo, title: "Redo last action [Ctrl-Y]", icon: "fa-redo" },
  ],
  [
    { tool: ToolsEnum.ExportGeoJson, title: "Export to GeoJSON", icon: "fa-external-link-square-alt" },
  ]
];