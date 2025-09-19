import { type ElementType, Component } from "../..";

export class HBox extends Component {
  static readonly TAG: string = "tc-hbox";
  constructor(props?: ElementType) {
    super(props);
    this.addClassName("hbox");
  }
}
TypeComposer.defineElement(HBox.TAG, HBox);
