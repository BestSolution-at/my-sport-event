import { batch, computed, effect, signal, type ReadonlySignal } from '@preact/signals';
import { BaseViewVM } from './BaseViewVM';
import {
	isBirthyearCohort,
	type BirthyearCohort,
	type BirthyearCohortPatch,
	type Cohort,
	type CohortNew,
	type CohortPatch,
	type Gender,
	type GenericCohort,
	type GenericCohortPatch,
	type SportEvent,
} from '../../remote/model';
import type { AllMessages } from '../../messages';
import { createEventCohortService, createSportEventService } from '../../remote';
import {
	createRemoteFunction,
	createSelectFormField,
	createTextField,
	parseFormattedInteger,
	validateRequired,
} from '../utils/utils';
import type { EventCohortService } from '../../remote/EventCohortService';
import type { SportEventService } from '../../remote/SportEventService';
import { cohortSort } from './utils';

export class CohortViewVM extends BaseViewVM {
	public readonly eventId = signal('');

	private readonly eventDto = signal<SportEvent>();

	public readonly title = computed(() => {
		if (this.eventDto.value) {
			return `${this.eventDto.value.name} - ${this.messages.value('CohortView_Title')}`;
		}
		return `${this.messages.value('CohortView_Title')} Loading...`;
	});
	public readonly cohorts = signal<readonly Cohort[]>([]);
	public readonly cohortDialog = signal<CohortViewDialogVM>();

	public readonly eventService = createSportEventService({ baseUrl: '' });
	public readonly cohortService = createEventCohortService({ baseUrl: '' });

	private readonly cohortServiceList = createRemoteFunction(this.cohortService.list, this.handleListResult.bind(this));

	private readonly eventServiceGet = createRemoteFunction(this.eventService.get, this.handleGetResult.bind(this));

	constructor(messages: ReadonlySignal<AllMessages>) {
		super(messages);
		effect(() => {
			if (this.eventId.value) {
				this.cohortServiceList(this.eventId.value);
				this.eventServiceGet(this.eventId.value);
			}
		});
	}

	private handleListResult(result: Awaited<ReturnType<EventCohortService['list']>>) {
		const [data, err] = result;
		if (data) {
			this.cohorts.value = [...data].sort(cohortSort);
		} else {
			console.error(err);
		}
	}

	private handleGetResult(result: Awaited<ReturnType<SportEventService['get']>>) {
		const [data, err] = result;
		if (data) {
			this.eventDto.value = data;
		} else {
			console.error(err);
		}
	}

	public onOpenNewCohortDialog() {
		this.cohortDialog.value = new CohortViewDialogVM(this);
	}

	public onOpenCohortEditDialog(cohort: Cohort) {
		this.cohortDialog.value = new CohortViewDialogVM(this, cohort);
	}

	public closeDialogs() {
		this.cohortDialog.value = undefined;
	}

	public refreshList() {
		if (this.eventId.value) {
			this.cohortServiceList(this.eventId.value);
		}
	}
}

export class CohortViewDialogVM extends BaseViewVM {
	private readonly parent: CohortViewVM;

	public title: ReadonlySignal<string>;
	public description: ReadonlySignal<string>;

	public cohortType = createSelectFormField<'generic' | 'birthyear'>({
		initialValue: 'generic',
		items: [
			{
				value: 'generic',
				label: this.messages.value('CohortViewDialog_Type_Generic'),
			},
			{
				value: 'birthyear',
				label: this.messages.value('CohortViewDialog_Type_Birthyear'),
			},
		],
		label: this.messages.value('CohortViewDialog_Type'),
		validation: () => '',
	});

	public name = createTextField({
		label: this.messages.value('CohortViewDialog_Name'),
		initialValue: '',
		validation: v => validateRequired(v, this.l10n),
	});
	public gender = createSelectFormField<Gender>({
		initialValue: 'ALL',
		items: [
			{
				value: 'ALL',
				label: this.messages.value('Generic_Male_Female'),
			},
			{
				value: 'FEMALE',
				label: this.messages.value('Generic_Female'),
			},
			{
				value: 'MALE',
				label: this.messages.value('Generic_Male'),
			},
		],
		label: this.messages.value('CohortViewDialog_Gender'),
		validation: () => '',
	});
	public min = createTextField({
		initialValue: '',
		label: this.messages.value('CohortViewDialog_Type_MinYear'),
		validation: this.validateMin.bind(this),
	});
	public max = createTextField({
		initialValue: '',
		label: this.messages.value('CohortViewDialog_Type_MinYear'),
		validation: this.validateMax.bind(this),
	});

	public readonly persistButtonLabel: ReadonlySignal<string>;
	private readonly dto?: Cohort;

