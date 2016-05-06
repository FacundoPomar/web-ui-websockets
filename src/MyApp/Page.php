<?php
namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use PDO;

class Page implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

        $parameters = $conn->WebSocket->request->getQuery()->toArray();
        $response = array();

        if (count($parameters) and isset($parameters['slug'])) {
            $slug = $parameters['slug'];
            $db = DB::getInstance();
            $stmt = $db->prepare("SELECT title, content FROM pages WHERE slug=:slug");
            $stmt->bindValue(':slug', $slug, PDO::PARAM_STR);
            $stmt->execute();
            $page = $stmt->fetch(PDO::FETCH_ASSOC);
            $response['response'] = 'ok';
            $response['page'] = $page;

        } else {
            $response['response'] = 'error';
            $response['error'] = 'lack of parameter id';
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

}



