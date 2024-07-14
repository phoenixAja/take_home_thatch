import axios from 'axios';
import { Entry } from './interfaces';
import { mapApiToField, isHSAEligible, getMaximumHSAContribution } from './utils';
import { AIRTABLE_API_KEY } from './constants';

const fetchData = async (): Promise<Entry[]> => {
    try {
        const response = await axios.get('https://api.airtable.com/v0/appekA493GuXz8uDK/tbllLFdZDMfLjAT4N', {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            },
        });

        const records = response.data.records.map((record: any) => {
            return {
                id: record.id,
                createdTime: new Date(record.createdTime),
                fields: mapApiToField(record.fields),
            } as Entry;
        });

        const recordsWithHSAInfo = records.map((record: Entry) => {
            return {
                ...record,
                HSAEligible: isHSAEligible(record),
                HSAMaxContribution: getMaximumHSAContribution(record),
            };
        });

        return recordsWithHSAInfo;
    } catch (error) {
        // TODO: Log errors with a monitoring service such as sentry
        throw error;
    }
};

export { fetchData };