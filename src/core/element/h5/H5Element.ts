import { ElementType, Component } from "../../";

export class H5Element extends HTMLHeadingElement implements IComponent {
	static readonly TAG: string = "tc-h5-element";
	constructor(props?: ElementType<H5Element>) {
		super();
		// @ts-ignore
		Component.initComponent(this, H5Element, props);
	}
}

TypeComposer.defineElement(H5Element.TAG, H5Element, { extends: "h5" });