/* eslint-disable  no-unused-vars */
import React from 'react';

import AppBar from '../components/AppBar'
import TutorCard from '../components/TutorCard'

import { fetchTutors, searchForCourse } from '../util/api';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

const deliveryOptions = [
  {
    value: '',
    label: 'Any'
  },
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

const sortOptions = [
  {
    value: 'bestReviewed',
    label: 'Highest Rating'
  },
  {
    value: 'mostReviewed',
    label: 'Most Ratings'
  },
  {
    value: 'newest',
    label: 'Newest'
  },
  {
    value: 'oldest',
    label: 'Oldest'
  },
  {
    value: 'high-low',
    label: 'Highest Rate'
  },
  {
    value: 'low-high',
    label: 'Lowest Rate'
  },
];

function Homepage () {
  const [tutors, setTutors] = React.useState([]);
  const [name, setName] = React.useState('')
  const [delivery, setDelivery] = React.useState('');
  const [minRate, setMinRate] = React.useState('')
  const [maxRate, setMaxRate] = React.useState('')
  const [minRating, setMinRating] = React.useState('')
  const [postcode, setPostcode] = React.useState('')
  const [courses, setCourses] = React.useState([])
  const [course, setCourse] = React.useState('')
  const [sortBy, setSortBy] = React.useState('newest')

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

  const handleFilterTutors = () => {
    fetchTutors(sortBy, name, delivery, postcode, courses, minRating, minRate, maxRate).then(data => setTutors(data))
    console.log(tutors)
  };

  React.useEffect(() => {
    const calledCourse = window.sessionStorage.getItem('calledCourse')
    if (calledCourse) {
      window.sessionStorage.removeItem('calledCourse')
      setCourse(calledCourse)
      fetchTutors(sortBy, name, delivery, postcode, calledCourse, minRating, minRate, maxRate).then(data => setTutors(data))
    } else {
      fetchTutors(sortBy, name, delivery, postcode, courses, minRating, minRate, maxRate).then(data => setTutors(data))
    }
  }, []);

  return (
    <>
      <AppBar pageTitle="Tutors" courseButton recommendButton/>
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
          <Typography variant='h5' sx={{ margin: '5px', fontWeight: 'bold' }}> Filters: </Typography>
          <FormControl sx={{ margin: '5px' }}>
            <InputLabel htmlFor='name'>Name</InputLabel>
            <Input id='name' name='name' autoComplete='name' value={name} onChange={(event) => setName(event.target.value)} />
          </FormControl>

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

          <FormControl sx={{ margin: '5px' }}>
            <InputLabel htmlFor='min-rating'>Minimum Rating</InputLabel>
            <Input
              id='min-rating'
              type='number'
              value={minRating}
              onChange={(event) => setMinRating(event.target.value)}
            />
          </FormControl>

          <FormControl sx={{ margin: '5px' }}>
            <InputLabel htmlFor='min-rate'>Minimum Hourly Rate</InputLabel>
            <Input
              id='min-rate'
              type='number'
              value={minRate}
              onChange={(event) => setMinRate(event.target.value)}
              startAdornment={<InputAdornment position='start'>$</InputAdornment>}
            />
          </FormControl>

          <FormControl sx={{ margin: '5px' }}>
            <InputLabel htmlFor='max-rate'>Maximum Hourly Rate</InputLabel>
            <Input
              id='max-rate'
              type='number'
              value={maxRate}
              onChange={(event) => setMaxRate(event.target.value)}
              startAdornment={<InputAdornment position='start'>$</InputAdornment>}
            />
          </FormControl>

          <FormControl sx={{ margin: '5px' }}>
            <InputLabel htmlFor='postcode'>Location (Postcode e.g. 2000)</InputLabel>
            <Input type='number' id='postcode' name='postcode' autoComplete='postcode' value={postcode} onChange={(event) => setPostcode(event.target.value)} />
          </FormControl>

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

          <TextField
            sx={{ margin: '5px' }}
            select
            label='Sort By'
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Button
              sx={{ margin: '5px' }}
              variant='contained'
              color='primary'
              onClick={handleFilterTutors}
            >Filter Tutors
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
          { !tutors.length && <Typography>No Tutors Match the Current Filters</Typography> }
          { tutors.map((tutor) => (
            <TutorCard key={ tutor._id } tutor={ tutor } />
          ))}
        </Box>
      </Box>
    </>
  )
}

export default Homepage;
