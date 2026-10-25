import { type ElementType } from "../..";
import "./HBox.css";
import { Component } from "../../../global/index";
export class HBox extends Component {
  static readonly TAG: string = "tc-hbox";
  constructor(props?: ElementType) {
    super(props);
    this.extendedStyle.add(HBox.TAG);
  }
}
TypeComposer.defineElement(HBox.TAG, HBox);
