import { ElementType, Component } from "../../";

export class SourceElement extends HTMLSourceElement implements IComponent {
	static readonly TAG: string = "tc-source-element";
	constructor(props?: ElementType<SourceElement>) {
		super();
		if (props?.src) this.src = props.src as any;
		if (props?.type) this.type = props.type as any;
		// @ts-ignore
        Component.initComponent(this, SourceElement, props);
	}
}

TypeComposer.defineElement(SourceElement.TAG, SourceElement, { extends: "source" });