import { Checkbox, CheckboxField } from '../../components/checkbox';
import { ErrorMessage, Label } from '../../components/fieldset';
import { useSignal, useValue, type CheckBoxFormField } from './utils';

export function CheckBoxFormField(props: { vm: CheckBoxFormField; className?: string }) {
	const label = useValue(props.vm.label);
	const [value, setValue] = useSignal(props.vm.value);
	const error = useValue(props.vm.validationError);

	return (
		<CheckboxField className={props.className}>
			<Checkbox checked={value} onChange={setValue} />
			<Label>{label}</Label>
			{error && <ErrorMessage>{error}</ErrorMessage>}
		</CheckboxField>
	);
}
