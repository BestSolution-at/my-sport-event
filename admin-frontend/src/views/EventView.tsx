import { useParams } from 'react-router';
import { ViewHeader } from './utils/ViewHeader';
import { FieldGroup, Fieldset, Legend } from '../components/fieldset';
import { Text } from '../components/text';
import { Button } from '../components/button';
import { useSignalValue, useValue, useVM } from './utils/utils';
import { EventViewVM, QRCodeDialogVM } from './vm/EventViewVM';
import { TextFormField } from './utils/TextFormField';
import { useMessageFormat, useMessageFormatSignal } from '../useMessageFormat';
import { messages } from '../messages';
import type { AppVM } from '../AppVM';
import { SuccessInfo } from './utils/SuccessInfo';
import { ErrorInfo } from './utils/ErrorInfo';
import { Dropdown, DropdownButton, DropdownDivider, DropdownItem, DropdownMenu } from '../components/dropdown';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { ArrowDownTrayIcon, LockClosedIcon, QrCodeIcon } from '@heroicons/react/20/solid';
import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '../components/dialog';

import QRCode from 'react-qr-code';
import { Listbox, ListboxLabel, ListboxOption } from '../components/listbox';
import { SelectFormField } from './utils/SelectFormField';

export function EventView(props: { appVM: AppVM }) {
	const m = useMessageFormatSignal(messages);
	const msg = useMessageFormat(messages);
	const vm = useVM(() => new EventViewVM(m));
	const title = useSignalValue(vm.title);
	const stateInfo = useValue(vm.stateInfo);
	const registrationUrl = useValue(vm.registrationUrl.$value);

	const params = useParams();
	const eventId = params['eventId'] as string;

	vm.eventId.value = eventId;

	if (!title) {
		return <div>Loading ...</div>;
	}

	const onPersist = async () => {
		await vm.persist();
		props.appVM.refresh(); // better would be to use some event-bus system
	};

	return (
		<div className="mx-auto mx-w6xl">
			<QRCodeDialogContainer vm={vm} />
			<ViewHeader title={title}>
				<Dropdown>
					<DropdownButton plain aria-label={msg('Generic_MoreOptions')}>
						{msg('Generic_Actions')}
						<ChevronDownIcon />
					</DropdownButton>
					<DropdownMenu anchor="bottom end">
						<DropdownItem disabled={true} onClick={() => {}}>
							<LockClosedIcon data-slot="icon" />
							{msg('EventView_Lock')}
						</DropdownItem>
						<DropdownDivider />
						<DropdownItem
							onClick={() => vm.onOpenQRCodeDialog()}
							disabled={!registrationUrl.match(/^https?:\/\/.+\.\w{2,}/)}
						>
							<QrCodeIcon data-slot="icon" />
							{msg('EventView_QRCode_Generate')}
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
				<Button onClick={onPersist}>{msg('Generic_Save')}</Button>
			</ViewHeader>
			{stateInfo?.type === 'success' && (
				<div className="mt-6">
					<SuccessInfo
						title={msg('Generic_Success')}
						message={stateInfo.message}
						buttons={[]}
						onDismiss={() => vm.clearStateInfo()}
					/>
				</div>
			)}
			{stateInfo?.type === 'error' && (
				<div className="mt-6">
					<ErrorInfo
						title={msg('Generic_Error')}
						message={stateInfo.message}
						buttons={[]}
						onDismiss={() => vm.clearStateInfo()}
					/>
				</div>
			)}
			<Fieldset className="mt-10">
				<Legend>{msg('EventView_Title')}</Legend>
				<Text>{msg('EventView_Description')}</Text>
				<FieldGroup>
					<div className="flex gap-4">
						<TextFormField vm={vm.name} className="flex-grow" />
						<SelectFormField vm={vm.status} className="basis-3xs" />
					</div>

					<div className="flex gap-4">
						<TextFormField vm={vm.date} type="date" className="flex-grow" />
						<TextFormField vm={vm.time} type="time" className="flex-grow" />
					</div>
					<TextFormField vm={vm.registrationUrl} type="url" />
				</FieldGroup>
			</Fieldset>
		</div>
	);
}

function QRCodeDialogContainer(props: { vm: EventViewVM }) {
	const dialog = useValue(props.vm.qrDialog);
	return <>{dialog && <QRCodeDialog vm={dialog} />}</>;
}

function QRCodeDialog(props: { vm: QRCodeDialogVM }) {
	const m = useMessageFormat(messages);
	const [open, setOpen] = useState(false);
	const qrRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const title = m('EventView_QRCodeDialog_Title');
	const description = m('EventView_QRCodeDialog_Description');

	const close = props.vm.close.bind(props.vm);
	const [size, setSize] = useState(256);
	const msg = useMessageFormat(messages);

	useEffect(() => {
		const timeout = setTimeout(() => setOpen(true));
		return () => {
			clearTimeout(timeout);
		};
	}, []);

	const downloadQRCodePng = async () => {
		if (qrRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas?.getContext('2d', { alpha: false });
			if (!canvas || !ctx) return;
			ctx.save();
			ctx.clearRect(0, 0, size, size);
			ctx.scale(size / 25, size / 25);

			for (const p of qrRef.current.firstElementChild?.getElementsByTagName('path') || []) {
				ctx.fillStyle = p.getAttribute('fill') ?? 'red';
				ctx.fill(new Path2D(p.getAttribute('d') || ''));
			}
			ctx.restore();
			canvas.toBlob(blob => {
				if (!blob) return;
				window.open(URL.createObjectURL(blob));
			});
		}
	};

	const downloadQRCodeSvg = () => {
		if (qrRef.current) {
			window.open(URL.createObjectURL(new File([qrRef.current.innerHTML], 'qrcode.svg', { type: 'image/svg+xml' })));
		}
	};

	return (
		<Dialog open={open} onClose={() => {}}>
			<DialogTitle>{title}</DialogTitle>
			<DialogDescription>{description}</DialogDescription>
			<DialogBody>
				<div className="flex gap-4">
					<Listbox aria-label="QR Code Size" value={size} onChange={setSize} className="mb-4">
						<ListboxOption value={128}>
							<ListboxLabel>128x128</ListboxLabel>
						</ListboxOption>
						<ListboxOption value={256}>
							<ListboxLabel>256x256</ListboxLabel>
						</ListboxOption>
						<ListboxOption value={512}>
							<ListboxLabel>512x512</ListboxLabel>
						</ListboxOption>
					</Listbox>
					<Dropdown>
						<DropdownButton plain aria-label={msg('Generic_MoreOptions')} className="mb-4">
							<ArrowDownTrayIcon />
						</DropdownButton>
						<DropdownMenu anchor="bottom end">
							<DropdownItem onClick={downloadQRCodeSvg}>{msg('EventView_QRCodeDialog_Download_Svg')}</DropdownItem>
							<DropdownItem onClick={downloadQRCodePng}>{msg('EventView_QRCodeDialog_Download_Png')}</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>

				<div className="flex justify-center">
					<div ref={qrRef}>
						<QRCode size={size} value={props.vm.url}></QRCode>
					</div>
					<canvas
						ref={canvasRef}
						width={size}
						height={size}
						style={{ position: 'absolute', left: 0, top: 0, visibility: 'hidden' }}
					></canvas>
				</div>
			</DialogBody>
			<DialogActions>
				<Button plain onClick={close}>
					{m('Generic_Dismiss')}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
