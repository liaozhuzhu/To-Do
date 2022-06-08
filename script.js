// API
//

const apiKey = "96364a-276feb-952475-c85e9e-d6e333";

let inputForm = document.getElementById("add-form");
inputForm.addEventListener("submit", addItem);

loadItems();

// Display 
//

function displayItem(todoItem) {

    // Create Item Wrapper
    //
    let ItemDiv = document.createElement("div");
    ItemDiv.className = "item-wrapper-class";
    ItemDiv.setAttribute("data-id", todoItem.id);
    ItemDiv.setAttribute("name", "item-div");
    ItemDiv.setAttribute("id", todoItem.id);

    // Create Item Parts
    //
    let ItemText = document.createElement("p");
    ItemText.className = "note-text-class";
    ItemText.innerHTML = todoItem.text;
    ItemText.setAttribute("id", "p-"+todoItem.id);
    

    let ItemBox = document.createElement("input");
    ItemBox.type = "checkbox";
    ItemBox.className = "checkbox-class";
    ItemBox.setAttribute("data-id", todoItem.id);
    ItemBox.addEventListener("click", setComplete);

    let ItemDelBtn = document.createElement("input");
    ItemDelBtn.type = "button";
    ItemDelBtn.className = "delete-class";
    ItemDelBtn.value = "X";
    ItemDelBtn.setAttribute("data-id", todoItem.id);
    ItemDelBtn.addEventListener("click", deleteItem);

    // Append Item Wrapper to Item Div
    //
    let contentArea = document.getElementById("item-wrapper");
    contentArea.appendChild(ItemDiv);
    
    // Append Items to Item Wrapper
    //
    ItemDiv.appendChild(ItemBox);
    ItemDiv.appendChild(ItemText);
    ItemDiv.appendChild(ItemDelBtn);

    // Refresh Checkbox
    //
    let finishedItemDiv = document.getElementById("finished-item-wrapper");

    if (todoItem.completed == true) {
        ItemText.style.textDecoration = "line-through";
        finishedItemDiv.appendChild(ItemDiv);
        ItemBox.checked = true;
    } else {
        ItemText.style.textDecoration = "none";
        ItemBox.checked = false;
    }

    document.getElementById(ItemText.id).contentEditable = "true";

}

// Load Items From Server
//

function loadItems() {
    
    var loadX = new XMLHttpRequest();

    loadX.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var todos = JSON.parse(this.responseText);
            console.log(todos);

            for (i = 0; i < todos.length; i++) {
                displayItem(todos[i]);
            }
           
        }
    };

    loadX.open("GET", "https://cse204.work/todos", true);
    loadX.setRequestHeader("x-api-key", apiKey);
    loadX.send();
}

// Add Item
//

function addItem(event) {
    event.preventDefault();

    // Setting variable for form input (get from HTML form)
    let itemText = document.getElementById("note-input-id").value;   

    var data = {
        text: itemText
    }
    
    // Initalize AJAX Request
    var addX = new XMLHttpRequest();
    
    // Response handler
    addX.onreadystatechange = function() {
    
    // Wait for readyState = 4 & 200 response
    if (this.readyState == 4 && this.status == 200) {
    
    // parse JSON response
    var todo = JSON.parse(this.responseText);

    // after adding item, displayItem()
    //
    displayItem(todo);

    } else if (this.readyState == 4) {
            // this.status !== 200, error from server
            console.log(this.responseText);
        }
    }

    addX.open("POST", "https://cse204.work/todos", true);
    addX.setRequestHeader("Content-type", "application/json");
    addX.setRequestHeader("x-api-key", apiKey);
    addX.send(JSON.stringify(data));

    // clear input box
    //
    document.getElementById("note-input-id").value = "";
}

// Delete
//

function deleteItem() {
    // Setting variable for form input (get from HTML form)
    let id = this.getAttribute("data-id");

    // Initalize AJAX Request
    var delX = new XMLHttpRequest();

    // Response handler
    delX.onreadystatechange = function() {

        // Wait for readyState = 4 & 200 response
        if (this.readyState == 4 && this.status == 200) {
            
            // remove div that displays the item from main-wrapper 
            // if item successfully removed from server
            //
            let deleteItem = document.getElementById(id);
        
            deleteItem.remove();


        } else if (this.readyState == 4) {
            // this.status !== 200, error from server
            console.log(this.responseText);
        }
    }

    delX.open("DELETE", "https://cse204.work/todos/"+id, true);

    delX.setRequestHeader("Content-type", "application/json");
    delX.setRequestHeader("x-api-key", apiKey);
    delX.send();
}

// Checkbox Status
//
function setComplete() {

    let itemDiv = document.getElementById("item-wrapper");
    let finishedItemDiv = document.getElementById("finished-item-wrapper");
    let id = this.getAttribute("data-id");
    let pTag = document.getElementById("p-"+id);
    let finishedItem = document.getElementById(id);

    if (this.checked) {
        var data = {
            "completed": true
        }
    } else {
        var data = {
            "completed": false
        }
    }
    

    // Initalize AJAX Request
    var checkX = new XMLHttpRequest();

    // Response handler
    checkX.onreadystatechange = function() {

        // Wait for readyState = 4 & 200 response
        if (this.readyState == 4 && this.status == 200) {

            // parse JSON response
            var todo = JSON.parse(this.responseText);

            //strikethrough complete items and move finished items to the finished div
            //
            if (todo.completed == true) {
                finishedItemDiv.appendChild(finishedItem);
                pTag.style.textDecoration = "line-through";
            } else {
                pTag.style.textDecoration = "none";
                itemDiv.appendChild(finishedItem);
            }


        } else if (this.readyState == 4) {
            // this.status !== 200, error from server
            console.log(this.responseText);
        }
    }

    checkX.open("PUT", "https://cse204.work/todos/"+id, true);

    checkX.setRequestHeader("Content-type", "application/json");
    checkX.setRequestHeader("x-api-key", apiKey);
    checkX.send(JSON.stringify(data));
}