import { ElementType, Component } from "../../";
// <legend>
export class LegendElement extends HTMLLegendElement implements IComponent {
	static readonly TAG: string = "tc-legend-element";
	constructor(props?: ElementType<LegendElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, LegendElement, props);

	}
}

TypeComposer.defineElement(LegendElement.TAG, LegendElement, {
	extends: "legend",
});