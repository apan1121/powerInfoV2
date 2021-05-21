wait_period=0

while true
do
    echo "Time Now: `date +%H:%M:%S`"
    echo "Sleeping for 10 seconds"
    # Here 300 is 300 seconds i.e. 5 minutes * 60 = 300 sec
    php GetPowerInfo.php

    sleep 600
done