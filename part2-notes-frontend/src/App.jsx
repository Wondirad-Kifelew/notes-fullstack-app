import React, { useState, useEffect } from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import noteService from "./services/notes";

// console.log("noteSer", noteService);
const Footer = () => {
  const footerStyle = {
    color: "green",
    fontSize: 16,
  };
  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, Department of Computer Science, University of Helsinki 2025
      </em>
    </div>
  );
};

const App = () => {
  // console.log("Notes in app:", props.notes);
  const [notes, setNotes] = useState([]);
  const [newNotes, setNewNotes] = useState("");
  const [showall, setShowall] = useState(true);
  const [errorMessage, setErrorMessage] = useState("some error happened...");
  //get

  useEffect(() => {
    noteService.getAll().then((resData) => {
      setNotes(resData);
      console.log("res data", resData);
    });
  }, []);
  const toggleImportanceOf = (id) => {
    console.log(`importance of ${id} needs to be toggled`);

    const note = notes.find((note) => note.id === id);
    const modifiedNote = { ...note, important: !note.important };
    console.log("modified note", modifiedNote);
    //put
    noteService
      .update(id, modifiedNote)
      .then((responseData) =>
        setNotes(notes.map((n) => (n.id === id ? responseData : n)))
      )
      .catch((error) => {
        setErrorMessage(
          `the message ${note.content} was already deleted from the server`
        );
        setTimeout(() => setErrorMessage(null), 5000);

        setNotes(notes.filter((n) => n.id != id));
      });
  };
  console.log("notes: ", notes);
  const handleNoteChange = (event) => {
    setNewNotes(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    if (newNotes != "") {
      const newObj = {
        id: String(notes.length + 1),
        content: newNotes,
        important: Math.random() < 0.5,
      };

      //create
      noteService.create(newObj).then((responseData) => {
        setNotes(notes.concat(responseData));
        setNewNotes("");
      });
    }
  };
  // console.log("notes", notes);
  const notesToShow = showall ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <button onClick={() => setShowall(!showall)}>
        {showall ? "Show important" : "Show all"}
      </button>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input value={newNotes} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

// export default App;

// import { useState, useEffect } from "react";
// import axios from "axios";

// const App = () => {
//   const [rate, setRate] = useState({});
//   const [value, setvalue] = useState("");
//   const [currency, setCurrency] = useState(null);
//   useEffect(() => {
//     console.log("effect run, currency is now", currency);
//     if (currency) {
//       axios
//         .get(`https://open.er-api.com/v6/latest/${currency}`)
//         .then((response) => {
//           setRate(response.data.rates);
//           console.log("rates: ", response.data.rates);
//         });
//     }
//   }, [currency]);
//   const handleInput = (event) => {
//     setvalue(event.target.value);
//   };
//   console.log("value: ", value);
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log("sth submitted");
//     setCurrency(value);
//   };
//   console.log("currency: ", currency);
//   return (
//     <div>
//       <h2>Currency converter</h2>
//       <form onSubmit={handleSubmit}>
//         Currency: <input value={value} onChange={handleInput} />
//         <button type="submit">exchange</button>
//       </form>
//       <pre>{JSON.stringify(rate, null, 2)}</pre>
//     </div>
//   );
// };

export default App;
