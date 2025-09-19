import { Component, ElementType } from "../..";

export class GridPanel extends Component {
  static readonly TAG: string = "tc-grid-panel";
  constructor(props?: ElementType<GridPanel>) {
    super(props);
    this.addClassName("grid-element");
    // @ts-ignore
		Component.initComponent(this, GridPanel, props);
  }

  set columns(value: string | number) {
    if (typeof value == "string") this.style.gridTemplateColumns = value;
    else this.style.gridTemplateColumns = `repeat(${value}, auto)`;
  }

  set rows(value: string | number) {
    if (typeof value == "string") this.style.gridTemplateRows = value;
    else this.style.gridTemplateRows = `repeat(${value}, auto)`;
  }
}
// @ts-ignore
TypeComposer.defineElement(GridPanel.TAG, GridPanel);
