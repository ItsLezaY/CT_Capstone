import React from 'react';
import { useState } from 'react';
import { getDatabase, ref, push, set } from 'firebase/database';
import { useNavigate, Link } from 'react-router-dom';
import {
    Button,
    TextField,
    Grid,
    Container,
    Typography,
    Box,
    Alert
    } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';


//internal imports
import { Timer } from '../Timers';
import { MessageType } from '../Auth';
import home_image from '../../assets/Images/beautiful-world-of-ffxi.jpg';
import { NavBar } from '../sharedComponents';





const Root = styled('div')({
    backgroundImage: `linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .5)), url(${home_image});`, 
    padding: 0,
    margin: 0,
})



//my BG and main div
const Main = styled('div')({
    backgroundImage: `linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .5)), url(${home_image});`, 
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})




const BoxContainer = styled('div')({
    background: 'rgba(189, 182, 201, .9)',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '100%',
});




export const Profile = () => {
    const [dynamisTime, setDynamisTime] = useState(new Date());
    const [limbusTime, setLimbusTime] = useState(new Date());
    const [salvageTime, setSalvageTime] = useState(new Date());
    const [assaultTime, setAssaultTime] = useState(new Date());
  
    const navigate = useNavigate();
    const db = getDatabase();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState<string>();
    const [messageType, setMessageType] = useState<MessageType>();
  
    const toUtc = (date: Date) => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
  
    const handleSave = async () => {
      const updateData = {
        dynamis: toUtc(dynamisTime).getTime(),
        limbus: toUtc(limbusTime).getTime(),
        salvage: toUtc(salvageTime).getTime(),
        assault: toUtc(assaultTime).getTime(),
      };
  
      const userId = localStorage.getItem('token');
      const timersRef = ref(db, `timers/${userId}/`);
  
      set(timersRef, updateData)
        .then((newtimersRef) => {
          console.log("Timers added for user: " + newtimersRef);
          setMessage(`Successfully changed timers.`);
          setMessageType('success');
          setOpen(true);
  
          navigate('/dashboard');
        })
        .catch((error) => {
          console.log("Error adding timers for user: " + error.message);
          setMessage(error.message);
          setMessageType('error');
          setOpen(true);
        });
    };
  
    return (
      <Root>
        <NavBar />
        <Main>
          <BoxContainer>
            <Container>
              <Typography variant="h5" gutterBottom>
                Enter Lockout Times
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Dynamis', state: dynamisTime, setState: setDynamisTime },
                  { label: 'Limbus', state: limbusTime, setState: setLimbusTime },
                  { label: 'Salvage', state: salvageTime, setState: setSalvageTime },
                  { label: 'Assault', state: assaultTime, setState: setAssaultTime },
                ].map((event, index) => (
                  <Grid item xs={12} key={index}>
                    <TextField
                      fullWidth
                      label={event.label}
                      type="datetime-local"
                      variant="outlined"
                      value={format(event.state, "yyyy-MM-dd'T'HH:mm")}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const dateValue = new Date(inputValue);
                        event.setState(dateValue);
                      }}
                    />
                    <Timer targetTime={event.state.getTime()} />
                  </Grid>
                ))}
              </Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ mt: 2, ml: 20 }}
              >
                Save
              </Button>
            </Container>
          </BoxContainer>
        </Main>
      </Root>
    );
  };