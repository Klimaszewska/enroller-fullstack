import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage({username, token}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);
    const [currentUser, setCurrentUser] = useState(false);

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

    async function fetchMeetings() {
        const response = await fetch(`/api/meetings`,
            {headers: {'Authorization': `Bearer ${token}`}});
        if (response.ok) {
            const meetings = await response.json();
            setMeetings(meetings);
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
    }

    async function handleDeleteMeeting(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        });
        if (response.ok) {
            const nextMeetings = meetings.filter(m => m !== meeting);
            setMeetings(nextMeetings);
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
        }
    }

    async function handleUnenrollParticipant(id) {
        const response = await fetch(`/api/meetings/${id}/participants/${username}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        });
        if (response.ok) {
            await fetchMeetings();
        }
    }


    return (
        <div>
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
                              participant={username}/>}
        </div>
    )
}

