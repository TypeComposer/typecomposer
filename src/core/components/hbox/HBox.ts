import { type ElementType, Component } from "../..";
import "./HBox.css";
export class HBox extends Component {
  static readonly TAG: string = "tc-hbox";
  constructor(props?: ElementType) {
    super(props);
    this.extendedStyle.add(HBox.TAG);
  }
}
TypeComposer.defineElement(HBox.TAG, HBox);
