import { ElementType } from "../..";
import { Component } from "../../../global/index";

export class IdiomaticElement extends Component {
    static readonly TAG: string = "tc-i-element";

    constructor(props?: ElementType) {
        super();
        // @ts-ignore
        Component.initComponent(this, IdiomaticElement, props);
    }
}
TypeComposer.defineElement(IdiomaticElement.TAG, IdiomaticElement, { extends: "i" });
