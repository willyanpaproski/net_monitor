function updateMikrotikSystemIdentity(data, mikrotikAccessIP) {
    data.forEach(({ ip, systemIdentity, error }) => {
        if (error) {
            console.error(`Erro no dispositivo ${ip}: ${error}`);
        } else if (ip == mikrotikAccessIP) {
            $('#mikrotikSystemIdentity').text(systemIdentity);
        }
    });
}