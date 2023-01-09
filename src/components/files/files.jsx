import './files.css';

function Files() {
    return (
        <div className="App">
            <main class="container">
                <article class="grid">
                    <div>
                        <hgroup>
                            <h1>ESCOM.Drive</h1>
                            <h2>Inicio de Sesión</h2>
                        </hgroup>
                        <form>
                            <input type="text" name="login" placeholder="Login" aria-label="Login" autocomplete="nickname" required />
                            <input type="password" name="password" placeholder="Password" aria-label="Password" autocomplete="current-password" required />
                            <fieldset>
                                <label for="remember">
                                    <input type="checkbox" role="switch" id="remember" name="remember" />
                                    Mantener sesión iniciada
                                </label>
                            </fieldset>
                            <button type="submit" class="contrast" onclick="event.preventDefault()">Login</button>
                        </form>
                    </div>
                    <div></div>
                </article>
            </main>

        </div>
    );
}

export default Files;