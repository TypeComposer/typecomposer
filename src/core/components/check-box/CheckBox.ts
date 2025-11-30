import { Component, InputElement, LabelElement, ElementType, IconElement, ref } from "../..";

export class CheckBox extends Component {
  static readonly TAG: string = "tc-check-box";
  readonly inputElement: InputElement = new InputElement({ type: "checkbox" });
  readonly labelElement: LabelElement | undefined;
  readonly label: string = "";

  constructor(
    props?: ElementType<CheckBox, "variant"> & { variant?: "checkbox" | "radio"; inputId?: string },
  ) {
    super(props);
    this.inputElement.id = props?.inputId || TypeComposer.generateUniqueId();
    this.extendedStyle.add(CheckBox.TAG);
    this.label = props?.label || "";
    this.inputElement.checked = props?.checked ?? false;
    if (props?.variant) this.variant = props.variant;
    if (props?.disabled) this.disabled = props.disabled;
    if (props?.value) this.value = props.value;
    if (props?.name) this.name = props.name;
    this.append(this.inputElement);
    if (props?.label)
      this.labelElement = this.appendChild(new LabelElement({ className: 'aria-Label', text: props.label, htmlFor: this.inputElement.id }));
    // this.inputElement.addEventListener("change", (e) => this.dispatchEvent(new Event("change")), { capture: true });

  }

  public get name(): string {
    return this.inputElement.name;
  }

  public set name(value: string) {
    this.inputElement.name = value;
  }

  public get value(): string {
    return this.inputElement.value;
  }

  public set value(value: string) {
    this.inputElement.value = value;
  }

  public get checked(): boolean {
    // @ts-ignore
    return this.inputElement.checked;
  }

  public set checked(value: boolean | ref<boolean>) {
    // @ts-ignore

    this.inputElement.checked = value;
  }


  public get variant(): "checkbox" | "radio" {
    // @ts-ignore
    return super.variant;
  }

  public set variant(value: "checkbox" | "radio") {
    super.variant = value;
    this.inputElement.type = value;
    this.inputElement.className = value;
  }
}

TypeComposer.defineElement(CheckBox.TAG, CheckBox);

export class CheckBoxGroup extends Component {
  private _selected: CheckBox | null = null;
  static readonly TAG: string = "tc-check-box-group";

  constructor(...checkBoxes: CheckBox[]) {
    super({ style: { display: "flex" } });
    this.append(...checkBoxes);
  }

  public append(...nodes: (string | Node)[]): void {
    nodes.forEach((node) => {
      this.check(node as Node);
    });
    super.append(...nodes);
  }

  public appendChild<T extends Node>(node: T): T {
    this.check(node);
    return super.appendChild(node);
  }

  public onChange: (checkbox: CheckBox) => void = () => { };

  private change(checkbox: CheckBox) {
    if (this._selected == checkbox) this._selected = null;
    if (checkbox.checked) {
      this._selected = checkbox;
      this.onChange(checkbox);
      this.querySelectorAll("check-box").forEach((cb) => {
        if (cb !== checkbox) {
          (cb as CheckBox).checked = false;
        }
      });
    }
  }

  private check<T extends Node>(node: T) {
    if (node instanceof CheckBox) {
      const checkbox = node as CheckBox;
      checkbox.addEventListener("change", this.change.bind(this, checkbox));
    }
  }

  get selected(): CheckBox | null {
    return this._selected;
  }
}

TypeComposer.defineElement(CheckBoxGroup.TAG, CheckBoxGroup);
