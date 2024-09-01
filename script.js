document.addEventListener("DOMContentLoaded", () => {
    const newItemInput = document.getElementById("new-item");
    const listContainer = document.getElementById("list");
    const saveButton = document.getElementById("save-list");
    const listsContainer = document.getElementById("lists");
    const newListNameInput = document.getElementById("new-list-name");
    const createListButton = document.getElementById("button-new-list");
    const newListButton = document.getElementById("new-list-button"); // New List button
    const currentListName = document.getElementById("current-list-name");

    const homeScreen = document.querySelector(".home");
    const listScreen = document.querySelector(".list");

    let items = [];
    let currentListId = null;

    // Load all lists on page load
    loadLists();

    // createListButton.onmousedown = function(){ navigate("home") };

    document.querySelector('#button-home').onmousedown = function(){ navigate("home") };

    function navigate(screenName)
    {
      if(screenName == 'home')
      {
        homeScreen.style.display = 'block';
        listScreen.style.display = 'none';
      }
      else if(screenName == 'list')
      {
        homeScreen.style.display = 'none';
        listScreen.style.display = 'block';
      }
    }


    // Add a new item to the list
    newItemInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const itemText = newItemInput.value.trim();
            if (itemText && currentListId !== null) {
                addItem(itemText);
                newItemInput.value = "";
            }
        }
    });

    // Load all lists from the server
    function loadLists() {
        fetch('load_lists.php')
            .then(response => response.json())
            .then(data => {
                renderLists(data);
            })
            .catch(error => console.error('Error loading lists:', error));
    }

    // Render all lists in the UI
    function renderLists(lists) {
        listsContainer.innerHTML = "";
        lists.forEach(list => {
            const li = document.createElement("li");
            li.textContent = list.name;
            li.dataset.id = list.id;

            //on click of a list name
            li.addEventListener("click", () => {
                currentListId = list.id;
                currentListName.textContent = `${list.name}`;
                loadItems(list.id);
                navigate('list');
            });

            listsContainer.appendChild(li);
        });
    }

    // Load items for the selected list from the server
    function loadItems(listId) {
        fetch(`load_items.php?list_id=${listId}`)
            .then(response => response.json())
            .then(data => {
                items = data;
                renderList();
            })
            .catch(error => console.error('Error loading items:', error));
    }

    // Function to add a new item to the list
    function addItem(text)
    {
        const item = {
            id: Date.now(),
            description: text,
            completed: 0
        };
        // TODO get this id after adding to database, seperate save_item php
        // id: Date.now(),

        addItemToDb(item);

        items.push(item);
    }

    function addItemToDb(item)
    {
      fetch('add_list_item.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ listId: currentListId, description: item.description, completed: item.completed })
      })
      .then(response => response.text())
      .then(data => {
          console.log("Response from server:", data);
          item.id = data.item_id;
          item.completed = data.completed;
          renderList();

          // alert("Item saved successfully!");
      })
      .catch(error => console.error('Error:', error));
    }

    function updateItem(item)
    {
      fetch('update_list_item.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: item.id, listId: currentListId, description: item.description, completed: item.completed })
      })
      .then(response => response.text())
      .then(data => {
          console.log("Response from server:", data);
          // alert("Item saved successfully!");
      })
      .catch(error => console.error('Error:', error));
    }

    // Function to render the list
    function renderList() {
        listContainer.innerHTML = "";

        items.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item.description;
            li.dataset.id = item.id;

            if (item.completed == 1) {
                li.classList.add("completed");
            }

            li.addEventListener("click", () => toggleCompletion(item.id));
            listContainer.appendChild(li);
        });
    }

    // Toggle the completion status of an item
    function toggleCompletion(id) {
        const item = items.find((item) => item.id === id);
        if (item) {
            if(item.completed == 0) item.completed = 1;
            else item.completed = 0;
            renderList();
            updateItem(item);
        }
    }

    // // Save the list via AJAX
    // saveButton.addEventListener("click", () => {
    //     if (currentListId === null) {
    //         alert("Please select a list first.");
    //         return;
    //     }
    //
    //     fetch('save_list.php', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ listId: currentListId, items: items })
    //     })
    //     .then(response => response.text())
    //     .then(data => {
    //         console.log("Response from server:", data);
    //         alert("List saved successfully!");
    //     })
    //     .catch(error => console.error('Error:', error));
    // });

    // Create a new list
    createListButton.addEventListener("click", () => {

      //set input to 'New List'
      newListNameInput.value = "New List";
      createNewList("New List");
      navigate('list');

        // const listName = newListNameInput.value.trim();

        // if (listName) {
        //     createNewList(listName);
        // } else {
        //     alert("Please enter a list name.");
        // }
    });

    // Create a new list and set it as the current list
    newListButton.addEventListener("click", () => {
        const listName = prompt("Enter a name for the new list:");
        if (listName) {
            createNewList(listName);
        }
    });

    function createNewList(listName) {
        fetch('create_list.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: listName })
        })
        .then(response => response.json())
        .then(data => {
            console.log("New list created:", data);
            currentListId = data.id; // Set the new list as the current list
            currentListName.textContent = `${listName}`;
            items = []; // Clear items for the new list
            renderList();
            loadLists(); // Reload the lists to include the new one
            newListNameInput.value = "";
        })
        .catch(error => console.error('Error creating list:', error));
    }
});
