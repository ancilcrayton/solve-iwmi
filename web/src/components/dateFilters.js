import React, {Fragment} from 'react';
import { 
    Grid,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import { handleStartDateChange,handleEndDateChange } from '../helpers/helpers'

const useStyles = makeStyles(theme => ({
    autocomplete:{
        marginTop:'16px',
        marginBottom:'8px'
    },
    option: {
        fontSize: 15,
        '& > span': {
          marginRight: 10,
          fontSize: 18,
        },
        marginTop:'16px',
        marginBottom:'8px'
      },
      date:{
        width:'250px'
      }
}));


function DateFilters(props){

    const classes = useStyles();

    return (
        <Fragment>
            <Grid item lg={2} xs={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        className={classes.date}
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="start-date"
                        label="Start Date"
                        value={props.startDate}
                        initialFocusedDate={new Date(2020,4,19)}
                        onChange={date => handleStartDateChange(date,props.changeStartDate,props.setRows)}
                        minDate={new Date(2020,4,18)}
                        maxDate={new Date(2020,5,14)}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
            </Grid>
            <Grid item lg={2} xs={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        className={classes.date}
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="end-date"
                        label="End Date"
                        value={props.endDate}
                        minDate={new Date(2020,4,18)}
                        maxDate={new Date(2020,5,14)}
                        initialFocusedDate={new Date(2020,5,13)}
                        onChange={date => handleEndDateChange(date,props.changeEndDate,props.setRows)}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
            </Grid>
        </Fragment>
    )
}

export default DateFilters;
