import './App.css';
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
import { Route, Routes, useLocation, useMatch, useNavigate } from 'react-router';
import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from './components/dialog';
import { Button } from './components/button';

import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { messages } from './messages';
import { EventView } from './views/EventView';
import { CohortView } from './views/CohortView';
import { ParticipantView } from './views/ParticipantView';
import { useMessageFormat, useMessageFormatSignal } from './useMessageFormat';
import { useValue, useVM } from './views/utils/utils';
import { AppVM, NewEventDialogVM } from './AppVM';
import { TextFormField } from './views/utils/TextFormField';
import { useEffect, useState } from 'react';

function App() {
	const m = useMessageFormatSignal(messages);
	const vm = useVM(() => new AppVM(m));

	const navigate = useNavigate();
	vm.navigateToEvent = newEventId => navigate(`/events/${newEventId}`);

	return (
		<>
			<SidebarLayout navbar={<AppNavBar />} sidebar={<AppSideBar vm={vm} />}>
				<Routes>
					<Route index element={<HomeView />} />
					<Route element={<SearchView />} path="search" />
					<Route element={<EventView appVM={vm} />} path="/events/:eventId"></Route>
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

function NewEventDialogContainer(props: { vm: AppVM }) {
	const dialog = useValue(props.vm.newEventDialog);
	return <>{dialog && <NewEventDialog vm={dialog} />}</>;
}

function NewEventDialog(props: { vm: NewEventDialogVM }) {
	const m = useMessageFormat(messages);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => setOpen(true));
		return () => {
			clearTimeout(timeout);
		};
	}, []);
	return (
		<Dialog open={open} onClose={() => {}}>
			<DialogTitle>{m('NewEventDialog_Title')}</DialogTitle>
			<DialogDescription>{m('NewEventDialog_Description')}</DialogDescription>
			<DialogBody>
				<TextFormField vm={props.vm.name} />
				<div className="flex gap-4">
					<TextFormField vm={props.vm.date} type="date" className="flex-grow" />
					<TextFormField vm={props.vm.time} type="time" className="flex-grow" />
				</div>
			</DialogBody>
			<DialogActions>
				<Button plain onClick={() => props.vm.close()}>
					{m('NewEventDialog_Cancel')}
				</Button>
				<Button onClick={() => props.vm.persist()}>{m('NewEventDialog_Create')}</Button>
			</DialogActions>
		</Dialog>
	);
}

function AppSideBar(props: { vm: AppVM }) {
	const location = useLocation();
	const match = useMatch('/events/:eventId/*');
	const message = useLocalizedStringFormatter(messages);
	const events = useValue(props.vm.events);
	const event = events.find(e => e.key === match?.params.eventId);

	return (
		<>
			<NewEventDialogContainer vm={props.vm} />
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
							{events.length > 0 && (
								<>
									<DropdownDivider />
									<DropdownSection>
										<DropdownHeading>{message.format('App_RecentEvents')}</DropdownHeading>
										{events.map(e => {
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
							<DropdownItem onClick={() => props.vm.openNewEventDialog()}>
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
								href={`/events/${event.key}/cohorts`}
								current={location.pathname === `/events/${event.key}/cohorts`}
							>
								<FontAwesomeIcon icon={faUsersBetweenLines} data-slot="icon" />
								<SidebarLabel>{message.format('CohortView_Title')}</SidebarLabel>
							</SidebarItem>
							<SidebarItem
								href={`/events/${event.key}/participants`}
								current={location.pathname === `/events/${event.key}/participants`}
							>
								<FontAwesomeIcon icon={faList} data-slot="icon" />
								<SidebarLabel>{message.format('ParticipantView_Title')}</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
					)}
				</SidebarBody>
			</Sidebar>
		</>
	);
}

export default App;
