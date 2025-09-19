import { ElementType, Component } from "../../";

export class EmElement extends HTMLEmbedElement implements IComponent {
	static readonly TAG: string = "tc-em-element";
	constructor(props?: ElementType<EmElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, EmElement, props);
	}
}

TypeComposer.defineElement(EmElement.TAG, EmElement, { extends: "em" });