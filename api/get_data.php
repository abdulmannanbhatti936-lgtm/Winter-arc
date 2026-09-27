<?php
header('Content-Type: application/json');
require '../config.php';

$categories = $pdo->query("SELECT * FROM categories ORDER BY id")->fetchAll(PDO::FETCH_ASSOC);

$stmt = $pdo->query("SELECT category_id, log_date, done FROM logs WHERE done = 1");
$logs = [];
foreach ($stmt as $row) {
    $logs[$row['log_date']][$row['category_id']] = (bool)$row['done'];
}

echo json_encode(['categories' => $categories, 'logs' => $logs]);