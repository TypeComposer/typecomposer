import { Component, ImageElement, InputElement, ElementType, ref, refString } from "../../";

export class AvatarPanel extends Component {
  static readonly TAG: string = "tc-avatar-panel";
  #image: ImageElement = new ImageElement({ className: "avatar" });
  #input = new InputElement({
    type: "file",
    hidden: true,
    accept: "image/*",
  });

  constructor(props?: ElementType & { src?: refString; srcOut?: ref<string>; onload?: (ev: Event) => void }) {
    super(props);
    this.addClassName("avatar-element");
    this.append(this.#image, this.#input);
    this.#input.onchange = () => {
      const file = this.#input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    };
    this.addEventListener("click", () => this.#input.click());
    if (props?.src) {
      this.src = props.src;
    }
    if (props?.onload) this.onload = props?.onload;
    // quando a imagem é carregada
    this.#image.addEventListener("load", (ev) => {
      this.onload(ev);
      if (props?.srcOut instanceof ref) {
        const baseRef = props.srcOut as ref<string>;
        if (baseRef) baseRef.value = this.src;
      }
    });
  }

  /**
   * Fires immediately after the browser loads the object.
   * @param ev The event.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGElement/load_event)
   */
  onload = (ev: Event) => { };

  get src(): string {
    return this.#image.src;
  }

  set src(value: refString) {
    // @ts-ignore
    this.#image.src = value;
  }

  get image(): ImageElement {
    return this.#image;
  }

  get input(): InputElement {
    return this.#input;
  }
}
TypeComposer.defineElement(AvatarPanel.TAG, AvatarPanel);
