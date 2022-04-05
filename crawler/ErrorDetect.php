<?php
// $records = @json_decode(file_get_contents('https://apan1121.github.io/powerInfoV2/log/summary.log'),true);
$start_time = strtotime('2022-01-01');
$end_time = time();

$records = [];
for ($target_time = $start_time; $target_time <=$end_time; $target_time += 86400) {
    $tmpTime = date('Y-m-d', $target_time);
    $tmpRecords = @json_decode(file_get_contents("https://apan1121.github.io/powerInfoV2/log/history/{$tmpTime}/summary.log"),true);
    $records = $records + $tmpRecords;
}

$diffGroup = [
    '2500' => 0,
    '2000' => 0,
    '1750' => 0,
    '1500' => 0,
    '1250' => 0,
    '1000' => 0,
    '500' => 0,
    '250' => 0,
    '100' => 0,
    '50' => 0,
    '0' => 0,
];

$lastUsed = 0;
echo "<table>";
echo "
<tr>
    <td>時間</td>
    <td>使用量</td>
    <td>差</td>
    <td>group</td>
</tr>
";
foreach ($records AS $date => $record) {
    $used = 0;
    foreach ($record AS $data) {
        $used += $data['used'];
    }
    $diff = $used - $lastUsed;

    $group = false;
    if ($diff < 0) {
        $tmpDiff = abs($diff);
        foreach ($diffGroup AS $tmpLimit => $val) {
            if ($tmpDiff > $tmpLimit) {
                $diffGroup[$tmpLimit] += 1;
                $group = $tmpLimit;
                break;
            }
        }
    }

    echo "
    <tr>
        <td>{$date}</td>
        <td>{$used}</td>
        <td>{$diff}</td>
        <td>".($group !== false ? "G{$group}" : "--" )."</td>
    </tr>
    ";



    $lastUsed = $used;
}
echo "</table>";
print_r($diffGroup);