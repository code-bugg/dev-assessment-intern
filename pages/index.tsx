import { employees } from "../data/employees";
import { Schedule, Shift, Employee } from "../types";


import * as React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button } from "@mui/material";
/*  Above are the imports needed for the Material-UI table and select components.   */

const days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const options: Shift[] = ["Off", "Early", "Late"];

export default function Home() {
  const rows: number = employees.length;
  const cols: number = days.length;
  const defaultDayValue: Shift = "Off";
  const [cellValues, setCellValues] = React.useState<Shift[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(defaultDayValue))
  );
  /* Initialize the table cells with "Off" and create the cell useState hook */
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (row: number, col: number, value: Shift) => {
    const newValues: Shift[][] = cellValues.map(arr => [...arr]);
    newValues[row][col] = value;
    /* function to update the cell value when a user selects a shift */
    setCellValues(newValues);
  };

  const save = () => {
    const schedule = employees.map((emp, rowIdx) => {
    const shifts: Record<string, Shift> = {};
    
    days.forEach((day, colIdx) => {
        shifts[day] = cellValues[rowIdx][colIdx];
      });
      return { id: emp.id, name: emp.name, shifts };
    });


    let errorMsg: string = "";  /* Initialize an empty error message string,
                           an error mesage will be concatenated to it */

    employees.forEach((emp, rowIdx) => {
      const shiftCount: number = cellValues[rowIdx].filter(v => v !== "Off").length;
      if (shiftCount > 5) {
        errorMsg += `Employee ${emp.name} (ID: ${emp.id}) has ${shiftCount} shifts. Max allowed is 5.\n`;
      }
    });

    setError(errorMsg.trim());
    /* unforntunately, I couldn't get the supabase to work
        so I will just log the schedule to the console */
    if (!errorMsg) {
      console.log(JSON.stringify(schedule, null, 2));
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Shift Planner</h1>
      <TableContainer component={Paper} sx={{ maxWidth: 1100 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Employee</TableCell>
              {days.map(day => (
                <TableCell key={day}>{day}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp, rowIdx) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.id}</TableCell>
                <TableCell>{emp.name}</TableCell>
                {days.map((day, colIdx) => (
                  <TableCell key={day}>
                    <Select
                      value={cellValues[rowIdx][colIdx]}
                      onChange={e => handleChange(rowIdx, colIdx, e.target.value as Shift)}
                      size="small"
                      variant="outlined"
                      sx={{ minWidth: 80 }}
                    >
                      {options.map(opt => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="my-4">
        <Button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={save}
        >
          Save
        </Button>
      </div>
      {error && (
        <div className="text-red-600 whitespace-pre-line mb-4">{error}</div>
      )}
    </main>
  );
}
