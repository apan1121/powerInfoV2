<?php
include("func.php");
require '../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
date_default_timezone_set('Asia/Taipei');


$powerInfoPath = "../log/powerInfo.log";
$powerUnitRecord = "../log/record/{unitKey}.log";

$target_date = date('Y-m-d H');

$target_minute = floor(date('i') / 10) * 10;
$target_date = $target_date.":".$target_minute;

$prev_powerInfo = [];
$prev_record = get($powerInfoPath);
if ($prev_record['time'] === $target_date) {
    echo "{$prev_record['time']} <-> {$target_date} 已經處理過\n";
    exit();
}

$twOpenDataError = get("../log/tw_open_data_error.log");

$dir = dirname(__FILE__)."/";

$now = time();

$SOURCE_URL = SOURCE_URL . "?v=".$now;

$url = "https://service.taipower.com.tw/data/opendata/apply/file/d006001/001.json";
// $url = "https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/genary.json";
if (!empty($twOpenDataError)) {
    $url = $SOURCE_URL;
}
$data = getUrl($url);
if (empty($data) || empty($data[""]) || ($now - strtotime($data[""])) >= 1200 ) {
    echo "TW Open Data 取得失敗，改使用 台電 json\n";
    print_r([
        $data[""] ?? '',
        date('Y-m-d H:i:s'),
        ($now - strtotime($data[""] || '')),
    ]);
    $url = $SOURCE_URL;
    $data = getUrl($url);

    /* 如果 openDataError 為空，寫入錯誤時間 */
    if (empty($twOpenDataError)) {
        save("../log/tw_open_data_error.log", ['error_date' => date('Y-m-d H:i:s')]);
    }
}
// print_r($data);exit();

$format_type = "open_data";
if (strpos($url, 'data.taipower.com.tw') !== false) {
    $format_type = "open_data";
} elseif(strpos($url, 'www.taipower.com.tw') !== false) {
    $format_type = "taipower";
} else {
    $format_type = "taipower";
}


/* 如果 openDataError 不為空，檢查時間有沒有超過一個小時，如果超過，刪除檔案，下一次重新使用 open Data */
if (!empty($twOpenDataError) && strtotime($twOpenDataError['error_date'])  + 3600  <= time()) {
    del("../log/tw_open_data_error.log");
}

// $ch = curl_init();
// // $url = "http://data.taipower.com.tw/opendata01/apply/file/d006001/001.txt";
// $url = "https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/genary.json";
// curl_setopt($ch, CURLOPT_URL, $url);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// $data = curl_exec($ch);
// if (empty($data)) {
//     $data = file_get_contents($url);
// }
// curl_close($ch);

// $data = @json_decode($data, true);

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
    "其它再生能源" => "other renewable energy",
    // "全部" => "all",
];

$powerTypesMapping = [];
foreach ($powerTypes AS $key => $val) {
    $powerTypesMapping[$val] = $key;
}

$powerStatusMapping = [
    "online" => '商轉中',
    "break" => '故障機組',
    "limit" => '限轉機組',
    "fix" => '待修機組',
];

