import React from 'react';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import { login } from '../util/api';
import mainlogo from '../util/mainlogo.jpeg';

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

function Login (props) {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const { classes } = props

  const handleSubmit = () => {
    if (email && password) {
      login(email, password).then(body => {
        if (body.token) {
          localStorage.setItem('Authorization', body.token)
          window.location.href = '/'
        } else {
          alert(body.message);
        }
      })
    } else {
      alert('Please fill all input fields')
    }
  }

  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <img className={classes.logo} src={mainlogo} />
        <Typography component='h1' variant='h5'>
          Sign in to CSE Tutors
        </Typography>
        <form className={classes.form}>
          <FormControl margin='normal' required fullWidth>
            <InputLabel required htmlFor='email'>Email</InputLabel>
            <Input id='email' name='email' autoComplete='email' value={email} onChange={(event) => setEmail(event.target.value)} />
          </FormControl>
          <FormControl margin='normal' required fullWidth>
            <InputLabel required htmlFor='password'>Password</InputLabel>
            <Input name='password' type='password' id='password' value={password} onChange={(event) => setPassword(event.target.value)} />
          </FormControl>
          <Button
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            onClick={handleSubmit}
          >Sign in
          </Button>
          <Button
            fullWidth
            variant='contained'
            color='inherit'
            className={classes.submit}
            onClick={() => navigate('/register')}
          >Need An Account? Sign Up Now
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

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
