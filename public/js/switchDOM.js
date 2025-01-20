$('#newSwitchButton').on('click', () => {
    openNewSwitchModal();
});

$('#closeNewSwitchModal').on('click', () => {
    closeNewSwitchModal();
});

$('#saveNewSwitch').on('click', () => {
    createOrUpdateSwitch()
});

$('#closeDeleteSwitchModal').on('click', () => {
    closeDeleteSwitchModal();
});

$('#cancelDeleteSwitchButton').on('click', () => {
    closeDeleteSwitchModal();
});

$('#deleteSwitchButton').on('click', async () => {
    const switchId = $('#switchId').val();
    
    await $.ajax({
        url: `/switch/deleteSwitch/${switchId}`,
        method: 'DELETE',
        contentType: 'application/json',
        success: () => {
            console.log('Switch Deletado com Sucesso!');
            closeDeleteSwitchModal();
        },
        error: (xhr, status, error) => {
            console.log(error);
        }
    });
});

function openNewSwitchModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex'
}

function closeNewSwitchModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    limparCampos();
}

function openDeleteSwitchModal(switchId) {
    $('#switchId').val(switchId);
    const modal = document.getElementById('deleteSwitchModal');
    modal.style.display = 'flex';
}

function closeDeleteSwitchModal() {
    const modal = document.getElementById('deleteSwitchModal');
    modal.style.display = 'none';
    limparCampos();
}

function limparCampos() {
    $('#switchId').val('');
    $('#switchIntegration').val('');
    $('#switchName').val('');
    $('#switchAccessIp').val('');
    $('#switchAccessUsername').val('');
    $('#switchAcessPassword').val('');
    $('#switchSnmpCommunity').val('');
    $('#switchDescription').val('');
}

async function openEditSwitch(switchId) {
    await $.ajax({
        url: `/switch/getSwitchById/${switchId}`,
        method: 'GET',
        contentType: 'application/json',
        success: (response) => {
            $('#switchId').val(response._id);
            $('#switchIntegration').val(response.integration);
            $('#switchName').val(response.name);
            $('#switchAccessIp').val(response.accessIP);
            $('#switchAccessUsername').val(response.accessUsername);
            $('#switchAcessPassword').val(response.accessPassword);
            $('#switchSnmpCommunity').val(response.snmpCommunity);
            $('#switchDescription').val(response.description);
            openNewSwitchModal();
        },
        error: (xhr, status, error) => {
            console.log(error);
        }
    });
}

async function createOrUpdateSwitch() {
    const data = {
        _id: $('#switchId').val(),
        integration: $('#switchIntegration').val(),
        name: $('#switchName').val(),
        accessIP: $('#switchAccessIp').val(),
        accessUsername: $('#switchAccessUsername').val(),
        accessPassword: $('#switchAcessPassword').val(),
        snmpCommunity: $('#switchSnmpCommunity').val(),
        description: $('#switchDescription').val()
    }

    const url = data._id ? `/switch/updateSwitch/${data._id}` : '/switch/createSwitch';
    const method = data._id ? 'PUT' : 'POST';

    await $.ajax({
        url,
        method,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: () => {
            console.log('Switch salvo com sucesso!');
            limparCampos();
            closeNewSwitchModal();
        },
        error: (xhr, status, error) => {
            console.log(error);
        }
    });
}