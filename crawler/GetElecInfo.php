<?php
include("func.php");
include("simple_html_dom.php");
$html = file_get_contents("https://zh.wikipedia.org/wiki/%E8%87%BA%E7%81%A3%E7%99%BC%E9%9B%BB%E5%BB%A0%E5%88%97%E8%A1%A8");

$html = str_get_html($html);

$base_url = "https://zh.wikipedia.org";
$table = $html->find('table.wikitable');

$electInfo = [];
$default =  [
    "name" => "",
    "url"  => "",
    "fullName" => "",
    "nickName" => "",
    "photo" => "",
    "location" => "",
    "geo" => false,
    "org" => "",
    "amount" => "",
    "capacity" => "",
    "status" => "",
    "note" => "",
    "type" => "",
];

$transKeyword = [
    "商轉中" => "online",
    "部分運轉中" => "part-online",
    "部分商轉中" => "part-online",
    "計劃中" => "plane",
    "計畫改建" => "rebuild",
    "已取消" => "cancel",
    "已廢止" => "remove",
    "已拆除" => "remove",
    "已廢棄" => "remove",
    "停工中" => "cancel",
    "備役中" => "spare",
    "試俥中" => "test",
    "封存中" => "stop",
    "計畫中" => "plan",
    "施工中" => "build",


    "電廠名稱" => "name",
    "電廠照片" => "photo",
    "所在位置" => "location",
    "操作單位" => "org",
    "機組數量（容量*機組數）" => "amount",
    "機組數量" => "amount",
    "裝置容量 （MW）" => "capacity",
    "裝置容量（MW）" => "capacity",
    "當前狀態" => "status",
    "燃料" => "type",
    "備註" => "note",

    "煤" => "coal",
    "天然氣" => "lng",
    "重油" => "oil",
    "柴油" => "oil",
    "燃料油" => "oil",
    "燃煤" =>"coal",
    "風力" => "wind",
    "水力" => "water",
    "水" => "water",
    "溪" => "water",
    "地熱" => "geothermal",
    "太陽" => "solar",
    "光電" => "solar",

    "elecMapping" => [
        "第一核能發電廠" => "核一",
        "第二核能發電廠" => "核二",
        "第三核能發電廠" => "核三",
        "第四核能發電廠" => "核四",
        "澎湖尖山"      => "尖山",
        "烏山頭水力發電廠" => "烏山頭",
        "協和發電廠珠山分廠" => "珠山",
        "明潭抽蓄水力發電廠" => "明潭",
        "尖山發電廠" => "尖山",
        "清風清水風力發電站" => "清風清水",
        "后里圳低落差示範電廠" => "后里",
        "台中電廠風力發電站" => "台中港",
        "大潭風力發電站" => "大潭風力",
        "關山大圳小水力發電廠" => "捷祥關山",
        "中屯風力發電站" => "澎湖中屯",
        "金沙風力發電站" => "金門金沙",
        "林口發電廠" => "林口",
        "西口水力發電廠" => "嘉南西口",
        "八田水力發電廠" => "八田",
    ],


    "elecShortName" => ["苗栗通苑", "海洋竹南", "東鋼龍港", "崎威崎頂", "中威大安", "雲麥", "豐威", "觀園", "石門", "王功", "湖西", "永興", "台中港", "鹿威鹿港", "雲麥", "路北", "豐德", "豐威", "觀園", "大鵬", "恆春", "安威", "鹿威彰濱", "龍威後龍", "離岸一期", "","台中","和平","麥寮","海湖","新桃","大潭","國光","通霄","星元","彰濱","嘉惠","森霸","南部","協和","望安","七美","塔山","協和珠山分廠","綠島","東引","蘭嶼","南竿","興達","大林","高原","彰工","深澳","海渡","北部","松山火力發電所","澎湖","台東火力","成功火力","關山火力","旭光","虎井","北竿","萬里","牡丹小型水力","八田水力","卓蘭景山分廠","光明抽蓄計畫","桂山","大甲溪","東部","大觀","明潭","萬大","卓蘭","石門","曾文","高屏","蘭陽","東興","烏山頭水力","西口","卑南上圳小型","名間","西寶","溪畔","谷園","仲岳","豐坪溪","東錦","關山水力","太平", "四湖", "臺中港", "香山", "蘆竹", "竹南"],
];

$elecType = [
    "coal" => ["煤", "燃煤"],
    "lng" => ["天然氣"],
    "oil" => ["重油", "柴油", "燃料油", "柴油"],
    "wind" => ["風力"],
    "water" => ["水力", "溪", "圳", "抽蓄", "曾文發電廠", "高屏發電廠", "石門發電廠", "大觀發電廠", "萬里發電廠", "萬大發電廠", "桂山發電廠", "卓蘭發電廠", "東部發電廠", "蘭陽發電廠", "明潭發電廠", "東興發電廠"],
    "geothermal" => ["地熱"],
    "nuclear" => ["核"],
    "solar" => ["太陽", "光電"],
];

