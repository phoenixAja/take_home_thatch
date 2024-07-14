import { Field, Entry } from './interfaces';
import { HDHPMinimumDeductiblePlanMapping, HSAContributionLimit, HSACatchUpContribution } from './constants';

// Mapping function to convert API fields to Field interface
export const mapApiToField = (apiField: any): Field => {
    return {
        dob: new Date(apiField['Date of birth']),
        deductible: apiField['Deductible'],
        name: apiField['Name'],
        planType: apiField['Plan type'],
    };
};

export const isHSAEligible = (entry: Entry): boolean => {
    const planType = entry.fields.planType;
    const deductible = entry.fields.deductible;
    const HDHPMinimalDeductible = HDHPMinimumDeductiblePlanMapping[planType];
    // If deductible is greater than the minimum deductible for the plan type, the plan is HSA eligible
    return deductible > HDHPMinimalDeductible;
};

export const getAge = (dob: Date): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export const getMaximumHSAContribution = (entry: Entry): number => {
    const planType = entry.fields.planType;
    const contributionLimit = HSAContributionLimit[planType];
    const dob = new Date(entry.fields.dob);
    // TODO: age should also take into account the month and day of birth
    const age = getAge(dob);
    return age >= 55 ? contributionLimit + HSACatchUpContribution : contributionLimit;
};
