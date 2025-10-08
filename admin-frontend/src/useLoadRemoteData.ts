import { useEffect, useRef, useState } from 'react';
import objectHash from 'object-hash';
import type { Result } from './remote/_result-utils';

export type LoadingData<T> = [T, false] | [null, true];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RemoteConfig<T extends (...params: any[]) => Promise<Result<any, any>>> = {
	readonly key: string;
	readonly block: T;
	readonly parameters: Parameters<T>;
};

type Cache<T> = {
	key: string;
	hash: string;
	parameters: T | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useLoadRemoteData<T extends (...params: any[]) => Promise<Result<any, any>>>(
	config: RemoteConfig<T>
): LoadingData<Awaited<ReturnType<T>>> {
	const { key, block, parameters } = config;
	const [loadState, setLoadState] = useState<LoadingData<Awaited<ReturnType<T>>>>(() => [null, true]);
	const called = useRef<Cache<Parameters<T>>>(null);

	useEffect(() => {
		const curParams = called.current;
		let hash;
		if (
			curParams === null ||
			curParams.key !== key ||
			(curParams.parameters !== parameters && curParams.hash !== (hash = objectHash(parameters)))
		) {
			hash = hash ?? objectHash(parameters);
			called.current = { key, hash, parameters };
			setLoadState([null, true]);
			async function fetchData() {
				const result = await block(...parameters);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				setLoadState([result as any, false]);
			}
			fetchData();
		}
	}, [key, block, parameters]);
	return loadState;
}