foreach($table as $_table) {
    if (trim($_table->find("tr",0)->find("th",0)->innertext) == "電廠名稱") {
        $tr = $_table->find("tr");
        $column = [];
        foreach($tr AS $tr_index => $_tr) {
            if (count($_tr->find("td")) > 0) {
                $_electInfo = $default;

                $td = $_tr->find("td");
                /* 比對欄位取出對應資料 */
                foreach ($td AS $td_index => $_td) {
                    $columnType = $column[$td_index];
                    switch ($columnType) {
                        case "name":
                            $_electInfo[$columnType] = $_td->innertext;
                            $url = $_td->find("a",0);
                            if (strpos($url->title, '不存在') === false) {
                                $_electInfo["url"] = $base_url.$_td->find("a",0)->href;
                            }

                            break;
                        case "photo":
                            if (count($_td->find("img")) > 0) {
                                $_electInfo["photo"] = urldecode(str_replace("100px","500px",$_td->find("img",0)->src));
                            }
                            break;
                        case "location":
                            $_electInfo["location"] = $_td->find("a",0)->innertext;
                            break;
                        case "org":
                            $_electInfo["org"] = $_td->innertext;
                            break;
                        case "amount":
                            $_electInfo["amount"] = $_td->innertext;
                            break;
                        case "status":
                            $_electInfo["status"] = $_td->innertext;
                            break;
                        case "type":
                            $_electInfo["type"] = $_td->innertext;
                            break;
                        case "note":
                            $_electInfo["note"] = $_td->innertext;
                            break;
                        case "capacity":
                            $_electInfo["capacity"] = $_td->plaintext;
                            break;
                    }
                }

                foreach ($_electInfo AS $key => $val) {
                    if (!empty($val)) {
                        $val = trim($val);
                        $val = strip_tags($val);
                        $val = preg_replace("/\&\#91\;[0-9]{1,}\&\#93\;/", "", $val);
                        $_electInfo[$key] = $val;
                    }
                }

                $_electInfo["name"] = trim($_electInfo["name"]);
                $_electInfo["name"] = preg_replace("/\&\#91\;[0-9]{1,}\&\#93\;/", "", $_electInfo["name"]);

                /* format info */
                if (@preg_match("/(?P<name>.{1,})（(?P<fullName>.{1,})）/", $_electInfo["name"], $match)) {
                    $_electInfo["name"] = trim($match["name"]);
                    $_electInfo["fullName"] = trim($match["fullName"]);
                } else {
                    $_electInfo["fullName"] = $_electInfo["name"];
                }

                if (isset($transKeyword["elecMapping"][$_electInfo["name"]])) {
                    $_electInfo["nickName"] = $transKeyword["elecMapping"][$_electInfo["name"]];
                } else {
                    $shortName = str_replace(["發電廠","電廠","景山分廠", "發電站"],"",$_electInfo["name"]);
                    $shortName = str_replace(["水力", "風力", "圳低落差示範", "苗栗", "金門"],"",$shortName);
                    if (in_array($shortName, $transKeyword["elecShortName"])){
                        $_electInfo["nickName"] = $shortName;
                    } else {
                         // echo $_electInfo["name"]."\n";
                    }
                }

                if (isset($transKeyword[$_electInfo["status"]])) {
                    $_electInfo["status"] = $transKeyword[$_electInfo["status"]];
                } else {
                    // echo $_electInfo["status"]."\n";
                }


                if (isset($transKeyword[$_electInfo["status"]])) {
                    $_electInfo["status"] = $transKeyword[$_electInfo["status"]];
                } else {
                    // echo "here". $_electInfo["status"]."\n";
                }

                /* 分析電廠類型 */
                if (empty($_electInfo["type"])) {
                    $_electInfo["type"] = [];
                    $detectName = implode("_", [$_electInfo['name'], $_electInfo['fullName'], $_electInfo['org'], $_electInfo['note']]);
                    foreach ($elecType AS $elecTypeKey => $elecTypeMatch) {
                        if (strposa($detectName, $elecTypeMatch) !== false) {
                            $_electInfo["type"][] = $elecTypeKey;
                            break;
                        }
                    }

                } else {
                    $tmpType = [];
                    $tmp = explode("<br />",$_electInfo["type"]);
                    foreach ($tmp AS $subType) {
                        $subType = trim($subType);
                        if (isset($transKeyword[$subType])) {
                            $tmpType[] = $transKeyword[$subType];
                        } else {
                            $tmpType[] = $_electInfo["type"]."\n";
                        }
                    }
                    $_electInfo["type"] = $tmpType;
                }
                $_electInfo["type"] = array_values(array_unique($_electInfo["type"]));


                /* 取得 gps */
                if (!empty($_electInfo["url"])) {
                    list($image, $geo) = getElectMoreInfo($_electInfo["url"]);
                    $_electInfo['photo'] = $image;
                    $_electInfo['geo'] = $geo;
                }

                $_electInfo["capacity"] = str_replace(",", "", $_electInfo["capacity"]);

                print_r($_electInfo);
                $electInfo[] = $_electInfo;

            } else if (count($_tr->find("th")) > 0) {
                /* 取得 table 標頭，作為欄位位置判定 */
                $th = $_tr->find("th");
                foreach ($th AS $_th) {
                    $str = trim(strip_tags($_th->innertext));
                    if (isset($transKeyword[$str])) {
                        $column[] = $transKeyword[$str];
                    } else {
                        $column[] = $str;
                    }
                }
                print_r($column);
            }
        }
    }
}

