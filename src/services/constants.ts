// src/constants.ts
export const HDHPMinimumDeductiblePlanMapping: { [key: string]: number } = {
    "Self-only": 1600,
    "Family": 3200,
};

export const HSAContributionLimit: { [key: string]: number } = {
    "Self-only": 4150,
    "Family": 8300,
};

export const HSACatchUpContribution = 1000;

// TODO: add Airtable API key to a secret manager
export const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;