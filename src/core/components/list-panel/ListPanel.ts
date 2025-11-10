import { type ElementType, Component, UListElement, ListItemElement, ref, refList } from "../..";

export class ListPanel<T = any> extends Component {
  static readonly TAG: string = "tc-list-panel";

  private itemSelected: {
    parent: HTMLElement;
    child: T;
  } | null = null;

  #container: UListElement = new UListElement();
  #items: T[] = [];
  #refbase: ref<T[]> | undefined;
  #insert: (item: T) => any | undefined = undefined;

  constructor(
    props?: ElementType & {
      variant?: "primary" | "secondary" | string;
      items?: T[] | refList<HTMLElement>;
      insert?(item: T): any;
    },
  ) {
    super(props);
    super.append(this.container);
    this.#insert = props?.insert;
    // @ts-ignore
    //this.#refbase = refType<T[]>(props?.items);
    // @ts-ignore
    this.#items = this.#refbase ? [] : props?.items || [];
    for (const item of this.#items) this.addItem(item);
    this.addEventListener("onConnected", () => {
      //if (this.#refbase) this.#refbase.onChange(this.#updateRefItems.bind(this), this);
    });
    this.addEventListener("onDisconnected", () => {
      //if (this.#refbase) this.#refbase.unsubscribe(this);
    });
    this.addEventListener("removeItem", (e) => {
      const { item, element } = e.detail;
      this.#onChildRemoved(item, element);
      e.stopPropagation();
    });
  }



  set variant(value: "primary" | "secondary" | string) {
    super.variant = value == "primary" ? "default" : value;
  }

  public get container(): UListElement {
    return this.#container;
  }



  public appendChild<T extends Node>(node: T | HTMLCollection): T {
    if (node instanceof HTMLCollection) {
      for (let i = 0; i < node.length; i++) {
        const item = node.item(i);
        if (item != undefined && item instanceof HTMLElement) this.addItem(item as any);
      }
    } else if (node instanceof HTMLElement && node && !node.classList.contains("flow-pane-item")) this.addItem(node as any);
    return node as T;
  }

  public removeChild<T extends Node>(child: T): T {
    if (child instanceof HTMLElement) this.removeItem(child);
    return child;
  }

  public addItem(value: T): ListItemElement {
    return this.insertItem(value, -1);
  }

  #createItem(value: T): ListItemElement {
    const element: T = this.#insert ? this.#insert(value) : value;
    const item = element instanceof ListItemElement ? element : new ListItemElement();
    item.classList.add("list-element-item");
    if (!(element instanceof ListItemElement)) {
      if (element instanceof HTMLElement) item.appendChild(element as Node);
      else item.innerHTML = element?.toString() || "";
    }
    this.addItemEventListener(item as any, element);
    item.item = value;
    return item;
  }

  onDragOver = (e: HTMLElement) => {
    if (this.#refbase) {
      const items = this.listItems.map((item) => item.item);
      this.#refbase.value = items;
    }
  };

  public insertItem(value: T, index: number): ListItemElement {
    if (value == null) return null;
    const item = this.#createItem(value);
    if (index < 0 || index >= this.container.children.length) this.container.appendChild(item);
    else this.container.insertBefore(item, this.container.children.item(index));
    return item;
  }

  #onChildRemoved(item: T, element: HTMLElement): void {
    if (item == null) return;
    if (this.#refbase) {
      const index = this.#refbase.value.findIndex((refItem) => refItem === item);
      if (index >= 0) {
        this.#refbase.value.splice(index, 1);
      }
    } else {
      const index = this.#items.indexOf(item);
      if (index >= 0) this.#items.splice(index, 1);
      element.remove();
    }
  }

  private addItemEventListener(parent: HTMLElement, child: T): void {
    parent.addEventListener("click", () => {
      if (this.itemSelected != null) {
        this.onUnselectItem(this.itemSelected.child);
        this.itemSelected.parent.removeAttribute("selected");
        this.itemSelected.parent.classList.remove("list-element-item-selected");
      }
      if (this.itemSelected?.parent != parent) {
        parent.classList.add("list-element-item-selected");
        parent.setAttribute("selected", "");
        this.onSelectItem(child);
        if (parent instanceof ListItemElement) parent.onSelect();
        this.itemSelected = { parent, child };
      } else this.itemSelected = null;
    });
  }

  public removeItem(element: HTMLElement | string): void {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children.item(i);
      if (child instanceof HTMLElement) {
        if (typeof element == "string" && child.innerHTML == element) this.container.removeChild(child);
        else if (child == element) this.container.removeChild(child);
        break;
      }
    }
  }

  public get listItems(): ListItemElement[] {
    return Array.from(this.container.children).filter((child) => child instanceof ListItemElement) as ListItemElement[];
  }

  public scrollToBottom() {
    this.#container.scrollTop = this.#container.scrollHeight;
  }

  public scrollToTop() {
    this.#container.scrollTop = 0;
  }

  public removeItems() {
    this.container.innerHTML = "";
  }

  append(...nodes: (string | Node)[]): void {
    this.container.append(...nodes);
  }

  public onSelectItem: (item: T) => void = () => { };
  public onUnselectItem: (item: T) => void = () => { };
}
TypeComposer.defineElement(ListPanel.TAG, ListPanel);
