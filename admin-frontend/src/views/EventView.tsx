import { useParams } from 'react-router';
import { ViewHeader } from './utils/ViewHeader';
import { FieldGroup, Fieldset, Legend } from '../components/fieldset';
import { Text } from '../components/text';
import { Button } from '../components/button';
import { useSignalValue, useVM } from './utils/utils';
import { EventViewVM } from './vm/EventViewVM';
import { TextFormField } from './utils/TextFormField';
import { useMessageFormat, useMessageFormatSignal } from '../useMessageFormat';
import { messages } from '../messages';
import type { AppVM } from '../AppVM';

export function EventView(props: { appVM: AppVM }) {
	const m = useMessageFormatSignal(messages);
	const msg = useMessageFormat(messages);
	const vm = useVM(() => new EventViewVM(m));
	const title = useSignalValue(vm.title);

	const params = useParams();
	const eventId = params['eventId'] as string;

	vm.eventId.value = eventId;

	if (!title) {
		return <div>Loading ...</div>;
	}

	const onPersist = async () => {
		await vm.persist();
		props.appVM.refresh(); // better would be to use some event-bus system
	};

	return (
		<div className="mx-auto mx-w6xl">
			<ViewHeader title={title}>
				<Button onClick={onPersist}>{msg('Generic_Save')}</Button>
			</ViewHeader>
			<Fieldset className="mt-10">
				<Legend>{msg('EventView_Title')}</Legend>
				<Text>{msg('EventView_Description')}</Text>
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
