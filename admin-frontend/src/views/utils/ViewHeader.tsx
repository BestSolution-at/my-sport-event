import type { PropsWithChildren } from 'react';
import { Divider } from '../../components/divider';
import { Heading } from '../../components/heading';

export function ViewHeader(props: PropsWithChildren<{ title: string }>) {
	return (
		<div>
			<div className="flex flex-wrap items-end justify-between gap-4">
				<Heading>{props.title}</Heading>
				<div className="flex gap-4">{props.children}</div>
			</div>
			<Divider className="mt-6" />
		</div>
	);
}
