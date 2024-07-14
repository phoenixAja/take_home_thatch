import { Field, Entry } from '../interfaces';
import { getAge, mapApiToField, isHSAEligible, getMaximumHSAContribution } from '../utils';

describe('mapApiToField', () => {
    it('should map API fields to Field interface', () => {
        const apiField = {
            'Date of birth': '1990-01-01',
            'Deductible': 2000,
            'Name': 'John Doe',
            'Plan type': 'Self-only'
        };

        const expectedField: Field = {
            dob: new Date('1990-01-01'),
            deductible: 2000,
            name: 'John Doe',
            planType: 'Self-only'
        };

        expect(mapApiToField(apiField)).toEqual(expectedField);
    });
});

describe('isHSAEligible', () => {
    it('should return true if the plan is HSA eligible', () => {
        // Create an entry with a deductible greater than the minimum deductible for the plan type (which for self-only is 1600)
        const entry: Entry = {
            id: '1',
            createdTime: new Date(),
            fields: {
                dob: new Date('1990-01-01'),
                deductible: 2000,
                name: 'John Doe',
                planType: 'Self-only'
            },
            HSAEligible: false,
            HSAMaxContribution: 0
        };

        expect(isHSAEligible(entry)).toBe(true);
    });

    it('should return false if the plan is not HSA eligible', () => {
        const entry: Entry = {
            id: '1',
            createdTime: new Date(),
            fields: {
                dob: new Date('1990-01-01'),
                deductible: 1000,
                name: 'John Doe',
                planType: 'Self-only'
            },
            HSAEligible: false,
            HSAMaxContribution: 0
        };

        expect(isHSAEligible(entry)).toBe(false);
    });
});

describe('getMaximumHSAContribution', () => {
    it('should return the maximum HSA contribution for a user under 55', () => {
        const entry: Entry = {
            id: '1',
            createdTime: new Date(),
            fields: {
                dob: new Date('1990-01-01'),
                deductible: 2000,
                name: 'John Doe',
                planType: 'Self-only'
            },
            HSAEligible: false,
            HSAMaxContribution: 0
        };

        expect(getMaximumHSAContribution(entry)).toBe(4150);
    });

    it('should return the maximum HSA contribution for a user 55 or older', () => {
        const entry: Entry = {
            id: '1',
            createdTime: new Date(),
            fields: {
                dob: new Date('1965-01-01'),
                deductible: 2000,
                name: 'John Doe',
                planType: 'Self-only'
            },
            HSAEligible: false,
            HSAMaxContribution: 0
        };

        expect(getMaximumHSAContribution(entry)).toBe(5150); // 4150 + 1000 (catch-up contribution)
    });
});

describe('getAge', () => {
    it('should return the correct age for a birthday today', () => {
        const today = new Date();
        const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
        expect(getAge(birthDate)).toBe(25);
    });

    it('should return the correct age for a birthday this year', () => {
        const today = new Date();
        const birthDate = new Date(today.getFullYear() - 25, today.getMonth() - 1, today.getDate());
        expect(getAge(birthDate)).toBe(25);
    });

    it('should return the correct age for a birthday next month', () => {
        const today = new Date();
        const birthDate = new Date(today.getFullYear() - 25, today.getMonth() + 1, today.getDate());
        expect(getAge(birthDate)).toBe(24);
    });

    it('should return the correct age for a birthday tomorrow', () => {
        const today = new Date();
        const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate() + 1);
        expect(getAge(birthDate)).toBe(24);
    });

    it('should return the correct age for a birthday yesterday', () => {
        const today = new Date();
        const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate() - 1);
        expect(getAge(birthDate)).toBe(25);
    });
});
