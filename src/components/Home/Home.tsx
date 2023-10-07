import React from "react";
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { CSSProperties } from 'react';

// internal imports
import home_image from '../../assets/Images/beautiful-world-of-ffxi.jpg'; //stored bg image to variable
import begin_tracking from '../../assets/Images/HomeMiddleLogo.png';
import { NavBar } from '../sharedComponents';
import { TimeComponent } from '../TimeComponent';



interface Props{
    title: string
}


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
})



//my tracker div
export const TrackerContainer = styled('div')({
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(98, 96, 109, .8)',
    marginTop: '1.5rem',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
})



export const Tracker = () => {
    const navigate = useNavigate();

    const handleStartClick = () => {
        const isUserLoggedIn = localStorage.getItem('auth') === 'true';

        if (isUserLoggedIn) {
            navigate('/dashboard'); //navigate to the dashboard if logged in
        } else {
            navigate('/auth'); //navigate to the login page if not logged in
        }
    };

    return (
        <TrackerContainer>
            <img src={`${begin_tracking}`} alt="Your Alt Text"         
            style={{
            width: '20rem',
            height: 'auto'
        }} />
            <Button
                component={Link}
                to={localStorage.getItem('auth') === 'true' ? '/profile' : '/auth'}
                variant="contained"
                color="primary"
                onClick={handleStartClick}
                style={{
                    position: 'absolute',
                    bottom: '3rem',
                    left: '50%',
                    transform: 'translateX(-50%)'
                }}
            >
                Start
            </Button>
            <div style={{ marginTop: '50px' }}>
    </div>
        </TrackerContainer>
    )
}



//MainText
const MainText = styled('div')({
    fontFamily: 'monospace',
    textAlign: 'center',
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white'
})



export const Home = (props: Props) => {

    return (
        <Root>
            <NavBar />
            <Main>
                <MainText>
                    <Tracker />
                </MainText>
            </Main>
        </Root>
    )
}
