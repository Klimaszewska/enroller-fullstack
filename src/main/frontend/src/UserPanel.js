import MeetingsPage from "./meetings/MeetingsPage";

export default function UserPanel({username, token, onLogout}) {
    return <div>
        <h2>Welcome, {username}!</h2>
        <button onClick={onLogout}>Log out</button>
        <MeetingsPage username={username} token={token}/>
    </div>;
}
