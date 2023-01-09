import { useEffect, useState } from 'react';
import download from 'downloadjs';

function Home() {

    const [fileData, setFileData] = useState();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
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


    function renderDocs(documentos) {
        if (documentos.length === 0) {
            return (
                <div className="alert alert-info" role="alert">
                    No hay archivos para descargar
                </div>
            )
        } else {
            return (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Descargar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documentos.map((doc, index) => (
                                <tr key={index}>
                                    <th scope="row">
                                        {index + 1}
                                    </th>
                                    <td>
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'pdf' &&
                                            <i class="fas fa-file-pdf"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'png' &&
                                            <i class="fas fa-file-image"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'jpg' &&
                                            <i class="fas fa-file-image"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'mp4' &&
                                            <i class="fas fa-file-video"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'mp3' &&
                                            <i class="fas fa-file-audio"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'doc' &&
                                            <i class="fas fa-file-word"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'docx' &&
                                            <i class="fas fa-file-word"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'ppt' &&
                                            <i class="fas fa-file-powerpoint"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'pptx' &&
                                            <i class="fas fa-file-powerpoint"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'xls' &&
                                            <i class="fas fa-file-excel"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'xlsx' &&
                                            <i class="fas fa-file-excel"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'zip' &&
                                            <i class="fas fa-file-archive"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'rar' &&
                                            <i class="fas fa-file-archive"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'txt' &&
                                            <i class="fas fa-file-alt"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'mp4' &&
                                            <i class="fas fa-file-video"></i>
                                        }
                                        {doc.name.substring(doc.name.length - 3, doc.name.length) === 'mp3' &&
                                            <i class="fas fa-file-audio"></i>
                                        }
                                        &nbsp; {doc.name}
                                    </td>
                                    <td>
                                        <button type="button" onClick={(e) => {
                                            e.preventDefault();
                                            fetch(`http://localhost:5000/download/${doc.id}`, {
                                                method: 'GET',
                                            }).then(res => res.blob())
                                                .then(blob => {
                                                    download(blob, doc.name);
                                                })
                                        }}>
                                            <i class="fas fa-download"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        }
    }

    return (
        <div className=" ">
            <article style={{ width: '100%' }}>
                <br/>
                <h1>ESCOM.Drive</h1>
                <h4> Archivos Recientes: </h4>
                {renderDocs(documentos)}
            </article>
        </div>
    );
}

export default Home;