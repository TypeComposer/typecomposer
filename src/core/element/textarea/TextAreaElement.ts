import { ElementType, Component, refString } from "../../";

export class TextAreaElement extends HTMLTextAreaElement implements IComponent {
	static readonly TAG: string = "tc-textarea-element";
	constructor(props?: ElementType<TextAreaElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, TextAreaElement, props);
	}
}

TypeComposer.defineElement(TextAreaElement.TAG, TextAreaElement, { extends: "textarea" });