import { useMemo, useState } from 'react';
import './App.css';
import { useLoadRemoteData } from './useLoadRemoteData';
import { createSportEventService } from './remote';
import { SidebarLayout } from './components/sidebar-layout';
import { Navbar } from './components/navbar';
import {
	Sidebar,
	SidebarBody,
	SidebarHeader,
	SidebarHeading,
	SidebarItem,
	SidebarLabel,
	SidebarSection,
} from './components/sidebar';
import {
	Dropdown,
	DropdownButton,
	DropdownDivider,
	DropdownHeading,
	DropdownItem,
	DropdownLabel,
	DropdownMenu,
	DropdownSection,
} from './components/dropdown';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/16/solid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPersonRunning,
	faUsersBetweenLines,
	faList,
	faHome,
	faSearch,
	faPenToSquare,
	faPersonSkiing,
} from '@fortawesome/free-solid-svg-icons';
import { Route, Routes, useLocation, useMatch } from 'react-router';
import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from './components/dialog';
import { Button } from './components/button';

import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { messages } from './messages';
import { ErrorMessage, Field, FieldGroup, Label } from './components/fieldset';
import { Input } from './components/input';
import type { InvalidDataError, NativeRSDError, StatusRSDError } from './remote/Errors';
import { Alert, AlertDescription, AlertTitle } from './components/alert';
import type { SportEvent } from './remote/model';
import { EventView } from './views/EventView';
import { CohortView } from './views/CohortView';
import { ParticipantView } from './views/ParticipantView';
import { useMessageFormat } from './useMessageFormat';

const service = createSportEventService({ baseUrl: '' });

function App() {
	const [refreshCounter, setRefreshCounter] = useState(0);

	const [result] = useLoadRemoteData(
		useMemo(() => {
			return { key: `list-${refreshCounter}`, block: service.list.bind(service), parameters: [] } as const;
		}, [refreshCounter])
	);

	let events: readonly SportEvent[] = [];
	console.log(result);
	if (result) {
		const [data] = result;
		if (data) {
			events = data;
		} else {
			events = [];
		}
	}

	return (
		<>
			<SidebarLayout
				navbar={<AppNavBar />}
				sidebar={<AppSideBar events={events} refresh={() => setRefreshCounter(v => v + 1)} />}
			>
				<Routes>
					<Route index element={<HomeView events={events} />} />
					<Route element={<SearchView />} path="search" />
					<Route element={<EventView />} path="/events/:eventId"></Route>
					<Route element={<CohortView />} path="/events/:eventId/cohorts"></Route>
					<Route element={<ParticipantView />} path="/events/:eventId/participants"></Route>
				</Routes>
			</SidebarLayout>
		</>
	);
}

function AppNavBar() {
	return <Navbar></Navbar>;
}

