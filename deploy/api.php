<?php
header('Content-Type: application/json');

$DATA_FILE = 'data.json';
$UPLOADS_DIR = 'uploads/';
$ADMIN_PASSWORD = 'Jur_Activ_Smol_99_!_Secure_Pass_#2024';
$TO_EMAIL = 'info@pravo-smol.ru';
$FROM_EMAIL = 'info@pravo-smol.ru';

if (!file_exists($UPLOADS_DIR)) {
    mkdir($UPLOADS_DIR, 0755, true);
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// API: Получение данных
if ($method === 'GET' && $action === 'get_data') {
    if (file_exists($DATA_FILE)) {
        echo file_get_contents($DATA_FILE);
    } else {
        echo json_encode([]);
    }
    exit;
}

// Получаем тело запроса (JSON)
$input = json_decode(file_get_contents('php://input'), true);

// API: Отправка заявки
if ($method === 'POST' && $action === 'send_lead') {
    if (!isset($input['name']) || !isset($input['phone']) || !isset($input['email']) || !isset($input['message']) || !isset($input['consent']) || !$input['consent']) {
        http_response_code(400);
        echo json_encode(['error' => 'Все поля обязательны. Необходимо согласие на обработку персональных данных.']);
        exit;
    }

    $name = htmlspecialchars($input['name']);
    $phone = htmlspecialchars($input['phone']);
    $email = htmlspecialchars($input['email']);
    $message = htmlspecialchars($input['message']);
    $consent = $input['consent'] ? 'Дано' : 'Не дано';
    $date = date('d.m.Y H:i:s');

    $subject = "Новая заявка с сайта pravo-smol.ru от $name";
    $body = "
    <html>
    <head>
        <title>Новая заявка</title>
    </head>
    <body>
        <h2>Новая заявка с сайта</h2>
        <p><strong>Имя:</strong> $name</p>
        <p><strong>Телефон:</strong> $phone</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Сообщение:</strong></p>
        <p>$message</p>
        <p><strong>Согласие на обработку ПД:</strong> $consent</p>
        <p><strong>Дата и время:</strong> $date</p>
    </body>
    </html>
    ";

    $headers = "From: $FROM_EMAIL\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    if (mail($TO_EMAIL, $subject, $body, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка отправки почты']);
    }
    exit;
}

// API: Загрузка изображений
if ($method === 'POST' && $action === 'upload') {
    if (!isset($input['password']) || $input['password'] !== $ADMIN_PASSWORD) {
        http_response_code(403);
        echo json_encode(['error' => 'Ошибка доступа']);
        exit;
    }

    if (isset($input['image'])) {
        $base64Data = $input['image'];
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $type)) {
            $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, etc

            if (!in_array($type, ['jpg', 'jpeg', 'png', 'gif'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Неверный тип изображения']);
                exit;
            }

            $base64Data = base64_decode($base64Data);
            if ($base64Data === false) {
                http_response_code(400);
                echo json_encode(['error' => 'Ошибка декодирования']);
                exit;
            }

            $fileName = 'img_' . time() . '.' . $type;
            $filePath = $UPLOADS_DIR . $fileName;

            if (file_put_contents($filePath, $base64Data)) {
                echo json_encode(['success' => true, 'url' => 'uploads/' . $fileName]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Ошибка сохранения файла']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Некорректный формат изображения']);
        }
    }
    exit;
}

// API: Сохранение данных
if ($method === 'POST' && $action === 'save_data') {
    if (!isset($input['password']) || $input['password'] !== $ADMIN_PASSWORD) {
        http_response_code(403);
        echo json_encode(['error' => 'Ошибка доступа']);
        exit;
    }

    $items = [];
    if (file_exists($DATA_FILE)) {
        $items = json_decode(file_get_contents($DATA_FILE), true) ?: [];
    }

    $newItem = [
        'id' => time() * 1000,
        'type' => $input['type'] ?? 'news',
        'title' => $input['title'] ?? '',
        'content' => $input['content'] ?? '',
        'image' => $input['image'] ?? null,
        'date' => date('d.m.Y')
    ];

    array_unshift($items, $newItem);

    if (file_put_contents($DATA_FILE, json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(['success' => true, 'item' => $newItem]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка записи в файл']);
    }
    exit;
}

// API: Удаление данных
if ($method === 'POST' && $action === 'delete_item') {
    if (!isset($input['password']) || $input['password'] !== $ADMIN_PASSWORD) {
        http_response_code(403);
        echo json_encode(['error' => 'Ошибка доступа']);
        exit;
    }

    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID не указан']);
        exit;
    }

    $items = [];
    if (file_exists($DATA_FILE)) {
        $items = json_decode(file_get_contents($DATA_FILE), true) ?: [];
    }

    $idToDelete = $input['id'];
    $filteredItems = array_filter($items, function($item) use ($idToDelete) {
        return $item['id'] != $idToDelete;
    });

    // Переиндексируем массив для корректного JSON (как массив, а не объект)
    $filteredItems = array_values($filteredItems);

    if (file_put_contents($DATA_FILE, json_encode($filteredItems, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка при удалении']);
    }
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Метод не найден']);
?>
