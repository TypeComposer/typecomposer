import { ElementType, Component } from "../../";

export class H4Element extends HTMLHeadingElement implements IComponent {
	static readonly TAG: string = "tc-h4-element";
	constructor(props?: ElementType<H4Element>) {
		super();
		// @ts-ignore
		Component.initComponent(this, H4Element, props);
	}
}

TypeComposer.defineElement(H4Element.TAG, H4Element, { extends: "h4" });