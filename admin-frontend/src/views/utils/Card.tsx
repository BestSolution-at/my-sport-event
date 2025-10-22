import type { PropsWithChildren } from 'react';
import { Subheading } from '../../components/heading';

export function Card(props: PropsWithChildren<{ label: string; emptyText?: string }>) {
	return (
		<div className="mt-12 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white ring ring-zinc-200">
			<div className="px-4 py-5 sm:px-6">
				<Subheading>{props.label}</Subheading>
			</div>
			<div className="bg-zinc-100 px-4 py-5 sm:p-6">
				<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						{props.children && (
							<div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg">{props.children}</div>
						)}
						{props.children === undefined && props.emptyText && (
							<div className="flex justify-center">
								<span>{props.emptyText}</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
