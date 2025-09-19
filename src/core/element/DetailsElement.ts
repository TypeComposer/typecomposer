import { ElementType, Component, SummaryElement } from "../../";

export class DetailsElement extends HTMLDetailsElement implements IComponent {
	static readonly TAG: string = "tc-details-element";
	constructor(props?: ElementType<DetailsElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, DetailsElement, props);
	}

	public set summary(summary: SummaryElement | string) {
		if (typeof summary == "string") 
			summary = new SummaryElement({ text: summary });
		this.querySelector("summary")?.remove();
		this.appendChild(summary);
	}
}

TypeComposer.defineElement(DetailsElement.TAG, DetailsElement, {
	extends: "details",
});