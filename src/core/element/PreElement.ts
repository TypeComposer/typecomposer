import { ElementType, Component } from "../../";

export class PreElement extends HTMLPreElement implements IComponent {
	static readonly TAG: string = "tc-pre-element";
	constructor(props?: ElementType<PreElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, PreElement, props);
	}
}

TypeComposer.defineElement(PreElement.TAG, PreElement, { extends: "pre" });