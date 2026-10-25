import { type ElementType } from "../..";
import "./VBox.css";
import { Component } from "../../../global/index";
export class VBox extends Component {
  static readonly TAG: string = "tc-vbox";
  constructor(props?: ElementType) {
    super(props);
    this.extendedStyle.add(VBox.TAG);
  }
}
TypeComposer.defineElement(VBox.TAG, VBox);
