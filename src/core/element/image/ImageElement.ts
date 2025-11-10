import { ElementType, Component, refString, refNumber } from "../../";

export class ImageElement extends HTMLImageElement implements IComponent {
	static readonly TAG: string = "tc-img-element";
	constructor(props?: ElementType<ImageElement> & {
		src?: string | refString; alt?: string | refString,
		lazy?: boolean; loading?: "eager" | "lazy" | "auto";
		decoding?: "sync" | "async" | "auto";
		sizes?: string;
		srcset?: string;
		crossOrigin?: "anonymous" | "use-credentials";
		width?: number | refNumber | string | refString;
		height?: number | refNumber | string | refString;
		referrerPolicy?: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
		importance?: "auto" | "high" | "low" | "none";
		referrerpolicy?: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
	}) {
		super();
		this.className = "image-element";
		// @ts-ignore
        Component.initComponent(this, ImageElement, props);
	}
}

TypeComposer.defineElement(ImageElement.TAG, ImageElement, { extends: "img" });
