import logo from './logo.svg';
import './App.css';
import Login from './components/login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from './components/error/error';
import Home from './components/home/home';
import HomeUpload from './components/home/upload/upload';

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login></Login>} >
              {/* <Route index element={<Login />} /> */}
            </Route>
            <Route path="login" element={
              <Login />
            } />
            <Route path="home" element={
              < Home />
            } />
            <Route path="upload" element={
              < HomeUpload />
            } />
            <Route path="error" element={<Error />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </header>

    </div>
  );
}

export default App;
