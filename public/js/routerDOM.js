let mikrotikSocket;
let realtimeMikrotikMemoryChart;
let realtimeMikrotikMemoryResources;
let realtimeMikrotikCpuUtilization;
let realtimeMikrotikDiskResources;
let realTimeMikrotikDiskUsageChart;
let mikrotikPPPActiveConnectionsDuringDayChart;

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

let currentMikrotik = null;

async function openMikrotikGraphs(mikrotikAccessIP, mikrotikName, mikrotikId) {

    $('#mikrotikInterfacesMenu').hide();

    currentMikrotik = mikrotikId;

    if (mikrotikSocket) {
        mikrotikSocket.disconnect();
        mikrotikSocket = null;
    }

    await getPppActiveConnectionsDuringDayData(mikrotikId);
    await loadMikrotikRealTimeCpuUtilizationGraph();
    await loadMikrotikRealTimeMemoryUsage();
    await loadMikrotikMemoryResourcesGraph();
    await loadMikrotikDiskResourcesGraph();
    await loadMikrotikRealtimeDiskUsage();

    const mikrotikGraphModal = document.getElementById('mikrotikGraphs');
    mikrotikGraphModal.style.display = 'flex';

    mikrotikSocket = io('http://localhost:9090', {
        transports: ['polling']
    });

    $('#mikrotikName').text(mikrotikName);

    mikrotikSocket.on('mikrotikSystemIdentity', (data) => {
        updateMikrotikSystemIdentity(data, mikrotikAccessIP);
    });

    mikrotikSocket.on('mikrotikSystemUptime', (data) => {
        updateSystemUptime(data, mikrotikAccessIP);
    });

    mikrotikSocket.on('mikrotikSystemTime', (data) => {
        updateSystemTime(data, mikrotikAccessIP);
    });

    mikrotikSocket.on('mikrotikFirmwareVersion', (data) => {
        updateSystemFirmwareVersion(data, mikrotikAccessIP);
    });

    mikrotikSocket.on('mikrotikSystemUsedMemory', (data) => {
        updateRealtimeMemoryUsageGraph(data, mikrotikAccessIP);
    });

    mikrotikSocket.on('mikrotikMemoryResources', (data) => {
        updateMemoryResourcesGraph(data, mikrotikAccessIP);
    });

    mikrotikSocket.on('mikrotikCpuUtilizationPercent', (data) => {
        updateCpuUtilizationPercentGraph(data, mikrotikAccessIP);
    });

    mikrotikSocket.on('mikrotikCpuFrequency', (data) => {
        updateSystemCpuFrequency(data, mikrotikAccessIP);
    });

    mikrotikSocket.on('mikrotikSystemDiskResources', (data) => {
        updateDiskResourcesGraph(data, mikrotikAccessIP);
    });

    mikrotikSocket.on('mikrotikSystemUsedDisk', (data) => {
        updateRealTimeDiskUsageGraph(data, mikrotikAccessIP);
    });

    mikrotikSocket.on('mikrotikPPPActiveConnections', (data) => {
        updatePppActiveConnectionsStats(data, mikrotikAccessIP);
    });

    mikrotikSocket.on('mikrotikPhysicalInterfaces', (data) => {
        console.log(data);
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

async function refreshPppActiveConnectionsDuringDayGraph() {
    await getPppActiveConnectionsDuringDayData(currentMikrotik);
}

function changeToMikrotikPrincipalMenu() {
    $('#mikrotikInterfacesMenu').hide();
    $('#mikrotikPrincipalMenu').show();
}

function changeToMikrotikInterfacesMenu() {
    $('#mikrotikPrincipalMenu').hide();
    $('#mikrotikInterfacesMenu').show();
}