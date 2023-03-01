import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AppBar from '../components/AppBar'
import { fetchUser, searchForCourse, userEdit } from '../util/api';
import { fileToDataUrl } from '../util/helper';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';

const deliveryOptions = [
  {
    value: 'face-to-face',
    label: 'Face to Face'
  },
  {
    value: 'online',
    label: 'Online'
  },
  {
    value: 'both',
    label: 'Hybrid'
  },
];

const TutorProfileEdit = () => {
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

  const [delivery, setDelivery] = React.useState('online');
  const [rate, setRate] = React.useState('')
  const [description, setDescription] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [originalLocation, setOriginalLocation] = React.useState('');
  const [teaching, setTeaching] = React.useState([])
  const [course, setCourse] = React.useState('')

  // on page load
  React.useEffect(() => {
    fetchUser().then(body => {
      if (body._id !== userId) navigate('/login');
      setOriginalLocation(body.postcode);
      setDescription(body.description);
      setDelivery(body.delivery);
      setTeaching(body.teaching.map(x => x.code));
      setName(body.name);
      setEmail(body.email);
      if (body.hourlyRate) setRate(body.hourlyRate)
    })
  }, [])

  const handleCourseSearch = () => {
    searchForCourse(course).then(body => {
      if (body.length === 1) {
        if (!teaching.includes(course)) setTeaching(teaching.concat([course]))
        setCourse('')
      } else {
        alert('Please enter a valid course code (e.g. COMP1511)')
      }
    })
  };

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
          reqBody.description = description;
          reqBody.delivery = delivery;
          reqBody.hourlyRate = rate;
          if (postcode) reqBody.postcode = postcode;
          reqBody.teaching = teaching;

          userEdit(reqBody).then(body => {
            if (body.message) alert(body.message)
            else navigate(`/tutor/${userId}`)
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
      reqBody.description = description;
      reqBody.delivery = delivery;
      reqBody.hourlyRate = rate;
      if (postcode) reqBody.postcode = postcode;
      reqBody.teaching = teaching;

      userEdit(reqBody).then(body => {
        if (body.message) alert(body.message)
        else navigate(`/tutor/${userId}`)
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
      <AppBar pageTitle='Edit Tutor Profile' backButton homeButton protect />
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
          required
          value={confirmPassword}
          onChange={e => { setConfirmPassword(e.target.value) }}
          error={pswdError}
          onBlur={handleConfirmPswd}
        />
        <TextField
          style = {{ margin: '5px' }}
          select
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
        <FormControl style = {{ margin: '5px' }}>
          <InputLabel htmlFor='hourly-rate'>Hourly Rate</InputLabel>
          <OutlinedInput
            label='Hourly Rate'
            id='hourly-rate'
            type='number'
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            startAdornment={<InputAdornment position='start'>$</InputAdornment>}
          />
          <FormHelperText id='hourly-rate'>Leave empty to set as &quot;Negotiable&quot;</FormHelperText>
        </FormControl>

        <Typography variant='h5' sx={{
          wordWrap: 'break-word',
        }}>
            Description
        </Typography>
        <TextField style = {{ margin: '5px' }} minRows='3' multiline label='Edit Description' variant='outlined' value={description} onChange={e => {
          setDescription(e.target.value);
        }}/>

        <Typography variant='h5' sx={{
          wordWrap: 'break-word',
        }}>
            Current Postcode:
        </Typography>
        <Typography variant='h6' sx={{
          wordWrap: 'break-word',
        }}>
            { originalLocation }
        </Typography>
        <TextField style = {{ margin: '5px' }} label='New Postcode (Optional)' variant='outlined' onChange={e => {
          setPostcode(e.target.value);
        }}/>

        <FormControl margin='normal' required fullWidth sx={{ display: 'flex', flexDirection: 'row' }}>
          <Box sx={{ flexBasis: '80%' }}>
            <TextField style = {{ margin: '5px' }} fullWidth label='Course Code (e.g COMP1511)' variant='outlined' value={course} onChange={e => {
              setCourse(e.target.value.toUpperCase());
            }}/>
          </Box>
          <Button
            sx={{ flexBasis: '15%', marginLeft: '10px' }}
            variant='contained'
            color='primary'
            onClick={handleCourseSearch}
          >Add Course
          </Button>
        </FormControl>
        <InputLabel htmlFor='course'>Your Offered Courses</InputLabel>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', height: '150px', border: 'solid 1px black', overflowY: 'scroll' }}>
          {!teaching.length && <Typography>Please add at least one course</Typography>}
          { teaching.map((courseCode) => {
            return (
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                border: 'solid 1px black',
                borderRadius: '10px',
                margin: '5px',
                height: '25px',
                width: '150px',
                alignItems: 'center',
                justifyContent: 'space-evenly'
              }} key={ courseCode } >
                <Typography> {courseCode} </Typography>
                <IconButton sx={{ width: 20, height: 20 }} onClick={() => {
                  const newTeaching = [...teaching]
                  newTeaching.splice(newTeaching.indexOf(courseCode), 1)
                  setTeaching(newTeaching)
                }}> X </IconButton>
              </Box>
            )
          })}
        </Box>
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

export default TutorProfileEdit;
