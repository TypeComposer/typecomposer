import { ElementType, Component, SourceElement } from "../../";
// <video>
export class VideoElement extends HTMLVideoElement implements IComponent {
	static readonly TAG: string = "tc-video-element";
	constructor(props?: ElementType<VideoElement>) {
		super();
		if (props?.src) {
			this.appendChild(new SourceElement({ src: props?.src }));
		}
		delete props?.src;
		// @ts-ignore
        Component.initComponent(this, VideoElement, props);
	}
}

TypeComposer.defineElement(VideoElement.TAG, VideoElement, { extends: "video" });