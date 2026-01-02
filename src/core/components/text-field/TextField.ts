import {
  Component,
  InputElement,
  LabelElement,
  refString,
  ElementType,
  InputType,
} from "../../";
import "./TextField.css";


export class TextField extends Component {
  static readonly TAG: string = "tc-text-field";

  public label?: string;
  public readonly inputElement: InputElement = new InputElement({ className: 'aria-Input' });

  constructor(props: ElementType<TextField, 'input'>) {
    super(props);
    this.extendedStyle.add(TextField.TAG);
    if (props.label)
      this.append(new LabelElement({ className: 'aria-Label', text: props.label }));
    this.appendChild(this.inputElement);
    this.placeholder = props?.placeholder || "";
    if (props?.name) this.name = props.name;
    // @ts-ignore
    if (props?.disabled) this.disabled = props.disabled;
    if (props?.type) this.type = props.type;
    this.value = props?.value;
    this.inputElement.addEventListener("change", (e) => this.dispatchEvent(new Event("change")), { capture: true });
    this.inputElement.addEventListener("input", (e) => this.dispatchEvent(new Event("input")), { capture: true });
  }

  public get name(): string {
    return this.inputElement.name;
  }

  public set name(value: string) {
    this.inputElement.name = value;
  }

  get disabled(): boolean {
    return this.inputElement.disabled;
  }

  set disabled(v: boolean) {
    super.disabled = v;
    this.inputElement.disabled = v;
  }

  get placeholder(): string | undefined {
    return this.inputElement.placeholder;
  }

  set placeholder(v: string) {
    this.inputElement.placeholder = v || "";
  }


  get value(): string | refString | undefined {
    return this.inputElement.value;
  }

  set value(v: string | refString) {
    // @ts-ignore
    this.inputElement.value = v || "";
  }

  get type(): InputType {
    return this.inputElement.type;
  }

  set type(v: InputType) {
    this.inputElement.type = v;
  }

}
TypeComposer.defineElement(TextField.TAG, TextField);