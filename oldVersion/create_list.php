<?php
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || empty(trim($data['name']))) {
    http_response_code(400);
    echo json_encode(['error' => 'List name is required.']);
    exit;
}

$listName = trim($data['name']);

$stmt = $conn->prepare("INSERT INTO lists (name) VALUES (?)");
$stmt->bind_param("s", $listName);

if ($stmt->execute()) {
    $newListId = $conn->insert_id;
    echo json_encode(['id' => $newListId, 'name' => $listName]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create list: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
