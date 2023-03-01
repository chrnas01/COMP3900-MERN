import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../util/api';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import defaultImage from '../default.jpg'

const CustomAppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

function AppBar ({ pageTitle, homeButton, backButton, protect, courseButton, recommendButton }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('Authorization');
  const [userId, setUserId] = React.useState(null);
  const [tutor, setTutor] = React.useState(false);
  const [avatar, setAvatar] = React.useState(defaultImage);
  React.useEffect(() => {
    if (protect && !token) {
      navigate('/login');
    }
    if (token) {
      fetchUser().then(body => {
        setUserId(body._id)
        setAvatar((body.pic) ? body.pic : defaultImage)
        setTutor(body.tutor)
      })
    }
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const home = () => {
    navigate('/');
  }

  const courses = () => {
    navigate('/courses');
  }

  const recommend = () => {
    navigate('/recommend');
  }

  const profile = () => {
    navigate(`/tutor/${userId}`);
  }

  const tutorProfileEdit = () => {
    navigate(`/tutor/${userId}/edit`);
  }

  const stuProfile = () => {
    navigate(`/${userId}`);
  }

  const stuProfileEdit = () => {
    navigate(`/${userId}/edit`);
  }

  const dashboard = () => {
    navigate('/dashboard');
  }

  const back = () => {
    navigate(-1);
  }

  const login = () => {
    navigate('/login');
  }

  const messages = () => {
    navigate('/chats');
  }

  const logout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('Authorization');
      window.location.href = '/'
    }
  }

  return (
    <CustomAppBar position='sticky'>
        <Toolbar>
            { backButton &&
            <CustomIconButton
                size='medium'
                edge='start'
                color='inherit'
                sx={{
                  mr: '20px',
                  boxShadow: '#333 1px 1px 3px',
                }}
                onClick={ back }
            >
                <BackIcon />
            </CustomIconButton>
            }
            { homeButton &&
            <CustomIconButton
                size='medium'
                edge='start'
                color='inherit'
                sx={{
                  mr: '5px',
                  boxShadow: '#333 1px 1px 3px',
                }}
                onClick={ home }
            >
                <HomeIcon />
            </CustomIconButton>
            }
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                { pageTitle }
            </Typography>
            { courseButton &&
            <CustomButton
                size='medium'
                edge='start'
                color='inherit'
                sx={{
                  mr: '5px',
                  boxShadow: '#333 1px 1px 3px',
                }}
                onClick={ courses }
            >
                Search By Course
            </CustomButton>
            }
            { recommendButton && token &&
            <CustomButton
                size='medium'
                edge='start'
                color='inherit'
                sx={{
                  mr: '5px',
                  boxShadow: '#333 1px 1px 3px',
                }}
                onClick={ recommend }
            >
                Auto-Recommend
            </CustomButton>
            }
            {!token &&
            <CustomButton
              size='medium'
              edge='start'
              color='inherit'
              sx={{
                mr: '5px',
                boxShadow: '#333 1px 1px 3px',
              }}
              onClick={ login }
            >Sign in
            </CustomButton>
            }

            {token &&
            <>
            <Button
              id='basic-button'
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={ handleClick }
            >
              <Avatar src={avatar} />
            </Button>
            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {tutor && <MenuItem onClick={ profile }>Tutor Profile</MenuItem>}
              {tutor && <MenuItem onClick={ tutorProfileEdit }>Edit Tutor Profile</MenuItem>}
              {!tutor && userId && <MenuItem onClick={ stuProfile }>Student Profile</MenuItem>}
              {!tutor && userId && <MenuItem onClick={ stuProfileEdit }>Edit Student Profile</MenuItem>}
              <MenuItem onClick={ dashboard }>My Dashboard</MenuItem>
              <MenuItem onClick={ messages }>Messages</MenuItem>
              <MenuItem onClick={ logout }>Logout</MenuItem>
            </Menu>
            </>
            }
        </Toolbar>
    </CustomAppBar>
  )
}

AppBar.propTypes = {
  pageTitle: PropTypes.string,
  homeButton: PropTypes.bool,
  courseButton: PropTypes.bool,
  recommendButton: PropTypes.bool,
  backButton: PropTypes.bool,
  protect: PropTypes.bool,
}

export default AppBar;
