function updateRealTimeDiskUsageGraph(data, mikrotikAccessIP) {
    data.forEach(({ ip, systemUsedlDisk, error }) => {
        if (error) {
            console.error(`Erro no dispositivo ${ip}: ${error}`);
        } else if (ip === mikrotikAccessIP) {
            const now = new Date();
            realTimeMikrotikDiskUsageChart.data.labels.push(now);
            realTimeMikrotikDiskUsageChart.data.datasets[0].data.push(systemUsedlDisk);

            if (realTimeMikrotikDiskUsageChart.data.labels.length > 10) {
                realTimeMikrotikDiskUsageChart.data.labels.shift();
                realTimeMikrotikDiskUsageChart.data.datasets[0].data.shift();
            }
            
            realTimeMikrotikDiskUsageChart.update();
        }
    });
}