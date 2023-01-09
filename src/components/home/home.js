import { useEffect, useState } from 'react';
import download from 'downloadjs';

function Home() {

    const [fileData, setFileData] = useState();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [documentos, setDocumentos] = useState([]);
    const [seleccion, setSeleccion] = useState({
        id: '',
        nombreArchivo: '',
    });


    const fileChangeHandler = (e) => {
        setFileData(e.target.files[0])
    }



    const actualizarLista = () => {
        fetch(`http://localhost:5000/`)
            .then(res =>
                res.json()
            )
            .then(res =>
                setDocumentos(res)
            )
    }

    useEffect(() => {
        actualizarLista()
    }, []);

    const onSubmitUpload = (e) => {

        e.preventDefault();

        if (fileData !== undefined) {
            const data = new FormData()
            data.append('image', fileData)
            fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: data,
            }).then(() => {
                setShowSuccess(true)
            }).then(() => {
                actualizarLista()
            }).then(() => {
                setSuccess('La lista de archivos a descargar se actualizo exitosamente!')
            }).catch((err) => {
                console.log(err.message)
            })
        } else {
            setError('Debe elegir un archivo a cargar')
            setShowError(true)
        }
    }

    return (
        <div className="App">
            <main class="container">
                <article style={{ width: '40vw' }}>
                    <div>
                        <h1>ESCOM.Drive</h1>
                        <input type="text" name="search" placeholder="search" aria-label="search" autocomplete="buscar" required />
                        <h4> Archivos Recientes </h4>
                    </div>
                </article>
                <article style={{ width: '40vw' }}>
                    <div>
                        <h4>Subir Archivos</h4>
                        <input type="file" name="file" id="file" class="inputfile" />
                        <button type="submit" class="contrast" onclick="event.preventDefault()">Subir</button>
                    </div>
                </article>
            </main>

        </div>
    );
}

export default Home;