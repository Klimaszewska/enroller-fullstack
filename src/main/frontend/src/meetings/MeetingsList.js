import "./MeetingsList.css";

export default function MeetingsList({meetings, onDelete, onEnroll, onUnenroll, participant}) {
    console.log(participant)

    return (
        <table>
            <thead>
            <tr>
                <th>Meeting title</th>
                <th>Description</th>
                <th>Participants</th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {
                meetings.map((meeting, index) => <tr key={index}>
                    <td>{meeting.title}</td>
                    <td>{meeting.description}</td>
                    <td>{meeting.participants.map(p =>
                        <div key={p.login}>{p.login}</div>)}
                    </td>
                    <td>
                        <button className="button-outline" onClick={() => onEnroll(meeting.id, participant)}>Enroll
                        </button>
                    </td>
                    <td>
                        <button className="button-outline button-red" disabled={!meeting.participants.some(p => p.login === participant)} onClick={() => onUnenroll(meeting.id, participant)}>Unenroll
                        </button>
                    </td>
                    <td>
                        <button className="button-outline button-red" disabled={meeting.participants.length > 0} onClick={() => onDelete(meeting)}>Delete empty
                            meeting
                        </button>
                    </td>
                </tr>)
            }
            </tbody>
        </table>
    );
}
