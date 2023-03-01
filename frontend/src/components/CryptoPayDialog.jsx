import React from 'react';
import PropTypes from 'prop-types'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import TextField from '@mui/material/TextField'

export default function CryptoPayDialog ({ open, onLogin, onLogout, handleClose, currAccount, currAmount, setAmount, setCurrAccount }) {
  const detectProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      window.alert('No Ethereum browser detected! Check out MetaMask');
    }
    return provider;
  };

  const onLoginHandler = async () => {
    const provider = detectProvider();
    if (provider) {
      if (provider !== window.ethereum) {
        console.error(
          'Not window.ethereum provider. Do you have multiple wallet installed ?'
        );
      }
      await provider.request({
        method: 'eth_requestAccounts',
      });
      onLogin(provider);
    } else {
      onLogout();
    }
  };

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
          Please connect to your Cryptocurrency Account
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              '& > legend': { mt: 2 },
            }}
          >
            <TextField
            sx={{ mt: '20px', mb: '20px' }}
            type='text'
            label="Account"
            value={currAccount}
            fullWidth
            onChange={(e) => setCurrAccount(e.target.value)}
          />
            <TextField
              sx={{ mt: '20px', mb: '20px' }}
              type='number'
              label="Amount"
              value={currAmount}
              fullWidth
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button variant="contained" startIcon={<CurrencyBitcoinIcon />} onClick={onLoginHandler}>
              Connect
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="warning" onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

CryptoPayDialog.propTypes = {
  open: PropTypes.bool,
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  handleClose: PropTypes.func,
  currAccount: PropTypes.string,
  currAmount: PropTypes.number,
  setAmount: PropTypes.func,
  setCurrAccount: PropTypes.func,
}
