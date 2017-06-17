var mongoose = require("mongoose");
var Schema = mongoose.Schema; //for Schema

var NoteSchema = new Schema({
  title: {
    type: String
  },
  body: {
    type: String
  }
});

var Note = mongoose.model("Note", NoteSchema); //note model

module.exports = Note;