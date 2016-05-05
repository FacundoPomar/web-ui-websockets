<?php
namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class SiteConfig implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

        $response = array(
            'title' => 'An Amaysing Comic Store',
            'subTitle' => 'We sell only the best commics in the world, if that is possible',
            'footer' => array(
                    'caption' => 'Copyright something',
                    'links' => array(
                            array(
                                'title' => 'sitemap',
                                'url' => '#/sitemap',
                                'class' => 'sitemap',
                                'text' => 'SITEMAP'
                            ),
                            array(
                                'title' => 'another link',
                                'url' => '#/alink',
                                'class' => '',
                                'text' => 'Another Important Link'
                            ),
                        )
                )
            );
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