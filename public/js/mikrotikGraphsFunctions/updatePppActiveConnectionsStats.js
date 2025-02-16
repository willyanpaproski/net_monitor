function updatePppActiveConnectionsStats(data, mikrotikAccessIP) {
    data.forEach(({ 
        ip, 
        PPPActiveConnections, 
        totalPPPActiveConnections, 
        totalPPPActiveConnectionsWithoutIP,
        totalPPPActiveConnectionsWithIP,
        error 
    }) => {
        if (error) {
            console.error(`Erro no dispositivo ${ip}: ${error}`);
        } else if (ip === mikrotikAccessIP) {
            $("#mikrotikTotalPPPActiveConnections").text(totalPPPActiveConnections);
            $("#mikrotikTotalPPPActiveConnectionsWithIP").text(totalPPPActiveConnectionsWithIP);
            $("#mikrotikTotalPPPActiveConnectionsWithoutIP").text(totalPPPActiveConnectionsWithoutIP);
        }
    });
}