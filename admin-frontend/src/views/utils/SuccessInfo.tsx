import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';

type Button = {
	label: string;
	onClick: () => void;
};

export function SuccessInfo(props: { title: string; message: string; buttons: Button[]; onDismiss?: () => void }) {
	return (
		<div className="rounded-md bg-green-50 p-4">
			<div className="flex">
				<div className="shrink-0">
					<CheckCircleIcon aria-hidden="true" className="size-5 text-green-400" />
				</div>
				<div className="ml-3">
					<h3 className="text-sm font-medium text-green-800">{props.title}</h3>
					<div className="mt-2 text-sm text-green-700">
						<p>{props.message}</p>
					</div>
					<div className="mt-4">
						<div className="-mx-2 -my-1.5 flex">
							{props.buttons.length > 0 && (
								<button
									type="button"
									onClick={props.buttons[0].onClick}
									className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
								>
									{props.buttons[0].label}
								</button>
							)}
							{props.buttons
								.filter((_, i) => i > 0)
								.map(b => (
									<button
										key={b.label}
										type="button"
										className="ml-3 rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
									>
										{b.label}
									</button>
								))}
						</div>
					</div>
				</div>
				{props.onDismiss && (
					<div className="ml-auto pl-3">
						<div className="-mx-1.5 -my-1.5">
							<button
								type="button"
								onClick={props.onDismiss}
								className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-green-50 focus-visible:outline-hidden"
							>
								<span className="sr-only">Dismiss</span>
								<XMarkIcon aria-hidden="true" className="size-5" />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
