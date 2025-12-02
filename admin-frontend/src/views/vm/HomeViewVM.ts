import { signal, type ReadonlySignal } from '@preact/signals';
import type { SportEvent } from '../../remote/model';
import { createSportEventService } from '../../remote';
import { createRemoteFunction } from '../utils/utils';
import type { SportEventService } from '../../remote/SportEventService';
import type { AllMessages } from '../../messages';
import { BaseViewVM } from './BaseViewVM';
import type { StateInfo } from './utils';

export class HomeViewVM extends BaseViewVM {
	public readonly events = signal<readonly SportEvent[]>([]);
	public readonly eventService = createSportEventService({ baseUrl: '' });
	public readonly eventServiceList = createRemoteFunction(this.eventService.list, this.handleListResult.bind(this));

	public readonly stateInfo = signal<StateInfo>();
	public readonly askDeleteDialogOpen = signal('');

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

	public async deleteEvent(eventKey: string, deleteConfirmed: boolean) {
		if (!deleteConfirmed) {
			this.askDeleteDialogOpen.value = eventKey;
			return;
		}
		this.askDeleteDialogOpen.value = '';
		const [, error] = await this.eventService.delete(eventKey);
		if (error) {
			this.stateInfo.value = { type: 'error', message: this.l10n('HomeView_Delete_Error') };
		} else {
			const state = { type: 'success', message: this.l10n('HomeView_Delete_Success') } as const;
			setTimeout(() => {
				if (this.stateInfo.value === state) {
					this.stateInfo.value = undefined;
				}
			}, 5000);
			this.stateInfo.value = state;
			this.eventServiceList();
		}
	}

	public clearStateInfo() {
		this.stateInfo.value = undefined;
	}
}
