import React, { useState} from "react";
import CreateToDoItem from "./CreateToDoItem";
import ToDoList from "./ToDoList";
import DeleteIcon from '@material-ui/icons/Delete';

function Note(props) {
    const [list, setList] = useState(props.toDoList);

    function addListItem(newList){    
        setList(prevList => {
            return [...prevList, newList];
        });
        props.onAddListItem(newList, props.id);
    }

    function deleteListItem(itemId){
        props.onDeleteListItem(itemId, props.id);
        setList(prevItems => {
            return prevItems.filter((listItem, index) => {
                return index !== itemId;
            })
        });
    }

    // ***
    function handleClick(){
        props.onDelete(props.id);
    }
    // ***
    return <div className="note">
        <h1>{props.title}</h1>
        <p>{props.content}</p>
        <div className="todolist">
        {list.length !== 0 ? <div className="seperate-line">Tasks</div> : ""}
        {list.map((listItem, index) => <ToDoList 
        key={index}
        id={index}
        noteId={props.id}
        content={listItem.listContent}
        checked={listItem.checkedBox}
        onUpdate={props.onUpdateListItem}
        onDelete={deleteListItem}
        />
        )}
    <CreateToDoItem
        onAddItem={addListItem}
        noteId={props.id}
        />
        </div>
        <button className="note-btn" onClick={handleClick} ><DeleteIcon /></button>
    </div>
}

export default Note;