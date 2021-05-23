<?php
include("func.php");

$dir = dirname(__FILE__)."/";

$ch = curl_init();
$url = "http://data.taipower.com.tw/opendata01/apply/file/d006001/001.txt";
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$data = curl_exec($ch);
if (empty($data)) {
    $data = file_get_contents("http://data.taipower.com.tw/opendata01/apply/file/d006001/001.txt");
}
curl_close($ch);

$data = @json_decode($data, true);

$summaryInfo = [];
define("SUMMARY_DAYS", 15);

$mappingPowerNameStorage = [
    "大潭CC" => ["大潭"],
    "澎湖尖山" => ["尖山"],
    "金門塔山" => ["塔山"],
    "馬祖珠山" => ["珠山","南竿","北竿"],
    "離島其他" => ["離島","蘭嶼","綠島","旭光","東引","七美","望安","虎井"],
    "嘉南西口嘉南烏山頭" => ["烏山頭"],
    "澎湖湖西" => ["湖西"],
    "苗栗竹南" => ["竹南"],
    "苗栗大鵬" => ["大鵬"],
    "鹿威鹿港" => ["鹿威"],

    "青山" => ["大甲溪"],
    "德基" => ["大甲溪"],
    "谷關" => ["大甲溪"],
    "天輪" => ["大甲溪"],
    "馬鞍" => ["大甲溪"],
    "松林" => ["萬大"],
    "大觀一" => ["大觀"],
    "大觀二" => ["大觀"],
    "鉅工" => ["明潭"],
    "水里" => ["明潭"],
    "立霧" => ["東部"],
    "龍澗" => ["東部"],
    "碧海" => ["東部"],
    "烏來桂山粗坑" => ["桂山"],
    "翡翠" => ["桂山"],
    "義興" => ["石門"],
    "后里示範" => ["大甲溪"],
    "后里" => ["大甲溪"],
    "卑南" => ["卑南上圳小型"],
    "北部小水力"=> ["蘭陽","桂山"],
    "中部小水力"=> ["大甲溪","明潭"],
    "南部小水力"=> ["高屏","明潭"],
    "東部小水力"=> ["東部"],
    "台中2" => ["台中"],
    "台中Gas34" => ["台中"],
];

$powerTypes = [
    "核能" => "nuclear",
    "燃煤" => "coal",
    "汽電共生" => "co-gen",
    "天然氣" => "lng",
    "燃氣" => "lng",
    "燃油" => "oil",
    "輕油" => "diesel",
    "水力" => "hydro",
    "風力" => "wind",
    "地熱" => "geothermal",
    "抽蓄發電" => "pumping gen",
    "抽蓄負載" => "pumping load",
    "太陽能" => "solar",
    "民營電廠-燃煤" => "ipp-coal",
    "民營電廠-燃氣" => "ipp-lng",
    // "全部" => "all",
];

$powerStatus = [
    "fix" => ["輔機檢修", "環保停機(檢修)", "歲修", "檢修", "機組安檢", "維修"],
    "limit" => ["降載", "減排", "水文限制", "燃料限制", "環保限制", "空污減載", "運轉限制", "EOH限制", "合約限制", "電源線限制", "外溫高限制", "測試運轉", "綠電先行"],
    "break" => ["停機", "故障"],
];


$summaryInfo = [];
foreach ($powerTypes AS $powerType) {
    $summaryInfo[$powerType] = [
        "cap" => 0,
        "used" => 0,
        "limit" => 0,
        "fix" => 0,
        "break" => 0,
    ];
}

