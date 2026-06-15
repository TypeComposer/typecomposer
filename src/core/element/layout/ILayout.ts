import { ElementType } from "../../";
import { Component } from "../../../global/index";

export class ILayout extends Component {
	static readonly TAG: string = "tc-layout-element";
	constructor(props?: ElementType) {
		super(props);
		// @ts-ignore
        Component.initComponent(this, ILayout, props);
	}
}

TypeComposer.defineElement(ILayout.TAG, ILayout);