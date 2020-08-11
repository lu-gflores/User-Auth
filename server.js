const express = require('express');
const app =  express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/test', (req, res) => {
    res.send('test')
})

app.listen(PORT, () =>{
    console.log('Listening on port ' + PORT)
})

