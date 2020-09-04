import React, {useEffect, useState, Fragment} from 'react';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@material-ui/core';
import {
    ExpandMore,
    Search
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
    const [selects,setSelect] = useState({dictionary:[]})
    const [filters, setFilters] = useState({})
    const [filterOptions, setFilterOptions] = useState({
        domains:[],
    })

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
            url:`${process.env.REACT_APP_API_URL}/api/search`,
            data:{
                startDate:startDate,
                endDate:endDate,
                search:textBox.search,
                domain:filters.domain,
                dictionary:selects.dictionary,
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
    }, [startDate,endDate,filters,selects]);

    useEffect(()=>{
        if(page !== 0 && (rowsPerPage*page+rowsPerPage*2) > rows.length){
            loadData(false)
        }
        else if(page === 0 && rowsPerPage > rows.length ){
            loadData(true)
        }
    },[rowsPerPage,page])
    
    useEffect(() => {
        const loadFilterOptions = () => {
            axios({
                method:'get',
                url:'http://localhost:8080/filters/scraper'
            }).then(response => {
                const data = response.data
                setFilterOptions(prevState => {
                    return {
                        ...prevState,
                        domains:data.domains,
                    }
                });
            }).catch(error => {
                console.log('error',error)
            })
        }

        loadFilterOptions()
    }, []);
    
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
                                <Grid item lg={2} xs={6}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel> Dictionary </InputLabel>
                                        <Select
                                            multiple
                                            id="dictionary"
                                            name="dictionary"
                                            onChange={handleSelect(setSelect)}
                                            value={selects.dictionary}
                                        >
                                            <MenuItem value={'IED'}>IED</MenuItem>
                                            <MenuItem value={'UAS'}>UAS</MenuItem>
                                            <MenuItem value={'CBRNE'}>CBRNE</MenuItem>
                                            <MenuItem value={'SUB-T'}>SUB-T</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} xs={6}>
                                    <Autocomplete
                                        className={classes.autocomplete}
                                        multiple
                                        id="domain-auto"
                                        options={filterOptions.domains}
                                        getOptionLabel={option => option.key}
                                        onChange={(event,values) => onSelectChange(event,values,'domain') }
                                        renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Website"
                                            placeholder="Website"
                                            fullWidth
                                        />
                                        )}
                                    />
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
                                    <TableCell>URL</TableCell>
                                    <TableCell>Tags</TableCell>
                                    <TableCell align="left">Terms</TableCell>
                                    <TableCell align="left">Date Added</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,i) => 
                                    <Fragment key={"row_"+i}>
                                        <TableRow key={"row_"+i}>
                                            <TableCell component="th" scope="left"><a href={row._id} target="_blank">{row._id}</a></TableCell>
                                            <TableCell align="left">{row._source['tags']}</TableCell>
                                            <TableCell align="left">{row._source['terms']}</TableCell>
                                            <TableCell align="left">{row._source['dateAdded']}</TableCell>
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
                                            field='full_text_processed'
                                        />
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                                                <Collapse
                                                    in={i===expand}
                                                    timeout="auto"
                                                    unmountOnExit
                                                >
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12}>
                                                            <div style={{display:'inline',whiteSpace:'pre-wrap'}}>
                                                                <b>Page Text:</b> {row._source['full_text_processed'].split(".").join("\n")}
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

export default SearchPage;
