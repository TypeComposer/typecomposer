import { ElementType, Component } from "../../";
// <base>
export class BaseElement extends HTMLElement implements IComponent {
	static readonly TAG: string = "tc-base-element";
	constructor(props?: ElementType<BaseElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, BaseElement, props);
	}
}

TypeComposer.defineElement(BaseElement.TAG, BaseElement, { extends: "base" });