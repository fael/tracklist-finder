<?php
require __DIR__ . "/vendor/autoload.php";
require __DIR__ . "/Core.php";

date_default_timezone_set('America/Sao_Paulo');

use Goutte\Client;

$app = new Silex\Application();
$client = new Client();

$app->get("/search/{term}", function ($term) use ($app, $client) {
	$crawler = Core::makeSearch($client, $term);	
	$results = Core::fetchList($crawler);
	return Core::printResponse($app, $results);
});

$app->get("/tracklist/{slug}", function ($slug) use ($app, $client) {
	$crawler = Core::readTracklist($client, $slug);	
	$results = Core::fetchTracklist($crawler);
	return Core::printResponse($app, $results);
});

$app->get("/", function () use ($app, $client) {
	$crawler = Core::readLatest($client);
	$results = Core::fetchList($crawler);
	return Core::printResponse($app, $results);
});

$app->run();
