import { Signal, signal, type ReadonlySignal } from '@preact/signals';
import { useEffect, useRef, useState } from 'react';
import type { Result } from '../../remote/_result-utils';
import type { AllMessageKeys } from '../../messages';
import { useParams } from 'react-router';

export function parseFormattedInteger(text: string): number {
	return parseInt(text.replaceAll(/\\D/g, ''));
}

export function compare(x: unknown, y: unknown): number {
	if (x === y) {
		return 0;
	}
	if (typeof x === 'number' && typeof y === 'number') {
		return x > y ? 1 : -1;
	}
	return String(x).localeCompare(String(y));
}

export function validateRequired(v: string, l10n: (key: AllMessageKeys) => string) {
	return v.trim().length === 0 ? l10n('Generic_Required_Field') : '';
}

export function compareProps<T extends Record<string, unknown>>(a: T, b: T, props: (keyof T)[]): number {
	for (const p of props) {
		const result = compare(a[p], b[p]);
		if (result !== 0) {
			return result;
		}
	}
	return 0;
}

export function useVM<T>(factory: () => T): T {
	const ref = useRef<T>(null);
	if (ref.current === null) {
		ref.current = factory();
	}
	return ref.current;
}

export function useSignalValue<T>(signal: ReadonlySignal<T>): T {
	const [value, setValue] = useState(signal.value);
	useEffect(() => {
		const sub = signal.subscribe(setValue);
		return () => {
			sub();
		};
	}, [signal]);
	return value;
}

export function useValue<T>(signal: ReadonlySignal<T> | T): T {
	const [value, setValue] = useState(isReadonlySignal(signal) ? signal.value : signal);
	useEffect(() => {
		if (isReadonlySignal(signal)) {
			const sub = signal.subscribe(setValue);
			return () => {
				sub();
			};
		} else {
			setValue(signal);
		}
	}, [signal]);
	return value;
}

export function useSignal<T>(signal: Signal<T>): [T, (v: T) => void] {
	const [value, setValue] = useState(signal.value);
	useEffect(() => {
		const sub = signal.subscribe(setValue);
		return () => {
			sub();
		};
	}, [signal]);
	return [value, (v: T) => (signal.value = v)];
}

export function useParamSignal<T>(key: string, defaultValue: T, typeguard: (value: unknown) => value is T) {
	const params = useParams();
	const value = params[key];
	const ref = useRef<Signal<T>>(null);
	if (ref.current === null) {
		ref.current = signal<T>(defaultValue);
	}

	if (typeguard(value)) {
		ref.current.value = value;
	}
	return ref.current;
}

export function isString(value: unknown): value is string {
	return typeof value === 'string';
}

export type Message<K> = (key: K, variables?: Record<string, unknown>) => string;
export type MessageKeys<T extends { [lang: string]: Record<string, string> }> = keyof T[keyof T];

export type ReadonlyValueSignal<T> = T | ReadonlySignal<T>;

export type FormField<T> = {
	readonly label: ReadonlyValueSignal<string>;
	readonly validationError: ReadonlySignal<string>;
	readonly value: Signal<T>;
	readonly disabled: ReadonlyValueSignal<boolean>;
	validate(): boolean;
};

export type FormFieldProps<T> = {
	readonly label: ReadonlyValueSignal<string>;
	readonly disabled?: ReadonlyValueSignal<boolean>;
	readonly initialValue: T;
	readonly validation: (v: T) => string;
};

export type TextFormField = FormField<string>;
export type TextFormFieldProps = FormFieldProps<string>;

export type Item<T> = {
	readonly key?: string;
	readonly value: T;
	readonly label: string;
};

export type SelectFormField<T> = FormField<T> & {
	readonly items: ReadonlyValueSignal<readonly Item<T>[]>;
	computeItemKey(item: Item<T>): string;
};

export type SelectFormFieldProps<T> = FormFieldProps<T> & {
	readonly items: ReadonlyValueSignal<readonly Item<T>[]>;
};

