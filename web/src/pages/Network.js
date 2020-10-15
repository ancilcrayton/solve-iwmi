import React, { useRef,useState,useEffect } from 'react';
import axios from 'axios'
import { 
    Grid,
    Card,
    CardContent
  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ResponsiveNetwork  from '../nivo/packages/network/src/ResponsiveNetwork'



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


function Network() {

    const classes = useStyles();
    const codeAreaRef = useRef(null);
    const [nodes, setNodes] = useState([])
    const [links, setLinks] = useState([])

    const loadNetwork = () => {

        axios({
            method:'post',
            url:`${process.env.REACT_APP_API_URL}/api/network`,
            withCredentials:true,
            data:{
            }
        }).then(response => {
        setNodes(response.data.nodes)
        setLinks(response.data.links)
        }).catch(error => {
            console.log('error',error)
        })
    }

    useEffect(() => {
        loadNetwork();
    }, []);
    return (
    <Grid container spacing={3}>
        <Grid item xs={12}>
            <Card>
                <CardContent style={{height:500}}>
                    <ResponsiveNetwork
                    nodes={nodes}
                    links={links}
                    margin={{ top: 100, right: 0, bottom: 10, left: 0 }}
                    repulsivity={6}
                    iterations={60}
                    nodeColor={function(t){return t.color}}
                    nodeBorderWidth={1}
                    nodeBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.8 ] ] }}
                    linkThickness={function(t){return 2*(2-t.source.depth)}}
                    motionStiffness={160}
                    motionDamping={12}
                    tooltip={node => {
                        return (
                            <div>
                                <div>
                                    <strong style={{ color: node.color }}>ID: {node.id}</strong>
                                    <br />
                                    Name: {node.name}
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
    </Grid>



  );
}

export default Network;