$powerStatus = [
    "fix" => ["輔機檢修", "環保停機(檢修)", "歲修", "檢修", "機組安檢", "維修"],
    "limit" => ["降載", "排砂", "減排", "水文限制", "燃料限制", "環保限制", "空污減載", "運轉限制", "EOH限制", "合約限制", "電源線限制", "外溫高限制", "測試運轉", "綠電先行", "新機組試俥"],
    "break" => ["停機", "故障", "通訊異常"],
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
$AlarmReduceRecords = [];
// $data = "";
if (empty($data)) {
    echo "跳出警告 \n";
    sendErrorMail("[警告] 無法取得電力資訊", "無法取得 電力資訊，請檢查 {$url} 是否正常。", OWNER_MAIL);
} else {

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

    if ($recordTime === $prev_record['time']) {
        echo "{$recordTime} 已經處理過 \n";
        exit();
    }



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

        switch ($format_type) {
            case 'taipower':
                list($powerData["type"], $__, $powerData["name"], $powerData["capacity"], $powerData["used"], $powerData["percent"], $powerData["note"] ) = $item;
                $powerData["type"] = $powerData["type"];
                break;
            default:
            case 'open_data':
                list($powerData["type"], $powerData["name"], $powerData["capacity"], $powerData["used"], $powerData["percent"], $powerData["note"] ) = $item;
                break;
        }


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

        $tryMappingName = str_replace(["CC","GT","Gas1","Gas2","Gas1&2","Gas3&4","&amp;","生水池","#1&#2", "&2"],"",$powerData["name"]);


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
        $powerData["type"] = strip_tags($powerData["type"]);
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
                    $mail = true;
                    switch ($diffKey) {
                        case 'status':
                            if ($powerData[$diffKey] === 'online') {
                                $mail = false;
                            }
                            break;
                        case 'note':
                            if (empty(trim($powerData[$diffKey]))) {
                                $mail = false;
                            }
                            break;
                    }

                    if ($powerData['gov'] == 0) {
                        $mail = false;
                    }

                    $NoticeRecords[] = [
                        'name' => $powerData['name'],
                        'type' => $powerData['type'],
                        'unitKey' => $unitKey,
                        'diff_type' => $diffKey,
                        'newVal' => $powerData[$diffKey],
                        'oldVal' => $pre_powerData[$diffKey],
                        'note' => '',
                        'recordTime' => $recordTime,
                        'mail'  => $mail,
                    ];
                }
            }


            /* 排除 風力 太陽能 抽蓄負載 */
            if (!in_array($powerData['type'], ['wind', 'solar', 'pumping load', 'co-gen', 'hydro', 'geothermal'])) {
                $newUsed = $powerData['used'];
                $oldUsed = $pre_powerData['used'];
                $capacity = $powerData['capacity'];

                $limitUsedPercent = 10;
                switch ($powerData['type']) {
                    case 'lng':
                        if ($powerData['gov'] == 1) {
                            $limitUsedPercent = 40;
                        } else {
                            $limitUsedPercent = 60;
                        }
                        break;
                    case 'diesel':
                        $limitUsedPercent = 40;
                        break;
                    case 'oil':
                        $limitUsedPercent = 20;
                        break;
                    case 'coal':
                        $limitUsedPercent = 20;
                        break;
                }

                $diff = $newUsed - $oldUsed;
                $diffPercent = 0;
                if ($capacity != 0) {
                    $diffPercent = round(($diff / $capacity) * 100, 2);
                }

                $mail = true;
                if ($powerData['gov'] == 0) {
                    $mail = false;
                }

                if ($diffPercent < 0 && abs($diffPercent) > $limitUsedPercent) {
                    $NoticeRecords[] = [
                        'name' => $powerData['name'],
                        'type' => $powerData['type'],
                        'unitKey' => $unitKey,
                        'diff_type' => 'used',
                        'newVal' => $powerData['used'],
                        'oldVal' => $pre_powerData['used'],
                        'note' => "降載超過 {$limitUsedPercent} %，降載 ".abs($diffPercent) ." %",
                        'recordTime' => $recordTime,
                        'mail' => $mail,
                    ];
                }

                if ($diffPercent < 0) {
                    $AlarmReduceRecords[] = [
                        'name' => $powerData['name'],
                        'type' => $powerData['type'],
                        'unitKey' => $unitKey,
                        'diff_type' => 'used',
                        'newVal' => $powerData['used'],
                        'oldVal' => $pre_powerData['used'],
                        'note' => "降載 ".abs($diffPercent) ." %",
                    ];
                }



                // if ($oldUsed === 0 && $newUsed > 0) {
                //     $NoticeRecords[] = [
                //         'name' => $powerData['name'],
                //         'type' => $powerData['type'],
                //         'unitKey' => $unitKey,
                //         'diff_type' => 'used',
                //         'newVal' => $powerData['used'],
                //         'oldVal' => $pre_powerData['used'],
                //         'note' => "機組啟動",
                //         'recordTime' => $recordTime,
                //     ];
                // }
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
    // print_r($powerInfo);exit();

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
        $orgNoticeRecords =  get($powerNoticePath);
        $orgNoticeRecords = array_merge($orgNoticeRecords, $NoticeRecords);

        $orgNoticeRecords = array_filter($orgNoticeRecords, function($recordInfo) use ($UnitRecordLimitTimestamp){
            $flag = false;
            $timestamp = strtotime($recordInfo['recordTime'] ?? '2000-01-01');
            if ($UnitRecordLimitTimestamp < $timestamp) {
                $flag = true;
            }
            return $flag;
        });
        $orgNoticeRecords = array_values($orgNoticeRecords);
        save($powerNoticePath, $orgNoticeRecords);

        $NoticeRecords = array_values(array_filter($NoticeRecords, function($item){
            return $item['mail'];
        }));

        sendNoticeRecordMail($NoticeRecords, NOTICE_MAIL);
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

        $end_date_timestamp = strtotime(date("Y-m-d", strtotime("{$recordTime}:00")));
        $start_date_timestamp = $end_date_timestamp - (86400 * SUMMARY_DAYS);

        for ($i = $start_date_timestamp; $i <= $end_date_timestamp; $i += 86400)  {
            $getTargetDate = date('Y-m-d', $i);
            // echo $getTargetDate."\n";
            $summaryData = get("../log/history/{$getTargetDate}/summary.log");
            if (!empty($summaryData)) {
                // echo "get \n";
                $totalSummary = array_merge($totalSummary, $summaryData);
            }
        }

        save("../log/summary.log", $totalSummary);

        // 警示檢查，前後資料差距多少
        if (1) {
            $dateKeys = array_keys($totalSummary);
            if (count($dateKeys) >= 2) {
                $dateKeys = array_splice($dateKeys, -2, 2);
                $dateKeysValue = [];
                foreach ($dateKeys AS $index => $dateKey) {
                    $tmpData = $totalSummary[$dateKey];
                    $_used = 0;
                    foreach ($tmpData AS $_tmpData) {
                        $_used += $_tmpData['used'];
                    }
                    $dateKeysValue[$index] = $_used;
                }
                $diff = $dateKeysValue[1] - $dateKeysValue[0];
                if ($diff < DIFF_TOTAL_USED_LIMIT) {
                    $dateAlarmFile = "../log/alarm.log";
                    $alarmData = get($dateAlarmFile);
                    if (empty($alarmData)) {
                        $summaryData = [];
                    }
                    $diff_records = [];
                    foreach($dateKeys AS $dateKey) {
                        $diff_records[$dateKey] = $totalSummary[$dateKey] ?? [];
                    }
                    $alarmData[] = [
                        'time' => $recordTime,
                        'DIFF_TOTAL_USED_LIMIT' => DIFF_TOTAL_USED_LIMIT,
                        'diff_used' => $diff,
                        'diff_records'=> $diff_records,
                        'reduce_records' => $AlarmReduceRecords,
                    ];
                    usort($alarmData, function($a, $b){
                        if ($a['time'] > $b['time']) {
                            return 1;
                        } else if ($a['time'] === $b['time']) {
                            return 0;
                        } else {
                            return -1;
                        }
                    });

                    save($dateAlarmFile, $alarmData);
                }

            }
        }
    }

    if (1) {
        $max_used_path = "../log/statistics/max_used/{year}.log";
        /* 紀錄每日最大使用量 */
        $dir = str_replace("{year}", date('Y', strtotime($recordTime)), $max_used_path);
        $max_used_record = get($dir, []);
        $formatSummaryInfo = [];
        $max_used_total = 0;
        foreach ($summaryInfo AS $key => $tmpRecord) {
            $formatSummaryInfo[$key] = $tmpRecord['used'] + 0;
            $max_used_total += $formatSummaryInfo[$key];
        }

        $formatDate = date('Y-m-d', strtotime($recordTime));

        if (empty($max_used_record[$formatDate]) || $max_used_record[$formatDate]["maxUsed"] <= $max_used_total) {
            $max_used_record[$formatDate] = [
                "time" => $recordTime,
                "record" => $formatSummaryInfo,
                "maxUsed" => round($max_used_total, 2),
            ];
        }

        save($dir, $max_used_record);

        $max_used_record = [];
        $endYear = date('Y', strtotime($recordTime));
        $limit_date_timestamp = strtotime($recordTime) - 86400 * 360;
        for ($year = $endYear - 1; $year <= $endYear; $year+=1) {
            $dir = str_replace("{year}", $year, $max_used_path);
            $_max_used_record = get($dir, []);
            foreach ($_max_used_record AS $date => $tmpRecord ) {
                if ($limit_date_timestamp <= strtotime($date)) {
                    $max_used_record[$date] = $tmpRecord;
                }
            }
        }
        save("../log/maxUsed.log", $max_used_record);
    }
}

