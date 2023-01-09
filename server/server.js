const express = require('express')
const multer = require('multer')
const cors = require('cors')
const path = require('path');
const { v4: uuidv4 } = require('uuid');

console.log("Starting server...")
console.log("Upload Folder:")
const uploadFolder = path.join(__dirname, "upload");
console.log(uploadFolder)

const app = express()
app.use(cors())

let Documentos = [];

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: fileStorage })

app.get('/', (req, res) => {
    res.json(Documentos)
})

app.get('/buscar/:id', (req, res) => {
    const id = req.params.id
    console.log(uploadFolder)
    const doc = Documentos.find(doc => doc.id === id)
    res.send(uploadFolder)
})

app.post('/upload', upload.single('image'), (req, res) => {
    console.log("req.file.path: " + req.file.path);
    console.log("req.file.originalname: " + req.file.originalname);
    console.log("uploading file: " + req.file.originalname);
    const uuid = uuidv4();
    const doc = {
        id: uuid,
        name: req.file.originalname
    }
    Documentos.push(doc)
    console.log(Documentos)
    res.send('Single File Upload')
})

app.get('/download/:id',(req, res) => {
    const id = req.params.id
    const doc = Documentos.find(doc => doc.id === id)
    console.log(uploadFolder + '/' + doc.name)

    //esto regresa el archivo en la ruta upload con el nombre doc.name
    res.download(uploadFolder + '/' + doc.name,(err)=>{
        if(err)
            console.log(err)
    });
})
console.log('Server started, listening on port 5000')
console.log('available at: http://localhost:5000')
app.listen(5000)