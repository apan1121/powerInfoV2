<?php
require '../config/config.php';

function strposa($haystack, $needles=array(), $offset=0) {
    $chr = array();
    foreach($needles as $needle) {
            $res = strpos($haystack, $needle, $offset);
            if ($res !== false) $chr[$needle] = $res;
    }
    if(empty($chr)) return false;
    return min($chr);
}

function get($path){
    return @json_decode(file_get_contents($path),true) ;
}

function save($path, $data) {
    $dir = dirname(__FILE__)."/";

    $path = explode("/",$path);
    $checkPath = [];
    for ($i = 0; $i < count($path) -1 ; $i++) {
        $checkPath[] = $path[$i];
        $folderPath = $dir.implode("/",$checkPath);
        if (!file_exists($folderPath)) {
            mkdir($folderPath, 0777, true);
        }
    }

    $file = fopen(implode("/",$path),"w");
    // fwrite($file,json_encode($data, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
    fwrite($file,json_encode($data));
}

function del($path) {
    return @unlink($path);
}