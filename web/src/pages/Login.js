import React, { useRef,useState,useEffect } from 'react';
import axios from 'axios'

import {
    Grid,
    TextField,
    Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {onTextChange } from '../helpers/helpers'
import { Redirect } from 'react-router'


const useStyles = makeStyles(theme => ({
    center:{
      textAlign:'center'
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    displayLinebreak:{
      whiteSpace: "pre-line"
    },
    textarea:{
      height:'100%',
      width:"75%"
    },
    image:{
      maxWidth:'75%',
      maxHeight:'700px'
    },
    textBox:{
        width:"80%",
        marginTop:'16px',
        marginBottom:'8px',
        alignContent:'center'
    },
}));


function Login({userHasAuthenticated,isAuthenticated}) {

    const classes = useStyles();
    const [textBox, setTextBox] = useState({})

    const submitLogin = (event) => {
        axios({
            method:'post',
            url:`${process.env.REACT_APP_API_URL}/api/login`,
            withCredentials:true,
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'application/json',
            },
            data:{
                email:textBox.username,
                password:textBox.password
            }
        }).then(response => {
            userHasAuthenticated(true)
        }).catch(error => {
            console.log(error)
            alert('Wrong Login Try Again')
        })
    };

    const logout = (event) => {
        axios({
            method:'post',
            url:`${process.env.REACT_APP_API_URL}/api/logout`,
        }).then(response => {
            userHasAuthenticated(false)
        }).catch(error => {
            
        })
    };

    return (
        <div>
            {isAuthenticated ?
                <Grid container spacing={3}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4} style={{paddingTop:'50px'}}>
                        
                        <Button onClick={logout} variant="contained">Logout</Button>
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
                :
                <Grid container spacing={3}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <TextField
                            className={classes.textBox}
                            id="username" 
                            label="Username" 
                            onChange={(event) => onTextChange(event,'username',setTextBox) }
                        />
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item  xs={4}>
                        <TextField
                            className={classes.textBox}
                            id="password" 
                            label="Password"
                            type="password"
                            onChange={(event) => onTextChange(event,'password',setTextBox) }
                        />
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item  xs={4}>
                        <Button onClick={submitLogin} variant="contained">Login</Button>
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
            }
        </div>
    );
}

export default Login;
