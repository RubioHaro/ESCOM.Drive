const express = require('express')
const multer = require('multer')
const cors = require('cors')
const net = require('net')
const fs = require('fs')
const path = require('path');
const prompt = require('prompt-sync')();


const { v4: uuidv4 } = require('uuid');

console.log("Starting server...")
console.log("Upload Folder:")
const uploadFolder = path.join("/", "server_files");
// console.log(uploadFolder)

const uploadDestiny = "/server_files"
const development = false
const app = express()
app.use(cors())

let Documentos = [];


if (development) {
    destiny = "./upload"
} else {
    destiny = uploadDestiny
    let answ = prompt("Do you want to use the default upload folder? (y/n)")
    
    if (answ === "y") {
        console.log("Using default upload folder: " + uploadDestiny + "")
    } else {
        destiny = prompt("Please enter the upload folder:")
        console.log("Using upload folder: " + destiny + "")
    }
}

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, destiny )
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: fileStorage })

app.get('/', (req, res) => {
    res.json(Documentos)
})

app.get('/getAvailables', (req, res) => {
    // read config file
    const config = fs.readFileSync('config.json')
    const configJson = JSON.parse(config)
    const listHosts = configJson.hosts
    const q_hosts = listHosts.length
    availableServers = []

    var task = new Promise((resolve, reject) => {
        let serve_counter = 0
        listHosts.forEach((host, id) => {
            const hostName = host.name
            const hostIp = host.ip
            const hostPort = host.port
            const socket = new net.Socket()
            socket.setTimeout(1000, () => {
                console.log(id + ': Timeout connecting to ' + hostName)
                serve_counter++
                if (serve_counter === q_hosts) {
                    resolve()
                } else {
                    console.log('Server ' + serve_counter + ' of ' + q_hosts + ' checked')
                }
                socket.end();
                socket.destroy()
            })

            socket.connect(hostPort, hostIp, () => {
                // console.log('Connected to ' + hostName + ' at ' + hostIp + ':' + hostPort)
                socket.write('PING')
                // read the response
                socket.on('data', (data) => {
                    // console.log('Received: ' + data)
                    // set a flag to indicate that the server is alive
                    if (data.toString() === 'PONG') {
                        console.log(id + ': Server is connected to ' + hostName)
                        host = {
                            name: hostName,
                            ip: hostIp,
                            port: hostPort
                        }
                        availableServers.push(host)
                        serve_counter++
                        if (serve_counter === q_hosts) {
                            resolve()
                        } else {
                            console.log('Server ' + serve_counter + ' of ' + q_hosts + ' checked')
                        }
                    }
                    // console.log('Closing connection to ' + hostName)
                    socket.destroy()
                })
            })

        })
        // resolve()
    })

    task.then(() => {
        console.log('All servers checked (' + q_hosts + ')')
        console.log('Available servers: ' + availableServers.length)
        if (availableServers.length === 0) {
            res.status(500)
            return res.json(['No servers available'])
        } else {
            return res.json(availableServers)
        }
    })
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

app.get('/download/:id', (req, res) => {
    const id = req.params.id
    const doc = Documentos.find(doc => doc.id === id)
    console.log(destiny + '/' + doc.name)

    //esto regresa el archivo en la ruta upload con el nombre doc.name
    res.download(destiny + '/' + doc.name, (err) => {
        if (err)
            console.log(err)
    });
})
console.log('Server started, listening on port 5000')
console.log('available at: http://localhost:5000')
console.log(' or at: http://' + require('ip').address() + ':5000')
app.listen(5000)