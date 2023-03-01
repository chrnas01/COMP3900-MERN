import React from 'react';

import AppBar from '../components/AppBar'
import CourseCard from '../components/CourseCard'

import { searchForCourse } from '../util/api';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function Courses () {
  const [statusMsg, setStatusMsg] = React.useState('Please use the search bar to search for courses')
  const [courses, setCourses] = React.useState([])
  const [search, setSearch] = React.useState('')

  const handleSearch = () => {
    if (search === '') {
      alert('You must supply a prefix')
    } else {
      searchForCourse(search).then(data => {
        setCourses(data)
        if (!data.length) setStatusMsg('No courses match that query')
      })
    }
  };

  return (
    <>
      <AppBar pageTitle="Courses" homeButton />
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
          <Typography variant='h5' sx={{ margin: '5px', fontWeight: 'bold' }}>Search for a Course</Typography>
          <FormControl sx={{ margin: '5px' }}>
            <InputLabel htmlFor='name'>Course Code (Prefix Search) </InputLabel>
            <Input id='name' name='name' autoComplete='name' value={search} onChange={(event) => setSearch(event.target.value)} />
          </FormControl>

          <Button
              variant='contained'
              color='primary'
              onClick={handleSearch}
            >Search Courses
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
          {!courses.length && <Typography>{statusMsg}</Typography>}
          { courses.map((course) => (
            <CourseCard key={ course._id } course={ course } />
          ))}
        </Box>
      </Box>
    </>
  )
}

export default Courses;
