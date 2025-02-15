function updateDiskResourcesGraph(data, mikrotikAccessIP) {
    data.forEach(({ ip, systemFreeDisk, systemUsedDisk, systemTotalDisk, systemUsedDiskPercent, systemFreeDiskPercent, error }) => {
        if (error) {
            console.error(`Erro no dispositivo ${ip}: ${error}`);
        } else if (ip == mikrotikAccessIP) {
            realtimeMikrotikDiskResources.options.plugins.title.text = `Total: ${systemTotalDisk} MB`
            realtimeMikrotikDiskResources.data.datasets[0].data = [systemUsedDisk, systemFreeDisk];
            realtimeMikrotikDiskResources.update();
        }
    });
}