/* eslint-disable  no-unused-vars */
import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Rating from '@mui/material/Rating';

function ReviewCard ({ review }) {
  return (
    <Card variant='outlined' sx={{
      justifyContent: 'center',
      alignContent: 'center',
      margin: '5px',
      width: '50%',
      height: '30%',
      boxShadow: '#333 1px 1px 3px',
    }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
                <Typography component="legend">Overall Rating</Typography>
                <Rating name='read-only' value={review.overallRating} readOnly />
                <Typography component="legend">Usefulness</Typography>
                <Rating size='small' name='read-only' value={review.usefullness} readOnly />
                <Typography component="legend">Worthiness</Typography>
                <Rating size='small' name='read-only' value={review.worthiness} readOnly />
                <Typography component="legend">Flexibility</Typography>
                <Rating size='small' name='read-only' value={review.flexibility} readOnly />
            </Box>
            <Box sx={{ border: 'solid 1px black', borderRadius: '10px', flexGrow: '1', padding: '5px' }}>
                <Typography sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{(review.note) ? review.note : 'No Message Provided'}</Typography>
            </Box>
        </CardContent>
    </Card>
  )
}

ReviewCard.propTypes = {
  review: PropTypes.object
}

export default ReviewCard;
