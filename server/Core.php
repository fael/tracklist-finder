<?php
class Core {
    public static $apiPath = "http://www.1001tracklists.com/";

    public function readLatest($client) {
        return $client->request("GET", self::$apiPath);
    }

    public function readTracklist($client, $slug) {
        $path = self::$apiPath . "tracklist/" . $slug . ".html";
        return $client->request("GET", $path);
    }

    public function makeSearch($client, $term) {
        $crawler = $client->request("GET", self::$apiPath);
        $form = $crawler->selectButton("")->form();
        $params = array(
            "search_selection" => "1",
            "main_search" => $term
        );
        return $client->submit($form, $params); 
    }

    public function fetchTracklist($crawler) {
        $title = $crawler->filter("#pageTitle")->text();
        $title = str_replace("Tracklist / Playlist", "", $title);

        $tracks = $crawler->filter(".trackValue a")->each(function ($node) {
            return (object)[
                "title" => $node->text(),
            ];
        });

        return ["title" => $title, "tracks" => $tracks];
    }

    public function fetchList($crawler) {
        return $crawler->filter(".tlInfo a")->each(function ($node) {
            $href = $node->attr("href");
            $pattern = "/\/tracklist\/(\d{1,5}).*/";
            $replacement = '${1}';
            $id = preg_replace($pattern, $replacement, $href);
            $slug = str_replace("/tracklist/", "", $href);
            $slug = str_replace(".html", "", $slug);
            $slug = str_replace(".", "", $slug);

            return (object)[
                "id" => $id,
                "slug" => $slug,
                "title" => $node->text(), 
            ];
        });
    }

    public function printResponse($app, $response) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST');

        return $app->json($response);
    }
}