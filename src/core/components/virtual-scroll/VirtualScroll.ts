import { Component, DivElement } from "../..";
import { ElementType } from "../../styles";

export interface VirtualScrollProps extends ElementType {
  items: any[];
  renderItem: (item: any, index: number) => HTMLElement;
  itemHeight?: number;
  buffer?: number;
}

export class VirtualScroll extends Component {
  static readonly TAG: string = "tc-virtual-scroll";
  private items: any[];
  private renderItem: (item: any, index: number) => HTMLElement;
  private itemHeight: number | undefined;
  private buffer: number;
  #innerContainer: HTMLElement;

  constructor(props: VirtualScrollProps) {
    super({ style: { overflowY: "auto", position: "relative" }, ...props });
    this.items = props.items;
    this.renderItem = props.renderItem;
    this.itemHeight = props.itemHeight ?? 50;
    this.buffer = props.buffer ?? 5;
    this.#innerContainer = new DivElement();
    this.#innerContainer.style.position = "relative";
    this.#innerContainer.style.height = `${this.items.length * this.itemHeight}px`;
    this.appendChild(this.#innerContainer);
    this.addEventListener("scroll", this.onScroll.bind(this));
    this.addEventListener("onConnected", this.renderVisibleItems.bind(this));
  }

  get innerContainer() {
    return this.#innerContainer;
  }

  private onScroll() {
    this.renderVisibleItems();
  }

  private renderVisibleItems() {
    const scrollTop = this.scrollTop;
    const containerHeight = this.clientHeight;
    const startIndex = Math.floor(scrollTop / this.itemHeight) - this.buffer;
    const endIndex = Math.ceil((scrollTop + containerHeight) / this.itemHeight) + this.buffer;
    const clampedStartIndex = Math.max(0, startIndex);
    const clampedEndIndex = Math.min(this.items.length, endIndex);
    this.#innerContainer.innerHTML = "";
    for (let i = clampedStartIndex; i < clampedEndIndex; i++) {
      const item = this.items[i];
      const element = this.renderItem(item, i);
      element.style.position = "absolute";
      element.style.top = `${i * this.itemHeight}px`;
      element.style.width = "100%";
      this.#innerContainer.appendChild(element);
    }
  }
}

TypeComposer.defineElement(VirtualScroll.TAG, VirtualScroll);