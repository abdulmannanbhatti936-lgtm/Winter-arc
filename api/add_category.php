<?php
header('Content-Type: application/json');
require '../config.php';

$input = json_decode(file_get_contents('php://input'), true);
$name = trim($input['name']);
$duration = trim($input['duration'] ?? '');

if ($name !== '') {
    $stmt = $pdo->prepare("INSERT INTO categories (name, duration) VALUES (?, ?)");
    $stmt->execute([$name, $duration !== '' ? $duration : null]);
}

echo json_encode(['success' => true]);