import { ElementType, Component } from "../../";

export class OrderedListElement extends HTMLOListElement implements IComponent {
	static readonly TAG: string = "tc-ol-element";
	constructor(props?: ElementType<OrderedListElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, OrderedListElement, props);
	}
}

TypeComposer.defineElement(OrderedListElement.TAG, OrderedListElement, { extends: "ol" });