import React from 'react';
import PropTypes from 'prop-types'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import InputAdornment from '@mui/material/InputAdornment';

import { postAppointment } from '../util/api';

const deliveryOptions = [
  {
    value: 'face-to-face',
    label: 'Face to Face'
  },
  {
    value: 'online',
    label: 'Online'
  },
];

export default function AppointmentDialog ({ open, handleClose, tutorId, studentId }) {
  const [price, setPrice] = React.useState('')
  const [duration, setDuration] = React.useState('')
  const [delivery, setDelivery] = React.useState('')
  const [date, setDate] = React.useState(dayjs());
  const [subject, setSubject] = React.useState('')

  const handleSubmit = (e) => {
    if (duration && delivery && date && subject) {
      postAppointment(tutorId, studentId, `${price} AUD`, duration, delivery, date.format('YYYY,MM,DD,H,m'), subject).then(body => {
        if (body.message) alert(body.message)
        else handleClose()
      })
    } else {
      alert('Please fill all fields')
    }
  }

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>
          Create an Appointment Request
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: '400px', justifyContent: 'space-evenly' }}>
          <TextField
            required
            type='number'
            label="Price for Whole Appointment"
            value={price}
            fullWidth
            onChange={(e) => setPrice(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
          />
          <TextField
            required
            type='number'
            label="Duration of Appointment in Minutes"
            value={duration}
            fullWidth
            onChange={(e) => setDuration(e.target.value)}
            InputProps={{ endAdornment: <InputAdornment position='end'>mins</InputAdornment> }}
          />
          <TextField
            required
            select
            fullWidth
            label='Mode of Delivery'
            value={delivery}
            onChange={(event) => setDelivery(event.target.value)}
          >
            {deliveryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Pick a Date and Time for the Start of the Appointment *"
              value={date}
              onChange={(newVal) => setDate(newVal)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            required
            type='text'
            label="Course Code of Subject"
            value={subject}
            fullWidth
            onChange={(e) => setSubject(e.target.value.toUpperCase())}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit" color="success" onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

AppointmentDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  tutorId: PropTypes.string,
  studentId: PropTypes.string
}
