import "milligram";
import './App.css';
import {useState} from "react";
import LoginForm from "./LoginForm";
import UserPanel from "./UserPanel";

function App() {
    const [loggedIn, setLoggedIn] = useState('');
    const [token, setToken] = useState('');

    function login({login, token}) {
        if (login) {
            setLoggedIn(login);
            setToken(token);
        }
    }

    function logout() {
        setLoggedIn('');
    }

    return (
        <div>
            <h1>System do zapisów na zajęcia</h1>
            {loggedIn ? <UserPanel username={loggedIn} token={token} onLogout={logout}/> : <LoginForm onLogin={login}/>}
        </div>
    );
}

export default App;
