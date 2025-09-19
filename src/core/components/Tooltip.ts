import { Component, SpanElement } from "..";
import { ElementType } from "../styles";

export class Tooltip extends Component {
	static readonly TAG: string = "tc-tooltip";

	constructor(props: ElementType<Tooltip>) {
		super(props);
		this.appendChild(new SpanElement({ className: `tc-tooltiptext tc-tooltiptext-${props.align || "bottom"}`, text: props.text || "" }));
		delete props?.text;
		this.addClassName("tc-tooltip");
		// @ts-ignore
		Component.initComponent(this, Tooltip, props);
	}

	set align(value: "top" | "bottom" | "left" | "right") {
		const element = this.getElementsByClassName("tc-tooltiptext")[0];
		if (element) element.className = `tc-tooltiptext tc-tooltiptext-${value}`;
	}

	get align() {
		const element = this.getElementsByClassName("tc-tooltiptext")[0];
		if (!element) return "bottom";
		const className = element.className;
		return className.replace("tc-tooltiptext ", "").replace("tc-tooltiptext-", "") as "top" | "bottom" | "left" | "right";
	}

}

TypeComposer.defineElement(Tooltip.TAG, Tooltip);