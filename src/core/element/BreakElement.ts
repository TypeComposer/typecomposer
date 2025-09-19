import { ElementType, Component } from "../../";
export class BreakElement extends HTMLBRElement implements IComponent {
   static readonly TAG: string = "tc-break-element";
   constructor(props?: ElementType<BreakElement>) {
	   super();
	   // @ts-ignore
		Component.initComponent(this, BreakElement, props);
   }
}

TypeComposer.defineElement(BreakElement.TAG, BreakElement, { extends: "br" });