import { RouteView, AsyncComponentLoader } from "../../";
import { App, DivElement } from "../../";
import { RouterGuard } from "./RouterGuard";

export type RouterHistoryMode = "history" | "hash" | "memory" | "static" | "abstract";

export interface RoutePage {
  path: string;
  component?: ComponentType | AsyncComponentLoader;
  children?: RoutePage[];
  redirect?: string;
  title?: string;
  guard?: RouterGuard;
}

interface RoutePageBuild extends RoutePage {
  parent: RoutePageBuild;
  build: IComponent;
  routeView: RouteView | undefined;
  id?: string;
}

interface RouteMatch {
  url: string;
  path: string;
  routers: RoutePageBuild[];
  params: Record<string, string>;
}

function getRoutePairs(routes: any[], basePath: string = "", parentRouters: any[] = []): any[] {
  let result = [];

  for (const route of routes) {
    const fullPath = `${basePath}${route.path ? `/${route.path}` : ""}`.replace(/\/+/g, "/");

    const routers = [...parentRouters];
    if (route.component || route.redirect) {
      routers.push({ component: route.component, path: route.path, id: route.id, guard: route.guard, redirect: route.redirect, title: route.title });
    }
    result.push({ path: fullPath, routers, isChild: route.isChild });

    if (route.children) {
      result = result.concat(getRoutePairs(route.children, fullPath, routers));
    }
  }

  return result;
}

function validateRoutePattern(route: any, urlPath: string): boolean {
  if (route.isChild) return false;
  const routePattern = route.path;
  if (routePattern === "/**") return true;
  const routeSegments = routePattern.split("/").filter(Boolean);
  const urlSegments = urlPath.split("/").filter(Boolean);
  return routeSegments.length === urlSegments.length && routeSegments.every((seg, idx) => seg.startsWith(":") || seg === "*" || seg === urlSegments[idx]);
}

function getRouterParams(route: any, url: URL): Record<string, string> {
  const params = {};
  const routeSegments = route.path.split("/").filter(Boolean);
  const urlSegments = url.pathname.split("/").filter(Boolean);
  for (let i = 0; i < routeSegments.length; i++) {
    const seg = routeSegments[i];
    if (seg.startsWith(":")) {
      params[seg.slice(1)] = urlSegments[i];
    }
  }
  for (const [key, value] of url.searchParams.entries()) {
    params[key] = value;
  }
  return params;
}

function matchRoute(url: URL, routes: any[]): RouteMatch | null {
  for (const route of routes) {
    if (validateRoutePattern(route, url.pathname)) {
      return {
        url: url.pathname,
        path: url.pathname,
        routers: route.routers.map((r) => ({
          component: r.component,
          path: r.path,
          guard: r.guard,
          title: r.title,
          redirect: r.redirect,
          build: undefined,
        })),
        params: getRouterParams(route, url),
      };
    }
  }
  return null;
}

function pageNotFound(): DivElement {
  const body = new DivElement();
  body.style.width = "100vw";
  body.style.height = "100vh";
  body.style.display = "flex";
  body.style.flexDirection = "column";
  body.style.justifyContent = "center";
  body.style.alignItems = "center";
  body.style.overflow = "hidden";
  body.style.position = "fixed";
  body.innerHTML =
    "<div style='text-align: center;'><h1 style='text-shadow: 0 3px 0px $color-base, 0 6px 0px #333; color: #f54f59; font-size: 6em; font-weight: 700; line-height: 0.6em;'>404</h1><h1 style='text-shadow: 0 3px 0px $color-base, 0 6px 0px #333; color: #f54f59; font-size: 10; font-weight: 15; line-height: 0.6em;'>Page not found</h1></div>";
  return body;
}

export class Router {
  static #router: Router;
  #history: RouterHistoryMode;
  #props: any = {};
  private routes: RouteOutput[] = [];
  private url: string = window.location.pathname;
  private urlValid: string = "";
  private pageNotFound: ComponentType;
  private match: RouteMatch | null = null;
  /**
   * @param data - An array of route objects.
   * @param history - The type of history to use. Can be "history", "hash", "memory", "static", or "abstract".
   */
  static readonly SEGMENT_WILDCARD = "*";
  /**
   * @param data - An array of route objects.
   * @param history - The type of history to use. Can be "history", "hash", "memory", "static", or "abstract".
   * @returns {void}
   */
  static readonly PATH_WILDCARD = "**";
  beforeEach: (to: RouteMatch) => void = () => {};

  public beforeEach: (to: RouteMatch) => void = () => {};

