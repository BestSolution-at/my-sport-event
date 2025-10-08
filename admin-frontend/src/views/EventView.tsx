import { useParams } from 'react-router';
import { useLoadRemoteData } from '../useLoadRemoteData';
import { useEffect, useMemo, useState } from 'react';
import { createSportEventService } from '../remote';
import { ViewHeader } from './utils/ViewHeader';
import { ErrorMessage, Field, FieldGroup, Fieldset, Label, Legend } from '../components/fieldset';
import { Text } from '../components/text';
import { Input } from '../components/input';
import type { InvalidDataError, NativeRSDError, NotFoundError, StaleDataError, StatusRSDError } from '../remote/Errors';
import { useMessageFormat } from '../useMessageFormat';
import { messages } from '../messages';
import { Button } from '../components/button';
import type { SportEvent, SportEventPatch } from '../remote/model';

const service = createSportEventService({ baseUrl: '' });

export function EventView() {
	const params = useParams();
	const [refreshCounter, setRefreshCounter] = useState(0);
	const eventId = params['eventId'] as string;

	const [result, isLoading] = useLoadRemoteData(
		useMemo(() => {
			return { key: `get-${refreshCounter}`, block: service.get.bind(service), parameters: [eventId] } as const;
		}, [eventId, refreshCounter])
	);

	const m = useMessageFormat(messages);

	const [name, setName] = useState('');
	const [nameError, setNameError] = useState('');

	const [date, setDate] = useState('');
	const [dateError, setDateError] = useState('');

	const [time, setTime] = useState('');
	const [timeError, setTimeError] = useState('');

	const [remoteError, setRemoteError] = useState<
		NotFoundError | StatusRSDError | NativeRSDError | InvalidDataError | StaleDataError | null
	>(null);

	useEffect(() => {
		if (result !== null) {
			const [data, err] = result;
			if (data) {
				setName(data.name);
				const [isoDate, isoTime] = toLocaleDateTime(data.date);
				setDate(isoDate);
				setTime(isoTime);
			}
		}
	}, [result]);

	if (isLoading) {
		return <div>Loading data ...</div>;
	}

	const [data, err] = result;

	if (err) {
		return <div className="mx-auto mx-w6xl">FAIL {err.message}</div>;
	}

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

	const updateEvent = async () => {
		validateName();
		validateDate();
		validateTime();

		if (nameError === '' && dateError === '' && timeError === '') {
			const patch = createSportEventPatch(data, { ...data, name, date: new Date(`${date}T${time}:00`).toISOString() });
			if (patch) {
				const [, err] = await service.update(data.key, patch);
				if (err) {
					setRemoteError(err);
				} else {
					setRefreshCounter(v => v + 1);
				}
			} else {
				console.info('No changes detected - no need to persist');
			}
		}
	};

	return (
		<div className="mx-auto mx-w6xl">
			<ViewHeader title={data.name}>
				<Button onClick={updateEvent}>Speichern</Button>
			</ViewHeader>
			<Fieldset className="mt-10">
				<Legend>Event Details</Legend>
				<Text>Bearbeite die Event-Details</Text>
				<FieldGroup>
					<Field>
						<Label>{m('NewEventDialog_Name')}</Label>
						<Input
							required
							value={name}
							onChange={e => {
								setName(e.target.value);
							}}
							invalid={nameError.length > 0}
						/>
						{nameError && <ErrorMessage>{nameError}</ErrorMessage>}
					</Field>
					<div className="flex gap-4">
						<Field className="flex-grow">
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
						<Field className="flex-grow">
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
					</div>
				</FieldGroup>
			</Fieldset>
		</div>
	);
}

function createSportEventPatch(cur: SportEvent, updated: SportEvent): SportEventPatch | undefined {
	const patch: SportEventPatch = {
		key: cur.key,
		version: cur.version,
		date: cur.date !== updated.date ? updated.date : undefined,
		name: cur.name !== updated.name ? updated.name : undefined,
	};
	if (patch.date !== undefined || patch.name !== undefined) {
		return patch;
	}
	return undefined;
}

function toLocaleDateTime(isoDateTime: string): [string, string] {
	const d = new Date(isoDateTime);

	const parts = new Intl.DateTimeFormat(undefined, {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).formatToParts(d);

	const day = parts.find(p => p.type === 'day')?.value;
	const month = parts.find(p => p.type === 'month')?.value;
	const year = parts.find(p => p.type === 'year')?.value;
	const hour = parts.find(p => p.type === 'hour')?.value;
	const minute = parts.find(p => p.type === 'minute')?.value;
	return [`${year}-${month}-${day}`, `${hour}:${minute}`];
}
