import { ElementType, Component } from "../../";

export class AbbreviationElement extends HTMLElement implements IComponent {

	static readonly TAG: string = "tc-abbr-element";

	constructor(props?: ElementType) {
		super();
		// @ts-ignore
		Component.initComponent(this, AbbreviationElement, props);
	}
}

TypeComposer.defineElement(AbbreviationElement.TAG, AbbreviationElement, { extends: "abbr" });