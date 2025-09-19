import { Component, ElementType } from "../..";

export class StackPanel extends Component {
  static readonly TAG: string = "tc-stack-panel";
  constructor(props?: ElementType) {
    super(props);
    this.addClassName("stack-panel");
  }
}

TypeComposer.defineElement(StackPanel.TAG, StackPanel);
