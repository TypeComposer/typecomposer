import { ElementType, Component, TableCellElement } from "../../";

export class TableHeadRowElement extends HTMLTableRowElement {
	static readonly TAG: string = "tc-th-row-element";
	value: any[] | undefined;
	constructor(
		props?: ElementType<TableHeadRowElement> & {
			cells?: TableCellElement[];
			value?: any[]
		},
	) {
		super();
		this.value = props?.value;
		if (props?.cells) {
			this.addCells(...props.cells);
		} else if (this.value) {
			this.addCells(... this.value.map((cell) => cell instanceof TableCellElement ? cell : new TableCellElement({ value: cell })));
		}

		delete props?.cells;
		delete props?.value;
		// @ts-ignore
        Component.initComponent(this, TableHeadRowElement, props);
	}
	addCells(...cells: TableCellElement[]) {
		cells.forEach((cell) => {
			this.appendChild(cell);
		});
	}
	addCell(cell: TableCellElement) {
		this.appendChild(cell);
		return cell;
	}
}
TypeComposer.defineElement(TableHeadRowElement.TAG, TableHeadRowElement, { extends: "tr" });