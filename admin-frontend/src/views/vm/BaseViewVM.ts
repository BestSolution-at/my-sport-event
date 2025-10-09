import { type ReadonlySignal } from '@preact/signals';
import type { AllMessages } from '../../messages';

export abstract class BaseViewVM {
	public readonly messages: ReadonlySignal<AllMessages>;

	constructor(messages: ReadonlySignal<AllMessages>) {
		this.messages = messages;
	}
}
