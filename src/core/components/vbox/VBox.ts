import { Component, type ElementType } from "../..";
import "./VBox.css";
export class VBox extends Component {
  static readonly TAG: string = "tc-vbox";
  constructor(props?: ElementType) {
    super(props);
    this.extendedStyle.add(VBox.TAG);
  }
}
TypeComposer.defineElement(VBox.TAG, VBox);
