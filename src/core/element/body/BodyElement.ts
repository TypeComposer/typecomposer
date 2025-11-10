import { ElementType, Component } from "../../";
// <body>
export class BodyElement extends HTMLBodyElement implements IComponent {
	static readonly TAG: string = "tc-body-element";
	constructor(props?: ElementType<BodyElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, BodyElement, props);
	}
}

TypeComposer.defineElement(BodyElement.TAG, BodyElement, { extends: "body" });