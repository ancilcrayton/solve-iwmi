import React, {useState,useEffect} from 'react';
import { BrowserRouter  as Router, Switch,Route, NavLink} from 'react-router-dom';
import { Redirect } from 'react-router'

import axios from 'axios'

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Dashboard from '../pages/Dashboard'
import SearchPage from '../pages/Search'
import Network from '../pages/Network'
import Login from '../pages/Login'
import iwmiLogo from '../assets/iwmi-logo.png'; 
import dssgLogo from '../assets/dssglogo.png'; 

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    titleLink:{
        textDecoration: 'none',
        color:'inherit',
    },
    menuButton: {
      marginRight: theme.spacing(2),
      color: "white",
    },
    title: {
        paddingRight:"30px",
    },
    active:{
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    image:{
        width:'40px',
        height:'40px'
    }
  }));

function Routes() {
    const classes = useStyles();
    const [isAuthenticated, userHasAuthenticated] = useState(false);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        axios({
        method:'post',
        url:`${process.env.REACT_APP_API_URL}/api/checkLogin`,
        }).then(response => {
            userHasAuthenticated(true)
        }).catch(error => {
            userHasAuthenticated(false)
            console.log('not logged in',error)
        })
    }

    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Grid
                        justify="space-between" // Add it here :)
                        container 
                        spacing={3}
                    >
                        <Grid item xs={1}>
                            <Typography variant="h5" className={classes.title}>
                                <NavLink className={classes.titleLink} to={"/"}>
                                    IWMI
                                </NavLink>
                            </Typography>
                        </Grid>
                        {/* <Button to={"/"} exact className={classes.menuButton} activeClassName={classes.active} color="primary" component={NavLink} >
                            Home
                        </Button> */}
                        <Grid item xs={1}>
                            <Button to={"/login"} exact className={classes.menuButton} activeClassName={classes.active}  color="primary" component={NavLink} >
                                Login
                            </Button>
                        </Grid>
                        <Grid item xs={1}>
                            <Button to={"/"} exact className={classes.menuButton} activeClassName={classes.active}  color="primary" component={NavLink} >
                                Dashboard
                            </Button>
                        </Grid>
                        <Grid item xs={1}>
                            {isAuthenticated ? <Button to={"/search"} className={classes.menuButton} activeClassName={classes.active}  color="primary" component={NavLink} >
                                Search
                            </Button>: ''} 
                        </Grid>
                        <Grid item xs={1}>
                            {isAuthenticated ? <Button to={"/network"} className={classes.menuButton} activeClassName={classes.active}  color="primary" component={NavLink} >
                            Network
                            </Button>: ''} 
                        </Grid>
                        <Grid item xs={5}>

                        </Grid>
                        <Grid item xs={1}>
                            <img className={classes.image} src={iwmiLogo} />
                        </Grid>
                        <Grid item xs={1}>
                            <img className={classes.image} src={dssgLogo} />
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Switch>
                {/* <Route exact path="/" component={Home} />  */}
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/search" render={props =>
                    isAuthenticated
                    ? <SearchPage/>
                    : <Redirect
                        to={`/login`}
                    />} 
                />
                <Route exact path="/network" render={props =>
                    isAuthenticated
                    ? <Network/>
                    : <Redirect
                        to={`/login`}
                    />} 
                />
                <Route exact path="/login" render={props =>
                    <Login
                        userHasAuthenticated= {userHasAuthenticated}
                        isAuthenticated={isAuthenticated}
                    />
                }/>

            </Switch>
      </Router>

    );
}
export default Routes;
