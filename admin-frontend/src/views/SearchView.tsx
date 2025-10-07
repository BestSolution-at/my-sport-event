import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { messages } from '../messages';
import { ViewHeader } from './utils/ViewHeader';

export function SearchView() {
	const message = useLocalizedStringFormatter(messages);

	return (
		<div className="mx-auto mx-w6xl">
			<ViewHeader title={message.format('SearchView_Title')} />
		</div>
	);
}
