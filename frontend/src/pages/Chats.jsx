import React from 'react'
import Box from '@mui/material/Box';
import AppBar from '../components/AppBar';
import AppointmentDialog from '../components/AppointmentDialog';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import io from 'socket.io-client'
import { sendMessage, fetchUser, fetchMessages, fetchChats } from '../util/api';

const SOCKET_URL = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}`

const socket = io(SOCKET_URL);

const Chats = () => {
  const [chats, setChats] = React.useState([]);
  const [selectedChat, setSelectedChat] = React.useState(null);
  const [currentMessage, setCurrentMessage] = React.useState('')
  const [messages, setMessages] = React.useState([]);
  const [loggedUser, setLoggedUser] = React.useState('');
  const [messageNew, setMessageNew] = React.useState(false);
  const [openAppointment, setOpenAppointment] = React.useState(false)
  const messagesEndRef = React.useRef(null)

  React.useEffect(() => {
    fetchUser().then(body => {
      setLoggedUser(body)
    })
    fetchChats().then(body => {
      setChats(body);
    })
    socket.emit('setup', loggedUser);
  }, []);

  React.useEffect(() => {
    if (selectedChat) {
      socket.emit('join chat', selectedChat._id)
      fetchMessages(selectedChat._id).then(body => {
        setMessages(body)
      })
    }
  }, [selectedChat])

  React.useEffect(() => {
    socket.on('message recieved', (room) => {
      fetchMessages(room._id).then(body => {
        setMessages(body)
      })
      setMessageNew(true)
    })
  }, [])

  React.useEffect(() => {
    if (messageNew === true) {
      // console.log(selectedChat.latestMessage.content)
      const selectedChatmemory = selectedChat
      setSelectedChat(null)
      setSelectedChat(selectedChatmemory)
    }
    setMessageNew(false)
  }, [messageNew])

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages]);

  const handleSubmit = () => {
    if (currentMessage.trim().length) {
      sendMessage(currentMessage, selectedChat._id).then(res => {
        if (!res.message) {
          if (selectedChat.latestMessage) {
            selectedChat.latestMessage.content = currentMessage
          }
          setMessageNew(true)
          fetchMessages(selectedChat._id).then(body => {
            setMessages(body)
          })
          setCurrentMessage('')
          socket.emit('new message', selectedChat)
        } else {
          alert(res.message)
        }
      })
    } else {
      setCurrentMessage('')
    }
  }

  const handleSelect = (chat) => {
    setSelectedChat(chat)
    fetchMessages(chat._id).then(body => {
      setMessages(body)
    })
  }

  return (
  <>
    <AppBar pageTitle='Messages' homeButton protect/>
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '92vh', justifyContent: 'center', marginTop: '5px' }}>
      <Card variant='outlined' sx={{ width: '25%', margin: '5px', boxShadow: '#333 1px 1px 3px' }}>
        <CardContent>
          <Typography variant='h4'>
            My Chats
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '83vh',
              overflowY: 'scroll',
            }}
          >
            {!chats.length && <Typography variant='h5' sx={{ fontWeight: 'bold' }}>No Chats Have Been Started Yet</Typography>}
            {chats.map((chat) => (
              <Card variant='outlined' key={chat._id}
              sx={{
                margin: '5px',
                boxShadow: '#333 1px 1px 3px',
                backgroundColor: selectedChat === chat ? '#38B2AC' : '#E8E8E8',
                color: selectedChat === chat ? 'white' : 'black',
              }}>
                <CardActionArea component={Button} sx={{ textTransform: 'none' }} onClick={() => handleSelect(chat)}>
                  <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    width: '90%'
                  }}>
                    <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                      { chat.users[0]._id === loggedUser._id ? chat.users[1].name : chat.users[0].name }
                    </Typography>
                    {chat.latestMessage && (
                      <Typography variant='h7' sx= {{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        <b>{chat.latestMessage.sender.name === loggedUser.name
                          ? 'You'
                          : chat.latestMessage.sender.name} : </b>
                          { chat.latestMessage.content }
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
      {selectedChat && <>
      <Card variant='outlined' sx={{ width: '50%', margin: '5px', boxShadow: '#333 1px 1px 3px' }}>
        <CardContent>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='contained' color='primary' sx={{ margin: '5px', boxShadow: '#333 1px 1px 3px' }} onClick={() => setOpenAppointment(true)}>+ Create Appointment Request</Button>
          </Box>
          <Box
            sx= {{
              height: '75vh',
              alignItems: 'flex-end',
              display: 'flex',
              overflowY: 'scroll',
              flexDirection: 'column-reverse',
              backgroundColor: '#f5f5f5',
            }}
          >
            <div ref={ messagesEndRef } />
            {messages.map((m) => (
              <Box className='messages' key={m._id}
                sx={{
                  display: 'flex',
                  justifyContent: m.sender._id === loggedUser._id ? 'flex-end' : 'flex-start',
                  width: '1',
                }}
              >
                <Typography sx={{
                  backgroundColor: `${
                    m.sender._id === loggedUser._id ? '#BEE3F8' : '#B9F5D0'}`,
                  padding: '5px 15px',
                  maxWidth: '75%',
                  borderRadius: '20px',
                  wordWrap: 'break-word',
                  marginTop: '1px',
                  marginBottom: '4px',
                  display: 'display-block',
                }}>
                  {m.content}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx= {{
              width: '100%',
              display: 'flex',
              backgroundColor: '#e0e0e0',
            }}
          >
            <FormControl margin='none' variant='filled' required fullWidth>
              <InputLabel htmlFor='message'>Type your message here</InputLabel>
              <Input name='message' type='message' id='message' value={currentMessage} onKeyDown={(event) => { if (event.key === 'Enter') handleSubmit() }} onChange={(event) => setCurrentMessage(event.target.value)}/>
            </FormControl>
            <Button
              variant='contained'
              color='primary'
              onClick={ handleSubmit }
            ><SendIcon />
            </Button>
          </Box>
        </CardContent>
      </Card>
      <AppointmentDialog open={openAppointment} handleClose={() => setOpenAppointment(false)} tutorId={ loggedUser.tutor ? loggedUser._id : (selectedChat.users[0]._id === loggedUser._id ? selectedChat.users[1]._id : selectedChat.users[0]._id) } studentId={!loggedUser.tutor ? loggedUser._id : (selectedChat.users[0]._id === loggedUser._id ? selectedChat.users[1]._id : selectedChat.users[0]._id)} />
      </>
      }
    </Box>
  </>
  )
};

export default Chats;
