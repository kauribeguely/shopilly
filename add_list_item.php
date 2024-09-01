<?php
require_once 'db.php'; // Include your database connection file

// Get the input from the request
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['listId']) || !isset($data['itemText'])) {
    http_response_code(400);
    echo json_encode(['error' => 'List ID and item name are required.']);
    exit;
}

$listId = (int)$data['listId'];
$itemName = trim($data['itemText']);
$completed = (int)$data['completed'];

// Prepare the SQL statement to insert a new item
$sql = "INSERT INTO list_items (list_id, item_name, completed) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to prepare statement: ' . $conn->error]);
    exit;
}

// Bind parameters and execute the statement
$stmt->bind_param("isi", $listId, $itemName, $completed);

if ($stmt->execute()) {
    // Retrieve the inserted item's ID
    $itemId = $stmt->insert_id;
    echo json_encode(['success' => true, 'item_id' => $itemId]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to insert item: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
