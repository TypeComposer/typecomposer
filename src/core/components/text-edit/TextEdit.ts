import { Component, ParagraphElement, SpanElement } from "../..";

export interface ITextEditFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  atributes?: string[];
  styles?: string[];
  classNames?: string[];
}

export class TextEdit extends Component {
  static readonly TAG: string = "tc-text-edit";
  #root: ParagraphElement;
  #selection: Selection | null = null;
  #format?: ITextEditFormat;

  constructor(props: { value?: string; format: ITextEditFormat }) {
    super({ style: { margin: "20px", padding: "10px", display: "flex", border: "1px solid #ccc" } });
    this.contentEditable = "true";
    this.#format = props.format || {
      atributes: [],
      styles: [],
      classNames: [],
    };
    this.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.#root = this.appendChild(new ParagraphElement({ text: props.value, style: { width: "100%" } }));
    this.#root.append(new ParagraphElement({ text: "hello word Hello" }));
  }

  handleMouseUp() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    this.#selection = selection;
  }

  cleanElements(container: Element | undefined) {
    if (container == null) return;
    for (let i = 0; i < container.children.length; i++) {
      const item = container.children[i];
      if (item == null) return;
      const isChild = item.children.length == 1;
      if (isChild && this.compareElements(item, item.children[0])) {
        const children = item.children[0];
        item.innerHTML = children.innerHTML;
        this.mergeAttributes(item as HTMLElement, children.style as Partial<CSSStyleDeclaration> | undefined, children.attributes);
      }
      for (let j = 0; j < item.children.length; j++) {
        this.cleanElements(item.children[j]);
      }
    }
  }

  removeEmptyValues(obj: { [key: string]: string }): { [key: string]: string } {
    const result: { [key: string]: string } = {};
    for (const key in obj) {
      if (key == "0") continue;
      if (obj[key] !== "") {
        result[key] = obj[key];
      }
    }
    return result;
  }

  private compareElements(item: Element, children: Element) {
    return item.tagName == children.tagName;
  }

  private mergeStyles(element: HTMLElement, newStyles: Partial<CSSStyleDeclaration> | undefined) {
    if (!element || !newStyles) return;
    const childrenStyle = JSON.stringify(newStyles);
    newStyles = this.removeEmptyValues(JSON.parse(childrenStyle));
    const elementStyleKeys = Object.keys(element.style);
    Object.keys(newStyles).forEach((key) => {
      const styleKey: any = key as keyof CSSStyleDeclaration;
      const newStyle = newStyles[styleKey] as string;
      if (elementStyleKeys.includes(styleKey)) {
        if (newStyle && newStyle != element.style[styleKey]) element.style[styleKey] = newStyle;
        else element.style[styleKey] = "";
      }
    });
  }

  private mergeAttributes(element: HTMLElement, newStyles: Partial<CSSStyleDeclaration> | undefined, attributes: NamedNodeMap | undefined) {
    this.mergeStyles(element, newStyles);
    this.mergeAttributes2(element, attributes);
  }
  private mergeAttributes2(element: HTMLElement, attributes: {} | undefined) {
    if (!element || !attributes) return;
    const childrenAttributes = JSON.stringify(attributes);
    attributes = this.removeEmptyValues(JSON.parse(childrenAttributes));
    Object.keys(attributes).forEach((attrKey: any) => {
      // @ts-ignore
      const attributeValue = attributes[attrKey as any];
      if (typeof attributeValue === "string") {
        element.setAttribute(attrKey, attributeValue);
      } else if (attrKey === "classList" && attributeValue instanceof DOMTokenList) {
        attributeValue.forEach((className) => element.classList.add(className));
      }
    });
  }

  public format(type: string, value: string) {
    if (this.#format?.atributes?.includes(type)) {
      // @ts-ignore
      this.formatAtribute({ [type]: value });
    } else if (this.#format?.styles?.includes(type)) {
      this.formatStyle({ [type]: value });
    } else if (this.#format?.classNames?.includes(type)) {
      //this.formatClass(type, value);
    } else {
      console.error("Invalid format type");
    }
  }

  private formatAtribute(attributes: NamedNodeMap) {
    this.#formatElement(undefined, attributes);
  }

  private formatStyle(cssProperties: Partial<CSSStyleDeclaration>) {
    this.#formatElement(cssProperties, undefined);
  }

  // Função para formatar a seleção, lidando com múltiplos nós
  #formatElement(cssProperties: Partial<CSSStyleDeclaration> | undefined, attributes: NamedNodeMap | undefined) {
    if (!this.#selection || this.#selection.rangeCount === 0) return;
    const range = this.#selection.getRangeAt(0);

    // Cria um fragmento para inserir as cópias com estilos e atributos
    const fragment = document.createDocumentFragment();

    // Itera sobre cada nó dentro do range e clona cada nó individualmente com cloneNode(true)
    range.cloneContents().childNodes.forEach((node) => {
      const clonedNode = (node as HTMLElement).cloneNode(true) as HTMLElement;
      fragment.appendChild(clonedNode);
    });

    // Agora, aplica os estilos e atributos aos nós clonados no fragmento
    fragment.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parentElement = node.parentElement as HTMLElement;

        // Verifica se o nó de texto está dentro de um <span> estilizado
        if (
          parentElement &&
          parentElement.tagName === "SPAN" &&
          range.startContainer === node &&
          range.startOffset === 0 &&
          range.endContainer === node &&
          range.endOffset === node.textContent?.length
        ) {
          // Aplica estilos e atributos diretamente ao <span> existente
          this.mergeAttributes(parentElement, cssProperties, attributes);
        } else {
          // Cria um novo <span> para estilizar a seleção parcial
          const styledElement = new SpanElement();
          styledElement.textContent = node.textContent;
          this.mergeAttributes(styledElement, cssProperties, attributes);
          node.replaceWith(styledElement);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        // Verifica se o elemento está completamente selecionado
        if (range.startContainer === range.endContainer && range.startOffset === 0 && range.endOffset === element.textContent?.length) {
          // Aplica o estilo e atributos diretamente ao elemento
          this.mergeAttributes(element, cssProperties, attributes);
        } else {
          // Envolve o conteúdo em um novo <span> se a seleção for parcial
          const styledElement = new SpanElement();
          styledElement.appendChild(element.cloneNode(true));
          this.mergeAttributes(styledElement, cssProperties, attributes);
          node.replaceWith(styledElement);
        }
      }
    });

    // Remove o conteúdo selecionado original e insere o fragmento estilizado no lugar
    range.deleteContents();
    range.insertNode(fragment);

    // Limpa a seleção após a formatação
    this.#selection.removeAllRanges();
    //this.cleanElements(this.#root);
  }
}
TypeComposer.defineElement(TextEdit.TAG, TextEdit);