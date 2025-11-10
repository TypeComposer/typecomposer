import { ElementType, Component, InputElement } from "../..";

export class ColorPicker extends Component {
  static readonly TAG: string = "tc-color-picker";

  readonly input: InputElement = new InputElement({
    type: "color",
    //width: 100,
    //height: "100%",
    style: {
      border: "none",
      outline: "none",
      appearance: "none",
      padding: "0",
      margin: "0",
      width: "0px",
    },
  });

  constructor(props?: ElementType & { value?: string }) {
    super();
    this.append(this.input);
    // this._input.onchange = () => {
    //   this.style.backgroundColor = this._input.value;
    // };
    this.addEventListener("click", () => {
      this.input.click();
    });
    Component.applyProps(this, { ...props, style: { display: "flex", ...props?.style } });
  }

  get value(): string {
    return this.input.value;
  }

  set value(value: string) {
    this.input.value = value;
  }
}

TypeComposer.defineElement(ColorPicker.TAG, ColorPicker);
