import { ElementType, Component } from "../../";

export class TableColElement extends HTMLTableColElement implements IComponent {
	static readonly TAG: string = "tc-col-element";
	constructor(props?: ElementType<TableColElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, TableColElement, props);
	}
}

TypeComposer.defineElement(TableColElement.TAG, TableColElement, { extends: "col" });