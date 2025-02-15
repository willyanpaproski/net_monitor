function updateRealtimeMemoryUsageGraph(data, mikrotikAccessIP) {
    data.forEach(({ ip, systemUsedMemory, error }) => {
        if (error) {
            console.error(`Erro no dispositivo ${ip}: ${error}`);
        } else if (ip === mikrotikAccessIP) {
            const now = new Date();
            realtimeMikrotikMemoryChart.data.labels.push(now);
            realtimeMikrotikMemoryChart.data.datasets[0].data.push(systemUsedMemory);

            if (realtimeMikrotikMemoryChart.data.labels.length > 10) {
                realtimeMikrotikMemoryChart.data.labels.shift();
                realtimeMikrotikMemoryChart.data.datasets[0].data.shift();
            }

            realtimeMikrotikMemoryChart.update();
        }
    });
}