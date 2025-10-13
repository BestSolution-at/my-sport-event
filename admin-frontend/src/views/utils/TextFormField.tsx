import { ErrorMessage, Field, Label } from '../../components/fieldset';
import { Input } from '../../components/input';
import { useSignal, useValue, type TextFormField } from './utils';

export function TextFormField(props: {
	vm: TextFormField;
	type?:
		| 'email'
		| 'number'
		| 'password'
		| 'search'
		| 'tel'
		| 'text'
		| 'url'
		| 'date'
		| 'datetime-local'
		| 'month'
		| 'time'
		| 'week';
	className?: string;
}) {
	const label = useValue(props.vm.label);
	const [value, setValue] = useSignal(props.vm.value);
	const error = useValue(props.vm.validationError);

	return (
		<Field className={props.className}>
			<Label>{label}</Label>
			<Input
				required
				type={props.type}
				value={value}
				onChange={e => {
					setValue(e.target.value);
				}}
				invalid={error.length > 0}
			/>
			{error && <ErrorMessage>{error}</ErrorMessage>}
		</Field>
	);
}
