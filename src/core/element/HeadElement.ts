import { ElementType, Component } from "../../";

export class HeadElement extends HTMLHeadElement implements IComponent {
	static readonly TAG: string = "tc-head-element";
	constructor(props?: ElementType<HeadElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, HeadElement, props);
	}
}

TypeComposer.defineElement(HeadElement.TAG, HeadElement, { extends: "head" });