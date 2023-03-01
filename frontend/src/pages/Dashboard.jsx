import React from 'react';

import AppBar from '../components/AppBar'
import AppointmentCard from '../components/AppointmentCard';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { fetchUser, getAppointments } from '../util/api';

function Dashboard () {
  const [isTutor, setIsTutor] = React.useState(false)
  const [refresh, setRefresh] = React.useState(false)
  const [incomingRequests, setIncomingRequests] = React.useState([])
  const [outgoingRequests, setOutgoingRequests] = React.useState([])
  const [approvedAppointments, setApprovedAppointments] = React.useState([])
  const [declinedAppointments, setDeclinedAppointments] = React.useState([])
  const [unpaidCompletedAppointments, setUnpaidCompletedAppointments] = React.useState([])
  const [paidCompletedAppointments, setPaidCompletedAppointments] = React.useState([])

  React.useEffect(() => {
    if (refresh) {
      getAppointments().then(appointments => {
        const incoming = []
        const outgoing = []
        const approved = []
        const declined = []
        const unpaidCompleted = []
        const paidCompleted = []
        for (const index in appointments) {
          if (appointments[index].status === 'pending') {
            if ((appointments[index].sender === 'tutor') !== isTutor) incoming.push(appointments[index])
            else outgoing.push(appointments[index])
          } else if (appointments[index].status === 'approved') approved.push(appointments[index])
          else if (appointments[index].status === 'declined') declined.push(appointments[index])
          else if (appointments[index].status === 'completed') {
            if (appointments[index].price.status === 'unpaid') unpaidCompleted.push(appointments[index])
            else paidCompleted.push(appointments[index])
          }
        }
        setIncomingRequests(incoming)
        setOutgoingRequests(outgoing)
        setApprovedAppointments(approved)
        setDeclinedAppointments(declined)
        setUnpaidCompletedAppointments(unpaidCompleted)
        setPaidCompletedAppointments(paidCompleted)
      })
    }
    setRefresh(false)
  }, [refresh]);

  React.useEffect(() => {
    fetchUser().then(body => {
      setIsTutor(body.tutor)
      setRefresh(true)
    })
  }, []);

  return (
    <>
      <AppBar pageTitle={'Personal Dashboard'} homeButton protect />
      <Box
        height='1'
        width='1'
        display='flex'
        flexDirection='column'
        justifyContent='center'
      >
          <Card variant='outlined' sx={{
            justifyContent: 'center',
            alignContent: 'center',
            margin: '5px',
            height: '20%',
            padding: '10px',
            boxShadow: '#333 1px 1px 3px',
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Incoming Appointment Requests
            </Typography>
            {!incomingRequests.length && <Typography variant="h6">
              No Incoming Appointment Requests
            </Typography>}
            {incomingRequests.length > 0 && <Box sx={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }}>
              { incomingRequests.map((appointment) => (
                <AppointmentCard key={ appointment._id } appointment={ appointment } setRefresh={setRefresh} incoming/>
              ))}
            </Box>}
          </Card>
          <br/>
          <Card variant='outlined' sx={{
            justifyContent: 'center',
            alignContent: 'center',
            margin: '5px',
            height: '20%',
            padding: '10px',
            boxShadow: '#333 1px 1px 3px',
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Outgoing Appointment Requests
            </Typography>
            {!outgoingRequests.length && <Typography variant="h6">
              No Outgoing Appointment Requests
            </Typography>}
            {outgoingRequests.length > 0 && <Box sx={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }}>
              { outgoingRequests.map((appointment) => (
                <AppointmentCard key={ appointment._id } appointment={ appointment } setRefresh={setRefresh} outgoing/>
              ))}
            </Box>}
          </Card>
          <br/>
          <Card variant='outlined' sx={{
            justifyContent: 'center',
            alignContent: 'center',
            margin: '5px',
            height: '20%',
            padding: '10px',
            boxShadow: '#333 1px 1px 3px',
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Approved Appointments
            </Typography>
            {!approvedAppointments.length && <Typography variant="h6">
              No Upcoming Appointments
            </Typography>}
            {approvedAppointments.length > 0 && <Box sx={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }}>
              { approvedAppointments.map((appointment) => (
                <AppointmentCard key={ appointment._id } appointment={ appointment } setRefresh={setRefresh}/>
              ))}
            </Box>}
          </Card>
          <br/>
          <Card variant='outlined' sx={{
            justifyContent: 'center',
            alignContent: 'center',
            margin: '5px',
            height: '20%',
            padding: '10px',
            boxShadow: '#333 1px 1px 3px',
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Declined Appointments
            </Typography>
            {!declinedAppointments.length && <Typography variant="h6">
              No Declined Appointments
            </Typography>}
            {declinedAppointments.length > 0 && <Box sx={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }}>
              { declinedAppointments.map((appointment) => (
                <AppointmentCard key={ appointment._id } appointment={ appointment } setRefresh={setRefresh}/>
              ))}
            </Box>}
          </Card>
          <br/>
          <Card variant='outlined' sx={{
            justifyContent: 'center',
            alignContent: 'center',
            margin: '5px',
            height: '20%',
            padding: '10px',
            boxShadow: '#333 1px 1px 3px',
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Unpaid Completed Appointments
            </Typography>
            {!unpaidCompletedAppointments.length && <Typography variant="h6">
              No Unpaid Completed Appointments
            </Typography>}
            {unpaidCompletedAppointments.length > 0 && <Box sx={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }}>
              { unpaidCompletedAppointments.map((appointment) => (
                (isTutor) ? <AppointmentCard key={ appointment._id } appointment={ appointment } setRefresh={setRefresh} unpaid isTutor/> : <AppointmentCard key={ appointment._id } appointment={ appointment } setRefresh={setRefresh} unpaid/>
              ))}
            </Box>}
          </Card>
          <br/>
          <Card variant='outlined' sx={{
            justifyContent: 'center',
            alignContent: 'center',
            margin: '5px',
            height: '20%',
            padding: '10px',
            boxShadow: '#333 1px 1px 3px',
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Completed Appointments
            </Typography>
            {!paidCompletedAppointments.length && <Typography variant="h6">
              No Completed Appointments
            </Typography>}
            {paidCompletedAppointments.length > 0 && <Box sx={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }}>
              { paidCompletedAppointments.map((appointment) => (
                <AppointmentCard key={ appointment._id } appointment={ appointment } setRefresh={setRefresh}/>
              ))}
            </Box>}
          </Card>
      </Box>
    </>
  )
}

export default Dashboard;
