import { ElementType, Component } from "../../";

// <cite>
export class CiteElement extends HTMLElement implements IComponent {
   static readonly TAG: string = "tc-cite-element";
   constructor(props?: ElementType) {
	   super();
	   // @ts-ignore
		Component.initComponent(this, CiteElement, props);
   }
}

TypeComposer.defineElement(CiteElement.TAG, CiteElement, { extends: "cite" });