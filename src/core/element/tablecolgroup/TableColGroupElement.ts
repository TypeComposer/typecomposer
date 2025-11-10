import { ElementType, Component } from "../../";

export class TableColGroupElement extends HTMLTableColElement implements IComponent {
	static readonly TAG: string = "tc-colgroup-element";
	constructor(props?: ElementType<TableColGroupElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, TableColGroupElement, props);
	}
}

TypeComposer.defineElement(TableColGroupElement.TAG, TableColGroupElement, {
	extends: "colgroup",
});