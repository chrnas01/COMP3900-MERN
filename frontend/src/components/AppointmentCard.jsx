/* eslint-disable  no-unused-vars */
import * as React from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CryptoPayDialog from '../components/CryptoPayDialog'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';

import { updateAppointment, setPaidAppointment } from '../util/api.jsx'

// Web3
import { useWeb3React } from '@web3-react/core';
import { injected } from '../connector.js';
import { useEagerConnect } from '../hooks';

const deliveryOptions = {
  'face-to-face': 'Face to Face',
  online: 'Online',
};
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

function AppointmentCard ({ appointment, setRefresh, incoming, outgoing, unpaid, isTutor }) {
  useEagerConnect()
  const { library, chainId, account, activate, active } = useWeb3React()
  const [openCrypto, setOpenCrypto] = React.useState(false)
  const [currAccount, setCurrAccount] = React.useState('');
  const [currAmount, setCurrAmount] = React.useState(0);

  const setAsPaid = () => {
    setPaidAppointment(appointment._id).then(body => {
      if (!body.message) setRefresh(true)
      else alert(body.message)
    })
  }

  const handleUpdate = (newStatus) => {
    updateAppointment(appointment._id, newStatus).then(body => {
      if (!body.message) setRefresh(true)
      else alert(body.message)
    })
  }

  const onLogin = () => {
    activate(injected)

    // Add correct chain
    // const networkData = [{
    //   method: 'wallet_addEthereumChain',
    //   params: [{
    //     chainId: '0x5',
    //     rpcUrls: ['https://goerli.infura.io/v3/'],
    //     nativeCurrency: {
    //       name: 'ETH',
    //       symbol: 'ETH',
    //       decimals: 18
    //     },
    //     blockExplorerUrls: ['https://goerli.etherscan.io']
    //   }]
    // }]

    // return window.ethereum.request({
    //   method: 'wallet_addEthereumChain',
    //   params: networkData,
    // });

    if (active) {
      const tx = {
        from: account,
        to: currAccount,
        value: ethers.utils.parseEther(currAmount.toString())
      }

      const signer = library.getSigner()
      signer.sendTransaction(tx).then((transaction) => {
        transaction.wait()
        window.alert(`Transaction successful - follow here: https://goerli.etherscan.io/tx/${transaction.hash}`)
      })
        .catch(err => {
          window.alert(err.message)
        })
    }
  }

  const onLogout = () => {
    setOpenCrypto(false)
  };

  return (
    <Card variant='outlined' sx={{
      justifyContent: 'center',
      alignContent: 'center',
      margin: '5px',
      width: '25%',
      height: '20%',
      boxShadow: '#333 1px 1px 3px',
    }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
                <Typography component='legend'>Tutor</Typography>
                <Typography variant='h6'>{appointment.tutor.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
                <Typography component='legend'>Student</Typography>
                <Typography variant='h6'>{appointment.student.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
                <Typography component='legend'>Price</Typography>
                <Typography variant='h6'>{appointment.price.value} {appointment.price.currency}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
                <Typography component='legend'>Duration</Typography>
                <Typography variant='h6'>{Math.floor(appointment.duration / 60)}h {Math.floor(appointment.duration % 60)}m</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
                <Typography component='legend'>Delivery</Typography>
                <Typography variant='h6'>{deliveryOptions[appointment.delivery]}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
                <Typography component='legend'>Date and Time</Typography>
                <Typography variant='h6'>{new Date(appointment.date).toLocaleDateString('en-GB', options)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', margin: '5px' }}>
                <Typography component='legend'>Subject</Typography>
                <Typography variant='h6'>{appointment.subject.code}</Typography>
            </Box>
        </CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
          {(incoming) && <Button variant='contained' color='primary' sx={{ margin: '5px', boxShadow: '#333 1px 1px 3px' }} onClick={() => handleUpdate('approved')}>Accept</Button>}
          {incoming && <Button variant='contained' color='primary' sx={{ margin: '5px', boxShadow: '#333 1px 1px 3px' }} onClick={() => handleUpdate('declined')}>Decline</Button>}
          {(outgoing) && <Button variant='contained' color='primary' sx={{ margin: '5px', boxShadow: '#333 1px 1px 3px' }} onClick={() => handleUpdate('declined')}>Cancel</Button>}
          {(unpaid && isTutor) && <Button variant='contained' color='primary' sx={{ margin: '5px', boxShadow: '#333 1px 1px 3px' }} onClick={setAsPaid}>Set as Paid</Button>}
          {(unpaid && !isTutor) && <Button
            endIcon={<CurrencyBitcoinIcon />}
            sx={{ margin: '5px', boxShadow: '#333 1px 1px 3px' }}
            onClick={() => setOpenCrypto(true)}
            >Pay Crypto
            </Button>}
        </Box>
        <CryptoPayDialog
         open={openCrypto}
         Amount={currAmount}
         Account={currAccount}
         setAmount={setCurrAmount}
         setCurrAccount={setCurrAccount}
         onLogin={(onLogin)}
         onLogout={onLogout}
         handleClose={() => setOpenCrypto(false)}
         />
    </Card>
  )
}

AppointmentCard.propTypes = {
  appointment: PropTypes.object,
  setRefresh: PropTypes.func,
  incoming: PropTypes.bool,
  outgoing: PropTypes.bool,
  unpaid: PropTypes.bool,
  isTutor: PropTypes.bool
}

export default AppointmentCard;
