import type { PropsWithChildren } from 'react';
import { Divider } from '../../components/divider';
import { Heading } from '../../components/heading';

export function ViewHeader(props: PropsWithChildren<{ title: string }>) {
	return (
		<div className="bg-white sticky top-0 z-10">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<Heading>{props.title}</Heading>
				<div className="flex gap-4">{props.children}</div>
			</div>
			<Divider className="mt-6" />
		</div>
	);
}
