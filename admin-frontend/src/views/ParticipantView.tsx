import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

import { Button } from '../components/button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '../components/dialog';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '../components/dropdown';
import { FieldGroup } from '../components/fieldset';
import { messages } from '../messages';
import { useLocaleSignal, useMessageFormat, useMessageFormatSignal } from '../useMessageFormat';
import { CheckBoxFormField } from './utils/CheckBoxFormField';
import { SelectFormField } from './utils/SelectFormField';
import { TextFormField } from './utils/TextFormField';
import { isString, useParamSignal, useSignal, useSignalValue, useValue, useVM } from './utils/utils';
import { ViewHeader } from './utils/ViewHeader';
import { ParticipantViewDialogVM, ParticipantViewVM, type ParticipantItem } from './vm/ParticipantViewVM';
import { Listbox, ListboxLabel, ListboxOption } from '../components/listbox';
import type { Cohort } from '../remote/model';
import { Card } from './utils/Card';
import { useMemo, useState, type MouseEvent } from 'react';

export function ParticipantView() {
	const eventId = useParamSignal('eventId', '', isString);
	const locale = useLocaleSignal();
	const m = useMessageFormatSignal(messages);
	const vm = useVM(() => new ParticipantViewVM(m, eventId, locale));
	const grouping = useValue(vm.grouping);

	return (
		<div className="mx-auto mx-w6xl">
			<ParticipantDialogContainer vm={vm} />
			<ParticipantHeader vm={vm} />
			<Grouping vm={vm} />
			<div className="px-2">
				{grouping === 'none' && <NameView vm={vm} />}
				{grouping === 'gender' && <GenderView vm={vm} />}
				{grouping === 'cohort' && <CohortView vm={vm} />}
			</div>
		</div>
	);
}

function ParticipantHeader(props: { vm: ParticipantViewVM }) {
	return (
		<ViewHeader title="Teilnehmer">
			<Button onClick={() => props.vm.openNewParticipantDialog()}>Neuer Teilnehmer</Button>
		</ViewHeader>
	);
}

function Grouping(props: { vm: ParticipantViewVM }) {
	const [value, setValue] = useSignal(props.vm.grouping);
	const m = useMessageFormat(messages);

	return (
		<div className="flex items-end mt-12">
			<Listbox
				aria-label={m('ParticipantView_Grouping')}
				value={value}
				onChange={setValue}
				className="max-w-xs ml-auto"
			>
				<ListboxOption value="none">
					<ListboxLabel>Keine</ListboxLabel>
				</ListboxOption>
				<ListboxOption value="gender">
					<ListboxLabel>Geschlecht</ListboxLabel>
				</ListboxOption>
				<ListboxOption value="cohort">
					<ListboxLabel>Klasse</ListboxLabel>
				</ListboxOption>
			</Listbox>
		</div>
	);
}

function ParticipantDialogContainer(props: { vm: ParticipantViewVM }) {
	const dialog = useValue(props.vm.participantDialog);
	return <>{dialog && <ParticipantDialog vm={dialog} />}</>;
}

function ParticipantDialog(props: { vm: ParticipantViewDialogVM }) {
	const m = useMessageFormat(messages);

	const title = useValue(props.vm.title);
	const description = useValue(props.vm.description);
	const persistButtonLabel = useValue(props.vm.persistButtonLabel);

	const close = props.vm.close.bind(props.vm);

	return (
		<Dialog open onClose={() => {}} size="2xl">
			<DialogTitle>{title}</DialogTitle>
			<DialogDescription>{description}</DialogDescription>
			<DialogBody>
				<FieldGroup>
					<div className="flex gap-4 flex-wrap">
						<TextFormField className="basis-32 flex-grow" vm={props.vm.lastname} />
						<TextFormField className="basis-32 flex-grow" vm={props.vm.firstname} />
					</div>
					<div className="flex gap-4 flex-wrap">
						<SelectFormField className="basis-64 flex-grow" vm={props.vm.gender} />
						<TextFormField className="basis-64  flex-grow" type="date" vm={props.vm.birthday} />
					</div>
					<div className="flex gap-4 items-end flex-wrap">
						<SelectFormField className="basis-64 flex-grow" vm={props.vm.cohort} />
						<CheckBoxFormField className="basis-64 flex-grow" vm={props.vm.cohortAutoAssign} />
					</div>
					<div className="flex gap-4 flex-wrap">
						<TextFormField className="basis-64 flex-grow" vm={props.vm.team} />
						<TextFormField className="basis-64 flex-grow" vm={props.vm.association} />
					</div>
				</FieldGroup>
			</DialogBody>
			<DialogActions>
				<Button plain onClick={close}>
					{m('Generic_Cancel')}
				</Button>
				<Button onClick={() => props.vm.persist()}>{persistButtonLabel}</Button>
			</DialogActions>
		</Dialog>
	);
}

