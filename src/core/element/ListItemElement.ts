import { ElementType, Component } from "../../";

export class ListItemElement<T = any> extends HTMLLIElement implements IComponent {
	static readonly TAG: string = "tc-list-item-element";
	constructor(props?: ElementType<ListItemElement>) {
		super();
		// @ts-ignore
        Component.initComponent(this, ListItemElement, props);
	}
	item: T | undefined = undefined;

	removeItem(): void {
		this.dispatchEvent(new CustomEvent("removeItem", { detail: { item: this.item, element: this }, bubbles: true, cancelable: true }));
	}

	set draggable(value: boolean) {
		if (value) {
			this.addClassName("item-draggable");
			this.setAttribute("draggable", "true");
		} else {
			this.classList.remove("item-draggable");
			this.removeAttribute("draggable");
		}
	}

	get draggable(): boolean {
		return this.hasAttribute("draggable");
	}

	onSelect(): void { }
}

TypeComposer.defineElement(ListItemElement.TAG, ListItemElement, { extends: "li" });