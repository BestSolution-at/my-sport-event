import type { AllMessages } from '../../messages';
import { isBirthyearCohort, type Cohort, type Gender } from '../../remote/model';
import { compare, compareProps } from '../utils/utils';

export type StateInfo = {
	type: 'success' | 'error';
	message: string;
};

export function cohortSort(a: Cohort, b: Cohort) {
	const autoAssignA = a.autoAssign ? 0 : 1;
	const autoAssignB = b.autoAssign ? 0 : 1;
	const autoAssignSort = compare(autoAssignA, autoAssignB);
	if (autoAssignSort !== 0) {
		return autoAssignSort;
	}
	const typeA = isBirthyearCohort(a) ? 0 : 1;
	const typeB = isBirthyearCohort(b) ? 0 : 1;
	const typeSort = compare(typeA, typeB);
	if (typeSort !== 0) {
		return typeSort;
	}
	const genderA = genderToString(a.gender);
	const genderB = genderToString(b.gender);
	const genderSort = compare(genderA, genderB);
	if (genderSort !== 0) {
		return genderSort;
	}
	if (isBirthyearCohort(a) && isBirthyearCohort(b)) {
		const minCompare = compare(a.min, b.min) * -1;
		if (minCompare !== 0) {
			return minCompare;
		}
		return compareProps(a, b, ['name', 'key']);
	}
	return compareProps(a, b, ['name', 'key']);
}

export function genderToString(gender: Gender) {
	if (gender === 'ALL') {
		return 'Männlich & Weiblich';
	} else if (gender === 'FEMALE') {
		return 'Weiblich';
	}
	return 'Männlich';
}

export function translateGender(
	gender: Gender,
	messages: AllMessages,
	allKey: 'Generic_Male_Female' | 'Generic_NoData' = 'Generic_Male_Female'
) {
	if (gender === 'ALL') {
		return messages(allKey);
	} else if (gender === 'FEMALE') {
		return messages('Generic_Female');
	}
	return messages('Generic_Male');
}
