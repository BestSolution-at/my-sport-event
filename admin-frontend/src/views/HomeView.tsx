import { useDateFormatter, useLocalizedStringFormatter } from '@react-aria/i18n';
import { messages } from '../messages';
import type { SportEvent } from '../remote/model';
import { ViewHeader } from './utils/ViewHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/table';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '../components/dropdown';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';

export function HomeView(props: { events: readonly SportEvent[] }) {
	const message = useLocalizedStringFormatter(messages);
	const dateFormat = useDateFormatter({ day: '2-digit', month: '2-digit', year: 'numeric' });
	const timeFormat = useDateFormatter({ hour: '2-digit', minute: '2-digit' });
	return (
		<div className="mx-auto mx-w6xl">
			<ViewHeader title={message.format('HomeView_Title')} />

			<Table striped className="mt-12 [--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]">
				<TableHead>
					<TableRow>
						<TableHeader>Name</TableHeader>
						<TableHeader>Datum, Uhrzeit</TableHeader>
						{/*<TableHeader>Teilnehmer</TableHeader>*/}
						<TableHeader className="relative w-0">
							<span className="sr-only">Actions</span>
						</TableHeader>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.events.map(e => {
						return (
							<TableRow key={e.key}>
								<TableCell>
									<div className="px-1">{e.name}</div>
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
											<DropdownButton plain aria-label="More options">
												<EllipsisHorizontalIcon />
											</DropdownButton>
											<DropdownMenu anchor="bottom end">
												<DropdownItem>View</DropdownItem>
												<DropdownItem>Edit</DropdownItem>
												<DropdownItem>Delete</DropdownItem>
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
