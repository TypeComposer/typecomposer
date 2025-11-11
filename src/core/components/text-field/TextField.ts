import {
  Component,
  FieldSetElement,
  IconElement,
  InputElement,
  LabelElement,
  LegendElement,
  Variant,
  refString,
  refNumber,
  ref,
  ParagraphElement,
  ElementType
} from "../../";
import "./TextField.css";
export interface TextFieldProps extends ElementType<InputElement> {
  placeholderAnimation?: boolean;
  icon?: IconElement;
  label?: string;
  labelError?: boolean;
  variant?: "default" | "outline" | "solo" | "standard" | "underlined";
  customError?: (validity: ValidityState) => string;
}

function getShortValidationMessage(input) {
  if (input.validity.valueMissing) return TextField.validateMessage.valueMissing;
  if (input.validity.typeMismatch) return TextField.validateMessage.typeMismatch;
  if (input.validity.patternMismatch) return TextField.validateMessage.patternMismatch;
  if (input.validity.tooShort) return TextField.validateMessage.tooShort.replace("{0}", input.minLength.toString());
  if (input.validity.tooLong) return TextField.validateMessage.tooLong.replace("{0}", input.maxLength.toString());
  if (input.validity.rangeUnderflow) return TextField.validateMessage.rangeUnderflow.replace("{0}", input.min.toString());
  if (input.validity.rangeOverflow) return TextField.validateMessage.rangeOverflow.replace("{0}", input.max.toString());
  if (input.validity.stepMismatch) return TextField.validateMessage.stepMismatch;
  if (input.validity.badInput) return TextField.validateMessage.badInput;
  if (input.validity.customError) return TextField.validateMessage.customError;
  return "";
}

export class TextField extends Component {
  static readonly TAG: string = "tc-text-field";
  public static validateMessage = {
    valueMissing: "required field!",
    typeMismatch: "invalid format!",
    patternMismatch: "invalid pattern!",
    tooShort: "min {0} chars!",
    tooLong: "max {0} chars!",
    rangeUnderflow: "min value: {0}!",
    rangeOverflow: "max value: {0}!",
    stepMismatch: "invalid step!",
    badInput: "invalid input!",
    customError: "invalid input!"
  }
  readonly input: InputElement;
  placeholder: string;
  placeholderAnimation: boolean;
  label: string;
  labelError: boolean;
  customError?: (validity: ValidityState) => string;

  constructor(props?: TextFieldProps) {
    super();
    this.label = props?.label || "";
    this.extendedStyle.add(TextField.TAG);
    this.customError = props?.customError;
    this.placeholderAnimation = props?.placeholderAnimation !== undefined ? props?.placeholderAnimation : true;
    this.labelError = props?.labelError !== undefined ? props?.labelError : false
    this.placeholder = props?.placeholder || "";
    this.input = new InputElement();
    this.variant = props?.variant?.toString() as Variant;
    Component.applyProps(this.input, { ...props, className: undefined, id: undefined }, true);
    delete props?.value;
    delete props?.text;
    Component.applyProps(this, props);
    // @ts-ignore
    Component.initComponent(this, TextField, props);
  }


  set disabled(value: boolean) {
    this.input.disabled = value;
    super.disabled = value;
  }

  get value(): string {
    return this.input.value;
  }

  set value(value: refString | refNumber) {
    if (value instanceof ref) {
      // @ts-ignore
      const onInput = () => (value.value = this.value);
      this.input.addEventListener("input", onInput);
      value.subscribe(this, "value", () => this.input.removeEventListener("input", onInput));
    } else {
      // @ts-ignore
      this.input.value = value;
    }
  }
}

TypeComposer.defineElement(TextField.TAG, TextField);

function setVariant(element: TextField, value: Variant) {
  element.innerHTML = "";
  if (element["__checkValidity"]) element.input.removeEventListener("input", element["__checkValidity"]);
  if (value == "default") {
    element.appendChild(new LabelElement({ text: element.label })).addEventListener("click", () => element.input.focus());
    element.append(element.input);
    element.input.placeholder = element.placeholder;
    element.addClassName("tc-tf-d");
  } else if (value == "outline" || value == "solo" || value == "standard" || value == "underlined") {
    const fieldset = new FieldSetElement();
    if (element.placeholderAnimation !== false) {
      fieldset.append(new LegendElement({ text: element.placeholder }));
      element.appendChild(new LabelElement({ text: element.label })).addEventListener("click", () => element.input.focus());
      element.input.placeholder = "";
      element.append(element.input, fieldset);
    } else {
      element.input.placeholder = element.placeholder;
      element.append(element.input, fieldset);
    }
    element.addClassName("tc-tf-osu");
  }
  if ((value == "default" || value == "outline" || value == "solo" || value == "standard" || value == "underlined")) {
    const paragraph = element.labelError ? new ParagraphElement({ id: "error-message", style: { display: "none" } }) : undefined;
    const fieldset = element.querySelector("fieldset");
    if (paragraph && value == "default")
      element.append(paragraph);
    const action = () => {
      element.input.setCustomValidity("");
      element.input.validity
      if (element.input.validationMessage != "") {
        fieldset?.addClassName("tc-m-e");
        if (paragraph) {
          paragraph.style.display = "block";
          paragraph.innerText = element?.customError ? element.customError(element.input.validity) : getShortValidationMessage(element.input);
        }
      }
      else {
        fieldset?.removeClassName("tc-m-e");
        if (paragraph) {
          paragraph.style.display = "none";
          paragraph.innerText = "";
        }
      }
    };
    element["__checkValidity"] = action;
    element.input.addEventListener("input", action);
    element.input.oninvalid = (e) => {
      const msg = element?.customError ? element.customError(element.input.validity) : getShortValidationMessage(element.input);
      element.input.setCustomValidity(msg);
    }
  }
}

Component.setVariant(TextField, "default", (element: TextField) => setVariant(element, "default"));
Component.setVariant(TextField, "outline", (element: TextField) => setVariant(element, "outline"));
Component.setVariant(TextField, "solo", (element: TextField) => setVariant(element, "solo"));
Component.setVariant(TextField, "standard", (element: TextField) => setVariant(element, "standard"));
Component.setVariant(TextField, "underlined", (element: TextField) => setVariant(element, "underlined"));
