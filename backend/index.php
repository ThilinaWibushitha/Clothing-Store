<?php
/**
 * Velvet Vogue - Enhanced Login Handler
 * Improved with security best practices, error handling, and proper validation
 */

require_once 'vendor/autoload.php';

// Start session for security
session_start();

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Only allow POST requests for login
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    sendJsonResponse(['error' => 'Method not allowed'], 405);
    exit;
}

// Rate limiting check
if (!checkRateLimit()) {
    http_response_code(429);
    sendJsonResponse(['error' => 'Too many login attempts. Please try again later.'], 429);
    exit;
}

try {
    // Validate CSRF token if implemented
    if (!validateCSRFToken()) {
        http_response_code(403);
        sendJsonResponse(['error' => 'Invalid security token'], 403);
        exit;
    }

    // Sanitize and validate input
    $username = sanitizeInput($_POST['uname'] ?? '');
    $password = $_POST['psw'] ?? '';

    // Validate input
    $validationErrors = validateLoginInput($username, $password);
    if (!empty($validationErrors)) {
        http_response_code(400);
        sendJsonResponse(['error' => 'Invalid input', 'details' => $validationErrors], 400);
        exit;
    }

    // Create MongoDB client with connection options
    $client = createMongoClient();
    $database = $client->velvet;
    $collection = $database->empcollection;

    // Find user with additional security checks
    $user = $collection->findOne([
        'username' => $username,
        'status' => 'active' // Only allow active users
    ]);

    if (!$user) {
        // Log failed login attempt
        logSecurityEvent('failed_login', $username, $_SERVER['REMOTE_ADDR']);
        
        // Use generic error message to prevent username enumeration
        http_response_code(401);
        sendJsonResponse(['error' => 'Invalid credentials'], 401);
        exit;
    }

    // Verify password
    if (!password_verify($password, $user['password'])) {
        // Log failed login attempt
        logSecurityEvent('failed_login', $username, $_SERVER['REMOTE_ADDR']);
        
        http_response_code(401);
        sendJsonResponse(['error' => 'Invalid credentials'], 401);
        exit;
    }

    // Check if account is locked
    if (isset($user['locked_until']) && $user['locked_until'] > time()) {
        http_response_code(423);
        sendJsonResponse(['error' => 'Account temporarily locked due to multiple failed attempts'], 423);
        exit;
    }

    // Successful login
    logSecurityEvent('successful_login', $username, $_SERVER['REMOTE_ADDR']);
    
    // Reset failed login attempts
    $collection->updateOne(
        ['username' => $username],
        ['$unset' => ['failed_attempts' => '', 'locked_until' => '']]
    );

    // Set session variables
    $_SESSION['user_id'] = $user['_id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['login_time'] = time();
    $_SESSION['csrf_token'] = generateCSRFToken();

    // Regenerate session ID for security
    session_regenerate_id(true);

    // Determine redirect URL based on role
    $redirectUrl = determineRedirectUrl($user['role']);
    
    sendJsonResponse([
        'success' => true,
        'message' => 'Login successful',
        'redirect' => $redirectUrl,
        'role' => $user['role']
    ]);

} catch (MongoDB\Exception\Exception $e) {
    error_log("MongoDB Error: " . $e->getMessage());
    http_response_code(500);
    sendJsonResponse(['error' => 'Database connection failed'], 500);
} catch (Exception $e) {
    error_log("General Error: " . $e->getMessage());
    http_response_code(500);
    sendJsonResponse(['error' => 'An unexpected error occurred'], 500);
}

/**
 * Create MongoDB client with proper configuration
 */
function createMongoClient() {
    $options = [
        'serverSelectionTimeoutMS' => 5000,
        'connectTimeoutMS' => 5000,
        'socketTimeoutMS' => 5000,
    ];
    
    return new MongoDB\Client('mongodb://localhost:27017', $options);
}

/**
 * Sanitize input data
 */
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate login input
 */
function validateLoginInput($username, $password) {
    $errors = [];
    
    if (empty($username)) {
        $errors[] = 'Username is required';
    } elseif (strlen($username) < 3 || strlen($username) > 50) {
        $errors[] = 'Username must be between 3 and 50 characters';
    } elseif (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
        $errors[] = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (empty($password)) {
        $errors[] = 'Password is required';
    } elseif (strlen($password) < 6) {
        $errors[] = 'Password must be at least 6 characters';
    }
    
    return $errors;
}

/**
 * Check rate limiting
 */
function checkRateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $key = "login_attempts_" . $ip;
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = ['count' => 0, 'last_attempt' => time()];
    }
    
    $attempts = $_SESSION[$key];
    
    // Reset counter if more than 15 minutes have passed
    if (time() - $attempts['last_attempt'] > 900) {
        $_SESSION[$key] = ['count' => 0, 'last_attempt' => time()];
        return true;
    }
    
    // Allow maximum 5 attempts per 15 minutes
    if ($attempts['count'] >= 5) {
        return false;
    }
    
    $_SESSION[$key]['count']++;
    $_SESSION[$key]['last_attempt'] = time();
    
    return true;
}

/**
 * Validate CSRF token
 */
function validateCSRFToken() {
    $token = $_POST['csrf_token'] ?? '';
    $sessionToken = $_SESSION['csrf_token'] ?? '';
    
    return !empty($token) && hash_equals($sessionToken, $token);
}

/**
 * Generate CSRF token
 */
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Determine redirect URL based on user role
 */
function determineRedirectUrl($role) {
    switch ($role) {
        case 'admin':
            return 'http://localhost:3000/backend/admin.php';
        case 'user':
        default:
            return 'http://127.0.0.1:5500/velvetVogue.html';
    }
}

/**
 * Log security events
 */
function logSecurityEvent($event, $username, $ip) {
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'event' => $event,
        'username' => $username,
        'ip' => $ip,
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
    ];
    
    error_log("Security Event: " . json_encode($logEntry));
}

/**
 * Send JSON response
 */
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
?>
