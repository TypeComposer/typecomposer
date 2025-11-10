import { ElementType, Component } from "../../";

export class CanvasElement extends HTMLCanvasElement implements IComponent {
   static readonly TAG: string = "tc-canvas-element";
   constructor(props?: ElementType<HTMLCanvasElement>) {
	   super();
	   // @ts-ignore
	   Component.initComponent(this, CanvasElement, props);
   }
}

TypeComposer.defineElement(CanvasElement.TAG, CanvasElement, { extends: "canvas" });