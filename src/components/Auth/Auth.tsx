import React from 'react';
import { useState } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import {
    onAuthStateChanged,
    getAuth,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword } from 'firebase/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {
    Box,
    Button,
    Typography,
    Snackbar,
    Stack,
    Divider,
    CircularProgress,
    Dialog,
    DialogContent,
    Alert } from '@mui/material';
import { styled } from '@mui/system';


//internal imports
import { NavBar } from '../sharedComponents';
import { InputText, InputPassword } from '../sharedComponents';
import home_image from '../../assets/Images/beautiful-world-of-ffxi.jpg'


const authStyles = {
    Main: {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .5)), url(${home_image});`, 
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center bottom',
        position: 'absolute',
    },
    stack : {
        width: '400px',
        marginTop: '100px',
        marginRight: 'auto',
        marginLeft: 'auto',
        color: 'white',
    },
    button: {
        width: '175px',
        fontSize: '14px'
    }
}



// our interfaces for our function arguments

interface Props {
    title: string; 
}


interface ButtonProps {
    open: boolean
    onClick: () => void
}

interface SubmitProps {
    email: string
    password: string
}


// making a literal union type for our alerts
export type MessageType = 'error' | 'warning' | 'info' | 'success'

const handleSave = async (user: { uid: string; email: string | null }) => {
    try {
        if (!user.email) {
            console.error('User email is null');
            return;
        }

        // Initialize Firestore
        const db = getFirestore();

        // Define collection reference 
        const lockoutTimesCollection = collection(db, 'lockoutTimes');

        // Create doc with lockout times and associated user
        await addDoc(lockoutTimesCollection, {
            user: user.uid,
            dynamis: '0', //default values
            limbus: '0',
            salvage: '0',
            assault: '0',
        });

        console.log('Lockout times saved successfully!');
    } catch (error) {
        console.error('Error saving lockout times:', error);
    }
};


const GoogleButton = (_props: ButtonProps ) => {
    // setting up our hooks to manage the state of some things
    const [ open, setOpen ] = useState(false)
    const [ message, setMessage ] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const navigate = useNavigate()
    const auth = getAuth()
    const [ signInWithGoogle, _user, loading, error ] = useSignInWithGoogle(auth)

    const signIn = async () => {
        await signInWithGoogle();

        localStorage.setItem('auth', 'true')
        onAuthStateChanged(auth, (user) => {

            if (user) {
                localStorage.setItem('user', user.email || '') 
                localStorage.setItem('token', user.uid || '')
                setMessage(`Successfully logged in ${user.email}`)
                setMessageType('success')
                setOpen(true)
                setTimeout(() => {navigate('/')}, 2000)
            }
            
        })

        if (error) {
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        }

        if (loading) {
            return <CircularProgress />
        }
    }

    return (
        <Box>
            <Button
                variant = 'contained'
                color = 'info'
                size = 'large'
                sx = { authStyles.button }
                onClick = { signIn }
            >
                Sign In With Google
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={()=> setOpen(false)}
            >
                <Alert severity = {messageType}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    )

}


const SignIn = () => {
    // setting up our hooks 
    const [ open, setOpen ] = useState(false)
    const [ message, setMessage ] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const navigate = useNavigate() //instantiate that useNavigate() object to use
    const auth = getAuth() //essentially monitoring the state of our authorization
    const { register, handleSubmit } = useForm<SubmitProps>({});


    const onSubmit: SubmitHandler<SubmitProps> = async (data, event) => {
        if (event) event.preventDefault();
    
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user;
    
                //save lockout times to Firestore
                handleSave(user);
    
                localStorage.setItem('auth', 'true');
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        localStorage.setItem('token', user.uid || '');
                        localStorage.setItem('user', user.email || '');
                    }
                });
            // Once a user is signed in we can display a success message
            setMessage(`Successfully logged in user ${user.email}`)
            setMessageType('success')
            setOpen(true)
            setTimeout(()=>{navigate('/')}, 2000)
        })
        .catch((error) => {
            const errorMessage = error.message;
            setMessage(errorMessage);
            setMessageType('error');
            setOpen(true);
        });
    };

    return (
        <Box>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <Typography variant='h6'>Sign Into Your Account</Typography>
                <Box>
                    <label htmlFor='email'></label>
                    <InputText {...register('email')} name='email' placeholder='Email Here' />
                    <label htmlFor='password'></label>
                    <InputPassword {...register('password')} name='password' placeholder='Password must be 6 or more characters' />
                </Box>
                <Button type='submit'>Submit</Button>
            </form>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={()=> setOpen(false)}
            >
                <Alert severity = {messageType}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    )

}



const SignUp = () => {
    // setting up our hooks 
    const [ open, setOpen ] = useState(false)
    const [ message, setMessage ] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const navigate = useNavigate() //instantiate that useNavigate() object to use
    const auth = getAuth() //essentially monitoring the state of our authorization
    const { register, handleSubmit } = useForm<SubmitProps>({});


    const onSubmit: SubmitHandler<SubmitProps> = async (data, event) => {
        if (event) event.preventDefault();
    
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user;
    
                // Add this line to save lockout times to Firestore
                handleSave(user);
    
                localStorage.setItem('auth', 'true');
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        localStorage.setItem('token', user.uid || '');
                        localStorage.setItem('user', user.email || '');
                    }
                });
            // Once a user is signed in we can display a success message
            setMessage(`Successfully logged in user ${user.email}`)
            setMessageType('success')
            setOpen(true)
            setTimeout(()=>{navigate('/')}, 2000)
        })
        .catch((error) => {
            const errorMessage = error.message;
            setMessage(errorMessage);
            setMessageType('error');
            setOpen(true);
        });
    };


    return (
        <Box>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <Typography variant='h6'>Register</Typography>
                <Box>
                    <label htmlFor='email'></label>
                    <InputText {...register('email')} name='email' placeholder='Email Here' />
                    <label htmlFor='password'></label>
                    <InputPassword {...register('password')} name='password' placeholder='Password must be 6 or more characters' />
                </Box>
                <Button type='submit'>Submit</Button>
            </form>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={()=> setOpen(false)}
            >
                <Alert severity = {messageType}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    )

}


const SignInContainer = styled('div')({
    background: 'rgba(98, 96, 109, .9)',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
});

export const Auth = (props: Props) => {
    // setup our hooks
    const [ open, setOpen ] = useState(false)
    const navigate = useNavigate();
    const [ signType, setSignType ] = useState<string>()

    const handleSnackClose = () => {
        setOpen(false)
        navigate('/')
    }


    return (
        <Box>
            <NavBar />
            <Box sx={authStyles.Main}>
            <Stack direction="column" alignItems="center" textAlign="center" sx={authStyles.stack}>
                <Typography variant="h2" sx={{ color: 'white' }}>
                {props.title}
                </Typography>
                <br />
                <Typography variant="h5"></Typography>
                <br />
                <Divider variant="fullWidth" color="white" />
                <br />
                <SignInContainer>
                <Stack
                    width="100%"
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                    spacing={5} // Set the desired spacing value
                >
                    <GoogleButton open={open} onClick={handleSnackClose} />
                    <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={authStyles.button}
                    onClick={() => {
                        setOpen(true);
                        setSignType('signin');
                    }}
                    >
                    Email Sign In
                    </Button>
                    <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={authStyles.button}
                    onClick={() => {
                        setOpen(true);
                        setSignType('signup');
                    }}
                    >
                    Register
                    </Button>
                </Stack>
                </SignInContainer>
            </Stack>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                {signType === 'signin' ? <SignIn /> : <SignUp />}
                </DialogContent>
            </Dialog>
            </Box>
        </Box>
        );
    };