import { ElementType, Component } from "../../";

export class StyleElement extends HTMLStyleElement implements IComponent {
	static readonly TAG: string = "tc-style-element";
	constructor(props?: ElementType<StyleElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, StyleElement, props);
	}
}

TypeComposer.defineElement(StyleElement.TAG, StyleElement, { extends: "style" });