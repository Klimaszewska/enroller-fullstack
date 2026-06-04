import {useState} from "react";
import './LoginForm.css';

export default function LoginForm({onLogin, buttonLabel}) {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleRegister() {
        const response = await fetch('/api/participants', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"login": login, "password": password}),
        });

        if (response.ok) {
            onLogin(login);
        } else if (response.status === 409) {
            setError("Login already taken");
        } else {
            setError("Something went wrong");
        }
    }

    async function handleLogin() {
        const response = await fetch('/api/participants', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"login": login, "password": password}),
        });

        if (response.ok || response.status === 409) {
            onLogin(login);
        } else {
            setError("Something went wrong");
        }
    }

    return <div>
        <label>Login (e-mail):</label>
        <input type="text" value={login} onChange={(e) => setLogin(e.target.value)}/>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <span style={{color: 'red'}}>{error}</span>
        <button className="login-form-button" type="button" onClick={() => handleRegister()}>{buttonLabel || 'Register'}</button>
        <button className="login-form-button" type="button" onClick={() => handleLogin()}>{buttonLabel || 'Log in'}</button>
    </div>;
}
