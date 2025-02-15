let mikrotikSocket;
let realtimeMikrotikMemoryChart;
let realtimeMikrotikMemoryResources;
let realtimeMikrotikCpuUtilization;
let realtimeMikrotikDiskResources;
let realTimeMikrotikDiskUsageChart;

$('#newNasButton').on('click', () => {
    openNewNasModal();
})

$('#closeNewNasModal').on('click', () => {
    closeNewNasModal();
});

$('#closeDeleteNasModal').on('click', () => {
    closeDeleteNasModal();
});

$('#cancelDeleteNasButton').on('click', () => {
    closeDeleteNasModal();
});

$('#saveNewNas').on('click', () => {
    createOrUpdateNas();
});

$('#closeMikrotikGraphs').on('click', () => {
    closeMikrotikGraphs();
});

$('#deleteNasButton').on('click', async () => {
    nasId = $('#nasId').val();

    await $.ajax({
        url: `/nas/deleteNas/${nasId}`,
        method: 'DELETE',
        contentType: 'application/json',
        success: () => {
            console.log('NAS deletado com sucesso');
            closeDeleteNasModal();
        },
        error: (xhr, status, error) => {
            console.log('Erro ao deletar o NAS');
            console.log(error);
        }
    });
});

function openNewNasModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
}

function closeNewNasModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    limparCampos();
}

function openDeleteNasModal(nasId) {
    $('#nasId').val(nasId);
    const modal = document.getElementById('deleteNasModal');
    modal.style.display = 'flex';
}

function closeDeleteNasModal() {
    const modal = document.getElementById('deleteNasModal');
    modal.style.display = 'none';
    limparCampos();
}

function limparCampos() {
    $('#nasId').val('');
    $('#nasIntegration').val('');
    $('#nasName').val('');
    $('#nasAccessIp').val('');
    $('#nasAccessUsername').val('');
    $('#nasAcessPassword').val('');
    $('#nasSnmpCommunity').val('');
    $('#nasDescription').val('');
}

async function openEditNas(nasId) {
    await $.ajax({
        url: `/nas/getNasById/${nasId}`,
        method: 'GET',
        contentType: 'application/json',
        success: (response) => {
            $('#nasId').val(response._id);
            $('#updatedAt').val(Date.now());
            $('#nasIntegration').val(response.integration);
            $('#nasName').val(response.name);
            $('#nasAccessIp').val(response.accessIP);
            $('#nasAccessUsername').val(response.accessUsername);
            $('#nasAcessPassword').val(response.accessPassword);
            $('#nasSnmpCommunity').val(response.snmpCommunity);
            $('#nasDescription').val(response.description);
            openNewNasModal();
        },
        error: (xhr, status, error) => {
            console.log(error);
        }
    });
}

async function createOrUpdateNas() {
    const data = {
        _id: $('#nasId').val(),
        updatedAt: $('#updatedAt').val(),
        integration: $('#nasIntegration').val(),
        name: $('#nasName').val(),
        accessIP: $('#nasAccessIp').val(),
        accessUsername: $('#nasAccessUsername').val(),
        accessPassword: $('#nasAcessPassword').val(),
        snmpCommunity: $('#nasSnmpCommunity').val(),
        description: $('#nasDescription').val()
    }

    const url = data._id ? `/nas/updateNas/${data._id}` : '/nas/createNas';
    method = data._id ? 'PUT' : 'POST';

    await $.ajax({
        url,
        method,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: () => {
            console.log('Nas salvo com sucesso');
            limparCampos();
            closeNewNasModal();
        },
        error: (xhr, status, error) => {
            console.log(error);
            console.log('Falha ao ,salvar o NAS');
        }
    });
}

