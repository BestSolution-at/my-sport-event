import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { Divider } from '../components/divider';
import { Heading } from '../components/heading';
import { messages } from '../messages';

export function HomeView() {
	const x = useLocalizedStringFormatter(messages);
	return (
		<div className="mx-auto mx-w6xl">
			<Heading>{x.format('HomeView_Title')}</Heading>
			<Divider className="mt-6" />
		</div>
	);
}
