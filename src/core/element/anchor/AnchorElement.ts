import { ElementType, Component, Router } from "../../";

export class AnchorElement extends HTMLAnchorElement implements IComponent {
  static readonly TAG: string = "tc-anchor-element";

  #rlinkController: {
    rlink: string;
    action: (e: any) => void;
  } = undefined;

  constructor(props?: ElementType<AnchorElement>) {
    super();
    // @ts-ignore
    Component.initComponent(this, AnchorElement, props);
  }

  set rlink(link: string) {
    if (this.#rlinkController) this.removeEventListener("click", this.#rlinkController.action);
    this.href = link;
    if (link) {
      this.#rlinkController = {
        rlink: link,
        action: (e: any) => {
          e.preventDefault();
          Router.go(link);
        },
      };
      this.addEventListener("click", this.#rlinkController.action);
    } else this.#rlinkController = undefined;
  }

  get rlink(): string {
    return this.#rlinkController?.rlink || "";
  }
}

TypeComposer.defineElement(AnchorElement.TAG, AnchorElement, { extends: "a" });
