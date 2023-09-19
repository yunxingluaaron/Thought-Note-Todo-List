import React, { useState } from "react";
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';

function CreateArea(props) {

const [isExpanded, setExpanded] = useState(false);

const [note, setNote] = useState({
  title: "",
  content: "",
  toDoList: [],
});



function handleChange(event){
const {name, value} = event.target; // destructure the object
  setNote((prevNote)=>{
    return {
      ...prevNote,
      [name]: value
    }
  });
}

function submitNote(event) {
  props.onAdd(note);
  setNote({
    title: "",
    content: "",
    toDoList: [],
  });
event.preventDefault();
}




function expand(){
  setExpanded(true);
}

  return (
    <div >
      <form className="create-note">
        {isExpanded && (<input name="title" onChange={handleChange} value={note.title} placeholder="Title" />)}
       
        <textarea 
        name="content" 
        onClick={expand}
        onChange={handleChange} 
        value={note.content} 
        placeholder="What are you thinking about...?" 
        rows={isExpanded ? 3 : 1} />
        <Zoom in={isExpanded}>
        <Fab onClick={submitNote}><AddIcon /></Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
