import { useState } from 'react';
import { Link } from 'react-router-dom';

function HomeUpload() {

    const [fileData, setFileData] = useState();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const host = 'http://localhost:5000';

    const fileChangeHandler = (e) => {
        setFileData(e.target.files[0])
    }

    const onSubmitUpload = (e) => {
        setLoading(true)

        e.preventDefault();

        if (fileData !== undefined) {
            const data = new FormData()
            data.append('image', fileData)
            fetch(`${host}/upload`, {
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
                        {showError &&
                            <p className="error">{error}</p>
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