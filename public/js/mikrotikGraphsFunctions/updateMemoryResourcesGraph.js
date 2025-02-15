function updateMemoryResourcesGraph(data, mikrotikAccessIP) {
    data.forEach(({ ip, systemUsedMemory, systemFreeMemory, systemTotalMemory, systemUsedMemoryPercent, systemFreeMemoryPercent, error }) => {
        if (error) {
            console.error(`Erro no dispositivo ${ip}: ${error}`);
        } else if (ip == mikrotikAccessIP) {

            realtimeMikrotikMemoryResources.options.plugins.title.text = `Total: ${systemTotalMemory} MB`
            realtimeMikrotikMemoryResources.data.datasets[0].data = [systemUsedMemory, systemFreeMemory];
            realtimeMikrotikMemoryResources.update();

            updateMemoryUsageBar(systemUsedMemoryPercent);
            updateMemoryFreeBar(systemFreeMemoryPercent);
        }
    });
}