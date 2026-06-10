import "milligram";
import './App.css';
import {useState} from "react";
import LoginForm from "./LoginForm";
import UserPanel from "./UserPanel";
import {ToastContainer} from "react-toastify";

function App() {
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem('login') || '');
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    function login({login, token}) {
        if (login) {
            setLoggedIn(login);
            setToken(token);
            localStorage.setItem('login', login);
            localStorage.setItem('token', token);
        }
    }

    function logout() {
        setLoggedIn('');
        localStorage.removeItem('login');
        localStorage.removeItem('token');
    }

    return (
        <div>
            <h1>System do zapisów na zajęcia</h1>
            {loggedIn ? <UserPanel username={loggedIn} token={token} onLogout={logout}/> : <LoginForm onLogin={login}/>}
            <ToastContainer/>
        </div>
    );
}

export default App;
