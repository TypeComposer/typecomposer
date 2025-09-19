import { ElementType, Component } from "../../";

export class ParagraphElement extends HTMLParagraphElement implements IComponent {
	static readonly TAG: string = "tc-p-element";
	constructor(props?: ElementType<ParagraphElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, ParagraphElement, props);
	}
}

TypeComposer.defineElement(ParagraphElement.TAG, ParagraphElement, { extends: "p" });