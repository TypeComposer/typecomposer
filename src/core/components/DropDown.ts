import { Component, DivElement, ElementType, TextField, ref, refList, RefList } from "../..";

export type SelectionType = "closeAndClean" | "closeAndKeep" | "openAndClean" | "openAndKeep";

export class DropDownItem extends Component {
  static readonly TAG: string = "tc-drop-down-item";
  constructor(props?: ElementType) {
    super({  ...props,style: {display: "block", unicodeBidi: "isolate", ...props?.style} });
  }
}

TypeComposer.defineElement(DropDownItem.TAG, DropDownItem);

export class DropDown<T = any> extends TextField {
  static readonly TAG: string = "tc-drop-down";
  private onSelectionAction: () => void = this.closeAndClean.bind(this);
  private _selectionType: SelectionType;
  private previousSelected: T[] = [];
  #options: T[];
  #value: T | ref<T>;
  private _dropdownContent: DivElement;
  private _idClass: number;
  private _arrow: DivElement;
  private _selected: number = -1;
  textValue: (value: T | undefined) => string | undefined = undefined;
  textSelected: (value: T | undefined) => string | undefined = undefined;
  private _filter: (value: T, input: string) => boolean = () => true;

  constructor(
    private props?: ElementType & {
      required?: boolean;
      noContent?: string;
      options?: T[];
      value?: T | ref<T>;
      defaultOption?: string;
      selectionType?: SelectionType;
      placeholder?: string;
      variant?: "outline" | "underlined";
      placeholderAnimation?: boolean;
      textValue?: (value: T) => string;
      textSelected?: (value: T) => string;
      filter?: (item: T, input: string) => boolean;
    },
  ) {
    super({ required: props?.required, label: props?.placeholder, placeholder: props?.placeholder, placeholderAnimation: props?.placeholder == undefined ? false : props?.placeholderAnimation, variant: props?.variant || "outline" });
    const v = props?.value;
    delete props?.value;
    Component.applyProps(this, props);
    props.value = v;
    this.#value = v;
    this.dropdownContent = new DivElement({ className: "dropdown-content" });
    this.dropdownContent.variant = props?.variant;
    this.append(this.dropdownContent);
    this.#onInit();
    this.selectionType = props.selectionType || "closeAndClean";
    if (props.textValue) this.textValue = props.textValue;
    if (props.textSelected) this.textSelected = props.textSelected;
    if (props.textSelected == undefined && props.textValue != undefined) this.textSelected = props.textValue;
    this.#options = props.options;
    this.input.addEventListener("input", () => {
      if (this.input.readOnly == false) {
        this.updateContent();
      }
    });
    this.filter = props.filter;
    this.updateContent();
  }

  get filter() {
    return this._filter;
  }

  set filter(filter: ((value: T, input: string) => boolean) | undefined) {
    if (!this.input.required) this.input.readOnly = filter == undefined;
    if (filter == undefined) filter = () => true;
    else this._filter = filter;
  }


  #onInit() {
    this._arrow = new DivElement({ className: "arrow-down", text: "▼" });
    this.append(this._arrow);
    this.onclick = (event) => {
      if (this.options.length === 0) return;
      if (this.dropdownContent.contains(event.target as Node)) {
        return;
      }
      this.dropdownContent.classList.toggle("pressed");
      this._arrow.classList.toggle("up");
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
    document.addEventListener("mousedown", this.handleClickOutside);
    if (this.input.required) {
      this.input.removeAttribute("readonly");
      this.input.readOnly = undefined;
      this.input.style.pointerEvents = "none";
      this.input.oninvalid = (event) => {
        if (!this.input.validity.valueMissing) {
          this.input.setCustomValidity("");
          event.preventDefault();
        } else {
          this.input.setCustomValidity(TextField.validateMessage.valueMissing);
        }
      }
    }
  }

  private handleClickOutside(event) {
    if (!this.contains(event.target) && !this.dropdownContent.contains(event.target) && this.dropdownContent.classList.contains("pressed")) {
      this._arrow.classList.toggle("pressed");
      this.dropdownContent.classList.toggle("pressed");
      this._arrow.classList.toggle("up");
    }
  }

