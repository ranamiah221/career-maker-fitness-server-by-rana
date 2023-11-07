const express = require('express');
const cors = require ('cors');
const port = process.env.PORT || 5000;
const app = express();

// middleware...
app.use(cors())
app.use(express.json());

app.get('/', (req, res)=>{
     res.send('Hello , Career maker');
})

app.listen(port, ()=>{
    console.log(`Career maker server running port :${port}`);
})