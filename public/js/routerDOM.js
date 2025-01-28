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

let realtimeMikrotikMemoryChart;
let realtimeMikrotikMemoryResources;

function openMikrotikGraphs(mikrotikAccessIP, mikrotikName) {
    const mikrotikGraphModal = document.getElementById('mikrotikGraphs');
    mikrotikGraphModal.style.display = 'flex';

    const socket = io('http://localhost:9090', {
        transports: ['polling']
    });

    const mikrotikRealTimeMemoryUsageCtx = document.getElementById('mikrotikMemoryUsage');
    const mikrotikRealTimeMemoryResourcesCtx = document.getElementById('mikrotikMemoryResources');

    if (realtimeMikrotikMemoryResources) {
        realtimeMikrotikMemoryResources.destroy();
    }

    realtimeMikrotikMemoryResources = new Chart(mikrotikRealTimeMemoryResourcesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Usado', 'Disponível'],
            datasets: [{
                data: [0, 0], // Inicializa com valores padrão
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
                duration: 500 // Animação suave para atualizações
            }
        }
    });

    if (realtimeMikrotikMemoryChart) {
        realtimeMikrotikMemoryChart.destroy(); // Destroi o gráfico anterior para evitar duplicatas
    }

    realtimeMikrotikMemoryChart = new Chart(mikrotikRealTimeMemoryUsageCtx, {
        type: 'line',
        data: {
            labels: [], // Horários
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
    
    socket.on('connect', () => {
        console.log('Conectado ao servidor WebSocket.');
    });

    $('#mikrotikName').text(mikrotikName);

    socket.on('mikrotikSystemIdentity', (data) => {
    
        data.forEach(({ ip, systemIdentity, error }) => {
            if (error) {
                console.error(`Erro no dispositivo ${ip}: ${error}`);
            } else if (ip == mikrotikAccessIP) {
                $('#mikrotikSystemIdentity').text(systemIdentity);
            }
        });
    });

    socket.on('mikrotikSystemUptime', (data) => {
    
        data.forEach(({ ip, systemUptime, error }) => {
            if (error) {
                console.error(`Erro no dispositivo ${ip}: ${error}`);
            } else if (ip == mikrotikAccessIP) {
                $('#mikrotikSystemUptime').text(systemUptime);
            }
        });
    });

    socket.on('mikrotikSystemTime', (data) => {
    
        data.forEach(({ ip, systemDateTime, error }) => {
            if (error) {
                console.error(`Erro no dispositivo ${ip}: ${error}`);
            } else if (ip == mikrotikAccessIP) {
                $('#mikrotikSystemTime').text(systemDateTime);
            }
        });
    });

    socket.on('mikrotikFirmwareVersion', (data) => {
    
        data.forEach(({ ip, systemFirmwareVersion, error }) => {
            if (error) {
                console.error(`Erro no dispositivo ${ip}: ${error}`);
            } else if (ip == mikrotikAccessIP) {
                $('#mikrotikSystemFirmware').text(systemFirmwareVersion);
            }
        });
    });

    socket.on('mikrotikSystemUsedMemory', (data) => {
        data.forEach(({ ip, systemUsedMemory, error }) => {
            if (error) {
                console.error(`Erro no dispositivo ${ip}: ${error}`);
            } else if (ip === mikrotikAccessIP) {
                const now = new Date();
                realtimeMikrotikMemoryChart.data.labels.push(now);
                realtimeMikrotikMemoryChart.data.datasets[0].data.push(systemUsedMemory); // Convertendo KB para MB

                if (realtimeMikrotikMemoryChart.data.labels.length > 20) {
                    realtimeMikrotikMemoryChart.data.labels.shift(); // Removendo o ponto mais antigo
                    realtimeMikrotikMemoryChart.data.datasets[0].data.shift();
                }

                realtimeMikrotikMemoryChart.update(); // Atualiza o gráfico
            }
        });
    });

    socket.on('mikrotikMemoryResources', (data) => {
        data.forEach(({ ip, systemUsedMemory, systemFreeMemory, systemTotalMemory, error }) => {
            if (error) {
                console.error(`Erro no dispositivo ${ip}: ${error}`);
            } else if (ip == mikrotikAccessIP) {

                realtimeMikrotikMemoryResources.options.plugins.title.text = `Total: ${systemTotalMemory} MB`
                realtimeMikrotikMemoryResources.data.datasets[0].data = [systemUsedMemory, systemFreeMemory];
                realtimeMikrotikMemoryResources.update();

            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Desconectado do servidor WebSocket.');
    });
}

function closeMikrotikGraphs() {
    const mikrotikGraphModal = document.getElementById('mikrotikGraphs');
    mikrotikGraphModal.style.display = 'none';
}