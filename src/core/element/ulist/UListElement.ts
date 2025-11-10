import { ElementType, Component } from "../../";

export class UListElement extends HTMLUListElement implements IComponent {
	static readonly TAG: string = "tc-ul-element";
	constructor(props?: ElementType<UListElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, UListElement, props);
	}
}

TypeComposer.defineElement(UListElement.TAG, UListElement, { extends: "ul" });