/* eslint-disable  no-unused-vars */
import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import defaultImage from '../default.jpg'

import AppBar from '../components/AppBar'
import { fetchUser, deleteUser } from '../util/api';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function StuProfile () {
  const navigate = useNavigate()
  const { userId } = useParams()
  const [student, setStudent] = React.useState({})
  const [isTutor, setIsTutor] = React.useState(true)
  const [isSelf, setIsSelf] = React.useState(false)

  React.useEffect(() => {
    fetchUser().then(body => {
      if (body._id !== userId) navigate('/login');
      setStudent(body)
    })
    if (localStorage.getItem('Authorization')) {
      fetchUser().then(body => {
        setIsTutor(body.tutor)
        if (body._id === userId) setIsSelf(true)
      })
    }
  }, []);

  const handleDeleteAccount = () => {
    if (window.confirm('Warning: are you sure you want to permanently delete this account?')) {
      deleteUser().then(() => {
        localStorage.removeItem('Authorization');
        window.location.href = '/'
      })
    }
  }

  return (
  <>
    <AppBar pageTitle='Student Profile' homeButton />
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Card variant='outlined' sx={{
        justifyContent: 'center',
        alignContent: 'center',
        margin: '5px',
        width: '25%',
        minWidth: '300px',
        boxShadow: '#333 1px 1px 3px',
      }}>
        <CardContent>
          <Typography variant='h5' sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
            Name: { student.name }
          </Typography>
          <CardMedia
            sx={{ objectFit: 'contain', width: '100%' }}
            component='img'
            image={ (!student.pic) ? defaultImage : student.pic }
            alt='Tutor Image'
          />
          <Typography variant='h6' sx={{ wordBreak: 'break-word' }}>
            Email: { student.email }
          </Typography>
        </CardContent>
        <CardActions>
          {isSelf && <Button variant='contained' endIcon={<EditIcon />} onClick={() => {
            navigate('edit', { replace: false })
          }}>Edit</Button>}
          {isSelf && <Button variant="contained" endIcon={<DeleteForeverIcon />} color="error" onClick={handleDeleteAccount}>Delete</Button>}
        </CardActions>
      </Card>
    </Box>
  </>
  )
}

export default StuProfile;
