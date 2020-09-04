import React, {useEffect, useState,Fragment} from 'react';
import axios from 'axios'
import { 
    Grid,
    TextField,
    Switch,
    FormControlLabel

} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

import countries from '../assets/country_codes'

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


function countryToFlag(isoCode) {
    return typeof String.fromCodePoint !== 'undefined'
        ? isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
        : isoCode;
}

function AcledFilters(props){

    const classes = useStyles();

    const [filterOptions, setFilterOptions] = useState({
        actors:[],
        events:[],
        sources:[]
    })

    useEffect(() => {
        const loadFilterOptions = () => {
            axios({
                method:'get',
                url:'http://localhost:8080/filters/acled'
            }).then(response => {
                const data = response.data
                setFilterOptions(prevState => {
                    return {
                        ...prevState,
                        actors:data.actors,
                        events:data.events,
                        sources:data.sources
                    }
                });
            }).catch(error => {
                console.log('error',error)
            })
        }

        loadFilterOptions()
    }, []);

    return (
        <Fragment>
            <Grid item lg={2} xs={6}>
                <FormControlLabel
                    style={{marginTop:'23px'}}
                    control={<Switch
                        onChange={props.handleSwitchChange('ied')}
                        value="ied"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />}
                    label="IED Event"
                />
                
            </Grid>
            <Grid item lg={3} xs={6}>
                <Autocomplete
                    id="country-select"
                    options={countries}
                    multiple
                    className={classes.option}
                    autoHighlight
                    getOptionLabel={option => option.key}
                    renderOption={option => (
                        <React.Fragment>
                        <span>{countryToFlag(option.code)}</span>
                        {option.key} ({option.code})
                        </React.Fragment>
                    )}
                    onChange={(event,values) => props.onSelectChange(event,values,'country') }
                    renderInput={params => (
                        <TextField
                        {...params}
                        label="Choose a country"
                        fullWidth
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                        />
                    )}
                />
            </Grid>
            <Grid item lg={3} xs={6}>
                <Autocomplete
                    className={classes.autocomplete}
                    multiple
                    id="event-auto"
                    options={filterOptions.events}
                    getOptionLabel={option => option.key}
                    onChange={(event,values) => props.onSelectChange(event,values,'event') }
                    renderInput={params => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Event Type"
                        placeholder="Event Type"
                        fullWidth
                    />
                    )}
                />
            </Grid>
            <Grid item lg={3} xs={6}>
                <Autocomplete
                    className={classes.autocomplete}
                    multiple
                    id="actor-auto"
                    options={filterOptions.actors}
                    getOptionLabel={option => option}
                    onChange={(event,values) => props.onSelectChange(event,values,'actor') }
                    renderInput={params => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Actor"
                        placeholder="Actor"
                        fullWidth
                    />
                    )}
                />
            </Grid>
            <Grid item lg={3} xs={6}>
                <Autocomplete
                    className={classes.autocomplete}
                    multiple
                    options={filterOptions.sources}
                    getOptionLabel={option => option.key}
                    id="source-auto"
                    onChange={(event,values) => props.onSelectChange(event,values,'source') }
                    renderInput={params => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Source"
                        placeholder="Source"
                        fullWidth
                    />
                    )}
                />
            </Grid>
            
        </Fragment>
    )
}

export default AcledFilters;
