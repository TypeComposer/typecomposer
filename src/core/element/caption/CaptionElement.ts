import { ElementType, Component } from "../../";
// <caption>
export class CaptionElement extends HTMLTableCaptionElement implements IComponent {
	static readonly TAG: string = "tc-caption-element";
	constructor(props?: ElementType<CaptionElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, CaptionElement, props);
	}
}
TypeComposer.defineElement(CaptionElement.TAG, CaptionElement, {
	extends: "caption",
});