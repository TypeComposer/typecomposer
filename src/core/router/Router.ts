import { App, DivElement, RouteView, AsyncComponentLoader } from "../../";
import { GuardResponse, RouterGuard } from "./RouterGuard";

export interface RoutePage {
  path: string;
  component?: ComponentType | AsyncComponentLoader;
  children?: RoutePage[];
  redirect?: string;
  title?: string;
  //changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  //priority?: 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0;
  guard?: RouterGuard;
}

interface RoutePageBuild extends RoutePage {
  parent: RoutePageBuild;
  build: IComponent;
  routeView: RouteView | undefined;
  id?: string;
}

interface RouteOutput {
  path: string;
  routers: { component?: any; path: string, guard?: RouterGuard, redirect?: string, title?: string }[];
}

function getRoutePairs(
  routes: RoutePage[],
  basePath = '',
  parentRouters: { component: any; path: string, guard?: RouterGuard }[] = []
): RouteOutput[] {
  let result: RouteOutput[] = [];

  for (const route of routes) {
    const fullPath = `${basePath}/${route.path}`.replace(/\/+/g, '/');

    const routers = [...parentRouters];
    if (route.component || route.redirect) {
      // @ts-ignore
      routers.push({ component: route.component, path: route.path, id: route.id, guard: route.guard, redirect: route.redirect, title: route.title });
    }

    result.push({ path: fullPath, routers });

    if (route.children) {
      result = result.concat(getRoutePairs(route.children, fullPath, routers));
    }
  }

  return result;
}


interface RouteMatch {
  url: string;
  path: string;
  routers: RoutePageBuild[];
  params: Record<string, string>;
}

function matchRoute(url: string, routes: RouteOutput[]): RouteMatch | null {
  let bestMatch: RouteMatch | null = null;
  for (const route of routes) {
    const routeRegex = new RegExp(
      `^${route.path
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]+')
        .replace(/:[^\s/]+/g, '([^/]+)')}$`
    );
    const match = url.match(routeRegex);


    if (match || route.path === `/${Router.PATH_WILDCARD}`) {
      const params: Record<string, string> = {};
      const paramKeys = route.path.match(/:[^\s/]+/g);

      if (paramKeys) {
        paramKeys.forEach((key, index) => {
          params[key.replace(':', '')] = match[index + 1];
        });
      }

      if (!bestMatch || route.path.length > bestMatch.path.length) {
        bestMatch = {
          path: route.path,
          // @ts-ignore
          routers: route.routers.map((route) => {
            // @ts-ignore
            return { component: route.component, path: route.path, id: route.id, guard: route.guard, title: route.title, redirect: route.redirect, build: undefined }
          }),
          params,
        };
      }
    }
  }
  if (bestMatch) bestMatch.url = url;
  return bestMatch;
}


function pageNotFound(): DivElement {
  const body = new DivElement();
  body.style.width = "100vw";
  body.style.height = "100vh";
  body.style.display = "flex";
  body.style.flexDirection = "column"
  body.style.justifyContent = "center";
  body.style.alignItems = "center";
  body.style.overflow = "hidden";
  body.style.position = "fixed";
  body.innerHTML =
    "<div style='text-align: center;'>" +
    "<h1 style='text-shadow: 0 3px 0px $color-base, 0 6px 0px #333; color: #f54f59; font-size: 6em; font-weight: 700; line-height: 0.6em;'>404</h1>" +
    "<h1 style='text-shadow: 0 3px 0px $color-base, 0 6px 0px #333; color: #f54f59; font-size: 10; font-weight: 15; line-height: 0.6em;'>Page not found</h1>" +
    "</div>";
  return body;
}

export class Router {

  static #router: Router;
  #history: "hash" | "history";
  #props: any = {};
  private routes: RouteOutput[] = [];
  private url: string = window.location.pathname;
  private urlValid: string = "";
  private pageNotFound: ComponentType | undefined;
  private match: RouteMatch | null = null;
  /**
   * @param data - An array of route objects.
   * @param history - The type of history to use. Can be either "hash" or "history".
   */
  static readonly SEGMENT_WILDCARD = "*";
  /**
   * @param data - An array of route objects.
   * @param history - The type of history to use. Can be either "hash" or "history".
   * @returns {void}
  */
  static readonly PATH_WILDCARD = "**";

  public beforeEach: (to: RouteMatch) => void = () => { };

  private constructor(data: RoutePage[], history: "hash" | "history", pageNotFound?: ComponentType) {
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
    window.addEventListener(history == "history" ? "popstate" : "hashchange", () => this.handleRoute());
    this.handleRoute();
  }

