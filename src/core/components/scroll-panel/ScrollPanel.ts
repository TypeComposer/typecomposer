import { type ElementType, Component, DivElement } from "../..";

export class ScrollPanel extends Component {
  static readonly TAG: string = "tc-scroll-panel";
  private _container: HTMLElement = new DivElement();

  constructor(
    props?: ElementType & {
      variant?: "default" | string;
      orientation?: "vertical" | "horizontal" | "both";
    },
  ) {
    super(props);
    if (props?.variant) this.variant = props.variant;
    this.addClassName("scroll-panel");
    this._container.addClassName(`container-pane-${props?.orientation || "both"}`);
    this.style.display = "flex";
    this.style.overflow = "hidden";
    this.style.position = "relative";
    this.container.style.overflow = "auto";
    this.container.style.flex = "1";
    super.appendChild(this._container);
  }

  append(...nodes: (string | Node)[]): void {
    this._container.append(...nodes);
  }

  appendChild<T extends Node>(node: T): T {
    return this._container.appendChild(node);
  }

  remove(): void {
    this._container.remove();
  }

  removeChild<T extends Node>(node: T): T {
    return this._container.removeChild(node);
  }

  get container() {
    return this._container;
  }
}
TypeComposer.defineElement(ScrollPanel.TAG, ScrollPanel);
