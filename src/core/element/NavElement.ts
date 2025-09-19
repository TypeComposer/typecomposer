import { ElementType, Component } from "../../";

export class NavElement extends HTMLElement implements IComponent {
	static readonly TAG: string = "tc-nav-element";
	constructor(props?: ElementType) {
		super();
		// @ts-ignore
        Component.initComponent(this, NavElement, props);
	}
}

TypeComposer.defineElement(NavElement.TAG, NavElement, { extends: "nav" });