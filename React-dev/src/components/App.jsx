import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";


function App(){
    const testNotes = [{
        title: "Loops",
        content: "How to keep a programmer in the shower forever. Show him the shampoo bottle instructions:",
        toDoList: [
            {
                listContent: "Lather.",
                checkedBox: false,
            },
            {
                listContent: "Rinse.",
                checkedBox: false,
            },
            {
                listContent: "Repeat.",
                checkedBox: true,
            },
        ],
    }];

    const [notes, setNotes] = useState(testNotes);
    
    function addNote(newNote) {
        setNotes(prevNotes => {
            return [...prevNotes, newNote];
        });
    }

    function deleteNote(id){
        setNotes(prevNote => {
            return prevNote.filter((noteItem, index) => {
                return index !== id;
            })
        });
    }

    function addListItem(newItem, noteId) {
        let allNotes = [...notes];
        allNotes[noteId].toDoList.push(newItem);
        setNotes(allNotes);
    }

    function deleteListItem(itemId, noteId){
        console.log("Delete item " + itemId + " " + noteId );
        let allNotes = [...notes];
        let newList = allNotes[noteId].toDoList.filter((listItem, index) => {
            return index !== itemId;
        });
        allNotes[noteId].toDoList = newList;
        setNotes(allNotes)
    }

    function updateListItem(itemId, noteId, newStatus){
        let allNotes = [...notes];
        allNotes[noteId].toDoList[itemId].checkedBox = newStatus;
        setNotes(allNotes)
    }


    return <div>
    <Header />
    <CreateArea 
        onAdd={addNote}
    />
    {notes.map((noteItem, index) => <Note 
        onAdd={addNote}
        key={index}
        id={index}
        title={noteItem.title} 
        content={noteItem.content}
        toDoList={noteItem.toDoList}  
        onDelete={deleteNote}
        onAddListItem={addListItem}
        onDeleteListItem={deleteListItem}
        onUpdateListItem={updateListItem}
        />
    )}
    
    <Footer />
    </div>
}

export default App;