function NewEventDialog(props: { open: boolean; onClose: (state: 'OK' | 'CANCEL') => void }) {
	const [name, setName] = useState('');
	const [nameError, setNameError] = useState('');

	const [date, setDate] = useState('');
	const [dateError, setDateError] = useState('');

	const [time, setTime] = useState('');
	const [timeError, setTimeError] = useState('');

	const [remoteError, setRemoteError] = useState<StatusRSDError | NativeRSDError | InvalidDataError | null>(null);

	const m = useMessageFormat(messages);
	const validateName = () => {
		if (name.trim().length === 0) {
			setNameError(m('NewEventDialog_RequiredField'));
		} else {
			setNameError('');
		}
	};

	const validateDate = () => {
		if (date.trim().length === 0) {
			setDateError(m('NewEventDialog_RequiredField'));
		} else {
			setDateError('');
		}
	};

	const validateTime = () => {
		if (time.trim().length === 0) {
			setTimeError(m('NewEventDialog_RequiredField'));
		} else {
			setTimeError('');
		}
	};

	const createEvent = async () => {
		validateName();
		validateDate();
		validateTime();
		if (nameError === '' && dateError === '' && timeError === '') {
			const [, err] = await service.create({ name, date: new Date(`${date}T${time}:00`).toISOString() });
			if (err) {
				setRemoteError(err);
			} else {
				props.onClose('OK');
			}
		}
	};
	return (
		<>
			<Alert open={remoteError !== null} onClose={() => setRemoteError(null)}>
				<AlertTitle>{m('NewEventDialog_RemoteError_Title')}</AlertTitle>
				<AlertDescription>
					<p>{m('NewEventDialog_RemoteError_Description')}</p>
					<p>{remoteError?.message}</p>
				</AlertDescription>
			</Alert>
			<Dialog open={props.open} onClose={() => {}}>
				<DialogTitle>{m('NewEventDialog_Title')}</DialogTitle>
				<DialogDescription>{m('NewEventDialog_Description')}</DialogDescription>
				<DialogBody>
					<FieldGroup>
						<Field>
							<Label>{m('NewEventDialog_Name')}</Label>
							<Input
								required
								autoFocus
								value={name}
								onChange={e => {
									setName(e.target.value);
								}}
								invalid={nameError.length > 0}
							/>
							{nameError && <ErrorMessage>{nameError}</ErrorMessage>}
						</Field>
						<Field>
							<Label>{m('NewEventDialog_Date')}</Label>
							<Input
								type="date"
								required
								value={date}
								onChange={e => setDate(e.target.value)}
								invalid={dateError.length > 0}
							/>
							{dateError && <ErrorMessage>{dateError}</ErrorMessage>}
						</Field>
						<Field>
							<Label>{m('NewEventDialog_Time')}</Label>
							<Input
								type="time"
								required
								value={time}
								onChange={e => setTime(e.target.value)}
								invalid={dateError.length > 0}
							/>
							{timeError && <ErrorMessage>{timeError}</ErrorMessage>}
						</Field>
					</FieldGroup>
				</DialogBody>
				<DialogActions>
					<Button plain onClick={() => props.onClose('CANCEL')}>
						{m('NewEventDialog_Cancel')}
					</Button>
					<Button onClick={createEvent}>{m('NewEventDialog_Create')}</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

function AppSideBar(props: { events: readonly SportEvent[]; refresh: () => void }) {
	const [isNewEventOpen, setNewEventOpen] = useState(false);
	const location = useLocation();
	const match = useMatch('/events/:eventId/*');
	const message = useLocalizedStringFormatter(messages);

	const onClose = (v: 'OK' | 'CANCEL') => {
		setNewEventOpen(false);
		if (v === 'OK') {
			props.refresh();
		}
	};

	const event = props.events.find(e => e.key === match?.params.eventId);

	return (
		<>
			<NewEventDialog open={isNewEventOpen} onClose={onClose} />
			<Sidebar>
				<SidebarHeader>
					<Dropdown>
						<DropdownButton as={SidebarItem} className="lg:mb-2.5">
							<SidebarLabel>My Sport Events</SidebarLabel>
							<ChevronDownIcon />
						</DropdownButton>
						<DropdownMenu className="min-w-64" anchor="bottom end">
							<DropdownItem href="/">
								<FontAwesomeIcon icon={faHome} data-slot="icon" />
								<DropdownLabel>{message.format('HomeView_Title')}</DropdownLabel>
							</DropdownItem>
							<DropdownItem href="/search">
								<FontAwesomeIcon icon={faSearch} data-slot="icon" />
								<DropdownLabel>Suche</DropdownLabel>
							</DropdownItem>
							{props.events.length > 0 && (
								<>
									<DropdownDivider />
									<DropdownSection>
										<DropdownHeading>{message.format('App_RecentEvents')}</DropdownHeading>
										{props.events.map(e => {
											return (
												<DropdownItem key={e.key} href={`/events/${e.key}`}>
													<FontAwesomeIcon
														icon={e.name.toLocaleLowerCase().includes('lauf') ? faPersonRunning : faPersonSkiing}
														data-slot="icon"
													/>
													<DropdownLabel>{e.name}</DropdownLabel>
												</DropdownItem>
											);
										})}
									</DropdownSection>
								</>
							)}
							<DropdownDivider />
							<DropdownItem onClick={() => setNewEventOpen(true)}>
								<PlusIcon />
								<DropdownLabel>{message.format('App_NewEvent')}&hellip;</DropdownLabel>
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</SidebarHeader>
				<SidebarBody>
					{match?.params.eventId === undefined && (
						<SidebarSection>
							<SidebarItem href="/">
								<FontAwesomeIcon icon={faHome} data-slot="icon" />
								<SidebarLabel>{message.format('HomeView_Title')}</SidebarLabel>
							</SidebarItem>
							<SidebarItem href="/search">
								<FontAwesomeIcon icon={faSearch} data-slot="icon" />
								<SidebarLabel>Suche</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
					)}
					{event && (
						<SidebarSection>
							<SidebarHeading>{event.name}</SidebarHeading>
							<SidebarItem href={`/events/${event.key}`} current={location.pathname === `/events/${event.key}`}>
								<FontAwesomeIcon icon={faPenToSquare} data-slot="icon" />
								<SidebarLabel>{message.format('EventView_Title')}</SidebarLabel>
							</SidebarItem>
							<SidebarItem
								href={`/events/${event.key}/participants`}
								current={location.pathname === `/events/${event.key}/participants`}
							>
								<FontAwesomeIcon icon={faList} data-slot="icon" />
								<SidebarLabel>{message.format('ParticipantView_Title')}</SidebarLabel>
							</SidebarItem>
							<SidebarItem
								href={`/events/${event.key}/cohorts`}
								current={location.pathname === `/events/${event.key}/cohorts`}
							>
								<FontAwesomeIcon icon={faUsersBetweenLines} data-slot="icon" />
								<SidebarLabel>{message.format('CohortView_Title')}</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
					)}
				</SidebarBody>
			</Sidebar>
		</>
	);
}

export default App;
