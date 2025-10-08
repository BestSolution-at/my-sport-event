import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useLoadRemoteData } from '../useLoadRemoteData';
import { createEventCohortService } from '../remote';
import { ViewHeader } from './utils/ViewHeader';
import { messages } from '../messages';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/table';
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
} from '../remote/model';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '../components/dropdown';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import { Button } from '../components/button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '../components/dialog';
import { ErrorMessage, Field, FieldGroup, Label } from '../components/fieldset';
import { Listbox, ListboxLabel, ListboxOption } from '../components/listbox';
import { Input } from '../components/input';
import { compare, compareProps, parseFormattedInteger } from './utils/utils';
import { useMessageFormat } from '../useMessageFormat';

const service = createEventCohortService({ baseUrl: '' });

export function CohortView() {
	const params = useParams();
	const [refreshCounter, setRefreshCounter] = useState(0);
	const [edit, setEdit] = useState<Cohort | undefined>();

	const eventId = params['eventId'] as string;

	const [result, isLoading] = useLoadRemoteData(
		useMemo(() => {
			return { key: `get-${refreshCounter}`, block: service.list.bind(service), parameters: [eventId] } as const;
		}, [eventId, refreshCounter])
	);

	if (isLoading) {
		return <div>Loading data ...</div>;
	}

	const [data, err] = result;

	if (err) {
		return <div>FAIL: ${err.message}</div>;
	}

	const onNewCohort = () => {
		setRefreshCounter(v => v + 1);
	};

	const onClose = (v: 'OK' | 'CANCEL') => {
		if (v === 'OK') {
			setRefreshCounter(c => c + 1);
		}
		setEdit(undefined);
	};

	return (
		<div className="mx-auto mx-w6xl">
			{edit !== undefined && <CohortDialog open={edit !== undefined} eventId={eventId} onClose={onClose} dto={edit} />}
			<Head onNewCohort={onNewCohort} eventId={eventId} />
			<Table striped className="mt-12 [--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]">
				<TableHead>
					<TableRow>
						<TableHeader>Name</TableHeader>
						<TableHeader>Typ</TableHeader>
						<TableHeader>Geschlecht</TableHeader>
						{/*<TableHeader>Teilnehmer</TableHeader>*/}
						<TableHeader className="relative w-0">
							<span className="sr-only">Actions</span>
						</TableHeader>
					</TableRow>
				</TableHead>
				<TableBody>
					{[...data].sort(sort).map(e => {
						return (
							<TableRow key={e.key}>
								<TableCell>{e.name}</TableCell>
								<TableCell>{isBirthyearCohort(e) ? `Jahrgänge ${e.min}-${e.max}` : 'Generisch'}</TableCell>
								<TableCell>{genderToString(e.gender)}</TableCell>
								<TableCell>
									<div className="-my-1.5">
										<Dropdown>
											<DropdownButton plain aria-label="More options">
												<EllipsisHorizontalIcon />
											</DropdownButton>
											<DropdownMenu anchor="bottom end">
												<DropdownItem onClick={() => setEdit(e)}>Bearbeiten</DropdownItem>
												<DropdownItem>Löschen</DropdownItem>
											</DropdownMenu>
										</Dropdown>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}

function Head(props: { onNewCohort: () => void; eventId: string }) {
	const m = useMessageFormat(messages);
	const [dialogOpen, setDialogOpen] = useState(false);
	const onClose = (status: 'OK' | 'CANCEL') => {
		if (status === 'OK') {
			props.onNewCohort();
		}
		setDialogOpen(false);
	};

	return (
		<>
			<ViewHeader title={m('CohortView_Title')}>
				<Button onClick={() => setDialogOpen(true)}>Neue Klasse</Button>
			</ViewHeader>
			{dialogOpen && <CohortDialog open onClose={onClose} eventId={props.eventId} />}
		</>
	);
}

function CohortDialog(props: {
	open: boolean;
	onClose: (status: 'OK' | 'CANCEL') => void;
	dto?: Cohort;
	eventId: string;
}) {
	const m = useMessageFormat(messages);

	const [type, setType] = useState<'birthyear' | 'generic'>(isBirthyearCohort(props.dto) ? 'birthyear' : 'generic');

	const [name, setName] = useState(props.dto?.name ?? '');
	const [nameError, setNameError] = useState('');

	const [min, setMin] = useState(isBirthyearCohort(props.dto) ? props.dto.min.toFixed() : '');
	const [minError, setMinError] = useState('');

	const [max, setMax] = useState(isBirthyearCohort(props.dto) ? props.dto.max.toFixed() : '');
	const [maxError, setMaxError] = useState('');

	const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'ALL'>(props.dto?.gender ?? 'ALL');

	const validateName = () => {
		if (name.trim().length === 0) {
			setNameError(m('Generic_Required_Field'));
		} else {
			setNameError('');
		}
	};

	const validateMin = () => {
		if (type === 'birthyear') {
			if (min.trim().length === 0) {
				setMinError(m('Generic_Required_Field'));
			} else {
				const vMin = parseFormattedInteger(min);
				if (Number.isNaN(vMin)) {
					setMinError(m('Generic_Number_Invalid'));
				} else if (vMin < 0) {
					setMinError(m('Generic_Number_Positive'));
				} else {
					setMinError('');
				}
			}
		} else {
			setMinError('');
		}
	};

	const validateMax = () => {
		if (type === 'birthyear') {
			if (max.trim().length === 0) {
				setMaxError(m('Generic_Required_Field'));
			} else {
				const vMax = parseFormattedInteger(max);
				const vMin = parseFormattedInteger(min);
				if (Number.isNaN(vMax)) {
					setMaxError(m('Generic_Number_Invalid'));
				} else if (vMax < 0) {
					setMaxError(m('Generic_Number_Positive'));
				} else if (!Number.isNaN(vMin) && vMin > vMax) {
					setMaxError(m('Generic_Number_LargerEqual', { otherValue: vMin }));
				} else {
					setMaxError('');
				}
			}
		} else {
			setMaxError('');
		}
	};

	const createCohort = async () => {
		validateName();
		validateMin();
		validateMax();

		if (props.dto) {
			const patch: CohortPatch | undefined = isBirthyearCohort(props.dto)
				? createBirthyearPatch(props.dto, {
						...props.dto,
						name,
						min: parseFormattedInteger(min),
						max: parseFormattedInteger(max),
				  })
				: createGenericPatch(props.dto, { ...props.dto, name });
			if (patch) {
				const [result, err] = await service.update(props.eventId, patch.key, patch);

				if (result) {
					props.onClose('OK');
				} else {
					console.error(err);
				}
			} else {
				console.info('No changes detected - no need to persist');
				props.onClose('CANCEL');
			}
		} else {
			const dto: CohortNew =
				type === 'birthyear'
					? {
							'@type': 'birthyear',
							name,
							min: parseFormattedInteger(min),
							max: parseFormattedInteger(max),
							gender,
					  }
					: { '@type': 'generic', name, gender };
			const [result, err] = await service.create(props.eventId, dto);
			if (result) {
				props.onClose('OK');
			} else {
				console.error(err);
			}
		}
	};

	return (
		<Dialog open={props.open} onClose={() => {}}>
			<DialogTitle>{props.dto === undefined ? 'Neue Klasse anlegen' : 'Klasse bearbeiten'}</DialogTitle>
			<DialogDescription>
				{props.dto === undefined
					? "Leg' eine neue Klasse an in die Teilnehmer eingeordnet werden können"
					: 'Bearbeite die Klassendaten'}
			</DialogDescription>
			<DialogBody>
				<FieldGroup>
					<Field>
						<Label>Klassentyp</Label>
						<Listbox value={type} onChange={setType} disabled={props.dto !== undefined} autoFocus>
							<ListboxOption value="generic">
								<ListboxLabel>Generisch</ListboxLabel>
							</ListboxOption>
							<ListboxOption value="birthyear">
								<ListboxLabel>Geburtsjahrgänge</ListboxLabel>
							</ListboxOption>
						</Listbox>
					</Field>
					<Field>
						<Label>Name</Label>
						<Input
							required
							value={name}
							onChange={e => {
								setName(e.target.value);
							}}
							invalid={nameError.length > 0}
						/>
						{nameError && <ErrorMessage>{nameError}</ErrorMessage>}
					</Field>
					<Field>
						<Label>Geschlecht</Label>
						<Listbox value={gender} onChange={setGender}>
							<ListboxOption value="ALL">
								<ListboxLabel>Männlich &amp; Weiblich</ListboxLabel>
							</ListboxOption>
							<ListboxOption value="FEMALE">
								<ListboxLabel>Weiblich</ListboxLabel>
							</ListboxOption>
							<ListboxOption value="MALE">
								<ListboxLabel>Männlich</ListboxLabel>
							</ListboxOption>
						</Listbox>
					</Field>
					{type === 'birthyear' && (
						<div className="flex gap-4">
							<Field>
								<Label>Ab Jahrgang</Label>
								<Input
									required
									value={min}
									onChange={e => {
										setMin(e.target.value);
									}}
									invalid={minError.length > 0}
								/>
								{minError && <ErrorMessage>{minError}</ErrorMessage>}
							</Field>
							<Field>
								<Label>Bis Jahrgang</Label>
								<Input
									required
									value={max}
									onChange={e => {
										setMax(e.target.value);
									}}
									invalid={maxError.length > 0}
								/>
								{maxError && <ErrorMessage>{maxError}</ErrorMessage>}
							</Field>
						</div>
					)}
				</FieldGroup>
			</DialogBody>
			<DialogActions>
				<Button plain onClick={() => props.onClose('CANCEL')}>
					Abbrechen
				</Button>
				<Button onClick={createCohort}>{props.dto ? 'Speichern' : 'Anlegen'}</Button>
			</DialogActions>
		</Dialog>
	);
}

function genderToString(gender: Gender) {
	if (gender === 'ALL') {
		return 'Männlich & Weiblich';
	} else if (gender === 'FEMALE') {
		return 'Weiblich';
	}
	return 'Männlich';
}

function sort(a: Cohort, b: Cohort) {
	const typeA = isBirthyearCohort(a) ? 0 : 1;
	const typeB = isBirthyearCohort(b) ? 0 : 1;
	const typeSort = compare(typeA, typeB);
	if (typeSort !== 0) {
		return typeSort;
	}
	if (isBirthyearCohort(a) && isBirthyearCohort(b)) {
		return compareProps(a, b, ['min', 'max', 'name', 'key']);
	}
	return compareProps(a, b, ['name', 'key']);
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
