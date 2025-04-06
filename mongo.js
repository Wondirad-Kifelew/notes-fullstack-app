const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://wondiradabebekifelew:${password}@cluster0.jqfkdio.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set("strictQuery", false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
  date: Date,
});
//modify output of the schema if our data is converted to JSON like API calls
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "HTML is easy",
  important: true,
  date: new Date(),
});
// const note_2 = new Note({
//   content: "HTML is not easy",
//   important: false,
//   date: new Date(),
// });
// note_2.save().then((result) => {
//   console.log("note_2 saved: ", result);
// });
note.save().then((result) => {
  console.log("note saved: ", JSON.stringify(result));
  mongoose.connection.close();
});
// Note.find({}).then((result) => {
//   result.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });
