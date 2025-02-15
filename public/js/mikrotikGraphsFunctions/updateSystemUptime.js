function updateSystemUptime(data, mikrotikAccessIP) {
    data.forEach(({ ip, systemUptime, error }) => {
        if (error) {
            console.error(`Erro no dispositivo ${ip}: ${error}`);
        } else if (ip == mikrotikAccessIP) {
            $('#mikrotikSystemUptime').text(systemUptime);
        }
    });
}