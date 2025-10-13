import { useParams } from 'react-router';
import { ViewHeader } from './utils/ViewHeader';
import { messages } from '../messages';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/table';
import { isBirthyearCohort } from '../remote/model';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '../components/dropdown';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import { Button } from '../components/button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '../components/dialog';
import { FieldGroup } from '../components/fieldset';
import { useSignalValue, useValue, useVM } from './utils/utils';
import { useMessageFormat, useMessageFormatSignal } from '../useMessageFormat';
import { CohortViewDialogVM, CohortViewVM, genderToString } from './vm/CohortViewVM';
import { SelectFormField } from './utils/SelectFormField';
import { TextFormField } from './utils/TextFormField';

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
	return (
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
				{[...data].map(e => {
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
											<DropdownItem onClick={() => props.vm.onOpenCohortEditDialog(e)}>Bearbeiten</DropdownItem>
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
	);
}

function CohortDialogContainer(props: { vm: CohortViewVM }) {
	const dialog = useSignalValue(props.vm.cohortDialog);
	return <>{dialog && <CohortDialog vm={dialog} />}</>;
}

function CohortDialog(props: { vm: CohortViewDialogVM }) {
	const m = useMessageFormat(messages);

	const title = useSignalValue(props.vm.title);
	const description = useSignalValue(props.vm.description);
	const persistButtonLabel = useSignalValue(props.vm.persistButtonLabel);

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
