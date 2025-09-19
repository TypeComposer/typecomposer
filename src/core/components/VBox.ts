import { Component, type ElementType } from "../..";

export class VBox extends Component {
  static readonly TAG: string = "tc-vbox";
  constructor(props?: ElementType) {
    super(props);
    this.addClassName("vbox");
  }
}
TypeComposer.defineElement(VBox.TAG, VBox);
