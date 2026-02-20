import { computed, effect, signal, type ReadonlySignal } from '@preact/signals';
import { BaseViewVM } from './BaseViewVM';
import type { AllMessages } from '../../messages';
import {
	createCheckBoxField,
	createRemoteFunction,
	createSelectFormField,
	createTextField,
	emptyAsUndefined,
	validateRequired,
	type CheckBoxFormField,
	type SelectFormField,
} from '../utils/utils';
import {
	isBirthyearCohort,
	type Cohort,
	type Gender,
	type Participant,
	type ParticipantNew,
	type ParticipantPatch,
} from '../../remote/model';
import { createEventCohortService, createEventParticipantService } from '../../remote';
import type { EventParticipantService } from '../../remote/EventParticipantService';
import type { EventCohortService } from '../../remote/EventCohortService';
import { cohortSort, translateGender, type StateInfo } from './utils';

export type ParticipantItem = Readonly<{
	key: string;
	lastname: string;
	firstname: string;
	birthday: string;
	birthyear: string;
	cohortname?: string;
	gender: string;
	time: string;
	dto: Participant;
}>;

function timeMillisToString(time: number): string {
	const hours = Math.floor(time / 3600000);
	const minutes = Math.floor((time % 3600000) / 60000);
	const seconds = Math.floor((time % 60000) / 1000);
	const millis = time % 1000;

	if (millis % 10 === 0) {
		return `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(minutes).padStart(2, '0')}:${String(
			seconds,
		).padStart(2, '0')},${String(Math.floor(millis / 10)).padStart(2, '0')}`;
	}

	return `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(minutes).padStart(2, '0')}:${String(
		seconds,
	).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
}

function stringToTimeMillis(time: string): number | null {
	if (time.trim() === '') {
		return null;
	}

	const timeParts = time.split(':');
	if (timeParts.length === 3) {
		const hours = parseInt(timeParts[0]);
		const minutes = parseInt(timeParts[1]);
		const secondsParts = timeParts[2].split(',');
		if (secondsParts.length === 2) {
			const seconds = parseInt(secondsParts[0]);
			const millis = parseInt(secondsParts[1].padEnd(3, '0'));
			return hours * 3600000 + minutes * 60000 + seconds * 1000 + millis;
		} else {
			const seconds = parseInt(timeParts[2]);
			return hours * 3600000 + minutes * 60000 + seconds * 1000;
		}
	} else if (timeParts.length === 2) {
		const minutes = parseInt(timeParts[0]);
		const secondsParts = timeParts[1].split(',');
		if (secondsParts.length === 2) {
			const seconds = parseInt(secondsParts[0]);
			const millis = parseInt(secondsParts[1].padEnd(3, '0'));
			return minutes * 60000 + seconds * 1000 + millis;
		} else {
			const seconds = parseInt(timeParts[1]);
			return minutes * 60000 + seconds * 1000;
		}
	} else if (timeParts.length === 1) {
		const secondsParts = timeParts[0].split(',');
		if (secondsParts.length === 2) {
			const seconds = parseInt(secondsParts[0]);
			const millis = parseInt(secondsParts[1].padEnd(3, '0'));
			return seconds * 1000 + millis;
		} else {
			const seconds = parseInt(timeParts[0]);
			return seconds * 1000;
		}
	} else {
		return parseInt(time.padEnd(3, '0'));
	}
}

export class ParticipantViewVM extends BaseViewVM {
	public readonly participantDialog = signal<ParticipantViewDialogVM | undefined>();

	public readonly participants = signal<readonly Participant[]>();
	public readonly cohorts = signal<readonly Cohort[]>();
	public readonly participantItems: ReadonlySignal<readonly ParticipantItem[]>;

	public readonly participantService = createEventParticipantService({ baseUrl: '' });
	public readonly cohortService = createEventCohortService({ baseUrl: '' });

	private readonly participantServiceList = createRemoteFunction(
		this.participantService.list,
		this.handleParticipantListResult.bind(this),
	);

	private readonly cohortServiceList = createRemoteFunction(
		this.cohortService.list,
		this.handleCohortListResult.bind(this),
	);

	public readonly eventId: ReadonlySignal<string>;
	public readonly stateInfo = signal<StateInfo>();
	public readonly askDeleteDialogOpen = signal('');

	constructor(messages: ReadonlySignal<AllMessages>, eventId: ReadonlySignal<string>, locale: ReadonlySignal<string>) {
		super(messages);
		this.eventId = eventId;
		const dateFormatter = computed(() => {
			return new Intl.DateTimeFormat(locale.value, { day: '2-digit', month: '2-digit', year: 'numeric' });
		});
		effect(() => {
			if (eventId.value) {
				this.cohortServiceList(eventId.value);
				this.participantServiceList(eventId.value);
			}
		});
		this.participantItems = computed(() => {
			if (this.cohorts.value !== undefined && this.participants.value !== undefined) {
				const cohortsMap = new Map<string, Cohort>(this.cohorts.value.map(c => [c.key, c]));
				return this.participants.value.map(p => {
					return {
						key: p.key,
						firstname: p.firstname,
						lastname: p.lastname,
						gender: translateGender(p.gender, this.messages.value, 'Generic_NoData'),
						birthday: p.birthday ? dateFormatter.value.format(new Date(p.birthday)) : '',
						birthyear: p.birthday ? p.birthday.split('-')[0] : '',
						cohortname: p.cohortKey ? cohortsMap.get(p.cohortKey)?.name : undefined,
						time: p.time ? timeMillisToString(p.time) : '',
						dto: p,
					};
				});
			}
			return [];
		});
	}

	private handleParticipantListResult(result: Awaited<ReturnType<EventParticipantService['list']>>) {
		const [data, err] = result;
		if (data) {
			this.participants.value = data;
		} else {
			console.error(err);
		}
	}

	private handleCohortListResult(result: Awaited<ReturnType<EventCohortService['list']>>) {
		const [data, err] = result;
		if (data) {
			this.cohorts.value = [...data].sort(cohortSort);
		} else {
			console.error(err);
		}
	}

	public openNewParticipantDialog() {
		this.participantDialog.value = new ParticipantViewDialogVM(this.messages, this.cohorts.value ?? [], this);
	}

	public openEditParticipantDialog(item: ParticipantItem) {
		this.participantDialog.value = new ParticipantViewDialogVM(this.messages, this.cohorts.value ?? [], this, item.dto);
	}

	public closeDialogs() {
		this.participantDialog.value = undefined;
	}

	public refreshParticipants() {
		this.participantServiceList(this.eventId.value);
	}

	public async deleteParticipant(participantKey: string, deleteConfirmed: boolean) {
		if (!deleteConfirmed) {
			this.askDeleteDialogOpen.value = participantKey;
			return;
		}
		this.askDeleteDialogOpen.value = '';
		const [, error] = await this.participantService.delete(this.eventId.value, participantKey);
		if (error) {
			this.stateInfo.value = { type: 'error', message: this.l10n('ParticipantView_Delete_Error') };
		} else {
			const state = { type: 'success', message: this.l10n('ParticipantView_Delete_Success') } as const;
			setTimeout(() => {
				if (this.stateInfo.value === state) {
					this.stateInfo.value = undefined;
				}
			}, 5000);
			this.stateInfo.value = state;
			this.refreshParticipants();
		}
	}

	public clearStateInfo() {
		this.stateInfo.value = undefined;
	}

	public async downloadCSV() {
		const [result, error] = await this.participantService.downloadCsv(this.eventId.value);
		if (error) {
			this.stateInfo.value = { type: 'error', message: this.l10n('ParticipantView_Download_Error') };
		} else {
			const url = window.URL.createObjectURL(new Blob([result], { type: 'text/csv;charset=utf-8;' }));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', result.name ?? 'participants.csv');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
}

export class ParticipantViewDialogVM extends BaseViewVM {
	public readonly firstname = createTextField({
		label: this.l10n('ParticipantDialog_Firstname'),
		initialValue: '',
		validation: v => validateRequired(v, this.l10n.bind(this)),
	});

	public readonly lastname = createTextField({
		label: this.l10n('ParticipantDialog_Lastname'),
		initialValue: '',
		validation: v => validateRequired(v, this.l10n.bind(this)),
	});

	public gender = createSelectFormField<Gender>({
		initialValue: 'ALL',
		items: [
			{
				value: 'ALL',
				label: this.messages.value('Generic_NoData'),
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
		label: this.messages.value('ParticipantDialog_Gender'),
		validation: () => '',
	});

	public readonly birthday = createTextField({
		label: this.l10n('ParticipantDialog_Birthday'),
		initialValue: '',
		validation: () => '',
	});

	public readonly cohortAutoAssign: CheckBoxFormField;
	public readonly cohort: SelectFormField<Cohort | null>;
	public readonly team = createTextField({
		label: this.l10n('ParticipantDialog_Team'),
		initialValue: '',
		validation: () => '',
	});
	public readonly association = createTextField({
		label: this.l10n('ParticipantDialog_Association'),
		initialValue: '',
		validation: () => '',
	});
	public readonly publishName = createCheckBoxField({
		initialValue: true,
		label: this.l10n('ParticipantDialog_PublishName'),
		validation: () => '',
	});
	public readonly time = createTextField({
		label: this.l10n('ParticipantDialog_Time'),
		initialValue: '',
		validation: () => '',
	});

	public readonly title: string;
	public readonly description: string;
	public readonly persistButtonLabel: string;
	public readonly stateInfo = signal<StateInfo>();

	private readonly parent: ParticipantViewVM;
	private readonly dto?: Participant;

	constructor(
		messages: ReadonlySignal<AllMessages>,
		cohorts: readonly Cohort[],
		parent: ParticipantViewVM,
		dto?: Participant,
	) {
		super(messages);
		this.parent = parent;
		this.dto = dto;
		this.title =
			dto === undefined ? this.l10n('ParticipantDialog_NewTitle') : this.l10n('ParticipantDialog_UpdateTitle');
		this.description =
			dto === undefined
				? this.l10n('ParticipantDialog_NewDescription')
				: this.l10n('ParticipantDialog_UpdateDescription');
		this.persistButtonLabel = dto === undefined ? this.l10n('Generic_Create') : this.l10n('Generic_Save');

		const items = computed(() => {
			const items = cohorts.map(value => ({ value, label: computeCohortLabel(value), key: value.key }));
			return [
				{
					value: null,
					key: 'none',
					label: '-',
				},
				...items,
			];
		});

		this.cohortAutoAssign = createCheckBoxField({
			initialValue: true,
			label: this.l10n('ParticipantDialog_AutoCohort'),
			validation: () => '',
		});

		this.cohort = createSelectFormField<Cohort | null>({
			initialValue: null,
			items,
			label: this.l10n('ParticipantDialog_Cohort'),
			validation: () => '',
			disabled: this.cohortAutoAssign.$value,
		});

		if (dto) {
			this.lastname.value = dto.lastname;
			this.firstname.value = dto.firstname;
			this.gender.value = dto.gender;
			this.birthday.value = dto.birthday ?? '';
			this.cohort.value = cohorts.find(c => c.key === dto.cohortKey) ?? null;
			this.team.value = dto.team ?? '';
			this.association.value = dto.association ?? '';
			this.publishName.value = dto.publishName;
			this.time.value = dto.time ? timeMillisToString(dto.time) : '';
		}
	}

	public close() {
		this.parent.closeDialogs();
	}

	public validate(): boolean {
		let result = this.lastname.validate();
		result = this.firstname.validate() && result;
		result = this.gender.validate() && result;
		result = this.birthday.validate() && result;
		result = this.cohort.validate() && result;
		result = this.cohortAutoAssign.validate() && result;
		result = this.team.validate() && result;
		result = this.association.validate() && result;
		return result;
	}

	public async persist() {
		if (this.validate()) {
			if (this.dto === undefined) {
				const participant: ParticipantNew = {
					firstname: this.firstname.value,
					gender: this.gender.value,
					lastname: this.lastname.value,
					association: emptyAsUndefined(this.association.value),
					birthday: emptyAsUndefined(this.birthday.value),
					cohortKey: this.cohort.value === null || this.cohortAutoAssign.value ? undefined : this.cohort.value.key,
					team: emptyAsUndefined(this.team.value),
					publishName: this.publishName.value,
				};
				const [, err] = await this.parent.participantService.create(
					this.parent.eventId.value,
					participant,
					this.cohortAutoAssign.value ? true : undefined,
				);
				if (err) {
					console.error(err);
				} else {
					this.parent.refreshParticipants();
					this.parent.closeDialogs();
				}
			} else {
				const updated: Participant = {
					key: this.dto.key,
					version: this.dto.version,
					firstname: this.firstname.value,
					gender: this.gender.value,
					lastname: this.lastname.value,
					association: emptyAsUndefined(this.association.value),
					birthday: emptyAsUndefined(this.birthday.value),
					cohortKey: this.cohort.value === null ? undefined : this.cohort.value.key,
					team: emptyAsUndefined(this.team.value),
					teamMates: [],
					publishName: this.publishName.value,
					time: stringToTimeMillis(this.time.value) ?? undefined,
				};
				const patch = createParticipantPatch(this.dto, updated);
				if (patch) {
					const [, err] = await this.parent.participantService.update(
						this.parent.eventId.value,
						patch.key,
						this.cohortAutoAssign.value ? { ...patch, cohortKey: undefined } : patch,
						this.cohortAutoAssign.value && (patch.birthday !== undefined || patch.gender !== undefined),
					);

					if (err) {
						this.stateInfo.value = {
							type: 'error',
							message: this.l10n('ParticipantDialog_Update_Error'),
						};
						console.error(err);
					} else {
						const state = {
							type: 'success',
							message: this.l10n('Generic_Success_Saved'),
						} as const;
						setTimeout(() => {
							if (this.parent.stateInfo.value === state) {
								this.parent.stateInfo.value = undefined;
							}
						}, 5000);
						this.parent.stateInfo.value = state;
						this.parent.refreshParticipants();
						this.parent.closeDialogs();
					}
				} else {
					this.parent.closeDialogs();
				}
			}
		}
	}

	clearStateInfo() {
		this.stateInfo.value = undefined;
	}
}

function createParticipantPatch(cur: Participant, updated: Participant): ParticipantPatch | undefined {
	const patch: ParticipantPatch = {
		key: cur.key,
		version: cur.version,
		association: patchValueOrNull(cur, updated, 'association'),
		birthday: patchValueOrNull(cur, updated, 'birthday'),
		cohortKey: patchValueOrNull(cur, updated, 'cohortKey'),
		firstname: cur.firstname !== updated.firstname ? updated.firstname : undefined,
		gender: cur.gender !== updated.gender ? updated.gender : undefined,
		lastname: cur.lastname !== updated.lastname ? updated.lastname : undefined,
		team: patchValueOrNull(cur, updated, 'team'),
		publishName: cur.publishName !== updated.publishName ? updated.publishName : undefined,
		time: patchValueOrNull(cur, updated, 'time'),
	};
	if (
		Object.entries(patch)
			.filter(e => e[0] !== 'key' && e[0] !== 'version')
			.find(e => e[1] !== undefined)
	) {
		return patch;
	}
	return undefined;
}

function patchValueOrNull<P extends keyof Participant>(
	cur: Participant,
	updated: Participant,
	prop: P,
): Participant[P] | undefined | null {
	if (cur[prop] === updated[prop]) {
		return undefined;
	}
	if (updated[prop] === undefined) {
		return null;
	}
	return updated[prop];
}

function computeCohortLabel(c: Cohort) {
	const type = isBirthyearCohort(c) ? `Jahrgänge ${c.min}-${c.max}` : 'Generisch';
	return `${c.name} - ${type}`;
}