  private constructor(data: RoutePage[], history: RouterHistoryMode, pageNotFound?: ComponentType) {
    if (Router.#router) throw new Error("Router already exists");
    Router.#router = this;
    this.#history = history;
    if (this.#history === "hash") {
      if (!window.location.pathname.startsWith("/#/")) {
        if (window.location.pathname === "/") {
          window.history.replaceState({}, "", "/#/");
        } else {
          window.history.replaceState({}, "", "/#" + window.location.pathname);
        }
      }
    }
    this.pageNotFound = pageNotFound;
    this.createAutoId(data, 0);
    this.routes = getRoutePairs(data);
    // Only add event listeners for browser-based routing modes
    if (history === "history" || history === "hash") {
      window.addEventListener(history == "history" ? "popstate" : "hashchange", () => this.handleRoute());
    }
    this.handleRoute();
  }

  private createAutoId(routes: RoutePage[] = [], id: number): number {
    for (const route of routes) {
      (route as any).id = `${route.path}_${++id}`;
      (route as any).isChild = route.children && route.children.length > 0;
      if (route.children) {
        id = this.createAutoId(route.children, id);
      }
    }
    return id;
  }

  private handleRoute() {
    let urlPath: string;
    
    // Handle different routing modes
    if (this.#history === "hash") {
      urlPath = (window.location.hash.replace(/^#\//, "/")) || "/";
    } else if (this.#history === "history") {
      urlPath = window.location.pathname || "/";
    } else {
      // For memory, static, and abstract modes, use the internal URL state
      urlPath = this.url || "/";
    }
    
    const url = new URL("http://localhost" + urlPath);
    this.url = url.pathname;
    this.buildRoutePage(matchRoute(url, this.routes));
  }

  private async buildRoutePage(match: RouteMatch | null): Promise<void> {
    let title = "";
    this.#props = match?.params || {};
    if (!match || !match.routers.length) {
      App.setPage(this.pageNotFound ? new this.pageNotFound() : pageNotFound());
      this.match = null;
    } else {
      if (!(await this.checkGuard(match))) return;
      if (this.match) {
        for (let i = 0; i < match.routers.length; i++) {
          const route = match.routers[i];
          if (route.path == this.match?.routers[i].path) {
            route.build = this.match.routers[i].build;
          }
        }
      }
      for (let i = 0; i < match.routers.length; i++) {
        const route = match.routers[i];
        if (route.redirect) {
          this.match = null;
          Router.go(route.redirect);
          return;
        }
        if (route.title) title = route.title;
        route.parent = i == 0 ? undefined : match.routers[i - 1];
      }
      const buildRoot = match.routers[0];
      if (!buildRoot.build && buildRoot.component) {
        if (typeof buildRoot.component === "function" && buildRoot.component.prototype instanceof Node) {
          // Component is a constructor
          buildRoot.build = App.setPage(new (buildRoot.component as ComponentType)());
        } else if (typeof buildRoot.component === "function") {
          // Component is an async loader
          const mod = await (buildRoot.component as AsyncComponentLoader)();
          buildRoot.build = App.setPage(new (mod.default as ComponentType)());
        }
      }
    }
    this.match = match;
    if (title) document.title = title;
    if (this.match) this.beforeEach(this.match);
    document?.body?.emitEvent("router:watch", { url: this.url, props: Router.props });
  }

  private async checkGuard(match: RouteMatch): Promise<boolean> {
    const guards = match.routers.map((route) => route.guard).filter(Boolean);
    let result: boolean = true;
    for await (const guard of guards) {
      const promise = new Promise<boolean>((resolve) => {
        const response = {
          path: match.url,
          params: match.params,
          query: this.#props,
          redirect: (path) => {
            resolve(path);
          },
          resolve: () => {
            resolve(true);
          },
          break: () => {
            resolve(false);
          },
          reject: () => {
            resolve(false);
          },
        };
        guard.beforeEach(response);
      });
      result = await promise;
      if (typeof result === "string") {
        Router.go(result);
        return false;
      }
    }
    if (result) this.urlValid = match.url;
    else Router.go(Router.#router?.urlValid);
    return result === true;
  }

  static create(data: {
    routes: RoutePage[];
    pageNotFound?: ComponentType;
    history?: RouterHistoryMode;
    sitemaps?: { baseUrl: string };
    robots?: "auto" | { [key: string]: any };
  }): void {
    Router.#router = new Router(data.routes, data.history || "history", data.pageNotFound);
  }

  static reload() {
    if (Router.#router) {
      Router.#router.match = null;
      Router.#router.handleRoute();
    } else window.location.reload();
  }

  static get props(): { [key: string]: any } {
    return this.#router.#props || {};
  }

  static get history(): "hash" | "history" {
    return Router.#router.#history;
  }

  private static buildURL(baseUrl: string, params: { [key: string]: any }): string {
    const queryString = Object.keys(params)
      .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
      .join("&");
    return baseUrl + (queryString ? "?" + queryString : "");
  }

  static async go(url: string, props?: {}): Promise<void> {
    if (!Router.#router) throw new Error("Router not initialized");
    if (!url) return;
    if (!url.startsWith("/")) url = "/" + url;
    const newUrl = Router.buildURL(url, props || {});
    
    // Handle different routing modes
    if (Router.#router.#history === "history") {
      history.pushState(props || {}, "", newUrl);
    } else if (Router.#router.#history === "hash") {
      window.location.hash = newUrl;
    } else {
      // For memory, static, and abstract modes, update internal state and trigger route handling
      Router.#router.url = url;
      Router.#router.#props = props || {};
      Router.#router.handleRoute();
    }
    // Router.#router?.handleRoute();
  }

  public static back() {
    if (Router.#router && (Router.#router.#history === "memory" || Router.#router.#history === "static" || Router.#router.#history === "abstract")) {
      // Non-browser modes don't support back navigation by default
      console.warn(`Router.back() is not supported in ${Router.#router.#history} mode`);
      return;
    }
    window.history.back();
  }

  public static forward() {
    if (Router.#router && (Router.#router.#history === "memory" || Router.#router.#history === "static" || Router.#router.#history === "abstract")) {
      // Non-browser modes don't support forward navigation by default
      console.warn(`Router.forward() is not supported in ${Router.#router.#history} mode`);
      return;
    }
    window.history.forward();
  }

  protected static getRouteViewFree(routeView: RouteView): RoutePageBuild | undefined {
    if (!Router.#router || !Router.#router.match) return undefined;
    const { routers } = Router.#router.match;
    const route = routers.find((route) => (!route.routeView || route.routeView === routeView) && route.parent);
    if (!route) return undefined;
    route.routeView = routeView;
    return route;
  }

  static get pathname(): string {
    return (Router.#router?.url || window.location.pathname).replace(/^\//, "");
  }
}
