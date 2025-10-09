import { computed, signal, type ReadonlySignal, type Signal } from '@preact/signals';
import { useEffect, useRef, useState } from 'react';

export function parseFormattedInteger(text: string): number {
	return parseInt(text.replaceAll(/\\D/g, ''));
}

export function compare(x: unknown, y: unknown): 0 | 1 | -1 {
	if (x === y) {
		return 0;
	}
	if (typeof x === 'number' && typeof y === 'number') {
		return x > y ? 1 : -1;
	}
	return String(x) > String(y) ? 1 : -1;
}

export function compareProps<T extends Record<string, unknown>>(a: T, b: T, props: (keyof T)[]): 0 | 1 | -1 {
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

export function useSignal<T>(signal: Signal<T>): [T, (v: T) => void] {
	const [value, setValue] = useState(signal.value);
	useEffect(() => {
		signal.subscribe(console.log);
		const sub = signal.subscribe(setValue);
		return () => {
			sub();
		};
	}, [signal]);
	return [value, (v: T) => (signal.value = v)];
}

export type Message<K> = (key: K, variables?: Record<string, unknown>) => string;
export type MessageKeys<T extends { [lang: string]: Record<string, string> }> = keyof T[keyof T];

export type FormField<T> = {
	readonly label: ReadonlySignal<string>;
	readonly validationError: ReadonlySignal<string>;
	readonly value: Signal<T>;
	validate(): boolean;
};

export type FormFieldProps<T> = {
	readonly label: string | ReadonlySignal<string>;
	readonly initialValue: T;
	readonly validation: (v: T) => string;
};

export type TextFormField = FormField<string>;
export type TextFormFieldProps = FormFieldProps<string>;

export type Item<T> = {
	readonly value: T;
	readonly label: string;
};

export type SelectFormField<T> = FormField<T> & {
	readonly items: Signal<readonly Item<T>[]>;
};

function toReadonlySignal(value: string | ReadonlySignal<string>): ReadonlySignal<string> {
	if (typeof value === 'string') {
		return computed(() => value);
	}
	return value;
}

class TextFormFieldImpl implements TextFormField {
	public readonly label: ReadonlySignal<string>;
	public readonly value: Signal<string>;
	public readonly validationError: Signal<string>;

	private readonly validation: (v: string) => string;

	constructor(props: TextFormFieldProps) {
		this.label = toReadonlySignal(props.label);
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
