import { ElementType, Component } from "../../";

export class MainElement extends HTMLElement implements IComponent {
	static readonly TAG: string = "tc-main-element";
	constructor(props?: ElementType) {
		super();
		// @ts-ignore
        Component.initComponent(this, MainElement, props);
	}
}

TypeComposer.defineElement(MainElement.TAG, MainElement, { extends: "main" });