function NameView(props: { vm: ParticipantViewVM }) {
	const m = useMessageFormat(messages);
	const list = useValue(props.vm.participantItems);
	const [sortColumn, setSortColumn] = useState<keyof ParticipantItem>('lastname');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

	const sortedList = useMemo(
		() => sortParticipants(list, sortDirection, sortColumn),
		[list, sortColumn, sortDirection]
	);

	const onClick = (evt: MouseEvent, type: keyof ParticipantItem) => {
		evt.preventDefault();
		if (sortColumn === type) {
			setSortDirection(cur => (cur === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortDirection('asc');
			setSortColumn(type);
		}

		return false;
	};

	return (
		<div className="overflow-x-auto">
			<table className="mt-8 relative min-w-full divide-y divide-gray-300">
				<thead>
					<tr>
						<th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
							<a href="#" className="group inline-flex" onClick={evt => onClick(evt, 'lastname')}>
								{m('ParticipantView_Lastname')}
								<span
									className={
										sortColumn === 'lastname'
											? 'ml-2 flex-none rounded-sm bg-gray-100 text-gray-900 group-hover:bg-gray-200'
											: 'invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible'
									}
								>
									{sortColumn !== 'lastname' || sortDirection === 'asc' ? (
										<ChevronDownIcon aria-hidden="true" className="size-5" />
									) : (
										<ChevronUpIcon aria-hidden="true" className="size-5" />
									)}
								</span>
							</a>
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							{m('ParticipantView_Firstname')}
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							<a href="#" className="group inline-flex" onClick={evt => onClick(evt, 'birthday')}>
								Jahrgang
								<span
									className={
										sortColumn === 'birthday'
											? 'ml-2 flex-none rounded-sm bg-gray-100 text-gray-900 group-hover:bg-gray-200'
											: 'invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible'
									}
								>
									{sortColumn !== 'birthday' || sortDirection === 'asc' ? (
										<ChevronDownIcon aria-hidden="true" className="size-5" />
									) : (
										<ChevronUpIcon aria-hidden="true" className="size-5" />
									)}
								</span>
							</a>
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							<a href="#" className="group inline-flex" onClick={evt => onClick(evt, 'gender')}>
								{m('ParticipantView_Gender')}
								<span
									className={
										sortColumn === 'gender'
											? 'ml-2 flex-none rounded-sm bg-gray-100 text-gray-900 group-hover:bg-gray-200'
											: 'invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible'
									}
								>
									{sortColumn !== 'gender' || sortDirection === 'asc' ? (
										<ChevronDownIcon aria-hidden="true" className="size-5" />
									) : (
										<ChevronUpIcon aria-hidden="true" className="size-5" />
									)}
								</span>
							</a>
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							<a href="#" className="group inline-flex" onClick={evt => onClick(evt, 'cohortname')}>
								{m('ParticipantView_Cohort')}
								<span
									className={
										sortColumn === 'cohortname'
											? 'ml-2 flex-none rounded-sm bg-gray-100 text-gray-900 group-hover:bg-gray-200'
											: 'invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible'
									}
								>
									{sortColumn !== 'cohortname' || sortDirection === 'asc' ? (
										<ChevronDownIcon aria-hidden="true" className="size-5" />
									) : (
										<ChevronUpIcon aria-hidden="true" className="size-5" />
									)}
								</span>
							</a>
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							{m('ParticipantView_Time')}
						</th>
						<th scope="col" className="py-3.5 pr-0 pl-3">
							<span className="sr-only">Edit</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{sortedList.map(p => (
						<tr key={p.key}>
							<td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
								{p.lastname}
							</td>
							<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{p.firstname}</td>
							<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{p.birthyear}</td>
							<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{p.gender}</td>
							<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{p.cohortname}</td>
							<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">0:00.00</td>
							<td className="py-4 pr-4 pl-3 text-right text-sm whitespace-nowrap sm:pr-0">
								<Dropdown>
									<DropdownButton plain aria-label="More options">
										<EllipsisHorizontalIcon />
									</DropdownButton>
									<DropdownMenu anchor="bottom end">
										<DropdownItem onClick={() => props.vm.openEditParticipantDialog(p)}>
											{m('Generic_Edit')}
										</DropdownItem>
										<DropdownItem>{m('Generic_Delete')}</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function CohortView(props: { vm: ParticipantViewVM }) {
	const cohorts = useSignalValue(props.vm.cohorts) ?? [];
	const participantItems = useSignalValue(props.vm.participantItems);
	return (
		<>
			{participantItems.find(p => p.dto.cohortKey === undefined) && <CohortSection vm={props.vm} cohort={undefined} />}
			{cohorts?.map(c => (
				<CohortSection vm={props.vm} cohort={c} />
			))}
		</>
	);
}

function CohortSection(props: { vm: ParticipantViewVM; cohort: Cohort | undefined }) {
	const m = useMessageFormat(messages);
	const cohortKey = props.cohort?.key;
	const allItems = useSignalValue(props.vm.participantItems);
	const items = useMemo(() => allItems.filter(p => p.dto.cohortKey === cohortKey), [allItems, cohortKey]);

	const [sortColumn, setSortColumn] = useState<keyof ParticipantItem>('lastname');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

	const sortedList = useMemo(
		() => sortParticipants(items, sortDirection, sortColumn),
		[items, sortColumn, sortDirection]
	);

	const onClick = (evt: MouseEvent, type: keyof ParticipantItem) => {
		evt.preventDefault();
		if (sortColumn === type) {
			setSortDirection(cur => (cur === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortDirection('asc');
			setSortColumn(type);
		}

		return false;
	};

	if (items.length === 0) {
		return (
			<Card
				label={props.cohort?.name ?? m('ParticipantView_NotAssign')}
				emptyText={m('ParticipantView_NoParticipants')}
			></Card>
		);
	}
	return (
		<Card label={props.cohort?.name ?? m('ParticipantView_NotAssign')}>
			<table className="relative min-w-full divide-y divide-gray-300">
				<thead className="bg-zinc-50">
					<tr>
						<th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
							<a href="#" className="group inline-flex" onClick={evt => onClick(evt, 'lastname')}>
								Nachname
								<span
									className={
										sortColumn === 'lastname'
											? 'ml-2 flex-none rounded-sm bg-gray-100 text-gray-900 group-hover:bg-gray-200'
											: 'invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible'
									}
								>
									{sortColumn !== 'lastname' || sortDirection === 'asc' ? (
										<ChevronDownIcon aria-hidden="true" className="size-5" />
									) : (
										<ChevronUpIcon aria-hidden="true" className="size-5" />
									)}
								</span>
							</a>
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							Vorname
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							<a href="#" className="group inline-flex" onClick={evt => onClick(evt, 'birthday')}>
								Jahrgang
								<span
									className={
										sortColumn === 'birthday'
											? 'ml-2 flex-none rounded-sm bg-gray-100 text-gray-900 group-hover:bg-gray-200'
											: 'invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible'
									}
								>
									{sortColumn !== 'birthday' || sortDirection === 'asc' ? (
										<ChevronDownIcon aria-hidden="true" className="size-5" />
									) : (
										<ChevronUpIcon aria-hidden="true" className="size-5" />
									)}
								</span>
							</a>
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							Zeit
						</th>
						<th scope="col" className="py-3.5 pr-4 pl-3 sm:pr-6">
							<span className="sr-only">Actions</span>
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200 bg-white">
					{sortedList.map(p => (
						<tr key={p.key}>
							<td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
								{p.lastname}
							</td>
							<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{p.firstname}</td>
							<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{p.birthyear}</td>
							<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">0:00.00</td>
							<td className="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
								<Dropdown>
									<DropdownButton plain aria-label="More options">
										<EllipsisHorizontalIcon />
									</DropdownButton>
									<DropdownMenu anchor="bottom end">
										<DropdownItem onClick={() => props.vm.openEditParticipantDialog(p)}>
											{m('Generic_Edit')}
										</DropdownItem>
										<DropdownItem>{m('Generic_Delete')}</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Card>
	);
}

function GenderView(props: { vm: ParticipantViewVM }) {
	const m = useMessageFormat(messages);
	const items = useSignalValue(props.vm.participantItems);
	const male = items.filter(p => p.dto.gender === 'MALE');
	const female = items.filter(p => p.dto.gender === 'FEMALE');
	const none = items.filter(p => p.dto.gender === 'ALL');
	return (
		<>
			{male.length > 0 && <GenderSection vm={props.vm} items={male} label={m('Generic_Male')} />}
			{female.length > 0 && <GenderSection vm={props.vm} items={female} label={m('Generic_Female')} />}
			{none.length > 0 && <GenderSection vm={props.vm} items={female} label={m('Generic_NoData')} />}
		</>
	);
}

function GenderSection(props: { vm: ParticipantViewVM; label: string; items: readonly ParticipantItem[] }) {
	const m = useMessageFormat(messages);
	const [sortColumn, setSortColumn] = useState<keyof ParticipantItem>('lastname');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

	const sortedList = useMemo(
		() => sortParticipants(props.items, sortDirection, sortColumn),
		[props.items, sortColumn, sortDirection]
	);

	const onClick = (evt: MouseEvent, type: keyof ParticipantItem) => {
		evt.preventDefault();
		if (sortColumn === type) {
			setSortDirection(cur => (cur === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortDirection('asc');
			setSortColumn(type);
		}

		return false;
	};

	return (
		<Card label={props.label}>
			<table className="relative min-w-full divide-y divide-gray-300">
				<thead className="bg-zinc-50">
					<tr>
						<th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
							<a href="#" className="group inline-flex" onClick={evt => onClick(evt, 'lastname')}>
								Nachname
								<span
									className={
										sortColumn === 'lastname'
											? 'ml-2 flex-none rounded-sm bg-gray-100 text-gray-900 group-hover:bg-gray-200'
											: 'invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible'
									}
								>
									{sortColumn !== 'lastname' || sortDirection === 'asc' ? (
										<ChevronDownIcon aria-hidden="true" className="size-5" />
									) : (
										<ChevronUpIcon aria-hidden="true" className="size-5" />
									)}
								</span>
							</a>
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							Vorname
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							<a href="#" className="group inline-flex" onClick={evt => onClick(evt, 'birthday')}>
								Jahrgang
								<span
									className={
										sortColumn === 'birthday'
											? 'ml-2 flex-none rounded-sm bg-gray-100 text-gray-900 group-hover:bg-gray-200'
											: 'invisible ml-2 flex-none rounded-sm text-gray-400 group-hover:visible group-focus:visible'
									}
								>
									{sortColumn !== 'birthday' || sortDirection === 'asc' ? (
										<ChevronDownIcon aria-hidden="true" className="size-5" />
									) : (
										<ChevronUpIcon aria-hidden="true" className="size-5" />
									)}
								</span>
							</a>
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							Zeit
						</th>
						<th scope="col" className="py-3.5 pr-4 pl-3 sm:pr-6">
							<span className="sr-only">Actions</span>
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200 bg-white">
					{sortedList.map(p => (
						<tr key={p.key}>
							<td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
								{p.lastname}
							</td>
							<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{p.firstname}</td>
							<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{p.birthyear}</td>
							<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">0:00.00</td>
							<td className="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
								<Dropdown>
									<DropdownButton plain aria-label="More options">
										<EllipsisHorizontalIcon />
									</DropdownButton>
									<DropdownMenu anchor="bottom end">
										<DropdownItem onClick={() => props.vm.openEditParticipantDialog(p)}>
											{m('Generic_Edit')}
										</DropdownItem>
										<DropdownItem>{m('Generic_Delete')}</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Card>
	);
}

function sortParticipants(
	items: readonly ParticipantItem[],
	sortDirection: 'asc' | 'desc',
	sortColumn: keyof ParticipantItem
) {
	const reverse = sortDirection == 'desc' ? -1 : 1;
	return [...items].sort((a, b) => {
		if (
			sortColumn === 'firstname' ||
			sortColumn === 'lastname' ||
			sortColumn === 'gender' ||
			sortColumn === 'cohortname'
		) {
			const v1 = a[sortColumn] ?? '';
			const v2 = b[sortColumn] ?? '';
			let result = v1.localeCompare(v2) * reverse;
			if (result !== 0) {
				return result;
			}
			result = a.lastname.localeCompare(b.lastname);
			if (result !== 0) {
				result = a.firstname.localeCompare(b.firstname);
			}
			return result;
		} else {
			return (a.dto.birthday ?? '').localeCompare(b.dto.birthday ?? '') * reverse;
		}
	});
}
