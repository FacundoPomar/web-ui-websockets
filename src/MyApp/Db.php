<?php
namespace MyApp;

Class DB {
    static $_instance;

    private function __construct() {}

    private function __clone(){}

    public static function getInstance() {
        if (!(self::$_instance instanceof self)) {
            self::$_instance = new \PDO('mysql:host=localhost;dbname=comicstore;charset=utf8mb4', 'root', 'root');
        }
        return self::$_instance;
    }

}