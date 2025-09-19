import { ElementType, Component } from "../../";

export class EmbedElement extends HTMLEmbedElement implements IComponent {
	static readonly TAG: string = "tc-embed-element";
	constructor(props?: ElementType<EmbedElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, EmbedElement, props);
	}
}

TypeComposer.defineElement(EmbedElement.TAG, EmbedElement, { extends: "embed" });
