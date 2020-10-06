import React from 'react';
import { BrowserRouter  as Router, Switch,Route, NavLink} from 'react-router-dom';


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';

import Dashboard from '../pages/Dashboard'
import SearchPage from '../pages/Search'
import Story from '../pages/Story'

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

                    <Button to={"/"} exact className={classes.menuButton} activeClassName={classes.active}  color="primary" component={NavLink} >
                        Dashboard
                    </Button>
                    <Button to={"/search"} className={classes.menuButton} activeClassName={classes.active}  color="primary" component={NavLink} >
                        Search
                    </Button>
                </Toolbar>
            </AppBar>
            <Switch>
                {/* <Route exact path="/" component={Home} />  */}
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/search" component={SearchPage} />

            </Switch>
      </Router>

    );
}
export default Routes;
