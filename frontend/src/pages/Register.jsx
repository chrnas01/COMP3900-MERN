import React from 'react';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';

import { register, searchForCourse } from '../util/api';
import mainlogo from '../util/mainlogo.jpeg';
import { Box } from '@mui/material';

/* Sourced https://github.com/mui-org/material-ui/blob/v3.x/docs/src/pages/getting-started/page-layout-examples/sign-in/SignIn.js */
const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  logo: {
    width: '100%',
    maxWidth: '350px',
    marginBottom: '20px',
  },
});

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

function Register (props) {
  const navigate = useNavigate()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [emailError, setEmailError] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [invalidPswd, setInvalidPswd] = React.useState(false)
  const [pswdConfirm, setPswdConfirm] = React.useState('')
  const [pswdError, setPswdError] = React.useState(false)
  const [isTutor, setIsTutor] = React.useState(false)
  const [delivery, setDelivery] = React.useState('online');
  const [rate, setRate] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [postcode, setPostcode] = React.useState('')
  const [teaching, setTeaching] = React.useState([])
  const [course, setCourse] = React.useState('')
  const { classes } = props

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

  const handleSubmit = () => {
    if (name && email && !emailError && password && pswdConfirm && !pswdError && (!isTutor || postcode) && (!isTutor || teaching.length > 0)) {
      register(name, email, password, isTutor, description, delivery, isTutor ? postcode : null, rate, teaching).then(body => {
        if (body.token) {
          localStorage.setItem('Authorization', body.token)
          window.location.href = '/'
        } else {
          alert(body.message);
        }
      })
    } else {
      alert('Please check all input fields')
    }
  }

  const handleEmail = () => {
    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (validEmail.test(email)) setEmailError(false)
    else setEmailError(true)
  }

  const handleFirstPswd = () => {
    if (password.length < 7) setInvalidPswd(true)
    else {
      if (password !== pswdConfirm) setPswdError(true)
      setInvalidPswd(false)
    }
  }

  const handleConfirmPswd = () => {
    if (password && password !== pswdConfirm) setPswdError(true)
    else setPswdError(false)
  }

  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <img className={classes.logo} src={mainlogo} />
        <Typography component='h1' variant='h5'>
          Sign up to CSE Tutors
        </Typography>
        <form className={classes.form}>
          <FormControl margin='normal' fullWidth>
            <InputLabel required htmlFor='name'>Name</InputLabel>
            <Input id='name' name='name' autoComplete='name' value={name} onChange={(event) => setName(event.target.value)} />
          </FormControl>
          <FormControl margin='normal' fullWidth>
            <InputLabel error={emailError} required htmlFor='email'>{emailError ? 'Please enter a valid Email Address' : 'Email'}</InputLabel>
            <Input id='email' name='email' autoComplete='email'
              error={emailError}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={handleEmail}
            />
          </FormControl>
          <FormControl margin='normal' fullWidth>
            <InputLabel error={invalidPswd} required htmlFor='password'>{invalidPswd ? 'Password must be at least 7 digits in length' : 'Password'}</InputLabel>
            <Input name='password' type='password' id='password'
              error={invalidPswd}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={handleFirstPswd}
            />
          </FormControl>
          <FormControl margin='normal' fullWidth>
            <InputLabel error={pswdError} required htmlFor='pswdConfirm'>{pswdError ? "Passwords don't match" : 'Confirm Password'}</InputLabel>
            <Input name='pswdConfirm' type='password' id='pswdConfirm'
              error={pswdError}
              value={pswdConfirm}
              onChange={(event) => setPswdConfirm(event.target.value)}
              onBlur={handleConfirmPswd}
            />
          </FormControl>
          <FormControl>
          <FormLabel id='rowRadioLabel'></FormLabel>
            <RadioGroup value={isTutor} row aria-labelledby='rowRadioLabel' onChange={(e) => setIsTutor(!isTutor)}>
              <FormControlLabel value={false} control={<Radio />} label='Student' />
              <FormControlLabel value={true} control={<Radio />} label='Tutor' />
            </RadioGroup>
          </FormControl>
          {isTutor && <div>
            <TextField
              sx={{ marginTop: '10px' }}
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

            <FormControl margin='normal' fullWidth>
              <InputLabel htmlFor='hourly-rate'>Hourly Rate</InputLabel>
              <Input
                id='hourly-rate'
                type='number'
                value={rate}
                onChange={(event) => setRate(event.target.value)}
                startAdornment={<InputAdornment position='start'>$</InputAdornment>}
              />
              <FormHelperText id='hourly-rate'>Leave empty to set as &quot;Negotiable&quot;</FormHelperText>
            </FormControl>
            <FormControl margin='normal' fullWidth>
              <InputLabel htmlFor='description'>Description</InputLabel>
              <Input multiline minRows='3' id='description' name='description' autoComplete='description' value={description} onChange={(event) => setDescription(event.target.value)} />
            </FormControl>
            <FormControl margin='normal' fullWidth>
              <InputLabel required htmlFor='postcode'>Location (Postcode e.g. 2000)</InputLabel>
              <Input type='number' id='postcode' name='postcode' autoComplete='postcode' value={postcode} onChange={(event) => setPostcode(event.target.value)} />
            </FormControl>
            <FormControl margin='normal' fullWidth sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box sx={{ flexBasis: '80%' }}>
                <InputLabel htmlFor='course'>Course Code (e.g COMP1511)</InputLabel>
                <Input id='course' name='course' autoComplete='course' value={course} onChange={(event) => setCourse(event.target.value.toUpperCase())} />
              </Box>
              <Button
                sx={{ flexBasis: '20%' }}
                variant='contained'
                color='primary'
                onClick={handleCourseSearch}
              >Add Course
              </Button>
            </FormControl>
            <InputLabel required htmlFor='course'>Your Offered Courses</InputLabel>
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
          </div>}

          <Button
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            onClick={handleSubmit}
          >Sign Up
          </Button>
          <Button
            fullWidth
            variant='contained'
            color='inherit'
            className={classes.submit}
            onClick={() => navigate('/login')}
          >Already have an account? Log In Now
          </Button>
          <Button
            fullWidth
            variant='contained'
            color='inherit'
            className={classes.submit}
            onClick={() => navigate('/')}
          >Back to Homepage
          </Button>
        </form>
      </Paper>
    </main>
  )
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
