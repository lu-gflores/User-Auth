const express = require('express');
const app =  express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/status', (req, res) => {
    res.status(200).json({message:'ok', status: 200})
})

app.post('/signup', (req, res, next) => {
    next(new Error('test'));
    res.status(200).json({message:'ok', status: 200})
} )

app.post('/login', (req, res) => {
    res.status(200).json({message:'ok', status: 200})
})

app.post('/logout', (req, res) => {
    res.status(200).json({message:'ok', status: 200})
})

app.post('/forgot-password', (req, res) => {
    res.status(200).json({message:'ok', status: 200})
})

app.post('/reset-password', (req, res) => {
    res.status(200).json({message:'ok', status: 200})
})

//catch all other routes
app.use((req, res) => {
    res.status(404).json({message: '404 NOT FOUND', status: 404})
}) 
//handle errors
app.use((req, res, next) => {
    console.log(error)
    res.status(error.status || 500).json({error: error.message, status: 500})
}) 

app.listen(PORT, () =>{
    console.log('Listening on port ' + PORT)
})

