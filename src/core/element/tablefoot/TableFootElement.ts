import { ElementType, Component } from "../../";

export class TableFootElement extends HTMLTableSectionElement implements IComponent {
	static readonly TAG: string = "tc-tfoot-element";
	constructor(props?: ElementType<TableFootElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, TableFootElement, props);
	}
}

TypeComposer.defineElement(TableFootElement.TAG, TableFootElement, { extends: "tfoot" });