$electInfo[] = [
    "name" => "大甲溪發電廠",
    "url" => "https://zh.wikipedia.org/wiki/%E5%A4%A7%E7%94%B2%E6%BA%AA%E7%99%BC%E9%9B%BB%E5%BB%A0",
    "fullName" => "大甲溪發電廠",
    "nickName" => "大甲溪",
    "photo" => "//upload.wikimedia.org/wikipedia/commons/thumb/8/86/Tachiachi_Hydropower_Plant02.jpg/300px-Tachiachi_Hydropower_Plant02.jpg",
    "location" => "臺中市",
    "geo" => [
        "lat" => "24.184",
        "lng" => "120.9231",
    ],
    "org" => "臺灣電力公司",
    "amount" => "21",
    "capacity" => "1356.1",
    "status" => "online",
    "note" => "將大甲溪主流沿線上七座電廠及機組合併而成，自上游至下游依序為德基、青山、谷關、天輪（包括新天輪）、馬鞍、社寮及后里等",
    "water" => ["water"],
];

$electInfo[] = [
    "name" => "東部發電廠",
    "url" => "https://zh.wikipedia.org/wiki/%E5%A4%A7%E7%94%B2%E6%BA%AA%E7%99%BC%E9%9B%BB%E5%BB%A0",
    "fullName" => "東部發電廠",
    "nickName" => "東部",
    "photo" => "//upload.wikimedia.org/wikipedia/commons/thumb/0/09/Taiwan_power_Company_The_Eastern_Power_plant_HQ.jpg/300px-Taiwan_power_Company_The_Eastern_Power_plant_HQ.jpg",
    "location" => "花蓮縣",
    "geo" => [
        "lat" => "23.9788",
        "lng" => "121.6043",
    ],
    "org" => "臺灣電力公司",
    "amount" => "16",
    "capacity" => "244.2",
    "status" => "online",
    "note" => "目前管轄分布於花蓮縣境內共11處的發電機組，旗下所管理之發電機組主要集中在花蓮溪支流木瓜溪沿線，僅溪口機組、立霧機組與碧海機組分別位於壽豐溪、立霧溪與和平溪流域。總計旗下共有11個廠、17部機組，總裝置容量到達244.2MW。",
    "water" => ["water"],
];



save("../log/powerPlant.log", $electInfo);

function getElectMoreInfo($url) {
    $html = file_get_contents($url);

    $html = str_get_html($html);
    $infoBox = $html->find('.infobox', 0);
    $image = '';
    $geo = false;
    if (!empty($infoBox->find('a.image img', 0))) {
        $image = $infoBox->find('img', 0)->src;
    }

    if (!empty($infoBox->find('.geo-nondefault .geo-dec', 0))) {
        $geo_str = $infoBox->find('.geo-nondefault .geo-dec', 0)->innertext;


        if (@preg_match("/(?P<lat>.{1,})°N (?P<lng>.{1,})°E/", $geo_str, $match)) {
            $geo['lat'] = trim($match["lat"]);
            $geo['lng'] = trim($match["lng"]);
        }
    }

    return [$image, $geo];
}

exit();

// foreach($table as $_table) {
//     if (trim($_table->find("tr",0)->find("th",0)->innertext) == "電廠名稱") {
//         $tr = $_table->find("tr");

