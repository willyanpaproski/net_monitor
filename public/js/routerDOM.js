let mikrotikSocket;

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

function updateMemoryUsageBar(percentage) {
    const progressBar = document.getElementById('usedMemoryPercentBar');

    progressBar.style.width = percentage + '%';

    $('#usedMemoryBarTitle').text(`Memória utilizada (${percentage} %)`);

    progressBar.setAttribute('aria-valuenow', percentage);
}

function updateMemoryFreeBar(percentage) {
    const progressBar = document.getElementById('freeMemoryPercentBar');

    progressBar.style.width = percentage + '%';

    $('#freeMemoryBarTitle').text(`Memória livre (${percentage} %)`);

    progressBar.setAttribute('aria-valuenow', percentage);
}

let realtimeMikrotikMemoryChart;
let realtimeMikrotikMemoryResources;
let realtimeMikrotikCpuUtilization;
let realtimeMikrotikDiskResources;
let realTimeMikrotikDiskUsage;

function loadMikrotikRealTimeCpuUtilizationGraph() {
    const mikrotikRealTimeCpuUsageCtx = document.getElementById('mikrotikCpuUsage');

    if (realtimeMikrotikCpuUtilization) {
        realtimeMikrotikCpuUtilization.destroy();
    }

    realtimeMikrotikCpuUtilization = new Chart(mikrotikRealTimeCpuUsageCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Uso de CPU (%)',
                data: [],
                borderColor: '#237BFD',
                backgroundColor: 'rgba(8, 107, 188, 0.3)',
                pointBackgroundColor: '#237BFD',
                pointBorderColor: '#237BFD',
                pointRadius: 3,
                showLine: true, 
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            animation: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'second',
                        displayFormats: {
                            second: 'HH:mm:ss'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Tempo'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Uso de CPU (%)'
                    }
                }
            }
        }
    });
}

function loadMikrotikRealTimeMemoryUsage() {
    const mikrotikRealTimeMemoryUsageCtx = document.getElementById('mikrotikMemoryUsage');

    if (realtimeMikrotikMemoryChart) {
        realtimeMikrotikMemoryChart.destroy();
    }

    realtimeMikrotikMemoryChart = new Chart(mikrotikRealTimeMemoryUsageCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Uso de Memória (MB)',
                data: [],
                borderColor: '#237BFD',
                backgroundColor: 'rgba(8, 107, 188, 0.3)',
                pointBackgroundColor: '#237BFD',
                pointBorderColor: '#237BFD',
                pointRadius: 3,
                showLine: true, 
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            animation: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'second',
                        displayFormats: {
                            second: 'HH:mm:ss'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Tempo'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Uso de Memória (MB)'
                    }
                }
            }
        }
    });
}

function loadMikrotikMemoryResourcesGraph() {
    const mikrotikRealTimeMemoryResourcesCtx = document.getElementById('mikrotikMemoryResources');

    if (realtimeMikrotikMemoryResources) {
        realtimeMikrotikMemoryResources.destroy();
    }

    realtimeMikrotikMemoryResources = new Chart(mikrotikRealTimeMemoryResourcesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Usado', 'Disponível'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#36A2EB', '#6EEB83'],
                hoverBackgroundColor: ['#36A2EB', '#6EEB83'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            cutout: 80,
            plugins: {
                legend: {
                    onClick: null,
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Uso de Memória do Mikrotik'
                }
            },
            animation: {
                duration: 200
            }
        }
    });
}

function loadMikrotikDiskResourcesGraph() {
    const mikrotikRealTimeDiskResourcesCtx = document.getElementById('mikrotikDiskResources');

    if (realtimeMikrotikDiskResources) {
        realtimeMikrotikDiskResources.destroy();
    }

    realtimeMikrotikDiskResources = new Chart(mikrotikRealTimeDiskResourcesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Usado', 'Disponível'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#36A2EB', '#6EEB83'],
                hoverBackgroundColor: ['#36A2EB', '#6EEB83'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            cutout: 80,
            plugins: {
                legend: {
                    onClick: null,
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Uso de Disco do Mikrotik'
                }
            },
            animation: {
                duration: 200
            }
        }
    });
}

function loadMikrotikRealtimeDiskUsage() {
    const mikrotikRealTimeDiskUsageCtx = document.getElementById('mikrotikDiskUsage');

    if (realTimeMikrotikDiskUsage) {
        realTimeMikrotikDiskUsage.destroy();
    }

    realTimeMikrotikDiskUsage = new Chart(mikrotikRealTimeDiskUsageCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Uso de Disco (MB)',
                data: [],
                borderColor: '#237BFD',
                backgroundColor: 'rgba(8, 107, 188, 0.3)',
                pointBackgroundColor: '#237BFD',
                pointBorderColor: '#237BFD',
                pointRadius: 3,
                showLine: true, 
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            animation: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'second',
                        displayFormats: {
                            second: 'HH:mm:ss'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Tempo'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Uso de Disco (MB)'
                    }
                }
            }
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
    
    mikrotikSocket.on('connect', () => {
        console.log('Conectado ao servidor WebmikrotikSocket.');
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

                if (realtimeMikrotikMemoryChart.data.labels.length > 20) {
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

                if (realtimeMikrotikCpuUtilization.data.labels.length > 20) {
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

                //updateMemoryUsageBar(systemUsedMemoryPercent);
                //updateMemoryFreeBar(systemFreeMemoryPercent);
            }
        });
    });

    mikrotikSocket.on('mikrotikSystemUsedDisk', (data) => {
        data.forEach(({ ip, systemUsedlDisk, error }) => {
            if (error) {
                console.error(`Erro no dispositivo ${ip}: ${error}`);
            } else if (ip === mikrotikAccessIP) {
                const now = new Date();
                realTimeMikrotikDiskUsage.data.labels.push(now);
                realTimeMikrotikDiskUsage.data.datasets[0].data.push(systemUsedlDisk);

                if (realTimeMikrotikDiskUsage.data.labels.length > 20) {
                    realTimeMikrotikDiskUsage.data.labels.shift();
                    realTimeMikrotikDiskUsage.data.datasets[0].data.shift();
                }
                
                realTimeMikrotikDiskUsage.update();
            }
        });
    });

    mikrotikSocket.on('disconnect', () => {
        console.log('Desconectado do servidor WebmikrotikSocket.');
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