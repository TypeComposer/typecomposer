import { ElementType, Component } from "../../";

export class TableBodyElement extends HTMLTableSectionElement implements IComponent {
	static readonly TAG: string = "tc-tbody-element";
	constructor(props?: ElementType<TableBodyElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, TableBodyElement, props);
	}
}

TypeComposer.defineElement(TableBodyElement.TAG, TableBodyElement, { extends: "tbody" });