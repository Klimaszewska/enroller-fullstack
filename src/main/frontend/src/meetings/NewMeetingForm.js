import {useState} from "react";

export default function NewMeetingForm({onSubmit}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    function submit(event) {
        event.preventDefault();
        onSubmit({title, date, description, participants: []});
    }

    return (
        <form onSubmit={submit}>
            <h3>Add a new meeting</h3>
            <label>Title</label>
            <input type="text" value={title}
                   onChange={(e) => setTitle(e.target.value)}/>
            <label>Date</label>
            <input type="date" value={date}
                   onChange={(e) => setDate(e.target.value)}/>
            <label>Description</label>
            <textarea value={description}
                      onChange={(e) => setDescription(e.target.value)}></textarea>
            <button>Add</button>
        </form>
    );
}