import { computed, effect, signal, type ReadonlySignal } from '@preact/signals';
import type { SportEvent, SportEventPatch } from '../../remote/model';
import { createSportEventService } from '../../remote';
import { createTextField } from '../utils/utils';
import { messages, type AllMessageKeys, type AllMessages } from '../../messages';
import { BaseViewVM } from './BaseViewVM';

export class EventViewVM extends BaseViewVM {
	public readonly eventId = signal('');

	private readonly dto = signal<SportEvent>();

	public readonly title = computed(() => {
		if (this.dto.value) {
			return this.dto.value.name;
		}
	});
	private readonly eventService = createSportEventService({ baseUrl: '' });

	public readonly name = createTextField({
		label: computed(() => this.l10n('NewEventDialog_Name')),
		initialValue: '',
		validation: v => (v.trim().length === 0 ? this.l10n('Generic_Required_Field') : ''),
	});

	public readonly date = createTextField({
		label: messages['en-US'].NewEventDialog_Date,
		initialValue: '',
		validation: v => (v.trim().length === 0 ? this.l10n('Generic_Required_Field') : ''),
	});
	public readonly time = createTextField({
		label: messages['en-US'].NewEventDialog_Time,
		initialValue: '',
		validation: v => (v.trim().length === 0 ? this.l10n('Generic_Required_Field') : ''),
	});

	constructor(messages: ReadonlySignal<AllMessages>) {
		super(messages);
		effect(() => {
			this.fetchData();
			return () => {};
		});
		effect(() => {
			if (this.dto.value) {
				this.name.value.value = this.dto.value.name;
				const [isoDate, isoTime] = toLocaleDateTime(this.dto.value.date);
				this.date.value.value = isoDate;
				this.time.value.value = isoTime;
			}
		});
	}

	private l10n(key: AllMessageKeys) {
		return this.messages.value(key);
	}

	private async fetchData() {
		if (this.eventId.value) {
			const [result, err] = await this.eventService.get(this.eventId.value);
			if (result) {
				this.dto.value = result;
			} else {
				console.log('====> FAILURE', err);
			}
		}
	}

	public async persist() {
		let valide = this.name.validate();
		valide &&= this.date.validate();
		valide &&= this.time.validate();

		if (valide && this.dto.value) {
			const name = this.name.value.value;
			const date = this.date.value.value;
			const time = this.time.value.value;
			const patch = createSportEventPatch(this.dto.value, {
				...this.dto.value,
				name,
				date: new Date(`${date}T${time}:00`).toISOString(),
			});
			if (patch) {
				const [result, err] = await this.eventService.update(this.eventId.value, patch);
				if (result) {
					this.fetchData();
				} else {
					console.error('Failure', err);
				}
			}
		}
	}
}

function createSportEventPatch(cur: SportEvent, updated: SportEvent): SportEventPatch | undefined {
	const patch: SportEventPatch = {
		key: cur.key,
		version: cur.version,
		date: cur.date !== updated.date ? updated.date : undefined,
		name: cur.name !== updated.name ? updated.name : undefined,
	};
	if (patch.date !== undefined || patch.name !== undefined) {
		return patch;
	}
	return undefined;
}

function toLocaleDateTime(isoDateTime: string): [string, string] {
	const d = new Date(isoDateTime);

	const parts = new Intl.DateTimeFormat(undefined, {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).formatToParts(d);

	const day = parts.find(p => p.type === 'day')?.value;
	const month = parts.find(p => p.type === 'month')?.value;
	const year = parts.find(p => p.type === 'year')?.value;
	const hour = parts.find(p => p.type === 'hour')?.value;
	const minute = parts.find(p => p.type === 'minute')?.value;
	return [`${year}-${month}-${day}`, `${hour}:${minute}`];
}
