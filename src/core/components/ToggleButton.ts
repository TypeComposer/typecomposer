import { ElementType, CheckBox } from "../..";

export interface DataToggleButton extends ElementType { }

export class ToggleButton extends CheckBox {
  static readonly TAG: string = "tc-toggle-button";
  constructor(props?: DataToggleButton) {
    // @ts-ignore
    super({ ...data, color: props?.color || undefined });
    this.input.classList.remove("checkbox");
    const labelColor = this.label.style.backgroundColor;
    this.addEventListener("change", (e) => {
      if (this.input.checked) {
        this.label.style.backgroundColor = this.input.style.accentColor;
      } else this.label.style.backgroundColor = labelColor;
    });
  }
}
// @ts-ignore
TypeComposer.defineElement(ToggleButton.TAG, ToggleButton);
