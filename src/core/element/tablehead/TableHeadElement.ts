import { ElementType, Component } from "../../";

export class TableHeadElement extends HTMLTableSectionElement implements IComponent {
	static readonly TAG: string = "tc-thead-element";
	constructor(props?: ElementType<TableHeadElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, TableHeadElement, props);
	}
}

TypeComposer.defineElement(TableHeadElement.TAG, TableHeadElement, { extends: "thead" });