function openMikrotikGraphs(mikrotikAccessIP, mikrotikName) {

    loadMikrotikRealTimeCpuUtilizationGraph();
    loadMikrotikRealTimeMemoryUsage();
    loadMikrotikMemoryResourcesGraph();
    loadMikrotikDiskResourcesGraph();
    loadMikrotikRealtimeDiskUsage();

    const mikrotikGraphModal = document.getElementById('mikrotikGraphs');
    mikrotikGraphModal.style.display = 'flex';

    mikrotikSocket = io('http://localhost:9090', {
        transports: ['polling']
    });

    $('#mikrotikName').text(mikrotikName);

    mikrotikSocket.on('mikrotikSystemIdentity', (data) => {
    
        data.forEach(({ ip, systemIdentity, error }) => {
            if (error) {
                console.error(`Erro no dispositivo ${ip}: ${error}`);
            } else if (ip == mikrotikAccessIP) {
                $('#mikrotikSystemIdentity').text(systemIdentity);
            }
        });
    });

    mikrotikSocket.on('mikrotikSystemUptime', (data) => {
    
        data.forEach(({ ip, systemUptime, error }) => {
            if (error) {
                console.error(`Erro no dispositivo ${ip}: ${error}`);
            } else if (ip == mikrotikAccessIP) {
                $('#mikrotikSystemUptime').text(systemUptime);
            }
        });
    });

    mikrotikSocket.on('mikrotikSystemTime', (data) => {
    
        data.forEach(({ ip, systemDateTime, error }) => {
            if (error) {
                console.error(`Erro no dispositivo ${ip}: ${error}`);
            } else if (ip == mikrotikAccessIP) {
                $('#mikrotikSystemTime').text(systemDateTime);
            }
        });
    });

    mikrotikSocket.on('mikrotikFirmwareVersion', (data) => {
    
        data.forEach(({ ip, systemFirmwareVersion, error }) => {
            if (error) {
                console.error(`Erro no dispositivo ${ip}: ${error}`);
            } else if (ip == mikrotikAccessIP) {
                $('#mikrotikSystemFirmware').text(systemFirmwareVersion);
            }
        });
    });

    mikrotikSocket.on('mikrotikSystemUsedMemory', (data) => {
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
    });

    mikrotikSocket.on('mikrotikMemoryResources', (data) => {
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
    });

    mikrotikSocket.on('mikrotikCpuUtilizationPercent', (data) => {
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
    });

    mikrotikSocket.on('mikrotikCpuFrequency', (data) => {
        data.forEach(({ ip, systemCpuFrequency, error }) => {
            if (error) {
                console.error(`Erro no dispositivo ${ip}: ${error}`);
            } else if (ip == mikrotikAccessIP) {
                $('#systemCpuFrequency').text(`Frequência da CPU: ${systemCpuFrequency} MHz`);
            }
        });
    });

    mikrotikSocket.on('mikrotikSystemDiskResources', (data) => {
        data.forEach(({ ip, systemFreeDisk, systemUsedDisk, systemTotalDisk, systemUsedDiskPercent, systemFreeDiskPercent, error }) => {
            if (error) {
                console.error(`Erro no dispositivo ${ip}: ${error}`);
            } else if (ip == mikrotikAccessIP) {
                realtimeMikrotikDiskResources.options.plugins.title.text = `Total: ${systemTotalDisk} MB`
                realtimeMikrotikDiskResources.data.datasets[0].data = [systemUsedDisk, systemFreeDisk];
                realtimeMikrotikDiskResources.update();
            }
        });
    });

    mikrotikSocket.on('mikrotikSystemUsedDisk', (data) => {
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
    });

    mikrotikSocket.on('mikrotikPPPActiveConnections', (data) => {
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
                console.log(PPPActiveConnections);
                $("#mikrotikTotalPPPActiveConnections").text(totalPPPActiveConnections);
                $("#mikrotikTotalPPPActiveConnectionsWithIP").text(totalPPPActiveConnectionsWithIP);
                $("#mikrotikTotalPPPActiveConnectionsWithoutIP").text(totalPPPActiveConnectionsWithoutIP);
            }
        });
    });
}

function closeMikrotikGraphs() {
    const mikrotikGraphModal = document.getElementById('mikrotikGraphs');
    mikrotikGraphModal.style.display = 'none';

    if (mikrotikSocket) {
        mikrotikSocket.disconnect();
        mikrotikSocket = null;
    }
}