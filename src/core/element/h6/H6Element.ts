import { ElementType, Component } from "../../";

export class H6Element extends HTMLHeadingElement implements IComponent {
	static readonly TAG: string = "tc-h6-element";
	constructor(props?: ElementType<H6Element>) {
		super();
		// @ts-ignore
		Component.initComponent(this, H6Element, props);
	}
}

TypeComposer.defineElement(H6Element.TAG, H6Element, { extends: "h6" });