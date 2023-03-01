/* eslint-disable  no-unused-vars */
import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import defaultImage from '../default.jpg'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Rating from '@mui/material/Rating';

const deliveryOptions = {
  'face-to-face': 'Face to Face',
  online: 'Online',
  both: 'Hybrid',
};

function TutorCard ({ tutor }) {
  return (
    <Card variant='outlined' sx={{
      justifyContent: 'center',
      alignContent: 'center',
      margin: '5px',
      width: '550px',
      height: '390px',
      boxShadow: '#333 1px 1px 3px',
    }}>
        <CardActionArea component={Link} to={`/tutor/${tutor._id}`}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography variant='h5' sx={{
                width: '60%',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                { tutor.name }
              </Typography>
              <Box sx={{ width: '40%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Rating name='read-only' value={tutor.rating.averageOverall} readOnly />
                <Typography>
                  {(Math.round(tutor.rating.averageOverall * 10) / 10).toFixed(1)} ({tutor.rating.totalRatings})
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardMedia
                  sx={{ objectFit: 'contain', width: '150px', height: '100px' }}
                  component='img'
                  src={ (tutor.pic) ? tutor.pic : defaultImage }
                  alt='Tutor Image'
                />
                <Typography sx={{ fontWeight: 'bold' }}>
                  Hourly Rate:
                </Typography>
                <Typography>
                  { tutor.hourlyRate ? `$${tutor.hourlyRate}` : 'Negotiable' }
                </Typography>
                <Typography sx={{ fontWeight: 'bold' }}>
                  Delivery:
                </Typography>
                <Typography>
                  { deliveryOptions[tutor.delivery] }
                </Typography>
                <Typography sx={{ fontWeight: 'bold' }}>
                  Postcode:
                </Typography>
                <Typography>
                  { tutor.postcode ? tutor.postcode : 'No Postcode Given' }
                </Typography>
              </Box>
              <Box sx={{ width: '70%' }}>
                <Box sx={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 85%, rgba(255, 255, 255, 0.75))', position: 'absolute', top: '50px', right: '0', height: '240px', width: '70%' }}></Box>
                <Typography sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word', overflowY: 'hidden', height: '240px' }}>
                  { tutor.description ? tutor.description : 'No Description Given' }
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ fontWeight: 'bold' }}>Courses Offered:</Typography>
            <Box>
              <Box sx={{ background: 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 75%, rgba(255, 255, 255, 1))', position: 'absolute', bottom: '50', height: '50px', width: '100%' }}></Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', overflowX: 'hidden' }}>
                {!tutor.teaching.length && <Typography>No Courses Offered</Typography>}
                { tutor.teaching.map((courseObj) => {
                  return (
                    <Box sx={{
                      display: 'flex',
                      border: 'solid 1px black',
                      borderRadius: '10px',
                      marginRight: '10px',
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
            <br/>
            <Typography sx={{ fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Click Card to See More Info</Typography>
          </CardContent>
        </CardActionArea>
    </Card>
  )
}

TutorCard.propTypes = {
  tutor: PropTypes.object
}

export default TutorCard;
