import { ElementType, Component, TableCellElement } from "../../";

export class TableRowElement extends HTMLTableRowElement implements IComponent {
	static readonly TAG: string = "tc-tr-element";
	value: any[] | undefined;
	constructor(
		props?: ElementType<TableRowElement> & {
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
        Component.initComponent(this, TableRowElement, props);
	}
	addCells(...cells) {
		cells.forEach((cell) => {
			this.appendChild(cell);
		});
	}
	addCell(cell) {
		this.appendChild(cell);
		return cell;
	}
}

TypeComposer.defineElement(TableRowElement.TAG, TableRowElement, { extends: "tr" });