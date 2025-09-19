import { ElementType, Component } from "../../";

export class SelectElement extends HTMLSelectElement implements IComponent {
	static readonly TAG: string = "tc-select-element";
	constructor(props?: ElementType<SelectElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, SelectElement, props);
	}
}

TypeComposer.defineElement(SelectElement.TAG, SelectElement, {
	extends: "select",
});