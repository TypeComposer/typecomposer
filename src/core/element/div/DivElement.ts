import { ElementType, Component } from "../../";

export class DivElement extends HTMLDivElement implements IComponent {
	static readonly TAG: string = "tc-div-element";
	constructor(props?: ElementType<HTMLDivElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, DivElement, props);
	}
}

TypeComposer.defineElement(DivElement.TAG, DivElement, { extends: "div" });