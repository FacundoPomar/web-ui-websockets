<?php
namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use PDO;

class Profile implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg) {

        $response = array();

        try {
            $data = json_decode($msg);
            var_dump($data);
            if ((isset($data->hash) && $data->hash) &&
                (isset($data->username) && $data->username))
            {
                $response['response'] = 'ok';
                $response['profile'] = $this->getUserData($data);
            } else {
                $response['response'] = 'error';
                $response['error'] = 'Lack of data to process request';
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

    private function getUserData($data) {

        $db = DB::getInstance();
        $stmt = $db->prepare("SELECT u.id, u.username, up.firstname, up.lastname, up.phone FROM users AS u
                            INNER JOIN userprofiles AS up ON up.username = u.username
                            WHERE u.username = :username AND u.hash = :hash AND u.expires >= NOW()");
        $stmt->bindValue(':username', $data->username, PDO::PARAM_STR);
        $stmt->bindValue(':hash', $data->hash, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

}



