import { ElementType, Component, InputElement, LabelElement, ref } from "../..";
import "./SwitchPanel.css";

export class SwitchPanel extends Component {
    static readonly TAG: string = "tc-switch-panel";
    readonly inputElement: InputElement = new InputElement({ type: "checkbox" });
    labelElement: LabelElement | undefined;
    readonly label: string = "";

    constructor(props?: ElementType<SwitchPanel>) {
        super(props);
        this.inputElement.id = TypeComposer.generateUniqueId();
        this.extendedStyle.add(SwitchPanel.TAG);
        this.label = props?.label || "";
        this.inputElement.checked = props?.checked ?? false;
        this.append(this.inputElement);
        if (props?.label)
            this.labelElement = this.appendChild(new LabelElement({ className: 'aria-Label', text: props.label, htmlFor: this.inputElement.id }));
        this.inputElement.addEventListener("change", (e) => this.dispatchEvent(new Event("change")), { capture: true });
    }

    get name(): string {
        return this.inputElement.name;
    }

    set name(value: string) {
        this.inputElement.name = value;
    }

    get checked(): boolean {
        // @ts-ignore
        return this.inputElement.checked;
    }

    set checked(value: boolean | ref<boolean>) {
        // @ts-ignore
        this.inputElement.checked = value;
    }

}

TypeComposer.defineElement(SwitchPanel.TAG, SwitchPanel);
