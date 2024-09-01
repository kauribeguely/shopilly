<?php
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$listId = $data['listId'];
$items = $data['items'];

// Clear existing items for the list
$sql = "DELETE FROM list_items WHERE list_id = $listId";
$conn->query($sql);

// Insert new items
foreach ($items as $item) {
    $text = $conn->real_escape_string($item['text']);
    $completed = $item['completed'] ? 1 : 0;

    $sql = "INSERT INTO list_items (list_id, item, completed) VALUES ($listId, '$text', $completed)";

    if ($conn->query($sql) !== TRUE) {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

echo "List saved successfully!";
$conn->close();
?>
