
import { type ElementType, Component, DivElement, InputElement, LabelElement, ListItemElement, ref, refList, UListElement } from "../..";
import "./SelectPanel.css";
export class SelectItemPanel extends ListItemElement {
    static readonly TAG: string = "tc-select-item-panel";
    public onChange?: ((item: any) => void);
    public selectType?: "single" | "multiple" | "none";

    constructor(props?: ElementType<SelectItemPanel>) {
        super(props);
        Component.initComponent(this, SelectItemPanel);
        this.selectType = props?.selectType || "single";
        if (this.selectType === "single") {
            this.addEventListener('click', () => {
                this.dispatchEvent(new Event('change'));
                this.onChange?.(this.item);
            });
        }
    }
}
TypeComposer.defineElement(SelectItemPanel.TAG, SelectItemPanel, { extends: "li" });

export class SelectPanel extends Component {
    static readonly TAG: string = "tc-select-panel";
    public readonly inputElement: InputElement;
    public readonly list: UListElement;
    public readonly inputWrapper: DivElement;
    public itemBinding?: (item: any) => string;
    public items: any[] | refList<any>;
    public placeholder?: string;
    public label?: string | ref<string>;
    public value?: any | ref;
    #selectedItem?: any;
    public readonly selectComponent: typeof SelectItemPanel;
    public onChange?: ((item: any) => void);
    public onFilter?: (filter: string) => boolean;
    #handleGlobalClick: (e: MouseEvent) => void;

    constructor(props?: ElementType<SelectPanel, 'input'>) {
        super(props);
        this.extendedStyle.add(SelectPanel.TAG);
        Component.initComponent(this, SelectPanel);
        this.#handleGlobalClick = this.#onHandleGlobalClick.bind(this);
        if (props?.label)
            this.append(new LabelElement({ className: 'aria-Label', text: props.label }));
        this.selectComponent = props?.selectComponent || SelectItemPanel;
        this.items = props?.items || [];
        this.inputWrapper = this.appendChild(new DivElement({ className: 'aria-InputWrapper' }));
        this.inputElement = this.inputWrapper.appendChild(new InputElement({ readOnly: true, className: 'aria-Input', placeholder: this.placeholder || '', disabled: props?.disabled || false }));
        if (props?.placeholder)
            this.placeholder = props.placeholder;
        if (props?.name)
            this.name = props.name;
        this.list = this.appendChild(new UListElement({ className: "select-list" }));
        const originalAppend = this.list.append;
        const originalAppendChild = this.list.appendChild;
        this.list.append = (...nodes: Node[]): void => {
            for (const node of nodes) {
                if (node instanceof this.selectComponent) {
                    node.addEventListener('change', () => {
                        this.#onChange(node.item, node);
                    });
                }
            }
            originalAppend.apply(this.list, nodes);
        };
        this.list.appendChild = <T extends Node>(node: T): any => {
            if (node instanceof this.selectComponent) {
                node.addEventListener('change', () => {
                    this.#onChange(node.item, node);
                });
            }
            return originalAppendChild.call(this.list, node);
        };
        this.addEventListener("onConnected", () => {
            console.log('SelectPanel connected:', this);
            window.addEventListener('click', this.#handleGlobalClick, { capture: true });
            if (props?.items && props?.items instanceof ref) {
                props.items.subscribe(this, "_updateItems");
            } else this._updateItems();
        });
        this.addEventListener("onDisconnected", () => {
            window.removeEventListener('click', this.#handleGlobalClick, { capture: true });
            if (this.items && this.items instanceof ref) {
                this.items.unsubscribe(this, "_updateItems");
            }
        });
    }

    #onHandleGlobalClick(e: MouseEvent) {
        console.log('SelectPanel #onHandleGlobalClick:', this);
        if (!this.contains(e.target as Node)) {
            this.classList.remove('open', 'up');
            this.inputElement.blur();
        }
    }

    public _updateItems() {
        this.list.innerHTML = '';
        for (const item of this.items.valueOf()) {
            const listItem = item instanceof this.selectComponent ? item : new this.selectComponent({ text: item.toString() });
            listItem.item = item;
            this.list.appendChild(listItem);
        }
    }

    #onChange(item: any, listItem: SelectItemPanel) {
        if (this.#selectedItem) this.#selectedItem.removeAttribute('aria-selected');
        this.#selectedItem = listItem;
        this.inputElement.value = listItem.textContent || '';
        this.classList.remove('open', 'up');
        this.#selectedItem.setAttribute('aria-selected', '');
        this.onChange?.(item);
    }

    onCreate(): void {
        this.inputElement.readOnly = this.onFilter ? false : true;
        this.inputElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.classList.toggle('open');
            if (this.classList.contains('open')) {
                const rect = this.inputElement.getBoundingClientRect();
                console.log('rect:', rect);
                this.list.style.minWidth = this.inputElement.offsetWidth + 'px';

                this.list.style.visibility = 'hidden';

                const listRect = this.list.getBoundingClientRect();

                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;

                if (spaceBelow >= listRect.height || spaceBelow >= spaceAbove) {
                    this.list.style.top = `${rect.height + 20}px`;
                }
                else {
                    this.list.style.top = `${-listRect.height + 10}px`;
                }
                this.list.style.visibility = 'visible';

            }
            else {
                this.classList.remove('open', 'up');
                this.inputElement.blur();
            }
        });
    }

    addItem(item: any) {
        if (this.items && this.items instanceof ref) {
            this.items.push(item);
            return;
        }
        const listItem = item instanceof this.selectComponent ? item : new this.selectComponent({ text: item.toString() });
        listItem.item = item;
        this.list.appendChild(listItem);
    }

    removeItem(item: any) {
        if (this.items && this.items instanceof ref) {
            const index = this.items.valueOf().indexOf(item);
            if (index !== -1) {
                this.items.splice(index, 1);
            }
            return;
        }
        for (const listItem of Array.from(this.list.children)) {
            if (listItem instanceof this.selectComponent && listItem.item === item) {
                this.list.removeChild(listItem);
                break;
            }
        }
    }

    get name(): string {
        return this.inputElement.name;
    }

    set name(value: string) {
        this.inputElement.name = value;
    }

}
TypeComposer.defineElement(SelectPanel.TAG, SelectPanel);