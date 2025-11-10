import { ElementType, Component } from "../../";

export class IFrameElement extends HTMLIFrameElement implements IComponent {
	static readonly TAG: string = "tc-iframe-element";
	constructor(props?: ElementType<IFrameElement>) {
		super();
		 // @ts-ignore
        Component.initComponent(this, IFrameElement, props);
	}

	public set allowfullscreen(value: boolean) {
		this.setAttribute("allowfullscreen", value.toString());
	}

	public get allowfullscreen(): boolean {
		return this.getAttribute("allowfullscreen") == "true";
	}

	public set allowpaymentrequest(value: boolean) {
		this.setAttribute("allowpaymentrequest", value.toString());
	}

	public get allowpaymentrequest(): boolean {
		return this.getAttribute("allowpaymentrequest") == "true";
	}

	public set csp(value: string) {
		this.setAttribute("csp", value);
	}

	public get csp(): string {
		return this.getAttribute("csp");
	}

	public set importance(value: "auto" | "high" | "low") {
		this.setAttribute("importance", value);
	}

	public get importance(): "auto" | "high" | "low" {
		return this.getAttribute("importance") as any;
	}

	public set referrerpolicy(
		value:
			| "no-referrer"
			| "no-referrer-when-downgrade"
			| "origin"
			| "origin-when-cross-origin"
			| "same-origin"
			| "strict-origin"
			| "strict-origin-when-cross-origin"
			| "unsafe-url",
	) {
		this.setAttribute("referrerpolicy", value);
	}

	public get referrerpolicy(): string {
		return this.getAttribute("referrerpolicy");
	}
}

TypeComposer.defineElement(IFrameElement.TAG, IFrameElement, {
	extends: "iframe",
});