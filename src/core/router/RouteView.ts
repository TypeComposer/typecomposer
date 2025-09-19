import { Component, Router, ElementType } from "../..";
import { RoutePage } from "./Router";

interface RoutePageBuild extends RoutePage {
  parent: RoutePageBuild;
  build?: IComponent;
  routeView?: RouteView;
  id?: string;
}

export class RouteView extends Component {
  static readonly TAG: string = "tc-route-view";
  private _view: IComponent | undefined = undefined;
  private _url: string = "";
  private routePage: RoutePageBuild | undefined = undefined;
  #defaultView: ComponentType | undefined = undefined;
  #defaultComponent: IComponent | undefined = undefined;


  constructor(
    props?: ElementType & {
      defaultView?: ComponentType;
      onUpdateView?: (view?: IComponent) => void;
    },
  ) {
    super();
    this.#defaultView = props?.defaultView;
    delete props?.defaultView;
    delete props?.children;
    Component.applyProps(this, props);
    this.onEvent("router:watch", () => {
      this.updateView()
      props?.onUpdateView?.(this.view);
    });
  }

  get url(): string {
    return this._url;
  }

  connectedCallback() {
    this.updateView();
  }

  append(...nodes: (Node | string)[]): void {
    throw new Error("Method not implemented.");
  }

  appendChild<T extends Node>(node: T): T {
    throw new Error("Method not implemented.");
  }

  private async updateView() {
    // @ts-ignore
    const routePage = Router.getRouteViewFree(this);
    if (routePage == undefined) {
      if (this.routePage)
        this.routePage.routeView = undefined;
      this.view = undefined;
      this.routePage = undefined;
      return;
    }
    if (routePage === this.routePage) return;
    if (routePage.build && routePage.build === this.routePage?.build) {
      routePage.routeView = this;
      return;
    }
    if (routePage.component instanceof Function && routePage.component.prototype instanceof Element) {
      // @ts-ignore
      routePage.build = routePage.build || new routePage.component!();
    }
    else if (!routePage.build) {
      // @ts-ignore
      const mod = await routePage.component();
      routePage.build = new mod.default;
    }

    this.routePage = routePage;
    this.view = routePage.build;
  }

  disconnectedCallback() {
    if (this.routePage) this.routePage.routeView = undefined;
    this.routePage = undefined;
    this.removeEvent("router:watch");
  }

  get view(): IComponent | undefined {
    return this._view;
  }

  set view(value: IComponent | undefined) {
    if (!value && this.#defaultView) {
      value = this.#defaultComponent || new this.#defaultView;
      this.#defaultComponent = value;
    }
    if (this._view == value) return;
    if (this._view) this._view.remove();
    this._view = value;
    if (value) super.append(value);
  }
}
TypeComposer.defineElement(RouteView.TAG, RouteView);
