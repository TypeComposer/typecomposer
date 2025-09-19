import { ElementType, Component } from "../../";

// <dfn>
export class DefinitionElement extends HTMLElement implements IComponent {
	static readonly TAG: string = "tc-dfn-element";
	constructor(props?: ElementType) {
		super();
		// @ts-ignore
		Component.initComponent(this, DefinitionElement, props);
	}
}

TypeComposer.defineElement(DefinitionElement.TAG, DefinitionElement, {
	extends: "dfn",
});
