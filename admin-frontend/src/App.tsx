import { useState } from 'react';
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
	DropdownItem,
	DropdownLabel,
	DropdownMenu,
} from './components/dropdown';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/16/solid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPersonSkiing,
	faPersonRunning,
	faUsersBetweenLines,
	faList,
	faHome,
	faSearch,
	faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { Route, Routes } from 'react-router';
import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from './components/dialog';
import { Button } from './components/button';

const client = createSportEventService({ baseUrl: '' });

function App() {
	const [result, isLoading] = useLoadRemoteData({ key: 'list', block: client.list.bind(client), parameters: [] });

	return (
		<SidebarLayout navbar={<AppNavBar />} sidebar={<AppSideBar />}>
			<Routes>
				<Route index element={<HomeView />} />
				<Route element={<SearchView />} path="search" />
			</Routes>
		</SidebarLayout>
	);
}

function AppNavBar() {
	return <Navbar></Navbar>;
}

function AppSideBar() {
	const [isNewEventOpen, setNewEventOpen] = useState(false);
	return (
		<>
			<Dialog open={isNewEventOpen} onClose={setNewEventOpen}>
				<DialogTitle>Neues Sport-Event</DialogTitle>
				<DialogDescription>Lege ein neues Sport-Event an</DialogDescription>
				<DialogBody></DialogBody>
				<DialogActions>
					<Button plain onClick={() => setNewEventOpen(false)}>
						Cancel
					</Button>
					<Button onClick={() => setNewEventOpen(false)}>Refund</Button>
				</DialogActions>
			</Dialog>
			<Sidebar>
				<SidebarHeader>
					<Dropdown>
						<DropdownButton as={SidebarItem} className="lg:mb-2.5">
							<SidebarLabel>My Sport Events</SidebarLabel>
							<ChevronDownIcon />
						</DropdownButton>
						<DropdownMenu className="min-w-64" anchor="bottom end">
							<DropdownItem href="/events/1">
								<FontAwesomeIcon icon={faPersonRunning} data-slot="icon" />
								<DropdownLabel>Kinderlauf 2025</DropdownLabel>
							</DropdownItem>
							<DropdownItem href="/events/2">
								<FontAwesomeIcon icon={faPersonSkiing} data-slot="icon" />
								<DropdownLabel>Skirennen 2026</DropdownLabel>
							</DropdownItem>
							<DropdownDivider />
							<DropdownItem onClick={() => setNewEventOpen(true)}>
								<PlusIcon />
								<DropdownLabel>Neues Sport-Event&hellip;</DropdownLabel>
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</SidebarHeader>
				<SidebarBody>
					<SidebarSection>
						<SidebarHeading>Alle Events</SidebarHeading>
						<SidebarItem href="/">
							<FontAwesomeIcon icon={faHome} data-slot="icon" />
							<SidebarLabel>Home</SidebarLabel>
						</SidebarItem>
						<SidebarItem href="/search">
							<FontAwesomeIcon icon={faSearch} data-slot="icon" />
							<SidebarLabel>Suche</SidebarLabel>
						</SidebarItem>
					</SidebarSection>
					<SidebarSection>
						<SidebarHeading>Skirennen 2026</SidebarHeading>
						<SidebarItem href="/events/1234">
							<FontAwesomeIcon icon={faPenToSquare} data-slot="icon" />
							<SidebarLabel>Basisdaten</SidebarLabel>
						</SidebarItem>
						<SidebarItem href="/events/1234/participants">
							<FontAwesomeIcon icon={faList} data-slot="icon" />
							<SidebarLabel>Teilnehmerliste</SidebarLabel>
						</SidebarItem>
						<SidebarItem href="/events/1234/cohorts">
							<FontAwesomeIcon icon={faUsersBetweenLines} data-slot="icon" />
							<SidebarLabel>Gruppen</SidebarLabel>
						</SidebarItem>
					</SidebarSection>
				</SidebarBody>
			</Sidebar>
		</>
	);
}

export default App;
