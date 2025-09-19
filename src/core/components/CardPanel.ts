import { ElementType, Component } from "../..";

export class CardPanel extends Component {
  static readonly TAG: string = "tc-card-panel";
  constructor(props?: ElementType) {
    super(props);
    this.extendedStyle.add(CardPanel.TAG);
  }
}
TypeComposer.defineElement(CardPanel.TAG, CardPanel);
