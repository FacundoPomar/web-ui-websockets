<?php
namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use PDO;

class Comics implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

        $type = 'latest';
        $parameters = $conn->WebSocket->request->getQuery()->toArray();

        if (count($parameters) and isset($parameters['type'])) {
            $type = $parameters['type'];
        }
        $response = array();

        try {
            $comics = ($type == 'latest') ? $this->getLatestComics() : $this->getPopularComics();
            $response['response'] = 'ok';
            $response['comics'] = $comics;
        } catch (Exception $e) {
            $response['response'] = 'error';
            $response['error'] = 'An error just happend';
        }

        $conn->send(json_encode($response));
    }

    public function onMessage(ConnectionInterface $from, $msg) {

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

    private function getLatestComics() {

        $db = DB::getInstance();
        $stmt = $db->prepare("SELECT * FROM comics ORDER BY id DESC LIMIT 0,8");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function getPopularComics() {
        $db = DB::getInstance();
        $stmt = $db->prepare("SELECT * FROM comics WHERE (id % 2) = 0");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}



