import { ElementType, Component } from "../../";

export class HeaderElement extends HTMLElement implements IComponent {
	static readonly TAG: string = "tc-header-element";
	constructor(props?: ElementType) {
		super();
		// @ts-ignore
		Component.initComponent(this, HeaderElement, props);
	}
}

TypeComposer.defineElement(HeaderElement.TAG, HeaderElement, {
	extends: "header",
});
