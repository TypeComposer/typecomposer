import { ElementType, Component } from "../../";

// <del>
export class DeletedTextElement extends HTMLModElement implements IComponent {
	static readonly TAG: string = "tc-del-element";
	constructor(props?: ElementType<DeletedTextElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, DeletedTextElement, props);
	}
}

TypeComposer.defineElement(DeletedTextElement.TAG, DeletedTextElement, {
	extends: "del",
});