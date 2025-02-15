function updateSystemFirmwareVersion(data, mikrotikAccessIP) {
    data.forEach(({ ip, systemFirmwareVersion, error }) => {
        if (error) {
            console.error(`Erro no dispositivo ${ip}: ${error}`);
        } else if (ip == mikrotikAccessIP) {
            $('#mikrotikSystemFirmware').text(systemFirmwareVersion);
        }
    });
}