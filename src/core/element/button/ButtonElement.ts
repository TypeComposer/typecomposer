import { ElementType, Component } from "../../";

export class ButtonElement extends HTMLButtonElement implements IComponent {
	static readonly TAG: string = "tc-button-element";
	loading: boolean = false;
	constructor(props?: ElementType<ButtonElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, ButtonElement, props);
	}

	// @ts-ignore
	set type(value: "submit" | "reset" | "button" | "file") {
		// @ts-ignore
		super.type = value;
	}

	set onclick(value: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null) {
		if (this.loading && value.constructor.name === "AsyncFunction") {
			super.onclick = async (event: MouseEvent) => {
				if (this.hasAttribute("loading")) return;
				if (this.loading) {
					this.setAttribute("loading", "");
					try {
						// @ts-ignore
						await value.bind(this, event);
					} catch (error) {
					}
					this.removeAttribute("loading");
				} else if (value)
					value.bind(this, event);
			}
		} else
			super.onclick = value;
	}

	set onfile(value: ((this: GlobalEventHandlers, file: FileList) => any) | null) {
		super.onfile = value;
	}
}

TypeComposer.defineElement(ButtonElement.TAG, ButtonElement, { extends: "button" });