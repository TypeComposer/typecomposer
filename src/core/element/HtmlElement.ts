import { ElementType, Component } from "../../";
export class HtmlElement extends HTMLHtmlElement implements IComponent {
	static readonly TAG: string = "tc-html-element";
	constructor(props?: ElementType<HtmlElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, HtmlElement, props);
	}
	set manifest(value: string) {
		this.setAttribute("manifest", value);
	}

	get manifest(): string {
		return this.getAttribute("manifest");
	}
}
TypeComposer.defineElement(HtmlElement.TAG, HtmlElement, { extends: "html" });
