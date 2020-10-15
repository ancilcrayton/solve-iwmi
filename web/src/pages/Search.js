import React, {useEffect, useState, Fragment} from 'react';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import { 
    Grid,
    Card,
    CardContent,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TextField,
    TableRow,
    TablePagination,
    TableFooter,
    Paper,
    IconButton,
    Icon,
    InputAdornment,
    Select,
    Switch,
    Slider,
    MenuItem,
    FormControl,
    FormControlLabel,
    InputLabel
} from '@material-ui/core';
import {
    ExpandMore,
    Search,
    ArrowUpward,
    ArrowDownward
} from '@material-ui/icons';

import clsx from 'clsx';
import DateFilters from '../components/dateFilters'
import TablePaginationActions from '../components/tableActions'
import Highlight from '../components/highlight'
import {handleSelect,handleExpand, handSearchButton,handleChangePage,handleChangeRowsPerPage,onTextChange } from '../helpers/helpers'

const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 650,
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
      },
      expandOpen: {
        transform: 'rotate(180deg)',
      },
      textBox:{
          width:"80%",
          marginTop:'16px',
          marginBottom:'8px'
      },
      formControl:{
          width:'100%',
          marginTop:'16px',
          marginBottom:'8px'
      },
      noselect:{
        userSelect: "none"
      }
}));

