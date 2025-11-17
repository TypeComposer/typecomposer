
import { type ElementType, Component } from "../..";


export class SelectItemPanel extends Component {
    static readonly TAG: string = "tc-select-item-panel";

    constructor(props?: ElementType<SelectItemPanel>) {
        super(props);
    }
}
TypeComposer.defineElement(SelectItemPanel.TAG, SelectItemPanel);

export class SelectPanel extends Component {
    static readonly TAG: string = "tc-select-panel";

    constructor(props?: ElementType<SelectPanel>) {
        super(props);
    }
}
TypeComposer.defineElement(SelectPanel.TAG, SelectPanel);