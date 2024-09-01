document.addEventListener("DOMContentLoaded", () => {
    const newItemInput = document.getElementById("new-item");
    const listContainer = document.getElementById("list");
    const saveButton = document.getElementById("save-list");
    const listsContainer = document.getElementById("lists");
    const newListNameInput = document.getElementById("new-list-name");
    const createListButton = document.getElementById("create-list");
    const newListButton = document.getElementById("new-list-button"); // New List button
    const currentListName = document.getElementById("current-list-name");

    let items = [];
    let currentListId = null;

    // Load all lists on page load
    loadLists();

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

            li.addEventListener("click", () => {
                currentListId = list.id;
                currentListName.textContent = `List Items - ${list.name}`;
                loadItems(list.id);
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
    function addItem(text) {
        const item = {
            id: Date.now(),
            text: text,
            completed: false
        };

        items.push(item);
        renderList();
    }

    // Function to render the list
    function renderList() {
        listContainer.innerHTML = "";

        items.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item.text;
            li.dataset.id = item.id;

            if (item.completed) {
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
            item.completed = !item.completed;
            renderList();
        }
    }

    // Save the list via AJAX
    saveButton.addEventListener("click", () => {
        if (currentListId === null) {
            alert("Please select a list first.");
            return;
        }

        fetch('save_list.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ listId: currentListId, items: items })
        })
        .then(response => response.text())
        .then(data => {
            console.log("Response from server:", data);
            alert("List saved successfully!");
        })
        .catch(error => console.error('Error:', error));
    });

    // Create a new list
    createListButton.addEventListener("click", () => {
        const listName = newListNameInput.value.trim();
        if (listName) {
            createNewList(listName);
        } else {
            alert("Please enter a list name.");
        }
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
            currentListName.textContent = `List Items - ${listName}`;
            items = []; // Clear items for the new list
            renderList();
            loadLists(); // Reload the lists to include the new one
            newListNameInput.value = "";
        })
        .catch(error => console.error('Error creating list:', error));
    }
});