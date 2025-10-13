import { signal } from '@preact/signals';
import type { SportEvent } from '../../remote/model';
import { createSportEventService } from '../../remote';
import { createRemoteFunction } from '../utils/utils';
import type { SportEventService } from '../../remote/SportEventService';

export class HomeViewVM {
	public readonly events = signal<readonly SportEvent[]>([]);
	public readonly eventService = createSportEventService({ baseUrl: '' });
	public readonly eventServiceList = createRemoteFunction(
		this.eventService.list.bind(this.eventService.list),
		this.handleListResult.bind(this)
	);

	constructor() {
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
}
