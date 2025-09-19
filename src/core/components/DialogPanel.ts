import { Component, ElementType, DialogElement } from "../..";

export class DialogPanel extends DialogElement implements IComponent {
  static readonly TAG: string = "tc-dialog-panel";
  clickOutsideToClose = true;
  #initShow: boolean | "modal" | "popover" | "show" = false;

  constructor(
    props?: {
      show?: boolean | "modal" | "popover" | "show";
      clickOutsideToClose?: boolean;
      root?: HTMLElement | "body";
    } & ElementType,
  ) {
    super();
    props = props || { };
    this.close();
    this.addEventListener("click", (event: any) => {
      const rect = this.getBoundingClientRect();
      // @ts-ignore
      const padding = parseFloat(this.style?.padding || 0);
      const innerLeft = rect.left + padding;
      const innerRight = rect.right - padding;
      const innerTop = rect.top + padding;
      const innerBottom = rect.bottom - padding;

      const isInMargin = event.clientX < innerLeft || event.clientX > innerRight || event.clientY < innerTop || event.clientY > innerBottom;
      if (isInMargin && this.clickOutsideToClose) if (this.clickOutsideToClose) this.close("close");
      event.stopPropagation();
    });
    this.addEventListener("close", () => {
      this.onClose(this.returnValue);
    });
    if (props?.clickOutsideToClose !== undefined) this.clickOutsideToClose = props.clickOutsideToClose;
    // @ts-ignore
    if (props?.content) this.content = props.content;
    delete props?.variant;
    this.#initShow = props?.show || false;
    delete props?.show;
    this.addEventListener("onConnected", () => {
      if (this.#initShow == true || this.#initShow == "modal") this.showModal();
      else if (this.#initShow == "popover") this.showPopover();
      else if (this.#initShow == "show") this.show();
    });
    if (props.root == "body") document.body.appendChild(this);
    else if (props.root) props.root.appendChild(this);
    delete props?.root;
    Component.applyProps(this, props as ElementType);
  }

  showModal(): void {
    this.onOpen();
    super.showModal();
  }

  showPopover(): void {
    this.onOpen();
    super.showPopover();
  }

  onOpen(): void { }

  onClose(returnValue?: string) { }
}

TypeComposer.defineElement(DialogPanel.TAG, DialogPanel, { extends: "dialog" });