	constructor(parent: CohortViewVM, dto?: Cohort) {
		super(parent.messages);
		this.parent = parent;
		this.dto = dto;

		this.title = computed(() =>
			dto ? this.messages.value('CohortViewDialog_UpdateTitle') : this.messages.value('CohortViewDialog_NewTitle')
		);
		this.description = computed(() =>
			dto
				? this.messages.value('CohortViewDialog_UpdateDescription')
				: this.messages.value('CohortViewDialog_NewDescription')
		);
		this.persistButtonLabel = computed(() =>
			dto ? this.messages.value('Generic_Save') : this.messages.value('Generic_Create')
		);

		if (dto) {
			this.cohortType.value = dto['@type'];
			this.name.value = dto.name;
			this.gender.value = dto.gender;
			if (isBirthyearCohort(dto)) {
				this.min.value = String(dto.min);
				this.max.value = String(dto.max);
			}
		}
	}

	private validateMin(v: string) {
		if (this.cohortType.value !== 'birthyear') {
			return '';
		}

		const req = validateRequired(v, this.l10n);
		if (req) {
			return req;
		}
		const vMin = parseFormattedInteger(v);
		if (Number.isNaN(vMin)) {
			return this.l10n('Generic_Number_Invalid');
		} else if (vMin < 0) {
			return this.l10n('Generic_Number_Positive');
		}
		return '';
	}

	private validateMax(v: string) {
		if (this.cohortType.value !== 'birthyear') {
			return '';
		}
		const vMax = parseFormattedInteger(v);
		const vMin = parseFormattedInteger(this.min.value);
		if (Number.isNaN(vMax)) {
			return this.l10n('Generic_Number_Invalid');
		} else if (vMax < 0) {
			return this.l10n('Generic_Number_Positive');
		} else if (!Number.isNaN(vMin) && vMin > vMax) {
			return this.l10n('Generic_Number_LargerEqual', { otherValue: vMin });
		}
		return '';
	}

	public validate(): boolean {
		return batch(() => {
			let valid = this.cohortType.validate();
			valid &&= this.name.validate();
			valid &&= this.gender.validate();
			valid &&= this.min.validate();
			valid &&= this.max.validate();
			return valid;
		});
	}

	public async persist() {
		if (this.validate()) {
			if (this.dto) {
				const min = this.min.value;
				const max = this.max.value;
				const name = this.name.value;
				const gender = this.gender.value;
				const patch: CohortPatch | undefined = isBirthyearCohort(this.dto)
					? createBirthyearPatch(this.dto, {
							...this.dto,
							name,
							min: parseFormattedInteger(min),
							max: parseFormattedInteger(max),
							gender,
					  })
					: createGenericPatch(this.dto, { ...this.dto, name, gender });
				if (patch) {
					const [result, err] = await this.parent.cohortService.update(this.parent.eventId.value, patch.key, patch);
					if (result) {
						this.parent.refreshList();
						this.parent.closeDialogs();
					} else {
						// TODO - Show error!!!
						console.error(err);
					}
				}
			} else {
				const min = this.min.value;
				const max = this.max.value;
				const name = this.name.value;
				const gender = this.gender.value;

				const dto: CohortNew =
					this.cohortType.value === 'birthyear'
						? {
								'@type': 'birthyear',
								name,
								min: parseFormattedInteger(min),
								max: parseFormattedInteger(max),
								gender,
						  }
						: { '@type': 'generic', name, gender };
				const [result, err] = await this.parent.cohortService.create(this.parent.eventId.value, dto);
				if (result) {
					this.parent.refreshList();
					this.parent.closeDialogs();
				} else {
					// TODO - Show error!!!
					console.error(err);
				}
			}
		}
	}

	public close() {
		this.parent.closeDialogs();
	}
}

function createBirthyearPatch(cur: BirthyearCohort, updated: BirthyearCohort): BirthyearCohortPatch | undefined {
	const result: BirthyearCohortPatch = {
		'@type': 'patch:birthyear',
		key: cur.key,
		version: cur.version,
		name: cur.name !== updated.name ? updated.name : undefined,
		min: cur.min !== updated.min ? updated.min : undefined,
		max: cur.max !== updated.max ? updated.max : undefined,
	};

	if (result.min !== undefined || result.max !== undefined || result.name !== undefined) {
		return result;
	}
	return undefined;
}

function createGenericPatch(cur: GenericCohort, update: GenericCohort): GenericCohortPatch | undefined {
	const result: GenericCohortPatch = {
		'@type': 'patch:generic',
		key: cur.key,
		version: cur.version,
		name: cur.name !== update.name ? update.name : undefined,
	};
	if (result.name !== undefined) {
		return result;
	}
	return undefined;
}
