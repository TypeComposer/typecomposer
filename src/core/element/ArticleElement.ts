import { ElementType, Component } from "../../";

export class ArticleElement extends HTMLElement implements IComponent {
   static readonly TAG: string = "tc-article-element";

   constructor(props?: ElementType) {
	   super();
	   // @ts-ignore
		Component.initComponent(this, ArticleElement, props);
   }
}

TypeComposer.defineElement(ArticleElement.TAG, ArticleElement, {
	extends: "article",
});