let counter = 0;

function createKey(prefix: string) {
	return `${prefix}-${counter++}`;
}

class SelectFormFieldImpl<T> implements SelectFormField<T> {
	public readonly label: ReadonlyValueSignal<string>;
	public readonly items: Signal<readonly Item<T>[]>;
	public readonly value: Signal<T>;
	public readonly validationError: Signal<string>;
	public readonly disabled: ReadonlyValueSignal<boolean>;

	private readonly validation: (v: T) => string;

	private readonly key = createKey('SelectFormFieldImpl');

	constructor(props: SelectFormFieldProps<T>) {
		this.label = props.label;
		this.disabled = props.disabled ?? false;
		this.value = signal(props.initialValue);
		this.items = isReadonlySignal(props.items) ? props.items : signal(props.items);

		this.validationError = signal('');
		this.validation = props.validation;
	}

	computeItemKey(item: Item<T>): string {
		if (item.key !== undefined) {
			return `${this.key}-${item.key}`;
		}
		return `${this.key}-${String(item.value)}`;
	}

	validate() {
		this.validationError.value = this.validation(this.value.value);
		return this.validationError.value.length === 0;
	}
}

export function createSelectFormField<T>(props: SelectFormFieldProps<T>): SelectFormField<T> {
	return new SelectFormFieldImpl<T>(props);
}

function isReadonlySignal<T>(value: unknown): value is ReadonlySignal<T> {
	return value instanceof Signal;
}

class TextFormFieldImpl implements TextFormField {
	public readonly label: ReadonlyValueSignal<string>;
	public readonly value: Signal<string>;
	public readonly validationError: Signal<string>;
	public readonly disabled: ReadonlyValueSignal<boolean>;

	private readonly validation: (v: string) => string;

	constructor(props: TextFormFieldProps) {
		this.label = props.label;
		this.disabled = props.disabled ?? false;
		this.value = signal(props.initialValue);

		this.validationError = signal('');
		this.validation = props.validation;
	}

	validate() {
		this.validationError.value = this.validation(this.value.value);
		return this.validationError.value.length === 0;
	}
}

export function createTextField(props: TextFormFieldProps): TextFormField {
	return new TextFormFieldImpl(props);
}

export type CheckBoxFormField = FormField<boolean>;
export type CheckBoxFormFieldProps = FormFieldProps<boolean>;

class CheckBoxFormFieldImpl implements CheckBoxFormField {
	public readonly label: ReadonlyValueSignal<string>;
	public readonly value: Signal<boolean>;
	public readonly validationError: Signal<string>;
	public readonly disabled: ReadonlyValueSignal<boolean>;

	private readonly validation: (v: boolean) => string;

	constructor(props: CheckBoxFormFieldProps) {
		this.label = props.label;
		this.disabled = props.disabled ?? false;
		this.value = signal(props.initialValue);

		this.validationError = signal('');
		this.validation = props.validation;
	}

	validate() {
		this.validationError.value = this.validation(this.value.value);
		return this.validationError.value.length === 0;
	}
}

export function createCheckBoxField(props: CheckBoxFormFieldProps): CheckBoxFormField {
	return new CheckBoxFormFieldImpl(props);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRemoteFunction<T extends (...params: any[]) => Promise<Result<any, any>>>(
	fn: T,
	resultHandler: (result: Awaited<ReturnType<T>>) => void
) {
	let invocationCount = 0;
	return (...parameters: Parameters<T>) => {
		async function invoke() {
			const cur = (invocationCount += 1);
			const result = await fn(...parameters);
			if (cur === invocationCount) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				resultHandler(result as any);
			}
		}
		invoke();
	};
}

export function emptyAsUndefined(value: string): string | undefined {
	return value.trim().length === 0 ? undefined : value;
}

export function nullAsUndefined<T>(value: T | null): T | undefined {
	return value === null ? undefined : value;
}
