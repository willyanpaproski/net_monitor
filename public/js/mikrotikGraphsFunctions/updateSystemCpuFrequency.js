function updateSystemCpuFrequency(data, mikrotikAccessIP) {
    data.forEach(({ ip, systemCpuFrequency, error }) => {
        if (error) {
            console.error(`Erro no dispositivo ${ip}: ${error}`);
        } else if (ip == mikrotikAccessIP) {
            $('#systemCpuFrequency').text(`Frequência da CPU: ${systemCpuFrequency} MHz`);
        }
    });
}