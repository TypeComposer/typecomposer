import { refList, ref } from "../../..";


export class Fragment extends DocumentFragment {
	constructor(onConnected: (data: {
		parentElement: HTMLElement | undefined,
		elementIndex: number,
		elements: {
			element: HTMLElement;
			value: any;
			index: number;
		}[]
	}) => void) {
		super();
		this.addEventListener("onConnected", () => {
			this.onBuildFragment(onConnected)
		})
	}

	

	onBuildFragment(onConnected: (data: {
		parentElement: HTMLElement | undefined,
		elementIndex: number,
		elements: {
			element: HTMLElement;
			value: any;
			index: number;
		}[]
	}) => void) {
		const data: {
			parentElement: HTMLElement | undefined;
			elementIndex: number,
			elements: {
				element: HTMLElement;
				value: any;
				index: number;
			}[]
		} = {
			parentElement: undefined,
			elementIndex: -1,
			elements: []
		}
		data.parentElement = this.parentElement as any;
		const childrens = this.parentElement?.children || []
		for (let i = 0; i < childrens.length; i++) {
			if (childrens[i] === this) {
				data.elementIndex = i > 0 ? i : 0;
				break;
			}
		}
		onConnected(data)
		//this.remove();
	}


	static getElement(data: {
		parentElement: HTMLElement | undefined,
		elementIndex: number,
		elements: {
			element: HTMLElement;
			value: any;
			index: number;
		}[]
	}) {
		const begin = data.elements[0]?.element;
		const childrens = data.parentElement.children;
		let element = childrens[0];
		if (!childrens) return undefined;
		for (let i = 0; i < childrens.length; i++) {
			if (begin === childrens[i]) {
				data.elementIndex = i;
				return childrens[i];
			}
			else if (!begin && i >= data.elementIndex) {
				return childrens[i];
			} else element = childrens[i];
		}
		return element;
	}

	public static forEach<T = any>(items: refList<T>, callbackfn: (value: T, index: number) => HTMLElement): Fragment {
		const onConnected = (data: {
			parentElement: HTMLElement | undefined,
			elementIndex: number,
			elements: {
				element: HTMLElement;
				value: any;
				index: number;
			}[]
		}) => {
			const updadeItems = () => {
				if (!data.parentElement) return;
				const begin = Fragment.getElement(data);
				const newElemets = items.map((e, index) => {
					return { element: callbackfn(e, index), value: e, index };
				});
				for (const element of newElemets) {
					data.parentElement.insertBefore(element.element, begin);
				}
				for (const element of data.elements) element.element.remove();
				data.elements = newElemets;
			};
			if (items instanceof ref) {
				// @ts-ignore
				items.subscribe(updadeItems);
			}
			updadeItems();
		}


		return new Fragment(onConnected);
	}



	public static create(condition: (change?: (value, index, array, action: Function) => any) => any, references: any[]): DocumentFragment {
		const onConnected = (data: {
			parentElement: HTMLElement | undefined,
			elementIndex: number,
			elements: {
				element: HTMLElement;
				value: any;
				index: number;
			}[]
		}) => {
			const updadeItems = (t: string, tr: string) => {
				if (!data.parentElement) return;
				const begin = Fragment.getElement(data);
				let newElemets = condition();

				if (newElemets && !Array.isArray(newElemets))
					newElemets = [newElemets];
				if (newElemets)
					newElemets = newElemets.map((e: any, index: number) => {
						return { element: e, value: undefined, index };
					});
				if (newElemets)
					for (const element of newElemets) {
						data.parentElement.insertBefore(element.element, begin);
					}
				for (const element of data.elements) element.element.remove();
				if (newElemets)
					data.elements = newElemets;
			}
			for (const reference of references) {
				// @ts-ignore
				if (reference instanceof ref) (reference as ref<any>).subscribe(updadeItems);
			}
			updadeItems("a", "b");
		}
		return new Fragment(onConnected);
	}

}

(globalThis as any).forEach = Fragment.forEach;
(globalThis as any).Fragment = Fragment;