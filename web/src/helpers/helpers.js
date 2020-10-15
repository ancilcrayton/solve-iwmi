
export const handleSelect = (setSelect) =>  (event) =>{
    setSelect(select => ({...select, [event.target.name]: event.target.value}));
}

export const handleStartDateChange = (date,changeStartDate,setRows) => {
    changeStartDate(date);
    setRows([])
};

export const handleEndDateChange = (date,changeEndDate,setRows) => {
    changeEndDate(date);
    setRows([])
};

export const handleExpand = (i,expand,setExpand) => {
    if(expand === i){
        setExpand(null)
    }
    else{
        setExpand(i);
    }
};

export const handSearchButton = (setRows,setPage,loadData) => {
    setRows([])
    setPage(0);
    loadData(true)

}

export const handleChangePage = (newPage,setPage) => {
    setPage(newPage);
};

export const handleChangeRowsPerPage = (setRowsPerPage,setPage) => event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    console.log(event)
};

export const onTextChange = (event,name,setTextBox) => {
    event.persist()
    setTextBox(prevState => {
        return {
            ...prevState,
            [name]:event.target.value
        }
    });
}