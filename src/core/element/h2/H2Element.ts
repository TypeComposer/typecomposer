import { ElementType, Component } from "../../";

export class H2Element extends HTMLHeadingElement implements IComponent {
	static readonly TAG: string = "tc-h2-element";
	constructor(props?: ElementType<H2Element>) {
		super();
		// @ts-ignore
		Component.initComponent(this, H2Element, props);
	}
}

TypeComposer.defineElement(H2Element.TAG, H2Element, { extends: "h2" });