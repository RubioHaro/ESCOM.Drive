import logo from './logo.svg';
import './App.css';
import Login from './components/login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from './components/error/error';
import Home from './components/home/home';

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <BrowserRouter>
          <Routes>
            <Route path="/" >
              <Route index element={<Login />} />
              <Route path="login" element={<Login />} />
              <Route path="home" element={<Home />} />
              <Route path="error" element={<Error />} />
              <Route path="*" element={<Error />} />
            </Route>
          </Routes>
        </BrowserRouter>

      </header>
    </div>
  );
}

export default App;
