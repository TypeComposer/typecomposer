import { ElementType, Component } from "../../";

export class H3Element extends HTMLHeadingElement implements IComponent {
	static readonly TAG: string = "tc-h3-element";
	constructor(props?: ElementType<H3Element>) {
		super();
		// @ts-ignore
		Component.initComponent(this, H3Element, props);
	}
}

TypeComposer.defineElement(H3Element.TAG, H3Element, { extends: "h3" });