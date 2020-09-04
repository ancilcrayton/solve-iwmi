import React, { useRef,useState } from 'react';

import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

import load_console from '../assets/console.jpg'
import open_firebug from '../assets/open_firebug.jpg'
import run_code from '../assets/run_code.jpg'
import save_json from '../assets/save_json.jpg'
import toolbox from '../assets/toolbox.jpg'

import {DialogTitle, DialogContent, DialogActions} from '../components/dialog'

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


function Scraper() {

  const classes = useStyles();
  const codeAreaRef = useRef(null);

  const [depth, setDepth] = React.useState(1);
  const [copySuccess, setCopySuccess] = useState('Copy This Code');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };



  function copyToClipboard(e) {
    codeAreaRef.current.select();
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    e.target.focus();
    setCopySuccess('Copied!');
  };
  
  const handleChange = event => {
    setDepth(event.target.value);
  };
  

  return (
    <Grid container spacing={3} >
      <br/>
      <Grid item xs={12} className={classes.center}>
        <h1 >Scraper</h1>
      </Grid>
      <Grid item xs={4}/>
      <Grid item xs={2}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Depth</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={handleChange}
            value={depth}
          >
            <MenuItem value={1}>One</MenuItem>
            <MenuItem value={2}>Two</MenuItem>
            <MenuItem value={3}>Three</MenuItem>
            <MenuItem value={4}>Four</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <Button variant="contained" color="primary" onClick={copyToClipboard}>Copy Code</Button>
        </FormControl>
        
      </Grid>
      <Grid item xs={6} className={classes.displayLinebreak}>
        <p>{copySuccess}</p>
        <TextareaAutosize
          readOnly
          className={classes.textarea}
          ref={codeAreaRef}
          rowsMax={20}
          value={`
          var visited_urls = []

          function download(content, fileName, contentType) {
              var i,j,temparray,chunk = 200;
              for (i=0,j=content.length; i<j; i+=chunk) {
                  temparray = content.slice(i,i+chunk);
                  // do whatever
              
                  var blob = new Blob([JSON.stringify(temparray)], {type: contentType});
                  e = document.createEvent('MouseEvents'),
                  a = document.createElement('a')
                  a.download = fileName
                  a.href = window.URL.createObjectURL(blob)
                  a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
                  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
                  a.dispatchEvent(e)
              }
          }

          async function asyncForEach(array, callback) {
            
              for (let index = 0; index < array.length; index++) {
                  await callback(array[index], index, array);
              }
          }

          async function get_urls(doc){
              if(!doc){
                  return Promise.all([])
              }
              var urls = [];
              for(var i = doc.links.length; i--> 0;){
                  if (doc.links[i].hostname === location.hostname){
                      urls.push(doc.links[i].href);
                  }
              }
              let unique_array = []
              for(let i = 0;i < urls.length; i++){
                  if(unique_array.indexOf(urls[i]) == -1){
                      unique_array.push(urls[i])
                  }
              }

              let fetches = []
              await asyncForEach(unique_array, async (url) => {
                  if(!visited_urls.includes(url) && !url.includes('#')){
                      console.log('grabbing url ',url)
                      visited_urls.push(url)
                      fetches.push(fetch(url).then( async function(response) {
                          // When the page is loaded convert it to text
                          var html =  await response.text()
                          // Initialize the DOM parser
                          var parser = new DOMParser();
                  
                          // Parse the text
                          var doc = parser.parseFromString(html, "text/html");
                          // You can now even select part of that html as you would in the regular DOM 
                          // Example:
                          // var docArticle = doc.querySelector('article').innerHTML;
                          return {document:doc,url:url}
                      })
                      .catch(function(err) {  
                          console.log('Failed to fetch page: ', err);  
                      }))
                  }
              })

              return Promise.all(fetches)
          }



          async function crawl(depth,documents){
              const all_html = []

              if(depth != 0){

                  await asyncForEach(documents, async (doc) => {
                      if(doc){
                          const return_docs = await get_urls(doc.document)
                          const crawl_html = await crawl(depth-1,return_docs)
                          //console.log('return',return_docs)
                          const return_html = await return_docs
                          .filter((doc_obj)=>{
                              return doc_obj
                          })
                          .map((doc_obj) => {
                              return {html:doc_obj.document.documentElement.outerHTML,url:doc_obj.url}
                          })

                          all_html.push(...crawl_html)
                          all_html.push(...return_html)
                      }
                  });
              }
              
              return all_html
          }

          var t0 = performance.now();

          crawl(${depth},[{document:document,url:'start page'}]).then(function(all_html){
              var t1 = performance.now();
              all_html.push({html:document.documentElement.outerHTML, url:window.location.href})
              console.log("Call to crawl took " + (t1 - t0) + " milliseconds. and got ",all_html.length);
              download(all_html, 'html.json', 'application/json');
          })`}
        />
      </Grid>
      <Grid item xs={6}/>
      <Grid item xs={6}>
        <FormControl className={classes.formControl}>
          <Button variant="contained" color="secondary" onClick={handleClickOpen}>Show Walkthrough</Button>
        </FormControl>
      </Grid>

      <Dialog maxWidth={'lg'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle onClose={handleClose}>
          Scraper Walkthrough
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            1) Open Silo and select a Toolbox
          </Typography>
          <img className={classes.image} alt="Selecting a toolbox" src={toolbox}/>
          <Typography gutterBottom>
            2) Navigate to the site you want to scrape
          </Typography>
          <Typography gutterBottom>
            3) Press Firebug icon to open developer console
          </Typography>
          <img className={classes.image} alt="Opening firebug console" src={open_firebug}/>
          <Typography gutterBottom>
            4) Make sure that you navigate to the console tab at the bottom of the page
          </Typography>
          <img className={classes.image} alt="Navigate to the console" src={load_console}/>
          <Typography gutterBottom>
            5) Paste copied JavaScript code in console area.  The depth you select will effect how many pages will be collected so for example depth 2
            will collect all the html of the links on the page you are currently on and the html of all the links of the pages collected from the initial page
          </Typography>
          <img className={classes.image} alt="Running the code in firebug" src={run_code}/>
          <Typography gutterBottom>
            6) Depending on the depth this could take a while to execute.  Once it is finished you may have multiple JSON files that you need to download
          </Typography>
          <img className={classes.image} alt="Save the json files" src={save_json}/>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>

    </Grid>



  );
}

export default Scraper;
