import { ElementType, Component } from "../../";

export class FooterElement extends HTMLElement implements IComponent {
	static readonly TAG: string = "tc-footer-element";
	constructor(props?: ElementType) {
		super();
		// @ts-ignore
		Component.initComponent(this, FooterElement, props);
	}
}

TypeComposer.defineElement(FooterElement.TAG, FooterElement, {
	extends: "footer",
});