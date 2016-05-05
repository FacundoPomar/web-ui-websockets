<?php
namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use PDO;

class Login implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

    }

    public function onMessage(ConnectionInterface $from, $msg) {

        $response = array();

        try {
            $data = json_decode($msg);

            if ($data->action == 'login') {
                $response = $this->login($data);
            } else if ($data->action == 'autologin') {
                $response = $this->checkHashValidity($data);
            }

        } catch (Exception $e) {
            $response['response'] = 'error';
            $response['error'] = $e;
        }

        $from->send(json_encode($response));

    }

    public function onClose(ConnectionInterface $conn) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }

    private function login($data) {

        $response = array();

        if ((isset($data->loginUser) && $data->loginUser) &&
                (isset($data->loginPass) && $data->loginPass))
        {
            $db = DB::getInstance();
            $stmt = $db->prepare('SELECT id, username FROM users WHERE username LIKE :user AND password = :pass');
            $stmt->bindValue(':user', $data->loginUser, PDO::PARAM_STR);
            $stmt->bindValue(':pass', $data->loginPass, PDO::PARAM_STR);
            $stmt->execute();
            $exists = $stmt->fetchColumn();
            // If exists, generate hash and save it with an expiration date.
            if ($exists) {
                $salt = 'SDdsaj"#$"#$dsa';
                $hash = md5($salt . time());

                $sql = 'UPDATE users SET hash = :hash, expires = :expires WHERE username = :user AND password = :pass';

                $stmt = $db->prepare($sql);
                $stmt->bindValue(':hash', $hash, PDO::PARAM_STR);
                $stmt->bindValue(':expires', date("Y-m-d H:i:s", strtotime(date("Y-m-d H:i:s") . ' + 5 days')), PDO::PARAM_STR);
                $stmt->bindValue(':user', $data->loginUser, PDO::PARAM_STR);
                $stmt->bindValue(':pass', $data->loginPass, PDO::PARAM_STR);
                $stmt->execute();
                $response['response'] = 'ok';
                $response['hash'] = $hash;
            } else {
                $response['response'] = 'error';
                $response['error'] = 'invalid credentials';
            }
        } else {
            $response['response'] = 'error';
            $response['error'] = 'missing data';
        }

        return $response;
    }

    private function checkHashValidity($data) {

        $response = array();

        if ((isset($data->hash) && $data->hash) &&
                (isset($data->username) && $data->username))
        {
            $db = DB::getInstance();
            $stmt = $db->prepare('SELECT id FROM users WHERE username LIKE :user AND hash = :hash AND expires >= NOW()');
            $stmt->bindValue(':user', $data->username, PDO::PARAM_STR);
            $stmt->bindValue(':hash', $data->hash, PDO::PARAM_STR);
            $stmt->execute();
            $exists = $stmt->fetchColumn();

            if ($exists) {
                $response['response'] = 'ok';
            } else {
                $response['response'] = 'session expired';
            }
        } else {
            $response['response'] = 'error';
            $response['error'] = 'lack of data on autologin';
        }

        return $response;
    }

}