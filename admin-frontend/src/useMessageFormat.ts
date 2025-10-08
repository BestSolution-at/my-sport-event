import { MessageFormatter } from '@internationalized/message';
import { type LocalizedStrings } from '@internationalized/string';
import { useLocale, useLocalizedStringDictionary } from '@react-aria/i18n';
import { useCallback, useMemo } from 'react';

export function useMessageFormat<K extends string = string>(
	strings: LocalizedStrings<K, string>
): (key: K, variables?: Record<string, unknown>) => string {
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
