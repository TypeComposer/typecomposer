import { ElementType, Component, LegendElement } from "../../";

export class FieldSetElement extends HTMLFieldSetElement implements IComponent {
	static readonly TAG: string = "tc-fieldset-element";
	constructor(props?: ElementType<FieldSetElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, FieldSetElement, props);
	}

	public set legend(element: LegendElement | string) {
		const legendElement = this.querySelector("legend");
		if (element instanceof LegendElement) {
			legendElement?.remove();
			this.appendChild(element);
		} else if (legendElement) {
			legendElement.innerHTML = element;
		}
		else {
			this.appendChild(new LegendElement({ text: element }));
		}
	}
}

TypeComposer.defineElement(FieldSetElement.TAG, FieldSetElement, {
	extends: "fieldset",
});