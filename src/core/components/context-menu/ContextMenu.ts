import { ElementType, Component } from "../../";


export class ContextMenuItem extends HTMLElement implements IComponent {
	 static readonly TAG: string = "tc-context-menu-item";
	constructor(props?: ElementType) {
		super();
		this.addClassName("tc-context-menu-item");
		this.innerHTML = "<i class='fa fa-cut'></i>";
		Component.applyProps(this, props);
	}
}

TypeComposer.defineElement(ContextMenuItem.TAG, ContextMenuItem);

export class ContextMenu extends Component implements IComponent {
	static readonly TAG: string = "tc-context-menu";
	constructor(props?: ElementType) {
		super({  ...props, style: { display: "none", flexDirection: "column", ...props?.style } });
		this.addClassName("tc-context-menu");
		Component.applyProps(this, props);
		//window.addEventListener("contextmenu", (event) => {
		//	event.preventDefault();
		//	this.setPosition(event.clientX, event.clientY);
		//});
	}

	setPosition(x: number, y: number) {
		this.style.top = y + "px";
		this.style.left = x + "px";
	}

	setPositionTarget(target: HTMLElement, type: "top" | "bottom" | "left" | "right" = "bottom") {
		const rect = target.getBoundingClientRect();
		if (type == "top") {
			this.style.top = rect.top + "px";
			this.style.left = rect.left + "px";
		}
		else if (type == "bottom") {
			this.style.top = rect.bottom + "px";
			this.style.left = rect.left + "px";
		}
		else if (type == "left") {
			this.style.top = rect.top + "px";
			this.style.left = rect.left + "px";
		}
		else if (type == "right") {
			this.style.top = rect.top + "px";
			this.style.left = rect.right + "px";
		}
	}

	show() {
		this.style.display = "flex";
		this.onOpen();
	}

	toggle() {
		if (this.style.display == "flex") this.close();
		else this.show();
	}

	close() {
		this.style.display = "none";
		this.onClose();
	}

	onClose = () => { };
	onOpen = () => { };

}

TypeComposer.defineElement(ContextMenu.TAG, ContextMenu);