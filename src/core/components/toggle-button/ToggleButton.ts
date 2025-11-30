import { ElementType, Component } from "../..";

export class ToggleButton extends Component {
  static readonly TAG: string = "tc-toggle-button";
  constructor(props?: ElementType<ToggleButton>) {
    super(props);
  }
}
// @ts-ignore
TypeComposer.defineElement(ToggleButton.TAG, ToggleButton);
