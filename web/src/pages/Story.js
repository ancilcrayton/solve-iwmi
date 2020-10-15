import React, { useRef,useState } from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { ParallaxBanner } from 'react-scroll-parallax';

var Amphan = require('../assets/amphan.jpg');


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
}));


function Story() {

  const classes = useStyles();
  const codeAreaRef = useRef(null);

  
  

  return (
    <Grid container spacing={3} style={{height:60000}}>
        <ParallaxBanner
            className="your-class"
            layers={[
                {
                    image: Amphan,
                    amount: 0.2,
                },
                {
                    image: Amphan,
                    amount: 0.2,
                },
            ]}
            style={{
                height: '1000px',
            }}
        >
            <h1>Banner Children</h1>
        </ParallaxBanner>
    </Grid>



  );
}

export default Story;