  private createAutoId(routes: RoutePage[] = [], id: number) {
    for (const route of routes) {
      route["id"] = `${route.path}_${++id}`;
      if (route.children) {
        id = this.createAutoId(route.children, id);
      }
    }
    return id;
  }

  private getQueryParams(url: string): Record<string, string> {
    const queryParams: Record<string, string> = {};
    const queryString = url.split('?')[1];

    if (queryString) {
      const pairs = queryString.split('&');
      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        queryParams[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    }

    return queryParams;
  }

  private handleRoute() {
    const url = this.#history === "hash" ? window.location.hash : window.location.pathname || "/";
    this.url = url;
    if (this.#history === "hash")
      this.url = this.url.replace(/^#\//, "/");
    this.#props = this.getQueryParams(this.url);
    this.buildRoutePage(matchRoute(this.url.split('?')[0], this.routes));
  }

  private async buildRoutePage(match: RouteMatch | undefined) {
    let title = "";
    if (!match || !match.routers.length) {
      App.setPage(this.pageNotFound ? new this.pageNotFound() : pageNotFound());
      this.match = null;
    }
    else {
      if (!await this.checkGuard(match)) return;
      if (this.match) {
        for (let i = 0; i < match.routers.length; i++) {
          if (!this.match?.routers[i]?.id)
            break;
          const route = match.routers[i];
          if (route.id == this.match?.routers[i]?.id) {
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
      this.match = match;
      if (!buildRoot.build) {
        if (buildRoot.component instanceof Function && buildRoot.component.prototype instanceof Element) {
          // @ts-ignore
          buildRoot.build = App.setPage(new buildRoot.component);
        }
        else {
          // @ts-ignore
          const mod = await buildRoot.component();
          buildRoot.build = App.setPage(new mod.default);
        }

      }
    }
    if (title) document.title = title;
    this.beforeEach(match);
    document?.body?.emitEvent("router:watch", { url: this.url, props: Router.props });
  }

  private async checkGuard(match: RouteMatch): Promise<boolean> {
    const guards = match.routers.map((route) => route.guard).filter(Boolean);
    let result: boolean | string = true;
    for await (const guard of guards) {
      const primose = new Promise<boolean | string>((resolve) => {
        const response: GuardResponse = {
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
          }
        }
        guard.beforeEach(response);
      });
      result = await primose;
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
    history?: "hash" | "history"; sitemaps?: { baseUrl: string }, robots?: "auto" | { [key: string]: any }
  }): void {
    Router.#router = new Router(data.routes, data.history || "history", data.pageNotFound);
  }

  static reload() {
    if (Router.#router) {
      Router.#router.match = null;
      Router.#router.handleRoute();
    }
    else
      window.location.reload();
  }

  public static get props(): { [key: string]: any } {
    if (window.location.hash) {
      const hashParts = window.location.hash.split('?');
      if (hashParts.length > 1) {
        const hashParams = new URLSearchParams(hashParts[1]);
        const props: { [key: string]: any } = {};
        for (const [key, value] of hashParams) {
          props[key] = value;
        }
        return props;
      }
    }
    else {
      const searchParams = new URLSearchParams(window.location.search);
      const props: { [key: string]: any } = {};
      for (const [key, value] of searchParams) {
        props[key] = value;
      }
      return props;
    }
    return {};
  }

  static get history() {
    return Router.#router.#history;
  }

  private static buildURL(baseUrl: string, parametros: { [key: string]: any }): string {
    const queryString = Object.keys(parametros)
      .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(parametros[key]))
      .join("&");
    return baseUrl + (queryString ? "?" + queryString : "");
  }

  public static async go(url: string, props?: {}) {
    if (!Router.#router) throw new Error("Router not initialized");
    if (!url) return;
    if (!url.startsWith("/"))
      url = "/" + url;
    const newUrl = Router.buildURL(url, props || {});
    if (Router.#router.#history === "history") history.pushState(props || {}, "", newUrl);
    else window.location.hash = newUrl;
    Router.#router?.handleRoute();
  }

  public static back() {
    window.history.back();
  }

  public static forward() {
    window.history.forward();
  }

  private static getRouteViewFree(routeView: RouteView): RoutePageBuild | undefined {
    if (!Router.#router || !Router.#router.match) return undefined;
    const { routers } = Router.#router.match;
    const route = routers.find((route) => (!route.routeView || route.routeView === routeView) && route.parent);
    if (!route) return undefined;
    route.routeView = routeView;
    return route;
  }

  /**
    * Returns the Location object's URL's path.
    *
    * Can be set, to navigate to the same URL with a changed path.
    *
    * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Location/pathname)
  */
  public static get pathname() {
    return (Router.#router?.url || window.location.pathname).replace(/^\//, "");
  }
}
