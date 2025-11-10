import { ElementType, Component } from "../../";


// export interface FormElementType extends ElementType<HTMLElement> {
// 	acceptCharset?: string;
// 	action?: string;
// 	enctype?: string;
// 	method?: "get" | "post" | "dialog";
// 	name?: string;
// 	novalidate?: boolean;
// 	rel?: "external" | "help" | "license" | "next" | "nofollow" | "noopener" | "noreferrer" | "opener" | "prev" | "search";
// 	target?: "_blank" | "_self" | "_parent" | "_top";
// 	/**
// 	 * The credentials mode of the request, which indicates whether credentials will be sent with the request.
// 	 */
// 	credentials?: RequestCredentials
// 	onResponse?: (response: Response) => void;
// }

export class FormElement extends HTMLFormElement implements IComponent {
	static readonly TAG: string = "tc-form-element";
	constructor(props?: ElementType<FormElement>) {
		super();
		// if (props?.onResponse) {
		// 	const onResponse = props.onResponse;

		// 	this.onsubmit = (event) => {
		// 		event.preventDefault();
		// 		const formData = new FormData(this);
		// 		const entries = (formData as any).entries();
		// 		const jsonObject = Object.fromEntries(entries);
		// 		const init: RequestInit = {
		// 			method: this.method || "get",
		// 			headers: {
		// 				"Accept": "application/json",
		// 				"Content-Type": "application/json"
		// 			}
		// 		}
		// 		if (props?.credentials) init.credentials = props.credentials;
		// 		if (this.method == "post") init.body = JSON.stringify(jsonObject);
		// 		else if (this.method == "get") init.params = jsonObject;
		// 		fetch(this.action, init).then(response => onResponse(response))
		// 			.catch(error => { onResponse(new Response(JSON.stringify({ error: error.message }), { status: 500, statusText: "Internal Server Error" })) });
		// 	};
		// }
		// delete props?.onResponse;
		// @ts-ignore
		Component.initComponent(this, FormElement, props);
	}
}

Component.setVariant(FormElement, "vbox", (element) => element.classList.add("vbox"));
TypeComposer.defineElement(FormElement.TAG, FormElement, { extends: "form" });