<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use MyApp\Chat;
use MyApp\SiteConfig;
use MyApp\Comics;

    require dirname(__DIR__) . '/vendor/autoload.php';

    $app = new Ratchet\App('localhost', 9090);
    $app->route('/chat', new Chat, array('*'));
    $app->route('/siteconfig', new SiteConfig, array('*'));
    $app->route('/comics/{type}', new Comics, array('*'));
    $app->run();