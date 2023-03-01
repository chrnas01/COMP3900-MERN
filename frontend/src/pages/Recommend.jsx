/* eslint-disable  no-unused-vars */
import React from 'react';

import AppBar from '../components/AppBar'
import TutorCard from '../components/TutorCard'

import { recommend, searchForCourse } from '../util/api';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

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

function Recommend () {
  const [statusMsg, setStatusMsg] = React.useState('Please fill out the form to get recommended tutors')
  const [tutors, setTutors] = React.useState([]);
  const [delivery, setDelivery] = React.useState('online');
  const [courses, setCourses] = React.useState([])
  const [course, setCourse] = React.useState('')

  const handleCourseSearch = () => {
    searchForCourse(course).then(body => {
      if (body.length === 1) {
        if (!courses.includes(course)) setCourses(courses.concat([course]))
        setCourse('')
      } else {
        alert('Please enter a valid course code (e.g. COMP1511)')
      }
    })
  };

  const handleRecommend = () => {
    recommend(courses, delivery).then(data => {
      if (data.message) alert(data.message)
      else {
        setTutors(data)
        if (!data.length) setStatusMsg('No Tutors match that query')
      }
    })
  };

  return (
    <>
      <AppBar pageTitle="Tutor Auto-Recommendations" homeButton/>
      <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Card variant='outlined' sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          padding: '10px',
          margin: '5px',
          width: '380px',
          height: '100%',
          boxShadow: '#333 1px 1px 3px',
        }}>
          <TextField
            sx={{ margin: '5px' }}
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

          <Box sx={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
            <FormControl sx={{ display: 'flex', flexDirection: 'row', width: '370px', justifyContent: 'space-between' }}>
              <Box>
                <InputLabel htmlFor='course'>Course Code (e.g COMP1511)</InputLabel>
                <Input id='course' name='course' autoComplete='course' value={course} onChange={(event) => setCourse(event.target.value.toUpperCase())} />
              </Box>
              <Button
                variant='contained'
                color='primary'
                onClick={handleCourseSearch}
              >Add Course
              </Button>
            </FormControl>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', height: '100px', border: 'solid 1px black', overflowY: 'scroll', marginTop: '10px' }}>
              {!courses.length && <Typography>Add courses to filter by</Typography>}
              { courses.map((courseCode) => {
                return (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    border: 'solid 1px black',
                    borderRadius: '10px',
                    alignItems: 'center',
                    justifyContent: 'space-evenly'
                  }} key={ courseCode } >
                    <Typography> {courseCode} </Typography>
                    <IconButton sx={{ width: 20, height: 20 }} onClick={() => {
                      const newcourses = [...courses]
                      newcourses.splice(newcourses.indexOf(courseCode), 1)
                      setCourses(newcourses)
                    }}> X </IconButton>
                  </Box>
                )
              })}
            </Box>
          </Box>

          <Button
              sx={{ margin: '5px' }}
              variant='contained'
              color='primary'
              onClick={handleRecommend}
            >Recommend me a tutor!
          </Button>
        </Card>

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
          minWidth: '575px',
          width: 'calc(100% - 420px)',
          height: '93vh',
          overflowY: 'scroll'
        }}>
          { !tutors.length && <Typography>{statusMsg}</Typography> }
          { tutors.map((tutor) => (
            <TutorCard key={ tutor._id } tutor={ tutor } />
          ))}
        </Box>
      </Box>
    </>
  )
}

export default Recommend;
