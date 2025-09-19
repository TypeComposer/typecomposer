import { Component, ElementType } from "../..";

export interface LazyLoadingProps extends ElementType {
  onintersect: ((isIntersecting?: boolean) => Promise<HTMLElement>) | ((isIntersecting?: boolean) => void);
  threshold?: number;
  rootMargin?: string;
  root?: Element;
  /**
   * If true the lazy loading component will be removed after the content is loaded default is true
   */
  autoRemove?: boolean;
}

export class LazyLoading extends Component {
  static readonly TAG: string = "tc-lazy-loading";
  protected observer?: IntersectionObserver;
  value: any;
  #load?: ((isIntersecting: boolean) => Promise<HTMLElement>) | (() => void);

  constructor(props: LazyLoadingProps) {
    super({  ...props , style: { display: "flex", minHeight: "50px", ...props?.style }});
    this.#load = props.onintersect;
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          if (props.autoRemove == false)
            this.#load(true);
          else {
            this.observer?.disconnect();
            // @ts-ignore
            this.loadContent(await this.#load());
          }
        }
        else if (props.autoRemove === false)
          this.#load(false);
      });
    }, { threshold: props.threshold, rootMargin: props.rootMargin, root: props.root });
    this.observer.observe(this);
  }

  async loadContent(content?: HTMLElement) {
    if (content && content instanceof HTMLElement) {
      this.parentElement?.replaceChild(content, this);
    } else
      this.remove();
  }
}

TypeComposer.defineElement(LazyLoading.TAG, LazyLoading);
