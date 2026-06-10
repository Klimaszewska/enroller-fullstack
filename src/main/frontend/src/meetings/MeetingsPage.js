import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage({username, token}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);
    const [currentUser, setCurrentUser] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMeetings();
    }, []);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const response = await fetch(`/api/participants?key=${username}`,
                {headers: {'Authorization': `Bearer ${token}`}});
            if (response.ok) {
                const currentUser = await response.json();
                setCurrentUser(currentUser);
            }
        };
        fetchCurrentUser();
        console.log("JKS: " + username);
        console.log("JKS: " + currentUser);
    }, []);

    function showError(message) {
        setError(message);
        setTimeout(() => setError(''), 3000);
    }

    async function fetchMeetings() {
        const response = await fetch(`/api/meetings`,
            {headers: {'Authorization': `Bearer ${token}`}});
        if (response.ok) {
            const meetings = await response.json();
            setMeetings(meetings);
        } else {
            showError('Failed to get meetings');
        }
    }

    async function handleNewMeeting(meeting) {
        const response = await fetch('/api/meetings', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(meeting)
        });

        if (response.ok) {
            const savedMeeting = await response.json();
            const nextMeetings = [...meetings, savedMeeting];
            setMeetings(nextMeetings);
            setAddingNewMeeting(false);
        }
        else {
            showError('Failed to add the meeting');
        }
    }

    async function handleEditMeeting(id, meeting) {
        const response = await fetch(`/api/meetings/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(meeting)
        });
        if (response.ok) {
            await fetchMeetings();
        } else {
            showError('Failed to delete meeting');
        }
    }

    async function handleDeleteMeeting(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        });
        if (response.ok) {
            const nextMeetings = meetings.filter(m => m !== meeting);
            setMeetings(nextMeetings);
        } else {
            showError('Failed to delete meeting');
        }
    }

    async function handleEnrollParticipant(id) {
        const response = await fetch(`/api/meetings/${id}/participants`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({"login": username})
        });
        if (response.ok) {
            await fetchMeetings();
        }  else {
            showError('Failed to enroll');
        }
    }

    async function handleUnenrollParticipant(id) {
        const response = await fetch(`/api/meetings/${id}/participants/${username}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        });
        if (response.ok) {
            await fetchMeetings();
        }  else {
            showError('Failed to unenroll');
        }
    }


    return (
        <div>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <h2>Zajęcia ({meetings.length})</h2>
            {
                addingNewMeeting
                    ? <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)}/>
                    : <button onClick={() => setAddingNewMeeting(true)}>Dodaj nowe spotkanie</button>
            }
            {meetings.length > 0 &&
                <MeetingsList meetings={meetings} username={username}
                              onDelete={handleDeleteMeeting}
                              onEnroll={handleEnrollParticipant}
                              onUnenroll={handleUnenrollParticipant}
                              onEdit={handleEditMeeting}
                              participant={username}/>}
        </div>
    )
}

