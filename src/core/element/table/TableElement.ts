import { ElementType, Component} from "../../";

export class TableElement extends HTMLTableElement implements IComponent {
	static readonly TAG: string = "tc-table-element";
	constructor(props?: ElementType<TableElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, TableElement, props);
	}
}

TypeComposer.defineElement(TableElement.TAG, TableElement, { extends: "table" });
