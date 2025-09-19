import { Component, ElementType, ref, refString } from "../..";

export class IconElement extends Component {
  static readonly TAG: string = "tc-icon-element";
  private _icon = ref("");

  constructor(
    props?: ElementType & {
      icon?: refString;
      src?: string;
      alt?: string;
    },
  ) {
    super();
    // @ts-ignore
    Component.initComponent(this, IconElement, props);
  }

  get icon(): string {
    return this._icon.value;
  }

  set icon(value: refString) {
    if (typeof value !== "string") this["_styleref"].appendStyleref("icon", this, value);
    else {
      const splice = value.split(" ");
      splice.forEach((v) => {
        this.addClassName(v);
      });
    }
  }

  get color(): string {
    // @ts-ignore
    return this.style.color;
  }

  set color(value: refString) {
    this.style.color = value;
  }
}
TypeComposer.defineElement(IconElement.TAG, IconElement);
