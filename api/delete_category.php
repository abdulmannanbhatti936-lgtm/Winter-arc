<?php
header('Content-Type: application/json');
require '../config.php';

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'];

$stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
$stmt->execute([$id]);

echo json_encode(['success' => true]);