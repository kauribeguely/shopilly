document.addEventListener("DOMContentLoaded", () => {
    const newItemInput = document.getElementById("new-item");
    const listContainer = document.getElementById("list");
    const saveButton = document.getElementById("save-list");

    let items = [];

    // Add a new item to the list
    newItemInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const itemText = newItemInput.value.trim();
            if (itemText) {
                addItem(itemText);
                newItemInput.value = "";
            }
        }
    });

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
        fetch('save_list.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(items)
        })
        .then(response => response.text())
        .then(data => {
            console.log("Response from server:", data);
            alert("List saved successfully!");
        })
        .catch(error => console.error('Error:', error));
    });
});
