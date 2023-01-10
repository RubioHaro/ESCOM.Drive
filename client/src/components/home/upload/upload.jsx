import { useEffect, useState } from 'react';
import download from 'downloadjs';
import { Link } from 'react-router-dom';

function HomeUpload() {

    const [fileData, setFileData] = useState();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [documentos, setDocumentos] = useState([]);
    const [docExtension, set_map_doc] = useState([]);
    const [seleccion, setSeleccion] = useState({
        id: '',
        nombreArchivo: '',
    });


    const fileChangeHandler = (e) => {
        setFileData(e.target.files[0])
    }

    const onSubmitUpload = (e) => {
        setLoading(true)

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
                setSuccess('Archivo subido exitosamente!')
                document.getElementById('file').value = ''
                // wait 5 seconds and setShowSuccess to false
                setTimeout(() => {
                    setShowSuccess(false)
                }, 3000)
            }).catch((err) => {
                console.log(err.message)
            })
        } else {
            setError('Debe elegir un archivo a cargar')
            setShowError(true)
        }
        setLoading(false)
    }

    return (
        <div className=" ">
            <article style={{ width: '100%' }}>
                <div>
                    <form onSubmit={onSubmitUpload}>
                        <h4>Subir Archivos</h4>
                        <input type="file" name="file" id="file" onChange={fileChangeHandler} className="inputfile" />
                        {showSuccess &&
                            <p className="success">{success}</p>
                        }
                        {loading &&
                            <button aria-busy="true">Subiendo Archivo…</button>
                        }
                        {!loading &&
                            <button type="submit" className="contrast">Subir</button>
                        }
                    </form>
                    <Link to="/home">
                        <button>
                        Ver archivos
                        </button>
                    </Link>
                </div>
            </article>
        </div>
    );
}

export default HomeUpload;