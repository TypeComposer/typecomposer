import { ElementType, Component, DivElement } from "../../";

interface SvgBaseElement extends IComponent {
	src?: string;
	readonly complete: boolean;
}

interface SvgConstructor {
	new(props?: ElementType & { src?: string }): SvgBaseElement;
}

const svgAssets = new Map<string, string>();

function svgCopy(src: SVGElement, dst: SVGElement): void {
	if (!src || !dst) return;
	for (let i = 0; i < src.attributes.length; i++) {
		const attr = src.attributes[i];
		dst.setAttribute(attr.name, attr.value);
	}
	while (dst.firstChild) {
		dst.removeChild(dst.firstChild);
	}
	for (let i = 0; i < src.childNodes.length; i++) {
		const clonedNode = src.childNodes[i].cloneNode(true);
		dst.appendChild(clonedNode);
	}
}

const applySvg = (svg: SVGElement, src: string | undefined, svgText: string): boolean => {
	if (svgText && svgText.length > 0 && (svgText.startsWith("<?xml") || svgText.includes("<svg"))) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgText, "image/svg+xml");
		const parserErrors = doc.getElementsByTagName("parsererror");
		// @ts-ignore
		const newSvg = doc.querySelector("svg") as SVGAElement;
		if (parserErrors.length == 0 && newSvg && newSvg?.tagName == "svg") {
			svgCopy(newSvg, svg);
			// @ts-ignore
			svg.complete = true;
			svg.dispatchEvent(new CustomEvent("load"));
			if (src) svgAssets.set(src, svgText);
			// @ts-ignore
			if (svg.onLoad) svg.onLoad();
			return true;
		}
	} else {
		svg.dispatchEvent(new CustomEvent("error"));
		// @ts-ignore
		if (svg.onError) svg.onError();
	}
	return false;
};

const SvgBaseElement: SvgConstructor = function (props?: ElementType & { src?: string }) {
	if (props?.src && props.src.includes("<svg") && props.src.includes("</svg>")) {
		const div = new DivElement();
		div.innerHTML = props.src;
		const svg = div.firstElementChild as HTMLElement;
		if (svg) Component.applyProps(svg, props);
		Object.defineProperty(svg, "src", {
			get: () => "",
			set: () => {
				console.warn("svg static: src is readonly");
			},
		});
		return svg as any;
	}
	// @ts-ignore
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGElement;
	const callback: MutationCallback = (mutationsList) => {
		for (const mutation of mutationsList) {
			if (mutation.type === "attributes" && mutation.attributeName == "src") {
				// @ts-ignore
				svg.complete = false;
				const src = (mutation.target as HTMLElement)?.getAttribute(mutation.attributeName!) || "";
				if (src.endsWith(".svg")) {
					const svgText = svgAssets.get(src);
					if (svgText) {
						applySvg(svg, undefined, svgText);
					} else {
						const currentDomain = window.location.origin;
						const urlObject = new URL(src, currentDomain);
						if (urlObject.origin === currentDomain) {
							fetch(src, {
								method: "GET",
								headers: {
									"Content-Type": "image/svg+xml",
									Accept: "image/svg+xml",
								},
								credentials: "same-origin",
							})
								.then(async (response) => {
									if (response.ok) {
										const svgText = await response.text();
										applySvg(svg, src, svgText);
									}
								})
								.catch(() => {
									// @ts-ignore
									svg.complete = true;
									applySvg(svg, undefined, document.createElementNS("http://www.w3.org/2000/svg", "svg").outerHTML);
									svg.dispatchEvent(new CustomEvent("error"));
									// @ts-ignore
									if (svg.onError) svg.onError();
								});
						} else {
							applySvg(svg, undefined, document.createElementNS("http://www.w3.org/2000/svg", "svg").outerHTML);
							// @ts-ignore
							svg.complete = true;
							svg.dispatchEvent(new CustomEvent("error"));
							// @ts-ignore
							if (svg.onError) svg.onError();
						}
					}
				} else {
					applySvg(svg, undefined, document.createElementNS("http://www.w3.org/2000/svg", "svg").outerHTML);
					// @ts-ignore
					svg.complete = true;
					svg.dispatchEvent(new CustomEvent("error"));
					// @ts-ignore
					if (svg.onError) svg.onError();
				}
			}
		}
	};
	const observer = new MutationObserver(callback);
	observer.observe(svg, {
		attributes: true,
		childList: false,
		subtree: false,
		attributeOldValue: true,
		attributeFilter: ["src"],
	});
	// @ts-ignore
	Component.applyProps(svg, props);
	svg.src = props.src;
	Object.defineProperty(svg, "__observer__", {
		value: observer,
		writable: false,
		enumerable: false,
		configurable: false,
	});
	// @ts-ignore
	return svg;
} as unknown as any;

export class SvgElement extends SvgBaseElement {
	static readonly TAG: string = "svg";
	constructor(props?: ElementType & { src?: string }) {
		super(props);
	}
}
