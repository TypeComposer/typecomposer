import { ElementType, Component } from "../../";

// <code>
export class CodeElement extends HTMLElement implements IComponent {
   static readonly TAG: string = "tc-code-element";
   constructor(props?: ElementType & { contentEditable?: boolean }) {
	   super();
	   // @ts-ignore
		Component.initComponent(this, CodeElement, props);
	   // if (props.contentEditable != undefined) this.contentEditable = props.contentEditable.toString();
   }
}

TypeComposer.defineElement(CodeElement.TAG, CodeElement, { extends: "code" });