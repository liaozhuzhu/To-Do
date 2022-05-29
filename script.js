let noteValue = document.getElementById("note-input-id");
let checkBoxValues = document.getElementsByClassName("checkbox_class");

function addNoteToList() {
    let addNoteValue = noteValue.value;
    if(addNoteValue != "") {
        let unLi = document.getElementById("ul-id");
        let newLi = document.createElement("li");
        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.className = "checkbox_class";
        newLi.appendChild(checkbox);
        newLi.appendChild(document.createTextNode(addNoteValue));
        unLi.appendChild(newLi);
    }
    noteValue.value = "";
}

// add button
document.getElementById("add-button-id").addEventListener("click", addNoteToList);
// end of add button

//keybind
window.addEventListener("keydown", checkEnterKeyPress, false);
function checkEnterKeyPress(key) {
    if(key.keyCode == "13") {
        addNoteToList();
    }
}