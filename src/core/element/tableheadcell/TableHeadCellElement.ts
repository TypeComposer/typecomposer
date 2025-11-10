import { ElementType, Component } from "../../";

export class TableHeadCellElement extends HTMLTableCellElement {
	static readonly TAG: string = "tc-th-cell-element";
	constructor(
		props?: ElementType<TableHeadCellElement> & {
			colspan?: number;
			rowspan?: number;
			child?: HTMLElement;
			value?: string | number | HTMLElement;
		},
	) {
		super();
		if (props?.colspan) this.colSpan = props.colspan;
		if (props?.rowspan) this.rowSpan = props.rowspan;
		if (props?.value) {
			if (props.value instanceof HTMLElement) this.appendChild(props.value);
			else this.innerHTML = props.value.toString();
		}
		if (props?.child) this.appendChild(props.child);
		delete props?.child;
		delete props?.value;
		// @ts-ignore
        Component.initComponent(this, TableHeadCellElement, props);
	}
}
TypeComposer.defineElement(TableHeadCellElement.TAG, TableHeadCellElement, { extends: "th" });