  get arrow() {
    return this._arrow;
  }

  get selected(): T | undefined {
    return this.#options.value[this._selected];
  }

  set selected(value: T) {
    // @ts-ignore
    if (this.#value instanceof ref) this.#value.value = value;
    else
      this.#value = value;
    this._selected = this.options.findIndex((option) => new String(option).toString() == new String(value).toString());
    if (this._selected == -1) return;
    const items = this.dropdownContent.querySelectorAll(".option");
    if (items) this.selectOption(this.options[this._selected], this._selected, items[this._selected] as HTMLElement);
    this.dropdownContent.classList.remove("pressed");
  }

  private closeAndClean() {
    // @ts-ignore
    Array.from(this.dropdownContent.children).forEach((value: HTMLElement) => {
      value.classList.remove("selected");
    });
    this.arrow.classList.toggle("pressed");
    this.dropdownContent.classList.toggle("pressed");
    this.arrow.classList.toggle("up");
  }

  private closeAndKeep() {
    this.arrow.classList.toggle("pressed");
    this.dropdownContent.classList.toggle("pressed");
    this.arrow.classList.toggle("up");
  }

  private openAndClean() {
    // @ts-ignore
    Array.from(this.dropdownContent.children).forEach((child: HTMLElement) => {
      child.classList.remove("selected");
    });
  }

  get selectionType() {
    return this._selectionType;
  }

  set selectionType(selectionType: SelectionType) {
    if (selectionType == "closeAndKeep") {
      this.onSelectionAction = this.closeAndKeep.bind(this);
    } else if (selectionType == "openAndClean") {
      this.onSelectionAction = this.openAndClean.bind(this);
    } else if (selectionType == "openAndKeep") {
      this.onSelectionAction = () => { };
    } else {
      this.onSelectionAction = this.closeAndClean.bind(this);
    }
    this._selectionType = selectionType;
  }

  get options(): T[] {
    return this.#options;
  }

  set options(items: T[]) {
    this.#options = items;
    this.updateContent();
  }

  private updateContent() {
    if (!this.dropdownContent) return;
    this.dropdownContent.innerHTML = "";
    const options = this.options;
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (!this.filter(option, this.input.value.toString())) continue;
      let node: Node;
      if (option instanceof Node) node = this.dropdownContent.appendChild(option);
      else {
        const div = new DropDownItem({
          text: this.textValue ? this.textValue(option) : option?.toString() || "",
        });
        node = div;
        if (this.previousSelected.includes(option)) {
          div.classList.toggle("selected");
        }
        this.dropdownContent.append(div);
      }
      (node as HTMLElement).classList.add("option");
      (node as HTMLElement).onclick = () => this.selectOption(option, i, node as HTMLElement);
    }
    if (this.input.readOnly)
      this.input.value =
        this.selected == undefined ? this.props?.defaultOption || "" : this.textSelected ? this.textSelected(this.selected) : this.selected?.toString() || "";
    if (this._selected == -1 && this.#value) {
      // @ts-ignore
      this.selected = this.#value instanceof ref ? this.#value.toJSON() : this.#value;
    }
  }

  private selectOption(option: T, index: number, element: HTMLElement) {
    this.onSelectionAction();
    element.classList.toggle("selected");
    if (element.classList.contains("selected")) {
      this.previousSelected.push(option);
    } else {
      this.previousSelected = this.previousSelected.filter((selectedOption) => selectedOption !== option);
    }
    // @ts-ignore
    if (this.#value instanceof ref) this.#value.value = option;
    else this.#value = option;
    this.input.value = this.textSelected ? this.textSelected(option) : option?.toString() || "";
    this._selected = index;
    this.input.style.color = "black";
    this.dispatchEvent(new CustomEvent("change", { detail: { item: option, index } }));
  }

  get dropdownContent() {
    return this._dropdownContent;
  }

  set dropdownContent(dropdownContent: DivElement) {
    this._dropdownContent = dropdownContent;
  }

  get idClass() {
    return this._idClass;
  }

  set idClass(idClass: number) {
    this._idClass = idClass;
  }
}

TypeComposer.defineElement(DropDown.TAG, DropDown);

Component.mergeVariant(DropDown, TextField);