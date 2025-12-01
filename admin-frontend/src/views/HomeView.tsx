import { useDateFormatter } from '@react-aria/i18n';
import { messages } from '../messages';
import { ViewHeader } from './utils/ViewHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/table';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '../components/dropdown';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import { useValue, useVM } from './utils/utils';
import { HomeViewVM } from './vm/HomeViewVM';
import { useMessageFormat, useMessageFormatSignal } from '../useMessageFormat';
import { SuccessInfo } from './utils/SuccessInfo';
import { ErrorInfo } from './utils/ErrorInfo';
import { ErrorDialog } from './utils/ErrorDialog';
import { Link } from '../components/link';

export function HomeView() {
	const ms = useMessageFormatSignal(messages);
	const vm = useVM(() => new HomeViewVM(ms));
	const events = useValue(vm.events);
	const stateInfo = useValue(vm.stateInfo);
	const askDeleteDialogOpen = useValue(vm.askDeleteDialogOpen);

	const m = useMessageFormat(messages);
	const dateFormat = useDateFormatter({ day: '2-digit', month: '2-digit', year: 'numeric' });
	const timeFormat = useDateFormatter({ hour: '2-digit', minute: '2-digit' });

	return (
		<div className="mx-auto mx-w6xl">
			<ErrorDialog
				title={m('HomeView_Delete_Confirm_Title')}
				message={m('HomeView_Delete_Confirm_Message')}
				okButtonLabel={m('Generic_Delete')}
				cancelButtonLabel={m('Generic_Cancel')}
				open={askDeleteDialogOpen !== ''}
				onClose={cancel => {
					if (!cancel) {
						vm.deleteEvent(askDeleteDialogOpen, true);
					} else {
						vm.askDeleteDialogOpen.value = '';
					}
				}}
			/>
			<ViewHeader title={m('HomeView_Title')} />
			{stateInfo?.type === 'success' && (
				<div className="mt-6">
					<SuccessInfo
						title={m('Generic_Success')}
						message={stateInfo.message}
						buttons={[]}
						onDismiss={() => vm.clearStateInfo()}
					/>
				</div>
			)}
			{stateInfo?.type === 'error' && (
				<div className="mt-6">
					<ErrorInfo
						title={m('Generic_Error')}
						message={stateInfo.message}
						buttons={[]}
						onDismiss={() => vm.clearStateInfo()}
					/>
				</div>
			)}
			<Table striped className="mt-12 [--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]">
				<TableHead>
					<TableRow>
						<TableHeader>{m('HomeView_Name')}</TableHeader>
						<TableHeader>{m('HomeView_DateAndTime')}</TableHeader>
						{/*<TableHeader>{m('HomeView_Participants')}</TableHeader>*/}
						<TableHeader className="relative w-0">
							<span className="sr-only">{m('Generic_Actions')}</span>
						</TableHeader>
					</TableRow>
				</TableHead>
				<TableBody>
					{events.map(e => {
						return (
							<TableRow key={e.key}>
								<TableCell>
									<div className="px-1">
										<Link href={`events/${e.key}`}>{e.name}</Link>
									</div>
								</TableCell>
								<TableCell>
									<div className="px-1">
										{dateFormat.format(new Date(e.date))}, {timeFormat.format(new Date(e.date))}
									</div>
								</TableCell>
								{/*<TableCell>xxxx</TableCell>*/}
								<TableCell>
									<div className="-my-1.5">
										<Dropdown>
											<DropdownButton plain aria-label={m('Generic_MoreOptions')}>
												<EllipsisHorizontalIcon />
											</DropdownButton>
											<DropdownMenu anchor="bottom end">
												<DropdownItem href={`events/${e.key}`}>{m('Generic_View')}</DropdownItem>
												<DropdownItem onClick={() => vm.deleteEvent(e.key, false)}>{m('Generic_Delete')}</DropdownItem>
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
