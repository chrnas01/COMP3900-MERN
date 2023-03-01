/* eslint-disable  no-unused-vars */
import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import defaultImage from '../default.jpg'

import AppBar from '../components/AppBar'
import ReviewDialog from '../components/ReviewDialog'
import ReviewCard from '../components/ReviewCard'
import { fetchUser, fetchTutor, accessChats, fetchTutorReviews, deleteUser } from '../util/api';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import ChatIcon from '@mui/icons-material/Chat';
import CardActions from '@mui/material/CardActions';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const deliveryOptions = {
  'face-to-face': 'Face to Face',
  online: 'Online',
  both: 'Hybrid',
};

function TutorProfile () {
  const navigate = useNavigate()
  const { userId } = useParams()
  const [isTutor, setIsTutor] = React.useState(true)
  const [isSelf, setIsSelf] = React.useState(false)
  const [name, setName] = React.useState('')
  const [averageOverall, setAverageOverall] = React.useState(0)
  const [totalRatings, setTotalRatings] = React.useState(0)
  const [profilePic, setProfilePic] = React.useState(null)
  const [rate, setRate] = React.useState(0)
  const [description, setDescription] = React.useState('')
  const [delivery, setDelivery] = React.useState('')
  const [postcode, setPostcode] = React.useState('')
  const [teaching, setTeaching] = React.useState([])
  const [reviews, setReviews] = React.useState([])
  const [fetchReviews, setFetchReviews] = React.useState(false)
  const [openReview, setOpenReview] = React.useState(false)

  React.useEffect(() => {
    fetchTutorReviews(userId).then(reviews => {
      setReviews(reviews)
    })
    fetchTutor(userId).then(tutor => {
      setAverageOverall(tutor.rating.averageOverall)
      setTotalRatings(tutor.rating.totalRatings)
    })
    setFetchReviews(false)
  }, [fetchReviews]);

  React.useEffect(() => {
    fetchTutor(userId).then(tutor => {
      setName(tutor.name)
      setAverageOverall(tutor.rating.averageOverall)
      setTotalRatings(tutor.rating.totalRatings)
      setProfilePic(tutor.pic)
      setRate(tutor.hourlyRate)
      setDescription(tutor.description ? tutor.description : 'No Description Given')
      setDelivery(tutor.delivery)
      setPostcode(tutor.postcode ? tutor.postcode : 'No Postcode Given')
      setTeaching(tutor.teaching)
    })
    setFetchReviews(true)
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
    <AppBar pageTitle='Tutor Profile' homeButton />
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
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Rating size='large' name='read-only' value={averageOverall} readOnly />
            <Typography>
              {(Math.round(averageOverall * 10) / 10).toFixed(1)} ({totalRatings})
            </Typography>
          </Box>
          <Typography variant='h5' sx={{
            fontWeight: 'bold',
            wordBreak: 'break-word'
          }}>
            Name: { name }
          </Typography>
          <CardMedia
            sx={{ objectFit: 'contain', width: '100%' }}
            component='img'
            image={ (!profilePic) ? defaultImage : profilePic }
            alt='Tutor Image'
          />
          <Typography sx={{ fontWeight: 'bold' }}>
            Hourly Rate:
          </Typography>
          <Typography>
            { rate ? `$${rate} Per Hour` : 'Negotiable' }
          </Typography>
          <Typography sx={{ fontWeight: 'bold' }}>
            Delivery:
          </Typography>
          <Typography>
            { deliveryOptions[delivery] }
          </Typography>
          <Typography sx={{ fontWeight: 'bold' }}>
            Postcode:
          </Typography>
          <Typography>
            { postcode }
          </Typography>
          <Typography sx={{ fontWeight: 'bold' }}>Courses Offered:</Typography>
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {!teaching.length && <Typography>No Courses Offered</Typography>}
              { teaching.map((courseObj) => {
                return (
                  <Box sx={{
                    display: 'flex',
                    border: 'solid 1px black',
                    borderRadius: '10px',
                    marginRight: '10px',
                    marginBottom: '10px',
                    height: '25px',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }} key={ courseObj.code } >
                    <Typography sx={{ margin: '5px' }}> {courseObj.code} </Typography>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </CardContent>
        <CardActions>
          {!isTutor && <Button variant='contained' size="small" startIcon={<EditIcon/>} onClick={() => setOpenReview(true)}
            >Add Review</Button>}
          {!isTutor && <Button variant='contained' size="small" endIcon={<ChatIcon />} onClick={() => {
            accessChats(userId).then(body => {
              navigate('../chats', { replace: true });
            })
          }}>Message</Button>}
          {isSelf && <Button variant='contained' endIcon={<EditIcon />} onClick={() => {
            navigate('edit', { replace: false })
          }}>Edit</Button>}
          {isSelf && <Button variant="contained" endIcon={<DeleteForeverIcon />} color="error" onClick={handleDeleteAccount}>Delete</Button>}
        </CardActions>
      </Card>
      <Box sx={{ width: '50%', minWidth: '300px' }}>
        <Card variant='outlined' sx={{
          justifyContent: 'center',
          alignContent: 'center',
          margin: '5px',
          width: '100%',
          boxShadow: '#333 1px 1px 3px',
        }}>
          <CardContent>
            <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
              Description
            </Typography>
            <Typography variant='h5' sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
              { description }
            </Typography>
          </CardContent>
        </Card>
        <Card variant='outlined' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '5px', width: '100%', boxShadow: '#333 1px 1px 3px' }}>
          <CardContent>
            <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
              Reviews
            </Typography>
            { reviews.length === 0 && <Typography variant='h5'>No Reviews Have Been Posted Yet</Typography>}
            { reviews.map((review) => (
              <ReviewCard key={ review._id } review={ review } />
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
    <ReviewDialog open={openReview} handleClose={() => setOpenReview(false)} tutorId={userId} setFetchReviews={setFetchReviews}/>
  </>
  )
}

export default TutorProfile;
