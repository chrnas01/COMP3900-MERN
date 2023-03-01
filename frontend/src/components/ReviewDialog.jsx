import React from 'react';
import PropTypes from 'prop-types'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'

import { postReview } from '../util/api';

export default function ReviewDialog ({ open, handleClose, tutorId, setFetchReviews }) {
  const [oValue, setOValue] = React.useState(0);
  const [uValue, setUValue] = React.useState(0);
  const [wValue, setWValue] = React.useState(0);
  const [fValue, setFValue] = React.useState(0);
  const [reviewTxt, setReviewTxt] = React.useState('');

  const handleSubmit = (e) => {
    if (oValue && uValue && wValue && fValue) {
      postReview(tutorId, oValue, uValue, wValue, fValue, reviewTxt).then(body => {
        if (body.message) alert(body.message)
        else {
          setFetchReviews(true)
          handleClose()
        }
      })
    } else {
      alert('Please fill all rating fields')
    }
  }

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          Submit a review
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              '& > legend': { mt: 2 },
            }}
          >
            <Stack spacing={1}>
              <Typography component="legend">Overall Rating</Typography>
              <Rating
                size = "large"
                name="customized-color"
                value={oValue}
                onChange={(event, newValue) => {
                  setOValue(newValue);
                }}/>
              <Typography component="legend">Usefulness</Typography>
              <Rating
                name="simple-ssefulness"
                value={uValue}
                onChange={(event, newValue) => {
                  setUValue(newValue);
                }}/>
              <Typography component="legend">Worthiness</Typography>
              <Rating
                name="simple-worthiness"
                value={wValue}
                onChange={(event, newValue) => {
                  setWValue(newValue);
                }}/>
              <Typography component="legend">Flexibility</Typography>
              <Rating
                name="simple-flexibility"
                value={fValue}
                onChange={(event, newValue) => {
                  setFValue(newValue);
                }}/>
            </Stack>
          </Box>
          <TextField
            sx={{ mt: '20px', mb: '20px' }}
            type='text'
            label="Please write your review here"
            value={reviewTxt}
            multiline
            minRows={2}
            fullWidth
            onChange={(e) => setReviewTxt(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit" color="success" onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

ReviewDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  tutorId: PropTypes.string,
  setFetchReviews: PropTypes.func,
}
