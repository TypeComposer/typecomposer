import { ElementType, Component } from "../../";

export class H1Element extends HTMLHeadingElement implements IComponent {
	static readonly TAG: string = "tc-h1-element";
	constructor(props?: ElementType<H1Element>) {
		super();
		// @ts-ignore
		Component.initComponent(this, H1Element, props);
	}
}

TypeComposer.defineElement(H1Element.TAG, H1Element, { extends: "h1" });