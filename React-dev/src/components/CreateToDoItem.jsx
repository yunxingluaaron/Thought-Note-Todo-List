import React, { useState } from "react";

function CreateToDoItem(props) {
    // use state of a object 
    const [list, setList] = useState({
        listContent: "",
        checkedBox: false,
      });

    function handleChange(event) {
        const {name, value} = event.target;

        setList(prevList => {
            return {
                ...prevList,
                [name]: value
            };
        });
    }

    function submitTodoItem(event) {
        // prevent refresh the page
        event.preventDefault();
        props.onAddItem(list);
        setList({
            listContent: "",
            checkedBox: false,
          });
        
    }

      return (
          <div>
            <form className="create-item">
            <input name="listContent" onChange={handleChange} value={list.listContent} placeholder="Add to do..." />
            <button onClick={submitTodoItem} >+</button>
            </form>
          </div>
      );
    
}

export default CreateToDoItem;