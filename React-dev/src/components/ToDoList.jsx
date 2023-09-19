import React from "react";
//import DeleteIcon from '@material-ui/icons/Delete';

function TodoList(props) {

    console.log("props.checked: "+props.checked);
    function deleteItem(){
        props.onDelete(props.id);
    }

    function handleCheck(event){
        props.onUpdate(props.id, props.noteId, event.target.checked);
    }

    return <div className="todo-entry">
        <input type="checkbox" name="checked" onChange={handleCheck} checked={props.checked} />
        <p>&nbsp;&nbsp;{props.content}</p>
        <button className="btn" onClick={deleteItem} >x</button>
    </div>
}

export default TodoList;
