import { ElementType, Component } from "../../";

export class AreaElement extends HTMLAreaElement implements IComponent {
	static readonly TAG: string = "tc-area-element";

	constructor(props?: ElementType<AreaElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, AreaElement, props);
	}
}

TypeComposer.defineElement(AreaElement.TAG, AreaElement, { extends: "area" });
