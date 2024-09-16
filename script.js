document.addEventListener("DOMContentLoaded", () => {
    // const newItemInput = document.getElementById("new-item");
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
        homeScreen.style.display = 'flex';
        listScreen.style.display = 'none';
        loadLists();
      }
      else if(screenName == 'list')
      {
        homeScreen.style.display = 'none';
        listScreen.style.display = 'flex';
        //if creation of new item, create top item and focus input
        // newItemInput.focus();
      }
    }


    // Add a new item to the list
    // newItemInput.addEventListener("keypress", (event) => {
    //     if (event.key === "Enter") {
    //         const itemText = newItemInput.value.trim();
    //         if (itemText && currentListId !== null) {
    //             addItem(itemText);
    //             newItemInput.value = "";
    //         }
    //     }
    // });

    // Load all lists from the server
    function loadLists() {
        fetch('load_lists.php')
            .then(response => response.json())
            .then(data => {
                renderLists(data);
            })
            .catch(error => console.error('Error loading lists:', error));
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
          // console.log("Response from server:", data);
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
          // console.log("Response from server:", data);
          // alert("Item saved successfully!");
      })
      .catch(error => console.error('Error:', error));
    }

    // Function to render items of a list
    function renderList() {
        listContainer.innerHTML = "";

        items.forEach((item) => {
            addAnItemToList(item);
        });

        //add new list item below and focus it
        newItemInput();
        // addAnItemToList({description: ""}).children[0].focus();
    }

    function newItemInput()
    {
      const li = document.createElement("li");
      const input = document.createElement("input");
      input.id = 'new-item';
      input.addEventListener("keypress", (event) => {
          if (event.key === "Enter") {
              const itemText = input.value.trim();
              //TODO: check if item exists (via id) if yes, update it, no, create it
              if (itemText && currentListId !== null) {
                  addItem(itemText);
                  // input.value = "";


              }
          }
      });

      li.appendChild(input);
      listContainer.appendChild(li);
      input.focus();
      return li;
    }

    function addAnItemToList(item)
    {
      const li = document.createElement("li");
      const input = document.createElement("input");
      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";

      input.setAttribute("type", "text");
      input.value = item.description;

      if(item.description.length > 0) //the non editing inputs
      {
        input.classList.add('nonEditInput');
        // input.disabled = true;
        checkBox.addEventListener("click", () => toggleCompletion(item.id, li));
        // li.addEventListener("click", () => toggleCompletion(item.id, li));
        li.appendChild(checkBox);
        // Add event listener for double-click
        li.addEventListener('dblclick', function()
        {
          input.disabled = false; // Enable the input field
          input.focus();          // Set focus on the input field
        });
      }
      else
      {
      }

      input.addEventListener("keypress", (event) => {
          if (event.key === "Enter") {
              const itemText = input.value.trim();
              item.description = itemText;
              //TODO: check if item exists (via id) if yes, update it, no, create it
              updateItem(item);
              input.blur();
          }
      });


      // li.textContent = item.description;
      li.dataset.id = item.id;

      if (item.completed == 1) {
          li.classList.add("completed");
          checkBox.checked = true;
      }


      li.appendChild(input);
      listContainer.appendChild(li);
      return li;
    }

    // Render all lists in the UI
    function renderLists(lists) {
        listsContainer.innerHTML = "";
        lists.reverse().forEach(list => {
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


    // Toggle the completion status of an item
    function toggleCompletion(id, clickedLi) {
        const item = items.find((item) => item.id === id);
        if (item) {
            if(item.completed == 0) item.completed = 1;
            else item.completed = 0;
            // renderList();
            updateItem(item);
        }

        clickedLi.querySelector('input[type="checkbox"]').checked = item.completed;
        clickedLi.classList.toggle('completed');
        // clickedLi.querySelector('input[type="text"]').classList.toggle('completed');

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

    function formatDate(date) {
        // Define the months array
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Get the day and month
        const day = date.getDate();
        const month = months[date.getMonth()];

        // Return formatted date
        return `${day} ${month}`;
    }



    // Create a new list
    createListButton.addEventListener("click", () => {

      // Get the current date
      const currentDate = new Date();

      let dateString = formatDate(currentDate);

      // Set the value of newListNameInput
      // newListNameInput.value = formatDate(currentDate);
      createNewList(dateString);
      navigate('list');



        // const listName = newListNameInput.value.trim();

        // if (listName) {
        //     createNewList(listName);
        // } else {
        //     alert("Please enter a list name.");
        // }
    });

    // Create a new list and set it as the current list
    // newListButton.addEventListener("click", () => {
    //     const listName = prompt("Enter a name for the new list:");
    //     if (listName) {
    //         createNewList(listName);
    //     }
    // });

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
            listContainer.innerHTML = "";


            //create first list item and focus input
            // addAnItemToList({description: ""}).children[0].focus();
            newItemInput();


            // renderList();
            // loadLists(); // Reload the lists to include the new one
            //TODO: add the new list to home (see renderLists() method)
            // newListNameInput.value = "";
        })
        .catch(error => console.error('Error creating list:', error));
    }
});
