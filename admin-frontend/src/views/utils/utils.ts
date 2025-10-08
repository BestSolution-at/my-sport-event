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
