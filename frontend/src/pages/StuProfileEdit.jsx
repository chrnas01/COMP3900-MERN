import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AppBar from '../components/AppBar'
import { fetchUser, userEdit } from '../util/api';
import { fileToDataUrl } from '../util/helper';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';

const StuProfileEdit = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [file, setFile] = React.useState(null)
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [invalidPswd, setInvalidPswd] = React.useState(false)
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [pswdError, setPswdError] = React.useState(false)

  // on page load
  React.useEffect(() => {
    fetchUser().then(body => {
      if (body._id !== userId) navigate('/login');
      setName(body.name);
      setEmail(body.email);
    })
  }, [])

  const saveChanges = () => {
    const reqBody = {};
    if (file) {
      try {
        fileToDataUrl(file).then(dataUrl => {
          reqBody.pic = dataUrl
          if (name) reqBody.name = name;
          if (email) reqBody.email = email;
          if (password && confirmPassword) {
            if (password === confirmPassword) reqBody.password = password;
            else {
              alert('New password does not match confirm password');
              return;
            }
          }

          userEdit(reqBody).then(body => {
            if (body.message) alert(body.message)
            else navigate(`/${userId}`)
          })
        })
      } catch (err) {
        setFile(null)
        alert(err.message)
      }
    } else {
      if (name) reqBody.name = name;
      if (email) reqBody.email = email;
      if (password && confirmPassword) {
        if (password === confirmPassword) reqBody.password = password;
        else {
          alert('New password does not match confirm password');
          return;
        }
      }

      userEdit(reqBody).then(body => {
        if (body.message) alert(body.message)
        else navigate(`/${userId}`)
      })
    }
  }

  const handleEmail = () => {
    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (validEmail.test(email)) setEmailError(false)
    else setEmailError(true)
  }

  const handleFirstPswd = () => {
    if (password && password.length < 7) setInvalidPswd(true)
    else setInvalidPswd(false)
  }

  const handleConfirmPswd = () => {
    if (password === confirmPassword) setPswdError(false)
    else setPswdError(true)
  }

  return (
    <>
      <AppBar pageTitle='Edit Student Profile' backButton homeButton protect />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        width: '400px',
        margin: 'auto',
        overflowY: 'hidden',
        overflowX: 'hidden'
      }}>
        <Typography variant='h6'>Change Name</Typography>
        <TextField
          type='text'
          style={{ margin: '5px' }}
          label='New Name (Optional)'
          value={name}
          onChange={e => { setName(e.target.value) }}
        />
        <Typography variant='h6'>Change Profile Photo</Typography>
        <TextField
          type='file'
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Typography variant='h6'>Change Email</Typography>
        <TextField
          type='text'
          style={{ margin: '5px' }}
          label={emailError ? 'Please enter a valid Email Address' : 'New Email(optional)'}
          value={email}
          onChange={e => { setEmail(e.target.value) }}
          error={emailError}
          onBlur={handleEmail}
        />
        <Typography variant='h6'>Change Password</Typography>
        <TextField
          type='password'
          style = {{ margin: '5px' }}
          label={invalidPswd ? 'Password must be at least 7 digits in length' : 'New Password(optional)'}
          value={password}
          onChange={e => { setPassword(e.target.value) }}
          error={invalidPswd}
          onBlur={handleFirstPswd}
        />
        <TextField
          type='password'
          style = {{ margin: '5px' }}
          label={pswdError ? "Passwords don't match" : 'Confirm Password'}
          value={confirmPassword}
          onChange={e => { setConfirmPassword(e.target.value) }}
          error={pswdError}
          onBlur={handleConfirmPswd}
        />
      </Box>
      <br/>
      <Fab color='primary' aria-label='save' onClick= { saveChanges } sx={{
        margin: 0,
        top: 'auto',
        left: 'auto',
        bottom: 5,
        right: 5,
        position: 'fixed',
      }}>
        <SaveIcon />
      </Fab>
    </>
  );
}

export default StuProfileEdit;
