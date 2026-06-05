import "./MeetingsList.css";

// TODO: implement the above also on frontend (currently WIP)
export default function MeetingsList({meetings, onDelete, onRegister, participant}) {
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
                        <button className="button-outline" onClick={() => onRegister(meeting.id, participant)}>Enroll
                        </button>
                    </td>
                    <td>
                        <button className="button-outline button-red" onClick={() => onDelete(meeting)}>Delete empty
                            meeting
                        </button>
                    </td>
                </tr>)
            }
            </tbody>
        </table>
    );
}
