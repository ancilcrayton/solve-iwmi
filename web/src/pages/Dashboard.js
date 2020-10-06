import React, {useEffect, useRef,useState } from 'react';
import axios from 'axios'
import { 
  Grid,
  Card,
  CardContent,
  TextField,
  IconButton,
  InputAdornment,
  Select,
  Switch,
  Slider,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Search
} from '@material-ui/icons';
import ReactWordcloud from "react-wordcloud";
import ResponsiveNetwork  from '../nivo/packages/network/src/ResponsiveNetwork'
import ResponsiveBar from '../nivo/packages/bar/src/ResponsiveBar'
import ResponsivePie from '../nivo/packages/pie/src/ResponsivePie'

import DateFilters from '../components/dateFilters'
import {handleSelect,onTextChange } from '../helpers/helpers'

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      padding:10,
      backgroundColor:'#f9fafc'
    },
    center:{
      textAlign:'center'
    },
    formControl:{
      width:'100%',
      marginTop:'16px',
      marginBottom:'8px'
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    displayLinebreak:{
      whiteSpace: "pre-line"
    },
    textBox:{
      width:"80%",
      marginTop:'16px',
      marginBottom:'8px'
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

const formater = new Intl.NumberFormat('en-IN')

function Dashboard() {

  const classes = useStyles();
  const [rows, setRows] = useState([])
  const codeAreaRef = useRef(null);
  const [nodes, setNodes] = useState([])
  const [links, setLinks] = useState([])
  const [charts, setCharts] = useState({
    wordCloud:[],
    langPie:[],
    povPie:[],
    topicsBar:[],
    avgSent:0,
    uniqueUsers:0,
    rewtweetCount:0,
    tweetCount:0,
  })  
  const [startDate, changeStartDate] = useState(null);
  const [endDate, changeEndDate] = useState(null);
  const [textBox, setTextBox] = useState({})
  const [selects,setSelect] = useState({
      topics:[],
      pov:[],
      lang:[]
  })
  const [verified, setVerified] = React.useState(false);
  const [sentiment, setSentiment] = React.useState([-1, 1]);

  const handleChangeSent = (event, newValue) => {
    setSentiment(newValue);
  };

  const handleChangeVer = (event) => {
      setVerified(event.target.checked);
  };

  const loadNetwork = () => {

    axios({
        method:'post',
        url:`${process.env.REACT_APP_API_URL}/api/network`,
        data:{
            startDate:startDate,
            endDate:endDate,
            search:textBox.search,
            topics:selects.topics,
            lang:selects.lang,
            pov:selects.pov,
            verified:verified,
            sentStart:sentiment[0],
            sentEnd:sentiment[1],
        }
    }).then(response => {
      setNodes(response.data.nodes)
      setLinks(response.data.links)
    }).catch(error => {
        console.log('error',error)
    })
  }

  const loadData = () => {

    axios({
        method:'post',
        url:`${process.env.REACT_APP_API_URL}/api/dashboard`,
        data:{
            startDate:startDate,
            endDate:endDate,
            search:textBox.search,
            topics:selects.topics,
            lang:selects.lang,
            pov:selects.pov,
            verified:verified,
            sentStart:sentiment[0],
            sentEnd:sentiment[1],
        }
    }).then(response => {
      console.log(response)
      setCharts({
        wordCloud:response.data.wordCloud,
        langPie:response.data.langPie,
        povPie:response.data.povPie,
        topicsBar:response.data.topicsBar,
        avgSent:response.data.avgSent,
        uniqueUsers:response.data.uniqueUsers,
        rewtweetCount:response.data.rewtweetCount,
        tweetCount:response.data.tweetCount,
      })
    }).catch(error => {
        console.log('error',error)
    })
  }

  useEffect(() => {
      loadData(true)
      loadNetwork()
  }, [startDate,endDate,selects,sentiment,verified]);

  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={12}>
        <Card className={classes.card} variant="outlined">
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item lg={3} xs={6}>
                        <TextField
                            className={classes.textBox}
                            id="search" 
                            label="Search" 
                            onChange={(event) => onTextChange(event,'search',setTextBox) }
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    loadData(true)
                                    ev.preventDefault();
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                <InputAdornment>
                                    <IconButton onClick={() => loadData(true)}>
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <DateFilters
                        startDate={startDate}
                        endDate={endDate}
                        changeStartDate={changeStartDate}
                        changeEndDate={changeEndDate}
                        setRows={setRows}
                    />
                    <Grid item lg={1} xs={4}>
                        <FormControl row style={{marginTop:'25px'}}>
                            <FormControlLabel
                                control={<Switch checked={verified} onChange={handleChangeVer} name="verified" color="primary"/>}
                                label="Verified"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={2} xs={4}>
                        <InputLabel>Sentiment Range</InputLabel>
                        <Slider
                            style={{marginTop:'25px'}}
                            value={sentiment}
                            onChange={handleChangeSent}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            min={-1}
                            max={1}
                            step={.05}
                        />
                    </Grid>
                    <Grid item lg={4} xs={6}>
                        <FormControl className={classes.formControl}>
                            <InputLabel>Topics</InputLabel>
                            <Select
                                multiple
                                id="topics"
                                name="topics"
                                onChange={handleSelect(setSelect)}
                                value={selects.topics}
                            >
                                <MenuItem value={'relief measures'}>Relief Measures</MenuItem>
                                <MenuItem value={'news updates'}>News Updates</MenuItem>
                                <MenuItem value={'donation'}>Donation</MenuItem>
                                <MenuItem value={'compensation'}>Compensation</MenuItem>
                                <MenuItem value={'government'}>Government</MenuItem>
                                <MenuItem value={'sympathy'}>Sympathy</MenuItem>
                                <MenuItem value={'hope'}>Hope</MenuItem>
                                <MenuItem value={'evacuation'}>Evacuation</MenuItem>
                                <MenuItem value={'job'}>Job</MenuItem>
                                <MenuItem value={'petition'}>Petition</MenuItem>
                                <MenuItem value={'utilities'}>Utilities</MenuItem>
                                <MenuItem value={'power supply'}>Power Supply</MenuItem>
                                <MenuItem value={'poverty'}>Poverty</MenuItem>
                                <MenuItem value={'medical assistance'}>Medical Assistance</MenuItem>
                                <MenuItem value={'volunteers'}>Volunteers</MenuItem>
                                <MenuItem value={'ecosystem'}>Ecosystem</MenuItem>
                                <MenuItem value={'housing'}>Housing</MenuItem>
                                <MenuItem value={'farm'}>Farm</MenuItem>
                                <MenuItem value={'corruption'}>Corruption</MenuItem>
                                <MenuItem value={'cellular network'}>Cellular Network</MenuItem>
                                <MenuItem value={'coronavirus'}>Coronavirus</MenuItem>
                                <MenuItem value={'food supply'}>Food Supply</MenuItem>
                                <MenuItem value={'criticism'}>Criticism</MenuItem>
                                <MenuItem value={'water supply'}>Water Supply</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item lg={4} xs={6}>
                        <FormControl className={classes.formControl}>
                            <InputLabel>POV</InputLabel>
                            <Select
                                id="pov"
                                name="pov"
                                onChange={handleSelect(setSelect)}
                                value={selects.pov}
                            >
                                <MenuItem value={'None'}>None</MenuItem>
                                <MenuItem value={'first'}>First Person</MenuItem>
                                <MenuItem value={'second'}>Second Person</MenuItem>
                                <MenuItem value={'third'}>Third Person</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item lg={4} xs={6}>
                        <FormControl className={classes.formControl}>
                            <InputLabel>Language</InputLabel>
                            <Select
                                id="lang"
                                name="lang"
                                onChange={handleSelect(setSelect)}
                                value={selects.lang}
                            >
                                <MenuItem value={'en'}>English</MenuItem>
                                <MenuItem value={'hi'}>Hindi</MenuItem>
                                <MenuItem value={'bn'}>Bengali</MenuItem>
                                <MenuItem value={'es'}>Spanish</MenuItem>
                                <MenuItem value={'or'}>Oriya</MenuItem>
                                <MenuItem value={'fr'}>French</MenuItem>
                                <MenuItem value={'in'}>Indonesian</MenuItem>
                                <MenuItem value={'ja'}>Japanese</MenuItem>
                                <MenuItem value={'de'}>German</MenuItem>
                                <MenuItem value={'und'}>Undefined</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
              </CardContent>
          </Card>
      </Grid>
      <Grid item xs={3}>
        <Card>
            <CardContent >
                <b>Number of Tweets: </b>{formater.format(charts.tweetCount)}
            </CardContent>
          </Card>
      </Grid>
      <Grid item xs={3}>
        <Card>
            <CardContent>
              <b>Number of Retweets: </b>{formater.format(charts.rewtweetCount)}
            </CardContent>
          </Card>
      </Grid>
      <Grid item xs={3}>
        <Card>
            <CardContent >
              <b>Unique Users: </b>{formater.format(charts.uniqueUsers)}
            </CardContent>
          </Card>
      </Grid>
      <Grid item xs={3}>
        <Card>
            <CardContent>
              <b>Sentiment: </b>{charts.avgSent.toFixed(3)}
            </CardContent>
          </Card>
      </Grid>
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
      <Grid item xs={6}>
        <Card>
            <CardContent style={{height:'500px'}}>
                <ReactWordcloud 
                  words={charts.wordCloud}
                  options={{fontSizes:[10,80]}}
                />
            </CardContent>
          </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardContent style={{height:'500px'}}>
            <ResponsivePie
                data={charts.povPie}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'nivo' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                radialLabelsSkipAngle={10}
                radialLabelsTextXOffset={6}
                radialLabelsTextColor="#333333"
                radialLabelsLinkOffset={0}
                radialLabelsLinkDiagonalLength={16}
                radialLabelsLinkHorizontalLength={24}
                radialLabelsLinkStrokeWidth={1}
                radialLabelsLinkColor={{ from: 'color' }}
                slicesLabelsSkipAngle={10}
                slicesLabelsTextColor="#333333"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        translateY: 56,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: '#999',
                        symbolSize: 18,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000'
                                }
                            }
                        ]
                    }
                ]}
              />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardContent style={{height:'500px'}}>
            <ResponsivePie
                data={charts.langPie}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'nivo' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                radialLabelsSkipAngle={10}
                radialLabelsTextXOffset={6}
                radialLabelsTextColor="#333333"
                radialLabelsLinkOffset={0}
                radialLabelsLinkDiagonalLength={16}
                radialLabelsLinkHorizontalLength={24}
                radialLabelsLinkStrokeWidth={1}
                radialLabelsLinkColor={{ from: 'color' }}
                slicesLabelsSkipAngle={10}
                slicesLabelsTextColor="#333333"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        translateY: 56,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: '#999',
                        symbolSize: 18,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000'
                                }
                            }
                        ]
                    }
                ]}
              />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
            <CardContent style={{height:'500px'}}>
              <ResponsiveBar
                data={charts.topicsBar}
                keys={['value']}
                indexBy="topic"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: 'accent' }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'topics',
                  legendPosition: 'middle',
                  legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Tweets',
                legendPosition: 'middle',
                legendOffset: -50
            }}
              />
            </CardContent>
          </Card>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
