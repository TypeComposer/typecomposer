import { Component, InputElement, LabelElement, ElementType, IconElement, ref } from "../../";

export class CheckBox extends Component {
  static readonly TAG: string = "tc-check-box";
  private _input: InputElement;
  private _label: LabelElement;
  private static serial = Math.round(Math.random() * 1000);
  private _variant: "checkbox" | "radio" = "checkbox";

  constructor(
    props?: ElementType & {
      variant?: "checkbox" | "radio";
      label?: string;
      value?: boolean | ref<boolean>;
      icon?: IconElement;
      placeholderAnimation?: boolean;
    },
  ) {
    super();
    const label = props?.label;
    delete props?.label;
    const value = props?.value;
    delete props?.value;
    Component.applyProps(this, props);
    this._variant = props?.variant || "checkbox";
    this._input = new InputElement({
      type: this.variant,
      className: this.variant,
      id: `checkbox-${CheckBox.serial++}-${Math.round(Math.random() * 100)}`,
      // checked: value,
    });
    this._label = new LabelElement({ text: label });
    this._label.setAttribute("for", this._input.id);
    if (props?.style?.color) this._input.style.accentColor = props.style.color;
    this.append(this._input, this._label);
    this.addEventListener("change", () => {
      this.onChange(this.checked, this.value);
    });
  }

  public onChange: (checked: boolean, value?: any) => void = () => { };

  public get id(): string {
    return this.input.id;
  }

  public get checked(): boolean {
    // @ts-ignore
    return this.input.checked;
  }

  public set checked(value: boolean | ref<boolean>) {
    // @ts-ignore
    this.input.checked = value;
  }

  public get value(): boolean {
    // @ts-ignore
    return this._input.checked;
  }

  public set value(value: boolean) {
    this.checked = value;
  }

  public get input(): InputElement {
    return this._input;
  }

  public get label(): LabelElement {
    return this._label;
  }

  public get variant(): "checkbox" | "radio" {
    return this._variant;
  }

  public set variant(value: "checkbox" | "radio") {
    this._variant = value;
    this.input.type = value;
    this.input.className = value;
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

// @ts-ignore
TypeComposer.defineElement(CheckBoxGroup.TAG, CheckBoxGroup);