//         $column = [];
//         foreach($tr AS $_tr) {
//             if (count($_tr->find("td")) > 0) {
//                 $_electInfo = $default;
//                 $td = $_tr->find("td");
//                 foreach ($td AS $key => $_td) {
//                     $columnType = $column[$key];
//                     switch ($columnType) {
//                         case "name":
//                             $_electInfo[$columnType] = strip_tags($_td->innertext);
//                             $_electInfo["url"] = $base_url.$_td->find("a",0)->href;
//                             break;
//                         case "photo":
//                             $_electInfo["photo"] = urldecode(str_replace("100px","500px",$_td->find("img",0)->src));
//                             break;
//                         case "location":
//                             $_electInfo["location"] = $_td->find("a",0)->innertext;
//                             break;
//                         case "org":
//                             $_electInfo["org"] = $_td->innertext;
//                             break;
//                         case "amount":
//                             $_electInfo["amount"] = $_td->innertext;
//                             break;
//                         case "status":
//                             $_electInfo["status"] = $_td->innertext;
//                             break;
//                         case "type":
//                             $_electInfo["type"] = $_td->innertext;
//                             break;
//                         case "note":
//                             $_electInfo["note"] = $_td->innertext;
//                             break;
//                         case "capacity":
//                             $_electInfo["capacity"] = $_td->innertext;
//                             break;
//                     }
//                 }

//                 $_electInfo["name"] = trim($_electInfo["name"]);
//                 /* format info */
//                 if (@preg_match("/(?P<name>.{1,})（(?P<fullName>.{1,})）/", $_electInfo["name"], $match)) {
//                     $_electInfo["name"] = trim($match["name"]);
//                     $_electInfo["fullName"] = trim($match["fullName"]);
//                 } else {
//                     $_electInfo["fullName"] = $_electInfo["name"];
//                 }

//                 if (isset($transKeyword["elecMapping"][$_electInfo["name"]])) {
//                     $_electInfo["nickName"] = $transKeyword["elecMapping"][$_electInfo["name"]];
//                 } else {
//                     $shortName = str_replace(["發電廠","電廠","景山分廠"],"",$_electInfo["name"]);
//                     $shortName = str_replace(["水力"],"",$shortName);
//                     if (in_array($shortName, $transKeyword["elecShortName"])){
//                         $_electInfo["nickName"] = $shortName;
//                     } else {
//                          // echo $_electInfo["name"]."\n";
//                     }
//                 }

//                 if (isset($transKeyword[$_electInfo["status"]])) {
//                     $_electInfo["status"] = $transKeyword[$_electInfo["status"]];
//                 } else {
//                     // echo $_electInfo["status"]."\n";
//                 }

//                 if (empty($_electInfo["type"])) {
//                     if (strpos($_electInfo["name"],"核") !== false) {
//                         $_electInfo["type"] = ["nuclear"];
//                     } else {
//                         $_electInfo["type"] = ["water"];
//                     }
//                 } else {
//                     $tmpType = [];
//                     $tmp = explode("<br />",$_electInfo["type"]);

//                     foreach ($tmp AS $subType) {
//                         $subType = trim($subType);
//                         if (isset($transKeyword[$subType])) {
//                             $tmpType[]=$transKeyword[$subType];
//                         } else {
//                             $tmpType[]=$_electInfo["type"]."\n";
//                         }
//                     }
//                     $_electInfo["type"] = $tmpType;
//                 }

//                 if (strposa($_electInfo["note"],["風"])!==false) {
//                     $_electInfo["type"][] = "wind";
//                 }


//                 $electInfo[] = $_electInfo;
//             } else if (count($_tr->find("th")) > 0) {
//                 $th = $_tr->find("th");
//                 foreach ($th AS $_th) {
//                     $str = strip_tags($_th->innertext);
//                     if (isset($transKeyword[$str])) {
//                         $column[] = $transKeyword[$str];
//                     } else {
//                         $column[] = $str;
//                     }
//                 }
//             }
//         }
//     }
// }

// print_r($electInfo);exit();

// save("../log/powerPlant.log", $electInfo);

// function save($path, $data) {
//     $dir = dirname(__FILE__)."/";

//     $path = explode("/",$path);
//     $checkPath = [];
//     for ($i = 0; $i < count($path) -1 ; $i++) {
//         $checkPath[] = $path[$i];
//         $folderPath = $dir.implode("/",$checkPath);
//         if (!file_exists($folderPath)) {
//             mkdir($folderPath, 0777, true);
//         }
//     }

//     $file = fopen(implode("/",$path),"w");
//     fwrite($file,json_encode($data));
// }


// function strposa($haystack, $needles=array(), $offset=0) {
//         $chr = array();
//         foreach($needles as $needle) {
//                 $res = strpos($haystack, $needle, $offset);
//                 if ($res !== false) $chr[$needle] = $res;
//         }
//         if(empty($chr)) return false;
//         return min($chr);
// }