function updateCpuUtilizationPercentGraph(data, mikrotikAccessIP) {
    data.forEach(({ ip, systemCpuUtilizationPercent, error }) => {
        if (error) {
            console.error(`Erro no dispositivo ${ip}: ${error}`);
        } else if (ip == mikrotikAccessIP) {
            if (systemCpuUtilizationPercent < 30) {
                $('#systemCpuUtilizationPercentCard').css('background-color', '#6EEB83');
            } else if (systemCpuUtilizationPercent > 30 && systemCpuUtilizationPercent < 80) {
                $('#systemCpuUtilizationPercentCard').css('background-color', '#ebe834');
            } else {
                $('#systemCpuUtilizationPercentCard').css('background-color', '#f50c0c');
            }
    
            $('#systemCpuUtilizationPercent').text(systemCpuUtilizationPercent + ' %');

            const currentTime = new Date();

            realtimeMikrotikCpuUtilization.data.labels.push(currentTime);
            realtimeMikrotikCpuUtilization.data.datasets[0].data.push(systemCpuUtilizationPercent);

            if (realtimeMikrotikCpuUtilization.data.labels.length > 10) {
                realtimeMikrotikCpuUtilization.data.labels.shift();
                realtimeMikrotikCpuUtilization.data.datasets[0].data.shift();
            }

            realtimeMikrotikCpuUtilization.update();
        }
    });
}