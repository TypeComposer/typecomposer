import { Component, DivElement, SpanElement, ElementType } from "../..";

export type AlertType = "success" | "info" | "warning" | "error";

export class AlertPanel extends Component {
  static readonly TAG: string = "tc-alert-panel";
  static #panelMain: DivElement | undefined = undefined;

  public timeout: number = 5000;

  constructor(
    props?: ElementType & {
      message: string;
      type: AlertType;
      timeout?: number;
      variant?: "outlined" | "filled";
    },
  ) {
    super({
      className: "alert",
      ...props,
    });
    this.addClassName(`${props?.variant || "filled"}-${props?.type || "info"}`);
    this.variant = props?.variant || "filled";
    const icon = new DivElement({ className: "icon" });
    icon.addClassName(`icon-${props?.variant || "filled"}-${props?.type || "info"}`);
    icon.innerHTML = this.#getIcon(props?.type);
    this.append(icon);
    this.append(new SpanElement({ text: props.message, style: { padding: "8px 0" } }));
    this.timeout = props?.timeout || 5000;
    const divBtn = this.appendChild(new DivElement({ className: "close-btn" }));
    const btn: SpanElement = divBtn.appendChild(new SpanElement({ className: "fas fa-times", text: "X" }));

    btn.onclick = () => {
      this.remove();
    };
  }

  #getIcon(type: AlertType) {
    switch (type) {
      case "success":
        return `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"></path></svg>`;
      case "info":
        return `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"></path></svg>`;
      case "warning":
        return `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"></path></svg>`;
      case "error":
        return `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>`;
      default:
        return "";
    }
  }

  onDisconnected(): void {
    AlertPanel.removeItem(this);
  }

  private static removeItem(item: AlertPanel) {
    if (AlertPanel.#panelMain && AlertPanel.#panelMain?.children.length === 0) {
      AlertPanel.#panelMain?.remove();
      AlertPanel.#panelMain = undefined;
    }
  }

  private static addItem(item: AlertPanel) {
    if (AlertPanel.#panelMain === undefined) {
      AlertPanel.#panelMain = new DivElement({ id: "alert-system" });
      document.body.appendChild(AlertPanel.#panelMain);
    }
    AlertPanel.#panelMain.append(item);
    if (item.timeout > 0) {
      setTimeout(() => {
        item?.remove();
      }, item.timeout);
    }
    return item;
  }

  public static success(message: string, props?: ElementType & { timeout?: number; variant?: "outlined" | "filled" }): AlertPanel {
    return AlertPanel.addItem(new AlertPanel({ ...props, type: "success", message }));
  }

  public static info(message: string, props?: ElementType & { timeout?: number; variant?: "outlined" | "filled" }): AlertPanel {
    return AlertPanel.addItem(new AlertPanel({ ...props, type: "info", message }));
  }

  public static warning(message: string, props?: ElementType & { timeout?: number; variant?: "outlined" | "filled" }): AlertPanel {
    return AlertPanel.addItem(new AlertPanel({ ...props, type: "warning", message }));
  }

  public static error(message: string, props?: ElementType & { timeout?: number; variant?: "outlined" | "filled" }): AlertPanel {
    return AlertPanel.addItem(new AlertPanel({ ...props, type: "error", message }));
  }
}

TypeComposer.defineElement(AlertPanel.TAG, AlertPanel);
