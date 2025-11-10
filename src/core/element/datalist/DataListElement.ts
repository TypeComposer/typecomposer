import { ElementType, Component } from "../../";

export class DataListElement extends HTMLDataListElement implements IComponent {
   static readonly TAG: string = "tc-datalist-element";
   constructor(props?: ElementType<DataListElement>) {
	   super();
	   // @ts-ignore
		Component.initComponent(this, DataListElement, props);
   }
}

TypeComposer.defineElement(DataListElement.TAG, DataListElement, {
	extends: "datalist",
});