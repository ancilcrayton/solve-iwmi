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
    InputAdornment
} from '@material-ui/core';
import {
    ExpandMore,
    Search,
    CheckCircle,
    Cancel
} from '@material-ui/icons';

import clsx from 'clsx';
import AcledFilters from '../components/filters'
import DateFilters from '../components/dateFilters'
import TablePaginationActions from '../components/tableActions'
import Highlight from '../components/highlight'
import {handleExpand, handSearchButton,handleChangePage,handleChangeRowsPerPage,onTextChange} from '../helpers/helpers'

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
      }
}));


function ACLEDPage() {
    const classes = useStyles();

    const [rows, setRows] = useState([])
    const [expand, setExpand] = useState(null)
    const [startDate, changeStartDate] = useState(null);
    const [endDate, changeEndDate] = useState(null);
    const [filters, setFilters] = useState({})
    const [textBox, setTextBox] = useState({})
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [total, setTotal] = React.useState(5); 

    const onSelectChange = (event, values,name) => {
        setFilters(prevState => {
            return {
                ...prevState,
                [name]:values.map((option) => option.key ? option.key : option)
            }
        });
        setRows([])
    }
    

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
            url:`${process.env.REACT_APP_API_URL}/search/acled`,
            data:{
                startDate:startDate,
                endDate:endDate,
                ied:filters.ied,
                country:filters.country,
                event:filters.event,
                actor:filters.actor,
                source:filters.source,
                search:textBox.search,
                name:textBox.name,
                size:rowsPerPage,
                from:from
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
    }, [startDate,endDate,filters]);

    useEffect(()=>{
        if(page !== 0 && (rowsPerPage*page+rowsPerPage*2) > rows.length){
            loadData(false)
        }
        else if(page === 0 && rowsPerPage > rows.length ){
            loadData(true)
        }
    },[rowsPerPage,page])

    const handleSwitchChange = name => event => {
        setFilters(prevState => {
            return {
                ...prevState,
                [name]: event.target.checked
            }
        });
        setRows([])
    };
    
    
    return (
        <div style={{ padding: 15 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card className={classes.card} variant="outlined">
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item lg={4} xs={6}>
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
                                <AcledFilters
                                    onSelectChange={onSelectChange}
                                    handleSwitchChange={handleSwitchChange}
                                />
                            </Grid>

                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Event ID</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="left">Type</TableCell>
                                    <TableCell align="left">Region</TableCell>
                                    <TableCell align="left">Country</TableCell>
                                    <TableCell align="left">Fatalities</TableCell>
                                    <TableCell align="left">Source</TableCell>
                                    <TableCell align="left">IED Event</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,i) => 
                                    <Fragment key={"row_"+i}>
                                        <TableRow key={"row_"+i}>
                                            <TableCell component="th" scope="left">{row._id}</TableCell>
                                            <TableCell align="left">{row._source['event_date']}</TableCell>
                                            <TableCell align="left">{row._source['event_type']}</TableCell>
                                            <TableCell align="left">{row._source['region']}</TableCell>
                                            <TableCell align="left">{row._source['country']}</TableCell>
                                            <TableCell align="left">{row._source['fatalities']}</TableCell>
                                            <TableCell align="left">{row._source['source'].length > 0 ? row._source['source'].reduce((result, item) => <>{result}{', '}{item}</>) : ''}</TableCell>
                                            <TableCell align="left">{(row._source['model_ied'] === 1) ? <CheckCircle style={{color:'green'}} fontSize="small" /> : <Cancel style={{color:'red'}} fontSize="small" />}</TableCell>
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
                                            field='notes'
                                        />
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                                                <Collapse
                                                    in={i===expand}
                                                    timeout="auto"
                                                    unmountOnExit
                                                >
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={3}>
                                                            <b>Actor 1:</b> {row._source['actor1']}
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <b>Actor 2:</b> {row._source['actor2']}
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <b>Location</b> {row._source['location']}
                                                        </Grid>
                                                        <Grid item xs={3}/>
                                                        <Grid item xs={12}>
                                                            <div style={{display:'inline',whiteSpace:'pre-wrap'}}>
                                                                <b>Notes:</b> {row._source['notes']}
                                                            </div>
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

export default ACLEDPage;