function getUrl($url){
    echo "curl: {$url} \n";
    // $url = "http://data.taipower.com.tw/opendata01/apply/file/d006001/001.txt";
    // $url = "https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/genary.json";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $data = curl_exec($ch);
    if (empty($data)) {
        echo "curl 失敗，改 file_get_contents: {$url} \n";
        $data = @file_get_contents($url);
    }
    curl_close($ch);

    $data = @json_decode($data, true);
    return $data;
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

function getMailer(){
    $mail = new PHPMailer(true);
    //Server settings
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = SMTP_Host;                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = SMTP_Username;                     //SMTP username
    $mail->Password   = SMTP_Password;                               //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         //Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
    $mail->Port       = 587;
    $mail->CharSet="UTF-8";                                  //TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

    //Recipients
    $mail->setFrom(FROM_EMAIL, FROM_NAME);

    //Content
    $mail->isHTML(true);
    return $mail;
}

function sendErrorMail($subject, $content, $recipient){
    $mail = getMailer();
    foreach ($recipient AS $_recipient) {
        $mail->addAddress($_recipient['email'], $_recipient['name']);     //Add a recipient        //Name is optional
    }

                                 //Set email format to HTML
    $mail->Subject = $subject;
    $mail->Body    = $content;
    $mail->AltBody = $content;

    $mail->send();

}

function sendNoticeRecordMail($noticeRecord, $recipient){
    global $powerTypesMapping, $powerStatusMapping;


    $diffTypeMapping = [
        'used' => '已發電量',
        'status' => '機組狀態',
        'note' => '備註',
    ];

    if (!empty($noticeRecord)) {
        /**
            Array
            (
                [0] => Array
                    (
                        [name] => 核二#1
                        [unitKey] => 核二#1_nuclear
                        [type] => status
                        [newVal] => online
                        [oldVal] => fix
                        ['note'] =>
                        [recordTime] => 2021-05-25 09:50
                    )

            )
         */
        $mail = getMailer();
        foreach ($recipient as $_recipient) {
            $mail->addBCC($_recipient['email'], $_recipient['name']);     //Add a recipient        //Name is optional
        }

        $AltBody = [];

        $html = [];
        $html[] = "<table style='width: 100%;' border='1' cellspacing='0' cellpadding='5'>";

        foreach ($noticeRecord as $i => $_noticeRecord) {
            if ($i % 10 === 0) {
                $html[] = "
                    <tr style='background: #666; color: #FFF;'>
                        <th style='width: 120px;'>時間</th>
                        <th style='width: 100px;'>機組名稱</th>
                        <th style='width: 100px;'>發電類型</th>
                        <th style='width: 80px;'>變動項目</th>
                        <th>舊值</th>
                        <th>新值</th>
                        <th>備註</th>
                    </tr>
                ";
            }



            $style = ($i % 2) ? 'background:#DDD': '';

            $diff_type = $diffTypeMapping[$_noticeRecord['diff_type']];


            $newVal = $_noticeRecord['newVal'];
            $oldVal = $_noticeRecord['oldVal'];

            switch ($_noticeRecord['diff_type']) {
                case 'status':
                    $diff_type = '運轉狀態';
                    $newVal = $powerStatusMapping[$newVal] ?? $newVal;
                    $oldVal = $powerStatusMapping[$oldVal] ?? $oldVal;
                    break;
                case 'notice':
                    $diff_type = '備註';
                    break;
            }

            $link = WEB_DOMAIN."/#/?unit_key=".urlencode($_noticeRecord['unitKey']);

            $html[] = "
                <tr style='{$style}'>
                    <td>{$_noticeRecord['recordTime']}</td>
                    <td><a href='{$link}' target='_blank' style='text-decoration: none;'>{$_noticeRecord['name']}</a></td>
                    <td>{$powerTypesMapping[$_noticeRecord['type']]}</td>
                    <td>{$diff_type}</td>
                    <td>{$oldVal}</td>
                    <td>{$newVal}</td>
                    <td>{$_noticeRecord['note']}</td>
                </tr>
            ";

            $AltBody[] = "{$_noticeRecord['recordTime']},{$_noticeRecord['name']},{$_noticeRecord['type']},{$_noticeRecord['newVal']},{$_noticeRecord['oldVal']};";
        }
        $html[] = "</table>";

        $html = implode("\n", $html);
        $AltBody = implode("\n", $AltBody);

        //Set email format to HTML
        $mail->Subject = "電力資料異動警告";
        $mail->Body    = $html;
        $mail->AltBody = $AltBody;

        $mail->send();
    }
}