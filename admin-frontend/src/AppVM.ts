import { batch, signal, type ReadonlySignal } from '@preact/signals';
import type { SportEvent } from './remote/model';
import { createSportEventService } from './remote';
import { createRemoteFunction, createTextField, validateRequired } from './views/utils/utils';
import type { SportEventService } from './remote/SportEventService';
import { BaseViewVM } from './views/vm/BaseViewVM';
import type { AllMessages } from './messages';

export class AppVM extends BaseViewVM {
	public readonly events = signal<readonly SportEvent[]>([]);
	public readonly newEventDialog = signal<NewEventDialogVM>();

	public readonly eventService = createSportEventService({ baseUrl: '' });
	public readonly eventServiceList = createRemoteFunction(this.eventService.list, this.handleListResult.bind(this));

	public navigateToEvent?: (eventId: string) => void;

	constructor(messages: ReadonlySignal<AllMessages>) {
		super(messages);
		this.eventServiceList();
	}

	private handleListResult(result: Awaited<ReturnType<SportEventService['list']>>) {
		const [data, err] = result;
		if (data) {
			this.events.value = data;
		} else {
			console.error(err);
		}
	}

	openNewEventDialog() {
		this.newEventDialog.value = new NewEventDialogVM(this, this.messages);
	}

	closeDialogs() {
		this.newEventDialog.value = undefined;
	}

	refresh() {
		this.eventServiceList();
	}
}

export class NewEventDialogVM extends BaseViewVM {
	public readonly name = createTextField({
		label: this.l10n('NewEventDialog_Name'),
		initialValue: '',
		validation: v => validateRequired(v, this.l10n),
	});

	public readonly date = createTextField({
		label: this.l10n('NewEventDialog_Date'),
		initialValue: '',
		validation: v => validateRequired(v, this.l10n),
	});
	public readonly time = createTextField({
		label: this.l10n('NewEventDialog_Time'),
		initialValue: '',
		validation: v => validateRequired(v, this.l10n),
	});

	private parent: AppVM;

	constructor(parent: AppVM, messages: ReadonlySignal<AllMessages>) {
		super(messages);
		this.parent = parent;
	}

	public close() {
		this.parent.closeDialogs();
	}

	public validate() {
		return batch(() => {
			let valide = this.name.validate();
			valide &&= this.date.validate();
			valide &&= this.time.validate();
			return valide;
		});
	}

	public async persist() {
		if (this.validate()) {
			const name = this.name.value.value;
			const date = this.date.value.value;
			const time = this.time.value.value;

			const [eventId, err] = await this.parent.eventService.create({
				name,
				date: new Date(`${date}T${time}:00`).toISOString(),
			});
			if (eventId) {
				this.parent.navigateToEvent?.(eventId);
				this.parent.refresh();
				this.parent.closeDialogs();
			} else {
				console.error(err);
			}
		}
	}
}
