<?php
header('Content-Type: application/json');
require '../config.php';

$input = json_decode(file_get_contents('php://input'), true);
$categoryId = $input['category_id'];
$date = $input['date'];

// Check if a log row already exists for this category+date
$stmt = $pdo->prepare("SELECT done FROM logs WHERE category_id = ? AND log_date = ?");
$stmt->execute([$categoryId, $date]);
$existing = $stmt->fetch(PDO::FETCH_ASSOC);

if ($existing) {
    $newValue = $existing['done'] ? 0 : 1;
    $stmt = $pdo->prepare("UPDATE logs SET done = ? WHERE category_id = ? AND log_date = ?");
    $stmt->execute([$newValue, $categoryId, $date]);
} else {
    $stmt = $pdo->prepare("INSERT INTO logs (category_id, log_date, done) VALUES (?, ?, 1)");
    $stmt->execute([$categoryId, $date]);
}

echo json_encode(['success' => true]);