$NoticeRecords = [];
if (empty($data)) {
    echo "跳出警告 \n";

} else {
    $powerInfoPath = "../log/powerInfo.log";
    $powerUnitRecord = "../log/record/{unitKey}.log";

    $prev_powerInfo = [];
    $prev_record = get($powerInfoPath);
    if (!empty($prev_record['info'])) {
        foreach ($prev_record['info'] AS $unit_info) {
            $unitKey = formatUnitKey($unit_info);
            $prev_powerInfo[$unitKey] = $unit_info;
        }
    }

    $recordTime = $data[""];
    $recordTime = date("Y-m-d H:i", strtotime($recordTime));
    $UnitRecordLimitTimestamp = strtotime($recordTime) - (86400 * 2);
    echo $recordTime."\n";
    $rawPowerInfo = $data["aaData"];

    $powerInfo = [];

    $unitKeys = [];
    foreach ($rawPowerInfo AS $item) {
        $powerData = [
            "type" => "",
            "name" => "",
            "unit_id" => "",
            "mappingName" => [],
            "capacity" => "",
            "used" => "",
            "percent" => "",
            "gov"  => true, //官方電廠
            "status" => "online",
            "note" => "",
            "noteId" => "",
            "records" => [],
        ];

        list($powerData["type"], $powerData["name"], $powerData["capacity"], $powerData["used"], $powerData["percent"], $powerData["note"] ) = $item;

        /* 小計資料不處理 */
        if (strpos(trim($powerData["name"]),"小計")!==false) {
            continue;
        }


        foreach ($powerData AS $key => $val) {
            if (!empty($val)) {
                $powerData[$key] = strip_tags(html_entity_decode(trim($val)));
            }
        }


        /* 取得 noteid */
        if (preg_match("/(?P<mappingName>.{1,})\(註(?P<noteId>[0-9]{1,})\)/", $powerData["name"], $match)) {
            $powerData["name"] = $match["mappingName"];
            $powerData["noteId"] = $match["noteId"];
        }

        /* 移除所有網頁標籤 */
        // echo $powerData["name"]."\n";

        $tryMappingName = str_replace(["CC","Gas1","Gas2","Gas1&2","Gas3&4","&amp;","生水池","#1&#2", "&2"],"",$powerData["name"]);


        /* 從名字中取出可能的對應電廠 */
        if (preg_match("/(?P<mappingName>.{1,})#(?P<unit_id>[0-9]{1,})/", $tryMappingName, $match)) {
            $tryMappingName = trim($match["mappingName"]);
            $tryMappingName = htmlspecialchars($tryMappingName);

            if (isset($mappingPowerNameStorage[$tryMappingName])) {
                $powerData["mappingName"] = $mappingPowerNameStorage[$tryMappingName];
            } else {
                $powerData["mappingName"] = [$tryMappingName];
            }
            $powerData["unit_id"] = $match["unit_id"];
        } else if (preg_match("/(?P<mappingName>.{1,})\(/", $tryMappingName, $match)) {
            $tryMappingName = trim($match["mappingName"]);

            if (isset($mappingPowerNameStorage[$tryMappingName])) {
                $powerData["mappingName"] = $mappingPowerNameStorage[$tryMappingName];
            } else {
                $powerData["mappingName"] = [$tryMappingName];
            }
        } else {
            $tryMappingName = trim($tryMappingName);
            if (isset($mappingPowerNameStorage[$tryMappingName])) {
                $powerData["mappingName"] = $mappingPowerNameStorage[$tryMappingName];
            } else {
                $powerData["mappingName"] = [$tryMappingName];
            }
        }


        /* 類型正規化成英文 */
        if (preg_match("/\((?P<type>[a-zA-Z-\s]{1,})\)/", $powerData["type"], $match)) {
            $powerData["type"] = strtolower($match["type"]);
        } else if (isset($powerTypes[$powerData["type"]])){
            $powerData["type"] = strtolower($powerTypes[$powerData["type"]]);
        }


        /* 政府民間？ */
        if (strpos(strtolower($powerData["type"]), "ipp-") !== false) {
            $powerData["type"] = str_replace(["IPP-","ipp-"],"",$powerData["type"]);
            $powerData["gov"] = false;
        }

        /* 可發電量與使用量數字化 */
        if (is_numeric($powerData["capacity"])) {
            $powerData["capacity"] = floatval($powerData["capacity"]);
        } else {
            $powerData["capacity"] = 0;
        }

        if (is_numeric($powerData["used"])) {
            $powerData["used"] = floatval($powerData["used"]);
        } else {
            $powerData["used"] = 0;
        }

        /* 機組平均發電量 */
        if (is_numeric($powerData["capacity"]) && $powerData["capacity"]> 0) {
            $powerData["percent"] = ($powerData["used"] / $powerData["capacity"]) * 100 ;
        } else {
            $powerData["percent"] = 0;
        }
        if (!is_numeric($powerData["percent"])) {
            $powerData["percent"] = 0;
        } else {
            $powerData["percent"] = round($powerData["percent"], 2);
        }

        if (!empty($powerData["note"])) {
            $tmp_status_key = "";
            foreach ($powerStatus AS $status_key => $type_str_arr ) {
                if (strposa($powerData["note"], $type_str_arr) !== false) {
                    $tmp_status_key = $status_key;
                    break;
                }
            }

            if ($powerData["used"] > 0) {
                $tmp_status_key = "online";
            }

            $powerData["status"] = $tmp_status_key;
        }

        switch ($powerData["status"]) {
            case "fix":
                $summaryInfo[$powerData["type"]]["fix"] += round($powerData["capacity"],4);
                break;
            case "limit":
                $summaryInfo[$powerData["type"]]["limit"] += round($powerData["capacity"],4);
                break;
            case "break":
                $summaryInfo[$powerData["type"]]["break"] += round($powerData["capacity"],4);
                break;
            default:
                $summaryInfo[$powerData["type"]]["cap"] += round($powerData["capacity"],4);
                $summaryInfo[$powerData["type"]]["used"] += round($powerData["used"],4);
                break;
        }

        $unitKey = [];
        $unitKey[] = $powerData['name'];
        $unitKey[] = $powerData['type'];
        $unitKey = implode("_", $unitKey);
        $unitKey = formatUnitKey($powerData);
        $powerData['key'] = $unitKey;

        $unitKeys[] = $unitKey;

        $pre_powerData =  false;
        if (isset($prev_powerInfo[$unitKey])) {
            $pre_powerData = $prev_powerInfo[$unitKey];
        }


        $records = [];
        if (!empty($pre_powerData)) {
            $tmpPowerUnitRecord = $powerUnitRecord;
            $tmpPowerUnitRecord = str_replace("{unitKey}", $unitKey, $tmpPowerUnitRecord);
            if (!empty($pre_powerData['records']) && is_array($pre_powerData['records'])) {
                $records = $pre_powerData['records'];
            } else {
                $records = get($tmpPowerUnitRecord);
                if (empty($records)) {
                    $records = [];
                }
            }

            foreach (['status', 'note'] AS $diffKey) {
                if ($powerData[$diffKey] !== $pre_powerData[$diffKey]) {
                    $NoticeRecords[] = [
                        'name' => $powerData['name'],
                        'record_type' => 'change',
                        'type' => $powerData["type"],
                        'newVal' => $powerData[$diffKey],
                        'oldVal' => $pre_powerData[$diffKey],
                    ];
                }
            }

            if ($pre_powerData['used'] == 0 && $powerData['used'] > 0) {

                $NoticeRecords[] = [
                    'name' => $powerData['name'],
                    'record_type' => 'unit_run',
                    'type' => $powerData["type"],
                    'newVal' => $powerData['used'],
                    'oldVal' => $pre_powerData['used'],
                ];
            }
        }

        foreach (array_keys($records) AS $dateTime) {
            if (strtotime($dateTime) < $UnitRecordLimitTimestamp || $records[$dateTime] === 0) {
                unset($records[$dateTime]);
            }
        }
        $records[$recordTime] = $powerData['used'];

        save($tmpPowerUnitRecord, $records);
        // $powerData['records'] = $records;
        unset($powerData['records']);

        $powerInfo[] = $powerData;
    }


    /* 儲存當前資料與歷史資料 */
    if (1) {
        $output = [
            "time" => $recordTime,
            "info" => $powerInfo
        ];
        save($powerInfoPath, $output);

        foreach ($output["info"] AS $key => $tmpPowerInfo) {
            unset($tmpPowerInfo['records']);
            $output["info"][$key] = $tmpPowerInfo;
        }

        $record_path = str_replace(" ", "/", str_replace(":", "_", $recordTime)).".log";
        save("../log/history/". $record_path, $output);


        $powerNoticePath = "../log/noticeRecord.log";
        save($powerNoticePath, $NoticeRecords);
    }

    if (1) {
        /* 重新把數字變成文字避免 json 數字溢位問題 */
        foreach ($summaryInfo AS $key => &$item) {
            foreach (["cap", "used", "fix", "limit", "break"] AS $type) {
                $item[$type] = round($item[$type], 2)  ."";
            }
        }

        /* 嘗試取出本日 summary 資料，並加入剛剛計入的結果 */
        list($date, $time) = explode(" ", $recordTime);
        $dateSummaryFile = "../log/history/{$date}/summary.log";
        $summaryData =  get($dateSummaryFile);
        if (empty($summaryData)) {
            $summaryData = [];
        }

        $summaryData[$recordTime] = $summaryInfo;
        save($dateSummaryFile, $summaryData);
    }

    if (1) {
        $totalSummary = [];
        /* 從歷史資料夾中取出倒數 $summaryDays 天的 summary 紀錄並合併資料 */
        $folderNames = array_reverse(scandir("../log/history/"));
        for ($i = 0; $i < SUMMARY_DAYS; $i++) {
            if (strpos($folderNames[$i],".") !== false) {
                break;
            }

            $summaryData = get("../log/history/{$folderNames[$i]}/summary.log");
            $totalSummary = array_merge($totalSummary, $summaryData);
        }

        save("../log/summary.log", $totalSummary);
    }

}


function formatUnitKey($unitInfo){
    $unitKey = [];
    $name = str_replace("/", "", $unitInfo['name']);
    $name = str_replace("&", "", $name);
    $unitKey[] = $name;

    $type = str_replace("", "-", $unitInfo['type']);
    $unitKey[] = $type;

    $unitKey = implode("_", $unitKey);
    return $unitKey;
}