import { AsyncComponentLoader, Component, ElementType } from "../..";

export class LazyLoad extends Component {
  static readonly TAG: string = "tc-lazy-load";
  // protected observer?: IntersectionObserver;
  // value: any;
  readonly loader?: AsyncComponentLoader;
  readonly loaderProps?: { [key: string]: any };

  constructor(props: ElementType<LazyLoad>) {
    super(props);
    this.loader = props.loader;
    this.loaderProps = props?.loaderProps;
    if (props.loader)
    {
      this.addEventListener("onConnected", () => {
        Component.lazyLoad(this.loader, { fallback: this, props: this.loaderProps });
      });
    }

    // this.value = null;
    // if (props.loader)
    //   this.setupObserver(props);
  }
    // this.#load = props.onintersect;
    // this.observer = new IntersectionObserver(entries => {
    //   entries.forEach(async (entry) => {
    //     if (entry.isIntersecting) {
    //       if (props.autoRemove == false)
    //         this.#load(true);
    //       else {
    //         this.observer?.disconnect();
    //         // @ts-ignore
    //         this.loadContent(await this.#load());
    //       }
    //     }
    //     else if (props.autoRemove === false)
    //       this.#load(false);
    //   });
    // }, { threshold: props.threshold, rootMargin: props.rootMargin, root: props.root });
    // this.observer.observe(this);
  // }

  // async loadContent(content?: HTMLElement) {
  //   if (content && content instanceof HTMLElement) {
  //     this.parentElement?.replaceChild(content, this);
  //   } else
  //     this.remove();
  // }
}

TypeComposer.defineElement(LazyLoad.TAG, LazyLoad);
