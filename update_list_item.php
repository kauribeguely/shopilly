<?php
require_once 'db.php'; // Include your database connection file

// Get the input from the request
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !isset($data['listId']) || !isset($data['description']) || !isset($data['completed'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ID, list ID, description, and completion status are required.']);
    exit;
}

$id = (int)$data['id'];
$listId = (int)$data['listId'];
$description = trim($data['description']);
$completed = (int)$data['completed']; // Ensure $completed is an integer (0 or 1)

// Prepare the SQL statement to update an existing item
$sql = "UPDATE list_items SET list_id = ?, description = ?, completed = ? WHERE id = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to prepare statement: ' . $conn->error]);
    exit;
}

// Bind parameters and execute the statement
$stmt->bind_param("isii", $listId, $description, $completed, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update item: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
