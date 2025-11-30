import { ElementType, Component } from "../../";

export class FormElement extends HTMLFormElement implements IComponent {
	static readonly TAG: string = "tc-form-element";
	constructor(props?: ElementType<HTMLFormElement>) {
		super();
		Component.initComponent(this, FormElement, props);
	}
}

TypeComposer.defineElement(FormElement.TAG, FormElement, { extends: "form" });