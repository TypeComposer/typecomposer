export interface ComponentDefinitionOptions extends ElementDefinitionOptions {
  tag?: string;
  templateUrl?: string;
  styleUrl?: string;
  tagTest?: string;
  scoped?: boolean;
}
let index = 1;
function converClasNameToTag(className: string, isExported: boolean = true): string {
  if (className == undefined)
    return `base-${Math.random().toString(36).substring(7)}-element`;
  let name = className.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/(\d+)([A-Z])/g, '$1-$2').toLowerCase()
  if (isExported == false) {
    name = `${name}-${Math.random().toString(36).substring(7) + index.toString()}`;
  } else if (!name.includes("-"))
    name = name + "-element";
  return name
}
// @ts-ignore
export function Register(options?: ComponentDefinitionOptions): any {
  return function (constructor: CustomElementConstructor) {
    const tag = options?.tag || converClasNameToTag(constructor.name, options?.scoped || false);
    TypeComposer.defineElement(tag, constructor, { extends: options?.extends });
  };
}