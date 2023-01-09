import './login.css';

function Login() {

    function handleLogin(event) {
        event.preventDefault();
        var login = document.getElementsByName("login")[0].value;
        var password = document.getElementsByName("password")[0].value;

        if (password === "123" && login === "rodrigo.rubio.haro.digital@gmail.com") {
            console.log("Login correcto");
            window.location.href = "/home";
        } else {
            console.log("Login incorrecto");
        }
    }

    return (
        <div className="App">
            <main className="container">
                <article className="grid">
                    <div>
                        <hgroup>
                            <h1>ESCOM.Drive</h1>
                            <h2>Inicio de Sesión</h2>
                        </hgroup>
                        <form>
                            <input type="text" name="login" placeholder="Login" aria-label="Login" autoComplete="usuario" required />
                            <input type="password" name="password" placeholder="Password" aria-label="Password" autoComplete="password" required />
                            <fieldset>
                                <label htmlFor="remember">
                                    <input type="checkbox" role="switch" id="remember" name="remember" />
                                    Mantener sesión iniciada
                                </label>
                            </fieldset>
                            <button type="submit" className="contrast" onClick={handleLogin}>Login</button>
                        </form>
                    </div>
                    <div className='hero'></div>
                </article>
            </main>

        </div>
    );
}

export default Login;