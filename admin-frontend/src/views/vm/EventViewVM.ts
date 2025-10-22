import { batch, computed, effect, signal, type ReadonlySignal } from '@preact/signals';
import type { SportEvent, SportEventPatch } from '../../remote/model';
import { createSportEventService } from '../../remote';
import { createRemoteFunction, createTextField, validateRequired } from '../utils/utils';
import { type AllMessages } from '../../messages';
import { BaseViewVM } from './BaseViewVM';
import type { SportEventService } from '../../remote/SportEventService';

export class EventViewVM extends BaseViewVM {
	public readonly eventId = signal('');

	private readonly dto = signal<SportEvent>();

	public readonly title = computed(() => {
		if (this.dto.value) {
			return this.dto.value.name;
		}
	});
	private readonly eventService = createSportEventService({ baseUrl: '' });

	private readonly eventServiceGet = createRemoteFunction(this.eventService.get, this.handleGetResult.bind(this));

	public readonly name = createTextField({
		label: computed(() => this.l10n('NewEventDialog_Name')),
		initialValue: '',
		validation: v => validateRequired(v, this.l10n),
	});

	public readonly date = createTextField({
		label: computed(() => this.l10n('NewEventDialog_Date')),
		initialValue: '',
		validation: v => validateRequired(v, this.l10n),
	});
	public readonly time = createTextField({
		label: computed(() => this.l10n('NewEventDialog_Time')),
		initialValue: '',
		validation: v => validateRequired(v, this.l10n),
	});

	constructor(messages: ReadonlySignal<AllMessages>) {
		super(messages);
		effect(() => {
			this.fetchData();
			return () => {};
		});
		effect(() => {
			if (this.dto.value) {
				this.name.value = this.dto.value.name;
				const [isoDate, isoTime] = toLocaleDateTime(this.dto.value.date);
				this.date.value = isoDate;
				this.time.value = isoTime;
			}
		});
	}

	private fetchData() {
		if (this.eventId.value) {
			this.eventServiceGet(this.eventId.value);
		}
	}

	private handleGetResult(result: Awaited<ReturnType<SportEventService['get']>>) {
		const [data, err] = result;
		if (data) {
			this.dto.value = data;
		} else {
			console.error('====> FAILURE', err);
		}
	}

	public validate() {
		return batch(() => {
			let valide = this.name.validate();
			valide = this.date.validate() && valide;
			valide = this.time.validate() && valide;
			return valide;
		});
	}

	public async persist() {
		if (this.validate() && this.dto.value) {
			const name = this.name.value;
			const date = this.date.value;
			const time = this.time.value;
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
