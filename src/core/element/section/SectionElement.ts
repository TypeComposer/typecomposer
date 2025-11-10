import { ElementType, Component } from "../../";

export class SectionElement extends HTMLElement implements IComponent {
	static readonly TAG: string = "tc-section-element";
	constructor(props?: ElementType) {
		super();
		// @ts-ignore
        Component.initComponent(this, SectionElement, props);
	}
}

TypeComposer.defineElement(SectionElement.TAG, SectionElement, {
	extends: "section",
});