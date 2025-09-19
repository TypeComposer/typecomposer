import { ElementType, Component, refString, refNumber, ref } from "../../";
// import { RegisterOptions } from "../app/Validate";

// export type InputType =
// 	| "text"
// 	| "password"
// 	| "checkbox"
// 	| "radio"
// 	| "submit"
// 	| "reset"
// 	| "file"
// 	| "hidden"
// 	| "image"
// 	| "button"
// 	| "color"
// 	| "date"
// 	| "datetime-local"
// 	| "email"
// 	| "month"
// 	| "number"
// 	| "range"
// 	| "search"
// 	| "tel"
// 	| "time"
// 	| "url"
// 	| "week";

// export interface InputElementType extends ElementType<HTMLInputElement, "checked" | "value"> {
// 	type?: InputType;
// 	checked?: boolean | ref<boolean>;
// 	value?: string | number | refString | refNumber;
// 	///**
// 	// * Delay in milliseconds to trigger the oninputDelay event default is 200ms
// 	// */
// 	delay?: number;
// 	validation?: RegisterOptions
// 	///**
// 	// * Event triggered when the input value changes with a delay defined by the delay property
// 	// */
// 	oninputDelay?: (value: string) => void;
// }

export class InputElement extends HTMLInputElement implements IComponent {
  static readonly TAG: string = "tc-input-element";
  //   #validation?: RegisterOptions;
  //   #checkValidity;
  constructor(props?: ElementType<InputElement, "checked" | "value">) {
    super();
    if (props?.accept) this.accept = props.accept;
    this.multiple = props?.multiple || false;
    // @ts-ignore
    this.readOnly = props?.readOnly || false;
    // @ts-ignore
    Component.initComponent(this, InputElement, props);
    // if (props?.oninputDelay) {
    // 	const delay = props.delay ?? 250;
    // 	let timeoutId: number;
    // 	this.addEventListener("input", () => {
    // 		clearTimeout(timeoutId);
    // 		timeoutId = window.setTimeout(() => {
    // 			props.oninputDelay?.(this.value);
    // 		}, delay);
    // 	});
    // }
    if (props?.maxLength !== undefined) this.maxLength = props?.maxLength.valueOf();
    if (props?.minLength !== undefined) this.minLength = props?.minLength;
    if (props?.min !== undefined) this.min = props?.min;
    if (props?.max !== undefined) this.max = props?.max;
    if (props?.pattern) this.pattern = props?.pattern;
    if (props?.required) this.required = props?.required || false;
  }

  // get validation(): RegisterOptions | undefined {
  // 	return this.#validation;
  // }

  // set validation(value: RegisterOptions | undefined) {
  // 	this.#validation = value;
  // 	if (this.#checkValidity) this.removeEventListener("input", this.#checkValidity);
  // 	this.#checkValidity = undefined;
  // 	if (value) {
  // 		this.#checkValidity = this.__checkValidity.bind(this);
  // 		this.addEventListener("input", this.#checkValidity);
  // 	}
  // }

  // private __checkValidity() {
  // 	if (!this.validation) return;
  // 	let validationMessage = this.validationMessage
  // 	if (this.validation.required && !this.value) {
  // 		validationMessage = "Required field";
  // 	} else if (this.validation.minLength !== undefined && this.value.length < this.validation.minLength) {
  // 		validationMessage = `Minimum length is ${this.validation.minLength}`;
  // 	} else if (this.validation.maxLength !== undefined && this.value.length > this.validation.maxLength) {
  // 		validationMessage = `Maximum length is ${this.validation.maxLength}`;
  // 	} else if (this.validation.min !== undefined && Number(this.value.toString()) < Number(this.validation.min)) {
  // 		validationMessage = `Minimum value is ${this.validation.min}`;
  // 	} else if (this.validation.max !== undefined && Number(this.value) > Number(this.validation.max)) {
  // 		validationMessage = `Maximum value is ${this.validation.max}`;
  // 	} else if (this.validation.pattern && !this.validation.pattern.test(this.value)) {
  // 		validationMessage = "Invalid value";
  // 	} else
  // 		validationMessage = "";
  // 	if (validationMessage !== this.validationMessage) {
  // 		this.setCustomValidity(validationMessage);
  // 		this.reportValidity();
  // 	}
  // }
}

TypeComposer.defineElement(InputElement.TAG, InputElement, { extends: "input" });
