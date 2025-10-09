import { signal } from '@preact/signals';

export class ParticipantViewVM {
	public readonly searchField = signal('Sample');
	constructor() {}
}
