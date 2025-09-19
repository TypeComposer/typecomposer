import { ElementType, Component } from "../../";

export class AudioElement extends HTMLAudioElement implements IComponent {
	static readonly TAG: string = "tc-audio-element";
	constructor(props?: ElementType<AudioElement>) {
		super();
		// @ts-ignore
		Component.initComponent(this, AudioElement, props);
	}
}

TypeComposer.defineElement(AudioElement.TAG, AudioElement, { extends: "audio" });