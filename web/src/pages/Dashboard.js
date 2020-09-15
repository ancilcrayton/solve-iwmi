import React, { useRef,useState } from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import ResponsiveNetwork  from '../nivo/packages/network/src/ResponsiveNetwork'

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      padding:10,
      backgroundColor:'#f9fafc'
    },
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


function Dashboard() {

  const classes = useStyles();
  const codeAreaRef = useRef(null);
  const [nodes, setNodes] = useState([
    {
      "id": "1",
      "radius": 8,
      "depth": 1,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "2",
      "radius": 8,
      "depth": 1,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "3",
      "radius": 8,
      "depth": 1,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "4",
      "radius": 8,
      "depth": 1,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "5",
      "radius": 8,
      "depth": 1,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "6",
      "radius": 8,
      "depth": 1,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "7",
      "radius": 8,
      "depth": 1,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "8",
      "radius": 8,
      "depth": 1,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "9",
      "radius": 8,
      "depth": 1,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "10",
      "radius": 8,
      "depth": 1,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "11",
      "radius": 8,
      "depth": 1,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "12",
      "radius": 8,
      "depth": 1,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "13",
      "radius": 8,
      "depth": 1,
      "color": "rgb(97, 205, 187)"
    },
    {
      "id": "0",
      "radius": 12,
      "depth": 0,
      "color": "rgb(244, 117, 96)"
    },
    {
      "id": "1.0",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "1.1",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "1.2",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "1.3",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "2.0",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "2.1",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "2.2",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "2.3",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "2.4",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "2.5",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "2.6",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "2.7",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "2.8",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "2.9",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "2.10",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "2.11",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "2.12",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.0",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.1",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.2",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.3",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.4",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.5",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.6",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.7",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.8",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.9",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.10",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.11",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.12",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.13",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "3.14",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "4.0",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "4.1",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "4.2",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "4.3",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "4.4",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "5.0",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "5.1",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "5.2",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "5.3",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "5.4",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "5.5",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "5.6",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "5.7",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "5.8",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "5.9",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "5.10",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "5.11",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.0",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.1",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.2",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.3",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.4",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.5",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.6",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.7",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.8",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.9",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.10",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.11",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.12",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.13",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "6.14",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "7.0",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "7.1",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "7.2",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "7.3",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "7.4",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "7.5",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "7.6",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "7.7",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "8.0",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "8.1",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "8.2",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "8.3",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "8.4",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "8.5",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "8.6",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "8.7",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "8.8",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "9.0",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "9.1",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "9.2",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "9.3",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.0",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.1",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.2",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.3",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.4",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.5",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.6",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.7",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.8",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.9",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.10",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.11",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.12",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.13",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "10.14",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.0",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.1",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.2",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.3",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.4",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.5",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.6",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.7",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.8",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.9",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.10",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.11",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.12",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.13",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "11.14",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "12.0",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "12.1",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "12.2",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "12.3",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "12.4",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "12.5",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "12.6",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "13.0",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "13.1",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "13.2",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "13.3",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "13.4",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "13.5",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "13.6",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "13.7",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "13.8",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "13.9",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    },
    {
      "id": "13.10",
      "radius": 4,
      "depth": 2,
      "color": "rgb(232, 193, 160)"
    }
  ])
  const [links, setLinks] = useState([
    {
      "source": "0",
      "target": "1",
      "distance": 50
    },
    {
      "source": "1",
      "target": "1.0",
      "distance": 30
    },
    {
      "source": "1",
      "target": "1.1",
      "distance": 30
    },
    {
      "source": "1",
      "target": "1.2",
      "distance": 30
    },
    {
      "source": "1",
      "target": "1.3",
      "distance": 30
    },
    {
      "source": "0",
      "target": "2",
      "distance": 50
    },
    {
      "source": "2",
      "target": "2.0",
      "distance": 30
    },
    {
      "source": "2",
      "target": "2.1",
      "distance": 30
    },
    {
      "source": "2",
      "target": "2.2",
      "distance": 30
    },
    {
      "source": "2",
      "target": "2.3",
      "distance": 30
    },
    {
      "source": "2",
      "target": "2.4",
      "distance": 30
    },
    {
      "source": "2",
      "target": "2.5",
      "distance": 30
    },
    {
      "source": "2",
      "target": "2.6",
      "distance": 30
    },
    {
      "source": "2",
      "target": "2.7",
      "distance": 30
    },
    {
      "source": "2",
      "target": "2.8",
      "distance": 30
    },
    {
      "source": "2",
      "target": "2.9",
      "distance": 30
    },
    {
      "source": "2",
      "target": "2.10",
      "distance": 30
    },
    {
      "source": "2",
      "target": "2.11",
      "distance": 30
    },
    {
      "source": "2",
      "target": "2.12",
      "distance": 30
    },
    {
      "source": "0",
      "target": "3",
      "distance": 50
    },
    {
      "source": "3",
      "target": "11",
      "distance": 70
    },
    {
      "source": "3",
      "target": "3.0",
      "distance": 30
    },
    {
      "source": "3",
      "target": "3.1",
      "distance": 30
    },
    {
      "source": "3",
      "target": "3.2",
      "distance": 30
    },
    {
      "source": "3",
      "target": "3.3",
      "distance": 30
    },
    {
      "source": "3",
      "target": "3.4",
      "distance": 30
    },
    {
      "source": "3",
      "target": "3.5",
      "distance": 30
    },
    {
      "source": "3",
      "target": "3.6",
      "distance": 30
    },
    {
      "source": "3",
      "target": "3.7",
      "distance": 30
    },
    {
      "source": "3",
      "target": "3.8",
      "distance": 30
    },
    {
      "source": "3",
      "target": "3.9",
      "distance": 30
    },
    {
      "source": "3",
      "target": "3.10",
      "distance": 30
    },
    {
      "source": "3",
      "target": "3.11",
      "distance": 30
    },
    {
      "source": "3",
      "target": "3.12",
      "distance": 30
    },
    {
      "source": "3",
      "target": "3.13",
      "distance": 30
    },
    {
      "source": "3",
      "target": "3.14",
      "distance": 30
    },
    {
      "source": "0",
      "target": "4",
      "distance": 50
    },
    {
      "source": "4",
      "target": "4.0",
      "distance": 30
    },
    {
      "source": "4",
      "target": "4.1",
      "distance": 30
    },
    {
      "source": "4",
      "target": "4.2",
      "distance": 30
    },
    {
      "source": "4",
      "target": "4.3",
      "distance": 30
    },
    {
      "source": "4",
      "target": "4.4",
      "distance": 30
    },
    {
      "source": "0",
      "target": "5",
      "distance": 50
    },
    {
      "source": "5",
      "target": "5.0",
      "distance": 30
    },
    {
      "source": "5",
      "target": "5.1",
      "distance": 30
    },
    {
      "source": "5",
      "target": "5.2",
      "distance": 30
    },
    {
      "source": "5",
      "target": "5.3",
      "distance": 30
    },
    {
      "source": "5",
      "target": "5.4",
      "distance": 30
    },
    {
      "source": "5",
      "target": "5.5",
      "distance": 30
    },
    {
      "source": "5",
      "target": "5.6",
      "distance": 30
    },
    {
      "source": "5",
      "target": "5.7",
      "distance": 30
    },
    {
      "source": "5",
      "target": "5.8",
      "distance": 30
    },
    {
      "source": "5",
      "target": "5.9",
      "distance": 30
    },
    {
      "source": "5",
      "target": "5.10",
      "distance": 30
    },
    {
      "source": "5",
      "target": "5.11",
      "distance": 30
    },
    {
      "source": "0",
      "target": "6",
      "distance": 50
    },
    {
      "source": "6",
      "target": "6.0",
      "distance": 30
    },
    {
      "source": "6",
      "target": "6.1",
      "distance": 30
    },
    {
      "source": "6",
      "target": "6.2",
      "distance": 30
    },
    {
      "source": "6",
      "target": "6.3",
      "distance": 30
    },
    {
      "source": "6",
      "target": "6.4",
      "distance": 30
    },
    {
      "source": "6",
      "target": "6.5",
      "distance": 30
    },
    {
      "source": "6",
      "target": "6.6",
      "distance": 30
    },
    {
      "source": "6",
      "target": "6.7",
      "distance": 30
    },
    {
      "source": "6",
      "target": "6.8",
      "distance": 30
    },
    {
      "source": "6",
      "target": "6.9",
      "distance": 30
    },
    {
      "source": "6",
      "target": "6.10",
      "distance": 30
    },
    {
      "source": "6",
      "target": "6.11",
      "distance": 30
    },
    {
      "source": "6",
      "target": "6.12",
      "distance": 30
    },
    {
      "source": "6",
      "target": "6.13",
      "distance": 30
    },
    {
      "source": "6",
      "target": "6.14",
      "distance": 30
    },
    {
      "source": "0",
      "target": "7",
      "distance": 50
    },
    {
      "source": "7",
      "target": "7.0",
      "distance": 30
    },
    {
      "source": "7",
      "target": "7.1",
      "distance": 30
    },
    {
      "source": "7",
      "target": "7.2",
      "distance": 30
    },
    {
      "source": "7",
      "target": "7.3",
      "distance": 30
    },
    {
      "source": "7",
      "target": "7.4",
      "distance": 30
    },
    {
      "source": "7",
      "target": "7.5",
      "distance": 30
    },
    {
      "source": "7",
      "target": "7.6",
      "distance": 30
    },
    {
      "source": "7",
      "target": "7.7",
      "distance": 30
    },
    {
      "source": "0",
      "target": "8",
      "distance": 50
    },
    {
      "source": "8",
      "target": "11",
      "distance": 70
    },
    {
      "source": "8",
      "target": "8.0",
      "distance": 30
    },
    {
      "source": "8",
      "target": "8.1",
      "distance": 30
    },
    {
      "source": "8",
      "target": "8.2",
      "distance": 30
    },
    {
      "source": "8",
      "target": "8.3",
      "distance": 30
    },
    {
      "source": "8",
      "target": "8.4",
      "distance": 30
    },
    {
      "source": "8",
      "target": "8.5",
      "distance": 30
    },
    {
      "source": "8",
      "target": "8.6",
      "distance": 30
    },
    {
      "source": "8",
      "target": "8.7",
      "distance": 30
    },
    {
      "source": "8",
      "target": "8.8",
      "distance": 30
    },
    {
      "source": "0",
      "target": "9",
      "distance": 50
    },
    {
      "source": "9",
      "target": "11",
      "distance": 70
    },
    {
      "source": "9",
      "target": "9.0",
      "distance": 30
    },
    {
      "source": "9",
      "target": "9.1",
      "distance": 30
    },
    {
      "source": "9",
      "target": "9.2",
      "distance": 30
    },
    {
      "source": "9",
      "target": "9.3",
      "distance": 30
    },
    {
      "source": "0",
      "target": "10",
      "distance": 50
    },
    {
      "source": "10",
      "target": "10.0",
      "distance": 30
    },
    {
      "source": "10",
      "target": "10.1",
      "distance": 30
    },
    {
      "source": "10",
      "target": "10.2",
      "distance": 30
    },
    {
      "source": "10",
      "target": "10.3",
      "distance": 30
    },
    {
      "source": "10",
      "target": "10.4",
      "distance": 30
    },
    {
      "source": "10",
      "target": "10.5",
      "distance": 30
    },
    {
      "source": "10",
      "target": "10.6",
      "distance": 30
    },
    {
      "source": "10",
      "target": "10.7",
      "distance": 30
    },
    {
      "source": "10",
      "target": "10.8",
      "distance": 30
    },
    {
      "source": "10",
      "target": "10.9",
      "distance": 30
    },
    {
      "source": "10",
      "target": "10.10",
      "distance": 30
    },
    {
      "source": "10",
      "target": "10.11",
      "distance": 30
    },
    {
      "source": "10",
      "target": "10.12",
      "distance": 30
    },
    {
      "source": "10",
      "target": "10.13",
      "distance": 30
    },
    {
      "source": "10",
      "target": "10.14",
      "distance": 30
    },
    {
      "source": "0",
      "target": "11",
      "distance": 50
    },
    {
      "source": "11",
      "target": "11.0",
      "distance": 30
    },
    {
      "source": "11",
      "target": "11.1",
      "distance": 30
    },
    {
      "source": "11",
      "target": "11.2",
      "distance": 30
    },
    {
      "source": "11",
      "target": "11.3",
      "distance": 30
    },
    {
      "source": "11",
      "target": "11.4",
      "distance": 30
    },
    {
      "source": "11",
      "target": "11.5",
      "distance": 30
    },
    {
      "source": "11",
      "target": "11.6",
      "distance": 30
    },
    {
      "source": "11",
      "target": "11.7",
      "distance": 30
    },
    {
      "source": "11",
      "target": "11.8",
      "distance": 30
    },
    {
      "source": "11",
      "target": "11.9",
      "distance": 30
    },
    {
      "source": "11",
      "target": "11.10",
      "distance": 30
    },
    {
      "source": "11",
      "target": "11.11",
      "distance": 30
    },
    {
      "source": "11",
      "target": "11.12",
      "distance": 30
    },
    {
      "source": "11",
      "target": "11.13",
      "distance": 30
    },
    {
      "source": "11",
      "target": "11.14",
      "distance": 30
    },
    {
      "source": "0",
      "target": "12",
      "distance": 50
    },
    {
      "source": "12",
      "target": "6",
      "distance": 70
    },
    {
      "source": "12",
      "target": "12.0",
      "distance": 30
    },
    {
      "source": "12",
      "target": "12.1",
      "distance": 30
    },
    {
      "source": "12",
      "target": "12.2",
      "distance": 30
    },
    {
      "source": "12",
      "target": "12.3",
      "distance": 30
    },
    {
      "source": "12",
      "target": "12.4",
      "distance": 30
    },
    {
      "source": "12",
      "target": "12.5",
      "distance": 30
    },
    {
      "source": "12",
      "target": "12.6",
      "distance": 30
    },
    {
      "source": "0",
      "target": "13",
      "distance": 50
    },
    {
      "source": "13",
      "target": "13.0",
      "distance": 30
    },
    {
      "source": "13",
      "target": "13.1",
      "distance": 30
    },
    {
      "source": "13",
      "target": "13.2",
      "distance": 30
    },
    {
      "source": "13",
      "target": "13.3",
      "distance": 30
    },
    {
      "source": "13",
      "target": "13.4",
      "distance": 30
    },
    {
      "source": "13",
      "target": "13.5",
      "distance": 30
    },
    {
      "source": "13",
      "target": "13.6",
      "distance": 30
    },
    {
      "source": "13",
      "target": "13.7",
      "distance": 30
    },
    {
      "source": "13",
      "target": "13.8",
      "distance": 30
    },
    {
      "source": "13",
      "target": "13.9",
      "distance": 30
    },
    {
      "source": "13",
      "target": "13.10",
      "distance": 30
    }
  ])
  

  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={6}>
        <Card>
          <CardContent style={{height:500}}>
            <ResponsiveNetwork
              nodes={nodes}
              links={links}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              repulsivity={6}
              iterations={60}
              nodeColor={function(t){return t.color}}
              nodeBorderWidth={1}
              nodeBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.8 ] ] }}
              linkThickness={function(t){return 2*(2-t.source.depth)}}
              motionStiffness={160}
              motionDamping={12}
              tooltip={node => {
                console.log(node)
                return (
                    <div>
                        <div>
                            <strong style={{ color: node.color }}>ID: {node.id}</strong>
                            <br />
                            Depth: {node.depth}
                            <br />
                            Radius: {node.radius}
                        </div>
                    </div>
                )
              }}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        Test
      </Grid>
    </Grid>
  );
}

export default Dashboard;
