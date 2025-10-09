import { useParams } from 'react-router';
import { ViewHeader } from './utils/ViewHeader';
import { FieldGroup, Fieldset, Legend } from '../components/fieldset';
import { Text } from '../components/text';
import { Button } from '../components/button';
import { useSignalValue, useVM } from './utils/utils';
import { EventViewVM } from './vm/EventViewVM';
import { TextFormField } from './utils/TextFormField';
import { useMessageFormatSignal } from '../useMessageFormat';
import { messages } from '../messages';

export function EventView() {
	const m = useMessageFormatSignal(messages);
	const vm = useVM(() => new EventViewVM(m));
	const title = useSignalValue(vm.title);

	const params = useParams();
	const eventId = params['eventId'] as string;

	vm.eventId.value = eventId;

	if (!title) {
		return <div>Loading ...</div>;
	}

	return (
		<div className="mx-auto mx-w6xl">
			<ViewHeader title={title}>
				<Button onClick={vm.persist.bind(vm)}>Speichern</Button>
			</ViewHeader>
			<Fieldset className="mt-10">
				<Legend>Event Details</Legend>
				<Text>Bearbeite die Event-Details</Text>
				<FieldGroup>
					<TextFormField vm={vm.name} />
					<div className="flex gap-4">
						<TextFormField vm={vm.date} type="date" className="flex-grow" />
						<TextFormField vm={vm.time} type="time" className="flex-grow" />
					</div>
				</FieldGroup>
			</Fieldset>
		</div>
	);
}
