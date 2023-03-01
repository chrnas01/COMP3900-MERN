/* eslint-disable  no-unused-vars */
import * as React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { fetchTutors } from '../util/api';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

function CourseCard ({ course }) {
  const [tutorAmt, setTutorAmt] = React.useState(0)
  const navigate = useNavigate();
  fetchTutors('', '', '', '', course.code, '', '', '').then(data => setTutorAmt(data.length))

  const home = () => {
    window.sessionStorage.setItem('calledCourse', course.code)
    navigate('/');
  }

  return (
    <Card variant='outlined' sx={{
      justifyContent: 'center',
      alignContent: 'center',
      margin: '5px',
      minWidth: '400px',
      width: '25%',
      height: '150px',
      boxShadow: '#333 1px 1px 3px',
    }}>
        <CardActionArea onClick={home}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                { course.code }
              </Typography>
              <Box>
                <Typography sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word', overflowY: 'hidden' }}>
                  { course.name }
                </Typography>
                <Box>
                <Typography sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word', overflowY: 'hidden' }}>
                  {tutorAmt} tutors available
                </Typography>
              </Box>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
    </Card>
  )
}

CourseCard.propTypes = {
  course: PropTypes.object
}

export default CourseCard;
