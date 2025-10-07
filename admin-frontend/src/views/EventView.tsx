import { useParams } from 'react-router';

export function EventView() {
	const params = useParams();

	return <div>EVENT DATA - ${params['eventId']}</div>;
}
