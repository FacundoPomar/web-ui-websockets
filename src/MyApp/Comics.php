<?php
namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

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
        return array(
            array(
                'title' => 'Spiderman 1',
                'img' => './img/comics/comic-sample.jpg',
                'description' => 'I\'m a description',
                'price' => '35.46',
                'id' => 2
            ),
            array(
                'title' => 'Spiderman 2',
                'img' => './img/comics/comic-sample.jpg',
                'description' => 'I\'m a description dsad',
                'price' => '35.46',
                'id' => 3
            ),
            array(
                'title' => 'Spiderman 3',
                'img' => './img/comics/comic-sample.jpg',
                'description' => 'I\'m a description wqdw qdwq ',
                'price' => '35.46',
                'id' => 4
            ),
            array(
                'title' => 'Spiderman 4',
                'img' => './img/comics/comic-sample.jpg',
                'description' => 'I\'m a description dqw dqw dqw',
                'price' => '135.46',
                'id' => 5
            ),
            array(
                'title' => 'Spiderman 5',
                'img' => './img/comics/comic-sample.jpg',
                'description' => 'I\'m a description qwddqw dqw ',
                'price' => '35.46',
                'id' => 6
            ),
            array(
                'title' => 'Spiderman 6',
                'img' => './img/comics/comic-sample.jpg',
                'description' => 'I\'m a description wwwwwwwqq qwd qwd qw dqwd qwd qwd ',
                'price' => '5.46',
                'id' => 7
            ),
            array(
                'title' => 'Spiderman 7',
                'img' => './img/comics/comic-sample.jpg',
                'description' => 'I\'m a description wqdqw dqwd qwd qwd qwd qwd qwd ',
                'price' => '31.46',
                'id' => 8
            ),
            array(
                'title' => 'Spiderman 8',
                'img' => './img/comics/comic-sample.jpg',
                'description' => 'I\'m a description qwdwqd qwd qwd qwd qwd qwd ',
                'price' => '35.00',
                'id' => 9
            ),
            array(
                'title' => 'Spiderman 9',
                'img' => './img/comics/comic-sample.jpg',
                'description' => 'I\'m a description  wdqwdqwdq dsad asd 32 d2d 32d 32 23',
                'price' => '235.46',
                'id' => 10
            )
        );
    }

    private function getPopularComics() {
        return array(
            array(
                'title' => 'Wonderwoman 1',
                'img' => './img/comics/comic-sample.jpg',
                'description' => 'I\'m a description',
                'price' => '35.46',
                'id' => 23
            ),
            array(
                'title' => 'Superman 2',
                'img' => './img/comics/comic-sample.jpg',
                'description' => 'I\'m a description dsad',
                'price' => '35.46',
                'id' => 44
            ),
            array(
                'title' => 'Spiderman 9',
                'img' => './img/comics/comic-sample.jpg',
                'description' => 'I\'m a description wqdw qdwq ',
                'price' => '35.46',
                'id' => 10
            )
        );
    }
}



