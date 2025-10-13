import { type ReadonlySignal } from '@preact/signals';
import type { AllMessageKeys, AllMessages } from '../../messages';

export abstract class BaseViewVM {
	public readonly messages: ReadonlySignal<AllMessages>;

	constructor(messages: ReadonlySignal<AllMessages>) {
		this.messages = messages;
	}

	public l10n(key: AllMessageKeys, variables?: Record<string, unknown>) {
		return this.messages.value(key, variables);
	}
}
