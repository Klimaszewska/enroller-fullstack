import "./MeetingsList.css";
import {useState} from "react";

export default function MeetingsList({meetings, onDelete, onEnroll, onUnenroll, onEdit, participant}) {
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editDescription, setEditDescription] = useState('');

    function startEdit(meeting) {
        setEditingId(meeting.id);
        setEditTitle(meeting.title);
        setEditDate(meeting.date || '');
        setEditDescription(meeting.description);
    }

    return (
        <table>
            <thead>
            <tr>
                <th>Meeting title</th>
                <th>Date</th>
                <th>Description</th>
                <th>Participants</th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {
                meetings.map((meeting, index) => editingId === meeting.id
                    ? <tr key={index}>
                        <td><input value={editTitle} onChange={e => setEditTitle(e.target.value)}/></td>
                        <td><input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}/></td>
                        <td><input value={editDescription} onChange={e => setEditDescription(e.target.value)}/></td>
                        <td></td>
                        <td>
                            <button className="button-outline" onClick={() => {
                                onEdit(meeting.id, {title: editTitle, date: editDate, description: editDescription});
                                setEditingId(null);
                            }}>Save</button>
                        </td>
                        <td><button className="button-outline" onClick={() => setEditingId(null)}>Cancel</button></td>
                    </tr>
                    : <tr key={index}>
                        <td>{meeting.title}</td>
                        <td>{meeting.date}</td>
                        <td>{meeting.description}</td>
                        <td>{meeting.participants.map(p =>
                            <div key={p.login}>{p.login}</div>)}
                        </td>
                        <td>
                            <button className="button-outline" onClick={() => onEnroll(meeting.id, participant)}>Enroll</button>
                        </td>
                        <td>
                            <button className="button-outline button-red"
                                    disabled={!meeting.participants.some(p => p.login === participant)}
                                    onClick={() => onUnenroll(meeting.id, participant)}>Unenroll
                            </button>
                        </td>
                        <td>
                            <button className="button-outline" onClick={() => startEdit(meeting)}>Edit</button>
                        </td>
                        <td>
                            <button className="button-outline button-red" disabled={meeting.participants.length > 0}
                                    onClick={() => onDelete(meeting)}>Delete empty meeting
                            </button>
                        </td>
                    </tr>
                )
            }
            </tbody>
        </table>
    );
}
