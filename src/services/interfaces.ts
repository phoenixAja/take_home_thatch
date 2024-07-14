export interface Field {
    dob: Date;
    deductible: number;
    name: string;
    planType: string;
}

export interface Entry {
    id: string;
    createdTime: Date;
    fields: Field;
    HSAEligible: boolean;
    HSAMaxContribution: number;
}
