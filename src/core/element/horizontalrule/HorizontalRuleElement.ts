import { ElementType, Component } from "../../";

export class HorizontalRuleElement extends HTMLHRElement implements IComponent {
	static readonly TAG: string = "tc-hr-element";
	constructor(props?: ElementType<HorizontalRuleElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, HorizontalRuleElement, props);
	}
}

TypeComposer.defineElement(HorizontalRuleElement.TAG, HorizontalRuleElement, {
	extends: "hr",
});
