import { Divider } from '../components/divider';
import { Heading } from '../components/heading';

import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { messages } from '../messages';

export function SearchView() {
	const x = useLocalizedStringFormatter(messages);

	return (
		<div className="mx-auto mx-w6xl">
			<Heading>{x.format('SearchView_Title')}</Heading>
			<Divider className="mt-6" />
		</div>
	);
}
