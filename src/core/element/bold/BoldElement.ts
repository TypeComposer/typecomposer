import { ElementType, Component } from "../../";
export class BoldElement extends HTMLElement implements IComponent {
   static readonly TAG: string = "tc-bold-element";
   constructor(props?: ElementType) {
	   super();
	   // @ts-ignore
		Component.initComponent(this, BoldElement, props);
   }
}

TypeComposer.defineElement(BoldElement.TAG, BoldElement, { extends: "b" });