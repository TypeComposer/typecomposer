import { ElementType, Component } from "../../";

export class SpanElement extends HTMLSpanElement implements IComponent {
	static readonly TAG: string = "tc-span-element";
	constructor(props?: ElementType<SpanElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, SpanElement, props);
	}
}

TypeComposer.defineElement(SpanElement.TAG, SpanElement, { extends: "span" });