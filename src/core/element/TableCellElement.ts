import { ElementType, Component } from "../../";

export class TableCellElement extends HTMLTableCellElement implements IComponent {
	static readonly TAG: string = "tc-td-element";
	constructor(
		props?: ElementType<TableCellElement> & {
			value?: any;
		}) {
		super();
		// @ts-ignore
        Component.initComponent(this, TableCellElement, props);
	}
}

TypeComposer.defineElement(TableCellElement.TAG, TableCellElement, { extends: "td" });