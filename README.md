# **TypeComposer**

**TypeComposer** is a modern frontend framework that allows you build user interfaces **declaratively** using **TypeScript or JavaScript classes** without writing HTML directly.

It provides a clean, class-based approach to UI development while maintaining full compatibility with existing web technologies.

## ✨ Features

* 🚀 **No HTML Required** – Define your entire UI using only TypeScript or JavaScript classes.
* 💡 **Declarative Syntax** – Create complex layouts with a simple, class-based structure.
* 🔷 **Full TypeScript Support** – Enjoy type safety, IntelliSense, and seamless TypeScript integration.
* ⚛️ **React-Friendly** – Easily integrate TypeComposer components into React projects.
* 🎨 **Tailwind CSS Ready** – Style and position elements with standard CSS or leverage **Tailwind CSS** for rapid, utility-first styling.

## 📦 Installation

Install TypeComposer using **npm**:

```bash
npm create typecomposer@latest
```

This will set up a new TypeComposer project with all the necessary configuration.

## 🚀 Getting Started

Creating a UI in TypeComposer is as simple as extending classes and composing elements.
Here’s an example of a **basic page** with a counter button:

```ts
import typescriptLogo from "/typescript.svg";
import logo from "/typecomposer.svg";
import {
  App,
  BorderPaneElement,
  ButtonElement,
  H1Element,
  HBoxElement,
  ImageElement,
  VBoxElement
} from "typecomposer";
import "./style.css";

export class AppPage extends BorderPaneElement {
  private count: number = 0;

  onInit(): void {
    const vbox = new VBoxElement({ justifyContent: "center" });
    const images = new HBoxElement({ width: "100%", alignItems: "center", justifyContent: "center" });

    images.append(new ImageElement({ src: logo, className: "logo" }));
    images.append(new ImageElement({ src: typescriptLogo, className: "logo" }));

    vbox.append(images);
    vbox.append(new H1Element({
      text: "TypeComposer",
      textAlign: "center",
      color: "#fcfffa"
    }));

    const counter = new ButtonElement({
      text: "0",
      width: "35%",
      height: "50px",
      alignSelf: "center"
    });

    counter.onclick = () => (counter.innerHTML = (this.count++).toString());
    vbox.append(counter);

    this.center = vbox;
  }
}

App.setPage(new AppPage());
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).