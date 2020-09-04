import React, {Fragment} from 'react';
import {  
    TableCell,
    TableRow,
} from '@material-ui/core';

function Highlight(props){

    return (
        <Fragment>
            {props.highlight ? 
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                        <div style={{fontSize:'20px', display:'inline'}}>
                            {props.highlight[props.field].map((line,i) =>
                                <span key={"highlight_"+i}>
                                    <div style={{display:'inline'}} dangerouslySetInnerHTML={{ __html:line }} />
                                    {'.  '}
                                    <br/>
                                </span>
                            )}
                        </div>
                    </TableCell>
                </TableRow>
                :<TableRow/>}
        </Fragment>
    )
}

export default Highlight;
