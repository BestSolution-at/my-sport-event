import type { Message, MessageKeys } from './views/utils/utils';

const en = {
	Generic_Required_Field: 'This field is required.',
	Generic_Number_Invalid: 'The value is not a number',
	Generic_Number_Positive: 'The value must be positive',
	Generic_Number_LargerEqual: 'The value must be larger than/equal to {otherValue}',
	Generic_Cancel: 'Cancel',
	Generic_Save: 'Save',
	Generic_Create: 'Create',
	Generic_Edit: 'Edit',
	Generic_Delete: 'Delete',

	Generic_Male_Female: 'Male & Female',
	Generic_Male: 'Male',
	Generic_Female: 'Female',
	Generic_NoData: 'No Data',

	App_RecentEvents: 'Recent events',
	App_NewEvent: 'New Event',

	App_HomeView_Label: 'Overview',
	App_SearchView_Label: 'Search',
	App_EventView_Label: 'Basics',
	App_ParticipantView_Label: 'Participants',

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

	HomeView_Title: 'Overview',
	SearchView_Title: 'Search',

	EventView_Title: 'Event Details',
	EventView_Description: 'Edit the details of the event',

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
	CohortView_CohortTable_Name: 'Name',
	CohortView_CohortTable_Type: 'Type',
	CohortView_CohortTable_Participant: 'Participant',

	ParticipantView_Grouping: 'Group by',
	ParticipantView_Lastname: 'Lastname',
	ParticipantView_Firstname: 'Firstname',
	ParticipantView_AgeGroup: 'Age group',
	ParticipantView_Gender: 'Gender',
	ParticipantView_Cohort: 'Cohort',
	ParticipantView_Time: 'Time',
	ParticipantView_NoParticipants: 'No participants',
	ParticipantView_NotAssign: 'No Cohort Assignment',

	ParticipantDialog_Firstname: 'Firstname',
	ParticipantDialog_Lastname: 'Lastname',
	ParticipantDialog_Gender: 'Gender',
	ParticipantDialog_Birthday: 'Birthday',
	ParticipantDialog_Cohort: 'Cohort',
	ParticipantDialog_AutoCohort: 'auto. assign',
	ParticipantDialog_Team: 'Team',
	ParticipantDialog_Association: 'Association',

	ParticipantDialog_NewTitle: 'New participant',
	ParticipantDialog_UpdateTitle: 'Update participant',
	ParticipantDialog_NewDescription: 'Create a new participant',
	ParticipantDialog_UpdateDescription: 'Edit the data of the participant',
};

const de = {
	Generic_Required_Field: 'Dieses Feld muss ausgefüllt werden.',
	Generic_Number_Invalid: 'Der Wert ist keine Zahl',
	Generic_Number_Positive: 'Der Wert muss positiv sein',
	Generic_Number_LargerEqual: 'Der Wert muss größer/gleich {otherValue} sein',
	Generic_Cancel: 'Abbrechen',
	Generic_Save: 'Speichern',
	Generic_Create: 'Anlegen',
	Generic_Edit: 'Bearbeiten',
	Generic_Delete: 'Löschen',

	Generic_Male_Female: 'Männlich & Weiblich',
	Generic_Male: 'Männlich',
	Generic_Female: 'Weiblich',
	Generic_NoData: 'Keine Angabe',

	App_RecentEvents: 'Letzte Events',
	App_NewEvent: 'Neues Sport-Event',
	App_HomeView_Label: 'Übersicht',
	App_SearchView_Label: 'Suche',
	App_EventView_Label: 'Basisdaten',
	App_ParticipantView_Label: 'Teilnehmerliste',

	HomeView_Title: 'Übersicht',
	SearchView_Title: 'Suche',

	EventView_Title: 'Event-Details',
	EventView_Description: 'Bearbeite die Details des Event',

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

	CohortView_Title: 'Klassen',
	CohortView_New: 'Neue Klasse',
	CohortView_CohortTable_Name: 'Name',
	CohortView_CohortTable_Type: 'Typ',
	CohortView_CohortTable_Participant: 'Teilnehmer',

	CohortViewDialog_NewTitle: 'Neue Klasse',
	CohortViewDialog_UpdateTitle: 'Klasse bearbeiten',
	CohortViewDialog_NewDescription: "Leg' eine neue Klasse an in die Teilnehmer:innen eingeordnet werden können",
	CohortViewDialog_UpdateDescription: 'Bearbeite die Klasse',
	CohortViewDialog_Type: 'Typ',
	CohortViewDialog_Type_Generic: 'Generisch',
	CohortViewDialog_Type_Birthyear: 'Geburtsjahrgänge',
	CohortViewDialog_Name: 'Name',
	CohortViewDialog_Gender: 'Geschlecht',
	CohortViewDialog_Type_MinYear: 'Ab Jahrgang',
	CohortViewDialog_Type_MaxYear: 'Bis Jahrgang',

	ParticipantView_Grouping: 'Gruppierung',
	ParticipantView_Lastname: 'Nachname',
	ParticipantView_Firstname: 'Vornahme',
	ParticipantView_AgeGroup: 'Jahrgang',
	ParticipantView_Gender: 'Geschlecht',
	ParticipantView_Cohort: 'Klasse',
	ParticipantView_Time: 'Zeit',
	ParticipantView_NoParticipants: 'Keine Teilnehmer',
	ParticipantView_NotAssign: 'Keine Klassenzuordnung',

	ParticipantDialog_Firstname: 'Vorname',
	ParticipantDialog_Lastname: 'Nachname',
	ParticipantDialog_Gender: 'Geschlecht',
	ParticipantDialog_Birthday: 'Geburtstag',
	ParticipantDialog_Cohort: 'Klasse',
	ParticipantDialog_AutoCohort: 'autom. Zuordnung',
	ParticipantDialog_Team: 'Team',
	ParticipantDialog_Association: 'Verein',

	ParticipantDialog_NewTitle: 'Neuer Teilnehmer',
	ParticipantDialog_UpdateTitle: 'Teilnehmer bearbeiten',
	ParticipantDialog_NewDescription: "Leg' einen neuen Teilnehmer/eine neue Teilnehmerin an",
	ParticipantDialog_UpdateDescription: 'Berabeite den/die Teilnehmer:in',
};

export const messages = {
	'en-US': en,
	'de-AT': de,
	'de-DE': de,
	'de-CH': de,
};

export type AllMessageKeys = MessageKeys<typeof messages>;
export type AllMessages = Message<AllMessageKeys>;
