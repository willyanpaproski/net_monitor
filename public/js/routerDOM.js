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