function SearchPage() {
    const classes = useStyles();

    const [rows, setRows] = useState([])
    const [expand, setExpand] = useState(null)
    const [startDate, changeStartDate] = useState(null);
    const [endDate, changeEndDate] = useState(null);
    const [textBox, setTextBox] = useState({})
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [total, setTotal] = React.useState(5);
    const [selects,setSelect] = useState({
        topics:[],
        pov:[],
        lang:[]
    })

    const [sort,setSort] = useState({'name':'id','direction':'asc'})
    const [verified, setVerified] = React.useState(false);
    const [sentiment, setSentiment] = React.useState([-1, 1]);

    const handleChangeSent = (event, newValue) => {
        setSentiment(newValue);
    };

    const handleSortClick = (value) => {

        if(sort.name === value){
            if(sort.direction === 'asc'){
                setSort({
                    name:value,
                    direction:'desc'
                })
            }
            else{
                setSort({
                    name:value,
                    direction:'asc'
                })
            }
        }
        else{
            setSort({
                name:value,
                direction:'desc'
            })
        }
    }

    const handleChangeVer = (event) => {
        setVerified(event.target.checked);
    };
    const loadData = (reload) => {
        var from;
        if(reload){
            from = 0
        }
        else{
            from = rows.length
        }
        axios({
            method:'post',
            url:`${process.env.REACT_APP_API_URL}/api/search`,
            withCredentials:true,
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
                size:rowsPerPage,
                from:from,
                sort:sort.name,
                direction:sort.direction
            }
        }).then(response => {
            var newRows;

            if(reload){
                newRows =  response.data.data.hits
                setPage(0)
            }
            else{
                newRows =  rows.concat(response.data.data.hits)
            }
            const total = response.data.data.total.value
            setExpand(null)
            setRows(newRows)
            setTotal(total)

        }).catch(error => {
            console.log('error',error)
        })
    }

    useEffect(() => {
        loadData(true)
    }, [startDate,endDate,selects,sentiment,verified,sort]);

    useEffect(()=>{
        if(page !== 0 && (rowsPerPage*page+rowsPerPage*2) > rows.length){
            loadData(false)
        }
        else if(page === 0 && rowsPerPage > rows.length ){
            loadData(true)
        }
    },[rowsPerPage,page])
    
    // useEffect(() => {
    //     const loadFilterOptions = () => {
    //         axios({
    //             method:'get',
    //             url:'http://localhost:8080/filters/scraper'
    //         }).then(response => {
    //             const data = response.data
    //             setFilterOptions(prevState => {
    //                 return {
    //                     ...prevState,
    //                     domains:data.domains,
    //                 }
    //             });
    //         }).catch(error => {
    //             console.log('error',error)
    //         })
    //     }

    //     loadFilterOptions()
    // }, []);
    
    return (
        <div style={{ padding: 15 }}>
            <Grid container spacing={3}>
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
                                                <IconButton onClick={() => handSearchButton(setRows,setPage,loadData)}>
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
                                    <FormControl style={{marginTop:'25px'}}>
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
                                <Grid item lg={3} xs={6}>
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
                                <Grid item lg={3} xs={6}>
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
                                <Grid item lg={3} xs={6}>
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
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell onClick={() => handleSortClick('id')}>Tweet ID</TableCell>
                                    <TableCell className={classes.noselect} onClick={() => handleSortClick('sentiment')}> 
                                        Sentiment
                                        {sort.name === 'sentiment' ? 
                                            sort.direction === 'asc' ? 
                                            <Icon>
                                                <ArrowUpward />
                                            </Icon> :
                                            <Icon>
                                                <ArrowDownward />
                                            </Icon>
                                            : ''
                                        }
                                    </TableCell>
                                    <TableCell className={classes.noselect} onClick={() => handleSortClick('pov.keyword')}> 
                                        POV
                                        {sort.name === 'pov.keyword' ? 
                                            sort.direction === 'asc' ? 
                                            <Icon>
                                                <ArrowUpward />
                                            </Icon> :
                                            <Icon>
                                                <ArrowDownward />
                                            </Icon>
                                            : ''
                                        }
                                    </TableCell>
                                    <TableCell className={classes.noselect} onClick={() => handleSortClick('retweet_count')} align="left"> 
                                        Retweets
                                        {sort.name === 'retweet_count' ? 
                                            sort.direction === 'asc' ? 
                                            <Icon>
                                                <ArrowUpward />
                                            </Icon> :
                                            <Icon>
                                                <ArrowDownward />
                                            </Icon>
                                            : ''
                                        }
                                    </TableCell>
                                    <TableCell className={classes.noselect} onClick={() => handleSortClick('favorite_count')} align="left"> 
                                        Favorites
                                        {sort.name === 'favorite_count' ? 
                                            sort.direction === 'asc' ? 
                                            <Icon>
                                                <ArrowUpward />
                                            </Icon> :
                                            <Icon>
                                                <ArrowDownward />
                                            </Icon>
                                            : ''
                                        }
                                    </TableCell>
                                    <TableCell className={classes.noselect} onClick={() => handleSortClick('reply_count')} align="left">
                                        Replies
                                        {sort.name === 'reply_count' ? 
                                            sort.direction === 'asc' ? 
                                            <Icon>
                                                <ArrowUpward />
                                            </Icon> :
                                            <Icon>
                                                <ArrowDownward />
                                            </Icon>
                                            : ''
                                        }
                                    </TableCell>
                                    <TableCell className={classes.noselect} onClick={() => handleSortClick('followers_count')} align="left">
                                        Followers
                                        {sort.name === 'followers_count' ? 
                                            sort.direction === 'asc' ? 
                                            <Icon>
                                                <ArrowUpward />
                                            </Icon> :
                                            <Icon>
                                                <ArrowDownward />
                                            </Icon>
                                            : ''
                                        }
                                    </TableCell>
                                    <TableCell className={classes.noselect} onClick={() => handleSortClick('tweet_created_at')} align="left">
                                        Date Added
                                        {sort.name === 'tweet_created_at' ? 
                                            sort.direction === 'asc' ? 
                                            <Icon>
                                                <ArrowUpward />
                                            </Icon> :
                                            <Icon>
                                                <ArrowDownward />
                                            </Icon>
                                            : ''
                                        }
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,i) => 
                                    <Fragment key={"row_"+i}>
                                        <TableRow key={"row_"+i}>
                                            <TableCell component="th" scope="left">{row._id}</TableCell>
                                            <TableCell  align="left">{row._source['sentiment'].toFixed(2)}</TableCell>
                                            <TableCell align="left">{row._source['pov'] ? row._source['pov'] :'None'}</TableCell>
                                            <TableCell align="left">{row._source['retweet_count']}</TableCell>
                                            <TableCell align="left">{row._source['favorite_count']}</TableCell>
                                            <TableCell align="left">{row._source['reply_count']}</TableCell>
                                            <TableCell align="left">{row._source['followers_count']}</TableCell>
                                            <TableCell align="left">{new Date(row._source['tweet_created_at']).toLocaleDateString("en-US")}</TableCell>
                                            <TableCell align="left">
                                                <IconButton
                                                    className={clsx(classes.expand, {
                                                        [classes.expandOpen]: i===expand,
                                                    })}
                                                    onClick={() => handleExpand(i,expand,setExpand)}
                                                    aria-expanded={true}
                                                    aria-label="show more"
                                                    >
                                                        <ExpandMore />
                                                    </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        <Highlight
                                            highlight={row.highlight}
                                            field='full_text_trans'
                                        />
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                                                <Collapse
                                                    in={i===expand}
                                                    timeout="auto"
                                                    unmountOnExit
                                                >
                                                    <Grid container spacing={4}>
                                                        <Grid item xs={4}>
                                                            <div style={{display:'inline',whiteSpace:'pre-wrap'}}>
                                                                <b>Full Tweet:</b> {row._source['full_text_trans'].split(".").join("\n")}
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <b>Topics:</b>
                                                            <ul>
                                                                {row._source['topics'] ? row._source['topics'].map((row,i) => 
                                                                    <li>{row} </li>
                                                                ) : ''}
                                                            </ul>
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <b>Similar Tweets:</b>
                                                            <ol>
                                                                {row._source['most_similar_tweets'] ? row._source['most_similar_tweets'].slice(0,5).map((row,i) => 
                                                                    <li>{row.text} </li>
                                                                ) : ''}
                                                            </ol>
                                                        </Grid>
                                                    </Grid>
                                                    
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, 50]}
                                        colSpan={9}
                                        count={total}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: { 'aria-label': 'rows per page' },
                                            native: true,
                                        }}
                                        onChangePage={(event,newPage) => handleChangePage(newPage,setPage)}
                                        onChangeRowsPerPage={handleChangeRowsPerPage(setRowsPerPage,setPage)}
                                        ActionsComponent={TablePaginationActions}
                                        />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    )

}

export default SearchPage;
