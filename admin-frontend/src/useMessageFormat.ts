import { MessageFormatter } from '@internationalized/message';
import { type LocalizedStrings } from '@internationalized/string';
import { useLocale, useLocalizedStringDictionary } from '@react-aria/i18n';
import { useCallback, useMemo, useRef } from 'react';
import { type Message } from './views/utils/utils';
import { Signal, signal, type ReadonlySignal } from '@preact/signals';

export function useMessageFormat<K extends string = string>(strings: LocalizedStrings<K, string>): Message<K> {
	const locale = useLocale();
	const dictonary = useLocalizedStringDictionary(strings);
	const formatter = useMemo(() => new MessageFormatter(locale.locale, dictonary), [locale, dictonary]);
	return useCallback(
		(key, variables) => {
			return formatter.format(key, variables) as string;
		},
		[formatter]
	);
}

export function useMessageFormatSignal<K extends string = string>(
	strings: LocalizedStrings<K, string>
): ReadonlySignal<Message<K>> {
	const messageFunc = useMessageFormat(strings);
	const signalRef = useRef<Signal<Message<K>>>(null);
	if (signalRef.current === null) {
		signalRef.current = signal(messageFunc);
	}
	signalRef.current.value = messageFunc;
	return signalRef.current;
}

/*export function useDateFormatterSignal(options: DateFormatterOptions): ReadonlySignal<DateFormatter> {
	const formatter = useDateFormatter(options);
	const signalRef = useRef<Signal<DateFormatter>>(null);
	if (signalRef.current === null) {
		signalRef.current = signal(formatter);
	}
	signalRef.current.value = formatter;
	return signalRef.current;
}*/

export function useLocaleSignal() {
	const locale = useLocale();
	const singalRef = useRef<Signal<string>>(null);
	if (singalRef.current === null) {
		singalRef.current = signal(locale.locale);
	}
	singalRef.current.value = locale.locale;
	return singalRef.current;
}
