import { ElementType, Component } from "../../";

export class DefinitionDescriptionElement extends HTMLElement implements IComponent {
   static readonly TAG: string = "tc-dd-element";
   constructor(props?: ElementType) {
	   super();
      // @ts-ignore
	   Component.initComponent(this, DefinitionDescriptionElement, props);
   }
}

TypeComposer.defineElement(DefinitionDescriptionElement.TAG, DefinitionDescriptionElement, {
	extends: "dd",
});