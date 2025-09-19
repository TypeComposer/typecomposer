import { ElementType, Component } from "../../";

// <dialog>
export class DialogElement extends HTMLDialogElement implements IComponent {
	static readonly TAG: string = "tc-dialog-element";
	constructor(props?: ElementType<DialogElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, DialogElement, props);
	}
}

TypeComposer.defineElement(DialogElement.TAG, DialogElement, {
	extends: "dialog",
});