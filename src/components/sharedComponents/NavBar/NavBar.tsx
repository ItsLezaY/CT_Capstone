import _React, { useState } from 'react'; 
import {
    Button,
    Drawer,
    ListItemButton,
    List,
    ListItemText,
    AppBar,
    Toolbar,
    IconButton,
    Stack, //this is flexbox
    Typography,
    Divider, //just a line
    CssBaseline,
    Box //just a basic div 
} from '@mui/material'; 
import { useNavigate } from 'react-router-dom'; 
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import BrowseGalleryIcon from '@mui/icons-material/BrowseGallery';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { signOut, getAuth } from 'firebase/auth'


// internal imports 
import { theme } from '../../../Theme/themes'; 
import Logo from '../../../assets/Images/Logo.png';


// buiding a CSS object 

const drawerWidth = 200; 

const navStyles = {
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp, //number 
            duration: theme.transitions.duration.leavingScreen //number
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut, //number 
            duration: theme.transitions.duration.enteringScreen //number
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2) //default it 8px * 2 == 16px 
    },
    hide: {
        display: 'none'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        display: 'flex',
        width: drawerWidth,
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end'
    },
    content: {
        transition: theme.transitions.create('margin', { //shifting it back to original position
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: 0
    },
    contentShift: {
        transition: theme.transitions.create('margin', { //shifting out content 
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
    },
    toolbar: {
        display: 'flex'
    },
    toolbarButton: {
        marginLeft: 'auto',
        color: theme.palette.primary.contrastText
    },
    signInStack: {
        position: 'absolute', 
        top: '20%', 
        right:'50px'
    }
}



//navbar component
export const NavBar = () => {
    const navigate = useNavigate(); //instantiating our useNavigate() hook 
    const [ open, setOpen ] = useState(false); 
    const myAuth = localStorage.getItem('auth') //either come back true or false depending on if someone is logged in
    const auth = getAuth()



    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const navLinks = [
        {
            text: 'Home',
            icon: <HomeIcon/>,
            onClick: () => {navigate('/')}
        },
        {
            text: myAuth === 'true' ? 'Profile' : 'Sign In',
            icon: myAuth === 'true' ? <AssignmentIndIcon /> : <AssignmentIndIcon />,
            onClick: () => {navigate(myAuth === 'true' ? '/profile' : '/auth')}
        },
        {
            text: myAuth === 'true' ? 'Dashboard' : '',
            icon: myAuth === 'true' ? <BrowseGalleryIcon /> : '',
            onClick: myAuth === 'true' ? () => {navigate('/dashboard')} : () => {}
        },
    ]


    let signInText = 'Sign In'

    if (myAuth === 'true'){
        signInText = 'Sign Out'
    }

    const signInButton = async () => {
        if (myAuth === 'false'){
            navigate('/auth')
        } else {
            await signOut(auth)
            localStorage.setItem('auth', 'false')
            localStorage.setItem('token', '')
            localStorage.setItem('user', '')
            navigate('/')
        }
    }

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline />
            <AppBar 
                sx={ open ? navStyles.appBarShift : navStyles.appBar }
                position = 'fixed'
            >
                <Toolbar sx={ navStyles.toolbar }>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        onClick = { handleDrawerOpen }
                        edge = 'start'
                        sx = { open ? navStyles.hide : navStyles.menuButton }
                    >
                        <MenuIcon />
                    </IconButton>
                    <img src={Logo} alt="Logo" style={{ height: '60px', margin: '0 8px' }} />
                </Toolbar>
                <Stack direction='row' justifyContent='space-between' alignItems='center' sx={ navStyles.signInStack }>
                <Box className="user-email" sx={{ color: 'inherit' }}>
                    <Typography variant='body2' sx={{color: 'inherit'}}>
                        {localStorage.getItem('user')}
                    </Typography>
                </Box>
                    <Button 
                        variant = 'contained'
                        color = 'secondary'
                        size = 'large'
                        sx = {{ marginLeft: '20px'}}
                        onClick = { signInButton }
                        >
                        { signInText }
                    </Button>
                </Stack>
            </AppBar>
            <Drawer 
                sx = { open ? navStyles.drawer : navStyles.hide }
                variant = 'persistent'
                anchor = 'left'
                open = {open}
            >
                <Box sx = { navStyles.drawerHeader }>
                    <IconButton onClick={handleDrawerClose}>
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Divider />
                <List>
                    { navLinks.map((item) => {
                        //searching for the variables with the same name on item object
                        const { text, icon, onClick } = item; 
                        return (
                            <ListItemButton key={text} onClick={onClick}>
                                <ListItemText primary={text} />
                                { icon }
                            </ListItemButton>
                        )
                    })}
                </List>
            </Drawer>
        </Box>
    )

}