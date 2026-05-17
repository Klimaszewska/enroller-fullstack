import "./MeetingsList.css";

export default function MeetingsList({meetings, onDelete}) {
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
                    <td>TODO</td>
                    <td>
                        <button className="button-outline" onClick={() => onDelete(meeting)}>Enroll</button>
                    </td>
                    <td>
                        <button className="button-outline button-red" onClick={() => onDelete(meeting)}>Delete empty meeting</button>
                    </td>
                </tr>)
            }
            </tbody>
        </table>
);
}
