import { Button } from '../components/button';
import { Table, TableHead, TableHeader, TableRow } from '../components/table';
import { ViewHeader } from './utils/ViewHeader';

export function ParticipantView() {
	return (
		<div className="mx-auto mx-w6xl">
			<ViewHeader title="Teilnehmer">
				<Button>Neuer Teilnehmer</Button>
			</ViewHeader>
			<Table striped className="mt-12 [--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]">
				<TableHead>
					<TableRow>
						<TableHeader>Name</TableHeader>
					</TableRow>
				</TableHead>
			</Table>
		</div>
	);
}
