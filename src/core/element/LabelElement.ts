import { ElementType, Component } from "../../";

export class LabelElement extends HTMLLabelElement implements IComponent {
	static readonly TAG: string = "tc-label-element";
	constructor(props?: ElementType<LabelElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, LabelElement, props);
	}
}

TypeComposer.defineElement(LabelElement.TAG, LabelElement, { extends: "label" });
