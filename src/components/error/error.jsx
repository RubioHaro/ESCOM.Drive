import { Link } from "react-router-dom";

function Error() {
    return (

        <article class="grid">
            <div >
                <hgroup>
                    <h1>ESCOM.Drive</h1>
                    <h2>Ha ocurrido un error</h2>
                </hgroup>
                <form>
                    <Link to='/'>
                        <button type="submit" class="contrast" onclick="event.preventDefault()">Regresar a Home</button>
                    </Link>
                </form>
            </div>
        </article>
    );
}

export default Error;