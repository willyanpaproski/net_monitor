function updateSystemTime(data, mikrotikAccessIP) {
    data.forEach(({ ip, systemDateTime, error }) => {
        if (error) {
            console.error(`Erro no dispositivo ${ip}: ${error}`);
        } else if (ip == mikrotikAccessIP) {
            $('#mikrotikSystemTime').text(systemDateTime);
        }
    });
}