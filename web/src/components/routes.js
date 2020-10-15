import React, {useState,useEffect} from 'react';
import { BrowserRouter  as Router, Switch,Route, NavLink} from 'react-router-dom';
import { Redirect } from 'react-router'

import axios from 'axios'

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';

import Dashboard from '../pages/Dashboard'
import SearchPage from '../pages/Search'
import Network from '../pages/Network'
import Login from '../pages/Login'

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
                    
                        <Typography variant="h5" className={classes.title}>
                            <NavLink className={classes.titleLink} to={"/"}>
                                IWMI
                            </NavLink>
                        </Typography>
                    
                    {/* <Button to={"/"} exact className={classes.menuButton} activeClassName={classes.active} color="primary" component={NavLink} >
                        Home
                    </Button> */}
                    <Button to={"/login"} exact className={classes.menuButton} activeClassName={classes.active}  color="primary" component={NavLink} >
                        Login
                    </Button>
                    <Button to={"/"} exact className={classes.menuButton} activeClassName={classes.active}  color="primary" component={NavLink} >
                        Dashboard
                    </Button>
                    {isAuthenticated ? <Button to={"/search"} className={classes.menuButton} activeClassName={classes.active}  color="primary" component={NavLink} >
                        Search
                    </Button>: ''} 
                    {isAuthenticated ? <Button to={"/network"} className={classes.menuButton} activeClassName={classes.active}  color="primary" component={NavLink} >
                    Network
                    </Button>: ''} 
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
