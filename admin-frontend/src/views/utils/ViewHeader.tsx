import { Divider } from '../../components/divider';
import { Heading } from '../../components/heading';

export function ViewHeader(props: { title: string }) {
	return (
		<div>
			<Heading>{props.title}</Heading>
			<Divider className="mt-6" />
		</div>
	);
}
