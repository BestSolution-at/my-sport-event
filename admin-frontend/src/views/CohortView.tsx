import { useParams } from 'react-router';
import { ViewHeader } from './utils/ViewHeader';
import { messages } from '../messages';
import { isBirthyearCohort, type Cohort } from '../remote/model';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '../components/dropdown';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import { Button } from '../components/button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '../components/dialog';
import { FieldGroup } from '../components/fieldset';
import { useSignalValue, useValue, useVM } from './utils/utils';
import { useMessageFormat, useMessageFormatSignal } from '../useMessageFormat';
import { CohortViewDialogVM, CohortViewVM } from './vm/CohortViewVM';
import { SelectFormField } from './utils/SelectFormField';
import { TextFormField } from './utils/TextFormField';
import { Card } from './utils/Card';

export function CohortView() {
	const m = useMessageFormatSignal(messages);
	const vm = useVM(() => new CohortViewVM(m));
	const params = useParams();
	vm.eventId.value = params['eventId'] as string;

	return (
		<div className="mx-auto mx-w6xl">
			<CohortDialogContainer vm={vm} />
			<CohortHeader vm={vm} />
			<CohortList vm={vm} />
		</div>
	);
}

function CohortHeader(props: { vm: CohortViewVM }) {
	const title = useSignalValue(props.vm.title);
	const m = useMessageFormat(messages);

	return (
		<ViewHeader title={title}>
			<Button onClick={props.vm.onOpenNewCohortDialog.bind(props.vm)}>{m('CohortView_New')}</Button>
		</ViewHeader>
	);
}

function CohortList(props: { vm: CohortViewVM }) {
	const data = useValue(props.vm.cohorts);
	const males = data.filter(c => c.gender === 'MALE');
	const females = data.filter(c => c.gender === 'FEMALE');
	const all = data.filter(c => c.gender === 'ALL');
	const m = useMessageFormat(messages);

	return (
		<>
			{females.length > 0 && <CohortTable vm={props.vm} data={females} label={m('Generic_Female')} />}
			{males.length > 0 && <CohortTable vm={props.vm} data={males} label={m('Generic_Male')} />}
			{all.length > 0 && <CohortTable vm={props.vm} data={all} label={m('Generic_Male_Female')} />}
		</>
	);
}

function CohortTable(props: { vm: CohortViewVM; data: readonly Cohort[]; label: string }) {
	return (
		<Card label={props.label}>
			<table className="relative min-w-full divide-y divide-gray-300">
				<thead className="bg-zinc-50">
					<tr>
						<th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
							Name
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							Typ
						</th>
						<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
							Teilnehmer
						</th>
						<th scope="col" className="py-3.5 pr-4 pl-3 sm:pr-6">
							<span className="sr-only">Actions</span>
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200 bg-white">
					{props.data.map(e => {
						return (
							<tr key={e.key}>
								<td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">{e.name}</td>
								<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
									{isBirthyearCohort(e) ? `Jahrgänge ${e.min}-${e.max}` : 'Generisch'}
								</td>
								<td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">TBD</td>
								<td className="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
									<Dropdown>
										<DropdownButton plain aria-label="More options">
											<EllipsisHorizontalIcon />
										</DropdownButton>
										<DropdownMenu anchor="bottom end">
											<DropdownItem onClick={() => props.vm.onOpenCohortEditDialog(e)}>Bearbeiten</DropdownItem>
											<DropdownItem>Löschen</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</Card>
	);
}

function CohortDialogContainer(props: { vm: CohortViewVM }) {
	const dialog = useValue(props.vm.cohortDialog);
	return <>{dialog && <CohortDialog vm={dialog} />}</>;
}

function CohortDialog(props: { vm: CohortViewDialogVM }) {
	const m = useMessageFormat(messages);

	const title = useValue(props.vm.title);
	const description = useValue(props.vm.description);
	const persistButtonLabel = useValue(props.vm.persistButtonLabel);

	const close = props.vm.close.bind(props.vm);

	const cohortType = useValue(props.vm.cohortType.value);

	return (
		<Dialog open onClose={close}>
			<DialogTitle>{title}</DialogTitle>
			<DialogDescription>{description}</DialogDescription>
			<DialogBody>
				<FieldGroup>
					<SelectFormField vm={props.vm.cohortType} />
					<TextFormField vm={props.vm.name} />
					<SelectFormField vm={props.vm.gender} />
					{cohortType === 'birthyear' && <MinMaxYear vm={props.vm} />}
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

function MinMaxYear(props: { vm: CohortViewDialogVM }) {
	return (
		<div className="flex gap-4">
			<TextFormField vm={props.vm.min} type="number" />
			<TextFormField vm={props.vm.max} type="number" />
		</div>
	);
}
