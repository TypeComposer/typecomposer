import { ElementType, Component, TableCellElement } from "../../";

export class TableFootRowElement extends HTMLTableRowElement {
	static readonly TAG: string = "tc-tfoot-row-element";
	constructor(props?: ElementType<TableCellElement> & { cells?: TableCellElement[]}) {
		super();
		if (props?.cells) {
			this.addCells(...props.cells);
		}
		delete props?.cells;
		// @ts-ignore
        Component.initComponent(this, TableFootRowElement, props);
	}
	addCells(...cells: TableCellElement[]) {
		cells.forEach((cell) => {
			this.appendChild(cell);
		});
	}
	addCell(cell: TableCellElement): TableCellElement {
		this.appendChild(cell);
		return cell;
	}
}

TypeComposer.defineElement(TableFootRowElement.TAG, TableFootRowElement, { extends: "tr" });