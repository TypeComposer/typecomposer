import { ElementType, Component } from "../../";

export class StrongElement extends HTMLSpanElement implements IComponent {
	static readonly TAG: string = "tc-strong-element";
	constructor(props?: ElementType<StrongElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, StrongElement, props);
	}
}

TypeComposer.defineElement(StrongElement.TAG, StrongElement, {
	extends: "strong",
});