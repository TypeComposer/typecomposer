import { ref, Router } from "../";

export type theme = "light" | "dark" | string;

export type Platform = "Windows" | "macOS" | "Linux" | "Android" | "iOS" | "Other";

async function detectOS(): Promise<Platform> {
  let platform: Platform = "Other";
  // @ts-ignore
  if (navigator?.userAgentData) {
    // @ts-ignore
    const data = await navigator.userAgentData.getHighEntropyValues(["platform"]);
    platform = data.platform;
  } else {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes("win")) return "Windows";
    if (userAgent.includes("mac")) return "macOS";
    if (userAgent.includes("linux")) return "Linux";
    if (/android/.test(userAgent)) return "Android";
    if (/iphone|ipad|ipod/.test(userAgent)) return "iOS";
  }
  return platform as Platform;
}

export class __App__ {
  private translateData: object;
  private component: IComponent | undefined = undefined;
  #platform: Platform | undefined = undefined;
  private translateComputed: any = undefined;
  #theme: ref<theme> = ref(this.getThemePreferred());
  #language: ref<string> = ref(this.getLanguagePreferred());
  #themeListener = (e: MediaQueryListEvent) => {
    this.theme.value = e.matches ? "dark" : "light";
  };

  constructor() {
    this.#theme.subscribe((theme) => {
      const html = document.querySelector("html");
      html?.setAttribute("data-theme", theme);
      localStorage.setItem(
        "__app__",
        JSON.stringify({
          theme: theme,
          language: this.#language.value,
        })
      );
    });

    this.#language.subscribe((language) => {
      if (this.#language.value != language) {
        this.#language.value = language;
        localStorage.setItem(
          "__app__",
          JSON.stringify({
            theme: this.#theme.value,
            language: language,
          })
        );
        if (this.translateComputed === undefined) Router.reload();
      }
    });

    // Auto theme detection
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", this.#themeListener);
  }

  disableAutoTheme(): void {
    window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", this.#themeListener);
  }

  enableAutoTheme(): void {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", this.#themeListener);
  }

  getThemePreferred(): theme {
    const store = localStorage.getItem("__app__");
    const data = store ? JSON.parse(store) : {};
    return data.theme || document.documentElement["data-theme"] || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }

  getLanguagePreferred(): string {
    const store = localStorage.getItem("__app__");
    const data = store ? JSON.parse(store) : {};
    return data.language || document.documentElement.lang || "en";
  }

  public get theme(): ref<theme> {
    return this.#theme;
  }

  public get language(): ref<string> {
    return this.#language;
  }

  public setPage(page: HTMLElement): IComponent {
    if (this.component) this.component.remove();
    Array.from(document.body.querySelectorAll("[main-page]")).map((el) => el.remove());
    page?.setAttribute("main-page", "");
    if (page instanceof HTMLBodyElement) {
      // @ts-ignore
      TypeComposer.initComponent(page, undefined);
      document.body = page;
    } else {
      if (!document.body) document.body = document.createElement("body");
      // @ts-ignore
      TypeComposer.initComponent(page, document.body);
      document.body.appendChild(page);
    }
    this.component = page;
    return page;
  }

  /**
   * Gets a reference to the root node of the document.
   * @returns {HTMLElement} The root node of the document.
   */
  public get root(): HTMLElement {
    return document.documentElement;
  }

  public get body(): HTMLElement {
    return document.body;
  }

  public get head(): HTMLElement {
    return document.head;
  }

  public get location(): Location {
    return window.location;
  }

  public get title(): string {
    return document.title;
  }

  public set title(value: string) {
    document.title = value;
  }

  setTitle(value: string): void {
    document.title = value;
  }

  public get style(): any {
    return document.documentElement.style;
  }

  public set translate(value: object) {
    this.translateData = value;
  }

  public get translate(): object {
    return this.translateData;
  }

  public get platform(): Promise<string> {
    if (this.#platform) return Promise.resolve(this.#platform);
    return detectOS().then((platform) => {
      this.#platform = platform;
      return platform;
    });
  }

  public getCookie(nome: string): any {
    const cookies = "; " + document.cookie;
    const partes = cookies.split("; " + nome + "=");
    if (partes.length === 2) {
      const value = partes.pop().split(";").shift();
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return null;
  }

  public setCookie(nome: string, valor: any, dias: number): void {
    const data = new Date();
    data.setTime(data.getTime() + dias * 24 * 60 * 60 * 1000);
    if (typeof valor === "object") valor = JSON.stringify(valor);
    document.cookie = `${nome}=${valor}; expires=${data.toUTCString()}; path=/`;
  }

  public removeCookie(nome: string): void {
    document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  public getLocalStorage(nome: string): string {
    return localStorage.getItem(nome);
  }

  public setLocalStorage(nome: string, valor: string): void {
    localStorage.setItem(nome, valor);
  }

  public removeLocalStorage(nome: string): void {
    localStorage.removeItem(nome);
  }

  requestFullscreen(): void {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement["mozRequestFullScreen"]) {
      document.documentElement["mozRequestFullScreen"]();
    } else if (document.documentElement["webkitRequestFullscreen"]) {
      document.documentElement["webkitRequestFullscreen"]();
    } else if (document.documentElement["msRequestFullscreen"]) {
      document.documentElement["msRequestFullscreen"]();
    }
  }

  exitFullscreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document["mozCancelFullScreen"]) {
      document["mozCancelFullScreen"]();
    } else if (document["webkitExitFullscreen"]) {
      document["webkitExitFullscreen"]();
    } else if (document["msExitFullscreen"]) {
      document["msExitFullscreen"]();
    }
  }
}
