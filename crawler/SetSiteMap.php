<?php
include("func.php");

$log = file_get_contents('../log/powerInfo.log');
$log = @json_decode($log, true) ?? [];

$plantList = file_get_contents('../log/powerPlant.log');
$plantList = @json_decode($plantList, true) ?? [];

// print_r($log);exit();
$WEB_DOMAIN = WEB_DOMAIN;

$xml = [];
$xml[] = '<?xml version="1.0" encoding="UTF-8"?>';
$xml[] = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">';
$xml[] = "
    <url>
        <loc>{$WEB_DOMAIN}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
";

$xml[] = "
    <url>
        <loc>{$WEB_DOMAIN}/?path=/summary</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
";

$xml[] = "
    <url>
        <loc>{$WEB_DOMAIN}/?path=/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.1</priority>
    </url>
";

foreach ($log['info'] AS $info) {
    // $url = "{$WEB_DOMAIN}/#/?".http_build_query(['unit_key' => $info['key']]);
    $params = [
        "path" => "unit/".$info['key'],
    ];
    $url = "{$WEB_DOMAIN}/?".http_build_query($params);
    $xml[] = "
    <url>
        <loc>{$url}</loc>
        <changefreq>hourly</changefreq>
        <priority>1.0</priority>
    </url>
    ";
}

foreach ($plantList AS $_plantList) {
    // $url = "{$WEB_DOMAIN}/#/?".http_build_query(['plant_name' => $_plantList['nickName']]);
    $params = [
        "path" => "plant/".$_plantList['nickName'],
    ];
    $url = "{$WEB_DOMAIN}/?".http_build_query($params);

    $xml[] = "
    <url>
        <loc>{$url}</loc>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
    ";
}


$xml[] = '</urlset>';

$path = "../log/sitemap.xml";
$file = fopen($path,"w");
fwrite($file,implode("\n", $xml));


// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
// <url> <loc>https://hahow.in/</loc> <changefreq>daily</changefreq> <priority>1.0</priority> </url>
// <url> <loc>https://hahow.in/about/hahow</loc> <changefreq>monthly</changefreq> <priority>0.1</priority> </url>
// <url> <loc>https://hahow.in/about/team</loc> <changefreq>monthly</changefreq> <priority>0.1</priority> </url>
// <url> <loc>https://hahow.in/cooperate</loc> <changefreq>monthly</changefreq> <priority>0.1</priority> </url>
// <url> <loc>https://hahow.in/courses</loc> <changefreq>daily</changefreq> <priority>1.0</priority> </url>
// <url> <loc>https://hahow.in/courses/create</loc> <changefreq>monthly</changefreq> <priority>0.5</priority> </url>
// <url> <loc>https://hahow.in/ideas</loc> <changefreq>daily</changefreq> <priority>0.3</priority> </url>

