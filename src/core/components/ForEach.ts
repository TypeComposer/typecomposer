import { Component, ElementType, ref } from "../..";

export class ForEach extends Component {
  static readonly TAG: string = "tc-for-each";
  #content: string = "";
  #of: string | null = null;
  #item: string | null = null;
  #parents: Component | null = null;
  #ref: ref<any[]> | null = null;
  #props: { [key: string]: any } = {};

  constructor(props: ElementType) {
    super(props);
    // @ts-ignore
    //this.#content = this.innerHTML;
    this.innerHTML = "";
    this.#of = this.getAttribute("of") || "";
    this.#item = this.getAttribute("item") || "item";
    try {
      this.#props = JSON.parse(this.getAttribute("props") || "{}");
    } catch (e) {
      new Error("ForEach: Invalid props");
    }
  }

  get of(): any[] {
    if (this.#of) {
      if (/^this\./.test(this.#of)) {
        const value = this.#of.replace("this.", "");
        // @ts-ignore
        const baseRef = refType<any[]>(this.#parents[value]);
        if (baseRef) {
          if (this.#ref) {
          }
          if (this.#ref !== baseRef) {
            baseRef.subscribe(this, "loop");
            this.#ref = baseRef;
          }
          return baseRef.value;
        }
        // @ts-ignore
        return this.#parents[value];
      }
    }
    return this.#of?.split(",") || [];
  }

  get item(): string {
    return this.#item || "";
  }

  set of(value: string) {
    this.setAttribute("of", value);
  }

  private set loop(items: any[]) {
    let index = 0;
    this.innerHTML = "";
    const regex = /\{\{(.*?)\}\}/g;

    const matches = [];
    let match;
    while ((match = regex.exec(this.#content)) !== null) {
      const key = match[1].trim();
      if (/^this\./.test(key)) matches.push(key.replace("this.", ""));
    }
    let content = this.#content;
    for (const key in this.#props) {
      const value = this.#props[key];
      content = content.replaceAll(`{{${key}}}`, value);
    }
    for (const key of matches) {
      const value = this.#parents[key];
      content = content.replaceAll(`{{this.${key}}}`, value);
    }
    for (const i of items) {
      const div = document.createElement("div");
      Component.applyProps(div, {});
      div.innerHTML = content.replaceAll(`{{${this.item}}}`, i).replaceAll(`{{index}}`, index.toString());
      index++;
      // @ts-ignore
      this.append(...div.children);
    }
  }

  public apply(parents: Component, of = this.#of): void {
    this.#parents = parents;
    this.#of = of;
    if (this.#of) this.loop = this.of;
  }
}

TypeComposer.defineElement(ForEach.TAG, ForEach);
