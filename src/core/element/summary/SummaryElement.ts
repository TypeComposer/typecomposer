import { ElementType, Component } from "../../";

export class SummaryElement extends HTMLElement implements IComponent {
	static readonly TAG: string = "base-summary-element";
	constructor(props?: ElementType) {
		super();
		// @ts-ignore
        Component.initComponent(this, SummaryElement, props);
	}
}

TypeComposer.defineElement(SummaryElement.TAG, SummaryElement, {
	extends: "summary",
});