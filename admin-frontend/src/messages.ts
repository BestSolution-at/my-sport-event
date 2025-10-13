import type { Message, MessageKeys } from './views/utils/utils';

const en = {
	Generic_Required_Field: 'This field is required.',
	Generic_Number_Invalid: 'The value is not a number',
	Generic_Number_Positive: 'The value must be positive',
	Generic_Number_LargerEqual: 'The value must be larger than/equal to {otherValue}',
	Generic_Cancel: 'Cancel',
	Generic_Save: 'Save',
	Generic_Create: 'Create',

	Generic_Male_Female: 'Male & Female',
	Generic_Male: 'Male',
	Generic_Female: 'Female',

	App_RecentEvents: 'Recent events',
	App_NewEvent: 'New Event',

	HomeView_Title: 'Overview',

	SearchView_Title: 'Search',

	NewEventDialog_Title: 'New sports event',
	NewEventDialog_Description: 'Create a new sports event',
	NewEventDialog_Cancel: 'Cancel',
	NewEventDialog_Create: 'Create',

	NewEventDialog_Name: 'Name of Event',
	NewEventDialog_Date: 'Date',
	NewEventDialog_Time: 'Time',
	NewEventDialog_RequiredField: 'This field is required.',

	NewEventDialog_RemoteError_Title: 'Failed to persist',
	NewEventDialog_RemoteError_Description: 'Failure while saving the data. The error message was:',

	EventView_Title: 'Basics',
	ParticipantView_Title: 'Participants',

	CohortView_Title: 'Cohorts',
	CohortView_New: 'New cohort',

	CohortViewDialog_NewTitle: 'New cohort',
	CohortViewDialog_UpdateTitle: 'Update cohort',
	CohortViewDialog_NewDescription: 'Create a new cohort so that you can assign participants',
	CohortViewDialog_UpdateDescription: 'Edit the data of the cohort',
	CohortViewDialog_Type: 'Type',
	CohortViewDialog_Type_Generic: 'Generic',
	CohortViewDialog_Type_Birthyear: 'Birthyears',
	CohortViewDialog_Name: 'Name',
	CohortViewDialog_Gender: 'Gender',
	CohortViewDialog_Type_MinYear: 'From Birthyear',
	CohortViewDialog_Type_MaxYear: 'To Birthyear',
};

const de = {
	Generic_Required_Field: 'Dieses Feld muss ausgefüllt werden.',
	Generic_Number_Invalid: 'Der Wert ist keine Zahl',
	Generic_Number_Positive: 'Der Wert muss positiv sein',
	Generic_Number_LargerEqual: 'Der Wert muss größer/gleich {otherValue} sein',
	Generic_Cancel: 'Abbrechen',
	Generic_Save: 'Speichern',
	Generic_Create: 'Anlegen',

	Generic_Male_Female: 'Männlich & Weiblich',
	Generic_Male: 'Männlich',
	Generic_Female: 'Weiblich',

	App_RecentEvents: 'Letzte Events',
	App_NewEvent: 'Neues Sport-Event',

	HomeView_Title: 'Übersicht',

	SearchView_Title: 'Suche',

	NewEventDialog_Title: 'Neues Sport-Event',
	NewEventDialog_Description: 'Lege ein neues Sport-Event an',
	NewEventDialog_Cancel: 'Abbrechen',
	NewEventDialog_Create: 'Anlegen',

	NewEventDialog_Name: 'Name des Events',
	NewEventDialog_Date: 'Datum',
	NewEventDialog_Time: 'Uhrzeit',
	NewEventDialog_RequiredField: 'Dieses Feld muss ausgefüllt werden.',

	NewEventDialog_RemoteError_Title: 'Fehler beim Speichern',
	NewEventDialog_RemoteError_Description:
		'Beim Speichern des Datensatzes ist ein Fehler aufgetreten. Die Fehlermeldung war:',

	EventView_Title: 'Basisdaten',
	ParticipantView_Title: 'Teilnehmerliste',

	CohortView_Title: 'Klassen',
	CohortView_New: 'Neue Klasse',

	CohortViewDialog_NewTitle: 'Neue Klasse',
	CohortViewDialog_UpdateTitle: 'Klasse bearbeiten',
	CohortViewDialog_NewDescription: "Leg' eine neue Klasse an in die Teilnehmer eingeordnet werden können",
	CohortViewDialog_UpdateDescription: 'Bearbeite die Klasse',
	CohortViewDialog_Type: 'Typ',
	CohortViewDialog_Type_Generic: 'Generisch',
	CohortViewDialog_Type_Birthyear: 'Geburtsjahrgänge',
	CohortViewDialog_Name: 'Name',
	CohortViewDialog_Gender: 'Geschlecht',
	CohortViewDialog_Type_MinYear: 'Ab Jahrgang',
	CohortViewDialog_Type_MaxYear: 'Bis Jahrgang',
};

export const messages = {
	'en-US': en,
	'de-AT': de,
	'de-DE': de,
	'de-CH': de,
};

export type AllMessageKeys = MessageKeys<typeof messages>;
export type AllMessages = Message<AllMessageKeys>;
