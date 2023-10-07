import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

// Material Icons for my timers
import HourglassFullIcon from '@mui/icons-material/HourglassFull'; //Dynamis
import FlareIcon from '@mui/icons-material/Flare'; //Limbus
import PagesIcon from '@mui/icons-material/Pages'; // Salvage
import SellIcon from '@mui/icons-material/Sell'; //Assault
import ArrowRightIcon from '@mui/icons-material/ArrowRight'; //Check-in Button

//internal imports
import home_image from '../../assets/Images/beautiful-world-of-ffxi.jpg'
import { NavBar } from '../sharedComponents';
import { TimeComponent } from '../TimeComponent';
import tracker_image from '../../assets/Images/their-plea.jpg';

interface TrackerProps {
  lockoutTimes: {
    dynamis: number;
    limbus: number;
    salvage: number;
    assault: number;
  };
}

interface CountdownTimerProps {
  event: string;
  lockoutTime?: number;
}

interface LockoutTimes {
  [key: string]: number | undefined;
  dynamis?: number;
  limbus?: number;
  salvage?: number;
  assault?: number;
}

const Root = styled('div')({
  backgroundImage: `linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .5)), url(${home_image});`,
  padding: 0,
  margin: 0
});

const Main = styled('div')({
  backgroundImage: `linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .5)), url(${home_image});`,
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center bottom',
  position: 'absolute',
});

export const TrackerContainer = styled('div')({
  textAlign: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  marginTop: '1.9rem',
  marginLeft: '-.9rem',
  padding: '2rem',
  borderRadius: '15px',
  boxShadow: '-10px 10px 15px rgba(0,0,0, .6)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundImage: `url('${tracker_image}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  opacity: 1,
});

const DateContainer = styled('div')({
  position: 'absolute',
  top: '.5rem',
  left: '2.25rem',
  color: 'white',
  fontFamily: 'monospace',
  letterSpacing: '1px',
  fontSize: '1rem',
  whiteSpace: 'pre-line'
});

const UpdateButton = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  marginBottom: '6rem',
});

const CountdownTimersContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  flexWrap: 'nowrap',
});

const CountdownTimerContainer = styled('div')({
  display: 'inline-block',
  margin: '10px',
  position: 'relative',
  textAlign: 'center',
  whiteSpace: 'nowrap',
});

const IconOverlay = styled('div')({
  position: 'absolute',
  top: '0',
  left: '50%',
  transform: 'translateX(-50%)',
  marginTop: '-30px'
});

export const Tracker: React.FC<TrackerProps> = ({ lockoutTimes }) => {

  return (
    <TrackerContainer>
      <h2 style={{ fontFamily: 'Fragment Mono, Roboto, monospace', letterSpacing: '-1px' }}></h2>
    </TrackerContainer>
  );
};



const CountdownTimer: React.FC<CountdownTimerProps> = ({ event, lockoutTime }) => {
    const [remainingTime, setRemainingTime] = useState(0);

useEffect(() => {
  if (lockoutTime) {
    setRemainingTime(Math.max(0, lockoutTime - Date.now()));
    
    const interval = setInterval(() => {
      setRemainingTime(prevTime => Math.max(0, prevTime - 1000));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }
}, [lockoutTime]);


    const hours = String(Math.floor(remainingTime / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((remainingTime % (1000 * 60)) / 1000)).padStart(2, '0');

    const formattedEvent = event.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    return (
        <div style={{ display: 'inline-block', margin: '10px', color: 'white', textAlign: 'center' }}>
            <div>{formattedEvent}</div>
            <div>{hours}h {minutes}m {seconds}s</div>
        </div>
    );
};







export const Dashboard: React.FC = () => {
  const [lockoutTimes, setLockoutTimes] = useState<LockoutTimes | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        const db = getDatabase();
        const userId = localStorage.getItem('token');
        const lockoutRef = ref(db, `timers/${userId}`);

        try {
            const snapshot = await get(lockoutRef);
            if (snapshot.exists()) {
                const lockoutTimes = snapshot.val();
                const lockoutEndTimes: LockoutTimes = {};
              
                Object.entries(lockoutTimes).forEach(([event, time]) => {
                  lockoutEndTimes[event] = time as number;
                });
              
                setLockoutTimes(lockoutEndTimes);
              } else {
                console.log("No data available");
            }
        } catch (error) {
            console.error('Error fetching lockout times:', error);
        }
    };

    fetchData();
}, []);


  const theme = useTheme();
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfWeek[currentDate.getDay()];

  const formattedDate = `${dayOfWeek}\n${month}/${day}`;

  return (
    <Root>
      <NavBar />
      <Main>
        <TrackerContainer>
          <UpdateButton>
            <Button
              component={Link}
              to={localStorage.getItem('auth') === 'true' ? '/profile' : '/auth'}
              variant="contained"
              color="primary"
              style={{ paddingRight: 3 }}
            >
              Check In
              <ArrowRightIcon style={{ color: theme.palette.info.main }} />
            </Button>
            <DateContainer>{formattedDate}</DateContainer>
          </UpdateButton>
          {lockoutTimes && (
            <CountdownTimersContainer>
              {Object.entries(lockoutTimes).map(([event, time]) => (
                <CountdownTimerContainer key={event}>
                  <IconOverlay>
                    {event === 'dynamis' && (
                      <HourglassFullIcon style={{ fontSize: 35, color: 'white' }} />
                    )}
                    {event === 'limbus' && (
                      <FlareIcon style={{ fontSize: 35, color: 'white' }} />
                    )}
                    {event === 'salvage' && (
                      <PagesIcon style={{ fontSize: 35, color: 'white' }} />
                    )}
                    {event === 'assault' && (
                      <SellIcon style={{ fontSize: 35, color: 'white' }} />
                    )}
                  </IconOverlay>
                  <CountdownTimer event={event} lockoutTime={time} />
                </CountdownTimerContainer>
              ))}
            </CountdownTimersContainer>
          )}
          <TimeComponent />
        </TrackerContainer>
      </Main>
    </Root>
  );
};
