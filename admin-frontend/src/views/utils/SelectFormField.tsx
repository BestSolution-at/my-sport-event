import { Field, Label } from '../../components/fieldset';
import { Listbox, ListboxLabel, ListboxOption } from '../../components/listbox';
import { useSignal, useValue, type SelectFormField } from './utils';

export function SelectFormField<T>(props: { vm: SelectFormField<T>; className?: string }) {
	const [value, setValue] = useSignal(props.vm.$value);
	const label = useValue(props.vm.$label);
	const disabled = useValue(props.vm.$disabled);
	const items = useValue(props.vm.$items);

	return (
		<Field className={props.className}>
			<Label>{label}</Label>
			<Listbox value={value} onChange={setValue} disabled={disabled}>
				{items.map(item => (
					<ListboxOption key={props.vm.computeItemKey(item)} value={item.value}>
						<ListboxLabel>{item.label}</ListboxLabel>
					</ListboxOption>
				))}
			</Listbox>
		</Field>
	);
}
