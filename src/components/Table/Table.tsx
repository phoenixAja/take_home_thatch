import React, { useState, useEffect } from "react";
import { fetchData } from "../../services/api";
import { Entry } from "../../services/interfaces";
import { booleanToYesNo } from "./utils";
import TableMUI from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export function Table() {
    const [data, setData] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const result = await fetchData();
                setData(result);
                setLoading(false);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unexpected error occurred, please contact support.");
                }
                setLoading(false);
            }
        };
        fetchDataAsync();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <TableContainer component={Paper}>
            <TableMUI sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="left">dob</TableCell>
                        <TableCell align="left">deductible</TableCell>
                        <TableCell align="left">plan Type</TableCell>
                        <TableCell align="left">HSA Eligible</TableCell>
                        <TableCell align="left">HSA max contribution</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.fields.name}
                            </TableCell>
                            <TableCell align="left">{row.fields.dob.toLocaleDateString()}</TableCell>
                            <TableCell align="left">{row.fields.deductible}</TableCell>
                            <TableCell align="left">{row.fields.planType}</TableCell>
                            <TableCell align="left">{booleanToYesNo(row.HSAEligible)}</TableCell>
                            <TableCell align="left">{row.HSAMaxContribution}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </TableMUI>
        </TableContainer>
    );
}