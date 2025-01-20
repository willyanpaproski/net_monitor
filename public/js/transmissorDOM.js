$('#newTransmissorButton').on('click', () => {
    openNewTransmissorModal();
});

$('#closeNewTransmissorModal').on('click', () => {
    closeNewTransmissorModal();
    limparCampos();
});

$('#saveNewTransmissor').on('click', () => {
    createOrUpdateTransmissor();
});

$('#closeDeleteTransmissorModal').on('click', () => {
    closeDeleteTransmissorModal();
});

$('#cancelDeleteTransmissorButton').on('click', () => {
    closeDeleteTransmissorModal();
});

$('#deleteTransmissorButton').on('click', async () => {
    const transmissorId = $('#transmissorId').val();

    await $.ajax({
        url: `/transmissor/deleteTransmissor/${transmissorId}`,
        method: 'DELETE',
        contentType: 'application/json',
        success: () => {
            console.log('Transmissor Deletado com Sucesso!');
            closeDeleteTransmissorModal();
        },
        error: (xhr, status, error) => {
            console.log(error);
        }
    });
});

function openNewTransmissorModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex'
}

function closeNewTransmissorModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function openDeleteTransmissorModal(transmissorId) {
    $('#transmissorId').val(transmissorId);
    modal = document.getElementById('deleteTransmissorModal');
    modal.style.display = 'flex';
}

function closeDeleteTransmissorModal() {
    modal = document.getElementById('deleteTransmissorModal');
    modal.style.display = 'none';
    limparCampos();
}

function limparCampos() {
    $('#transmissorId').val('');
    $('#transmissorIntegration').val('');
    $('#transmissorName').val('');
    $('#transmissorAccessIp').val('');
    $('#transmissorAccessUsername').val('');
    $('#transmissorAcessPassword').val('');
    $('#transmissorSnmpCommunity').val('');
    $('#transmissorDescription').val('');
}

async function openEditTransmissor(transmissorId) {
    await $.ajax({
        url: `/transmissor/getTransmissorById/${transmissorId}`,
        method: 'GET',
        contentType: 'application/json',
        success: (response) => {
            console.log(response);
            $('#transmissorId').val(response._id);
            $('#transmissorIntegration').val(response.integration);
            $('#transmissorName').val(response.name);
            $('#transmissorAccessIp').val(response.accessIP);
            $('#transmissorAccessUsername').val(response.accessUsername);
            $('#transmissorAcessPassword').val(response.accessPassword);
            $('#transmissorSnmpCommunity').val(response.accessPassword);
            $('#transmissorDescription').val(response.description);
            openNewTransmissorModal()
        },
        error: (xhr, status, error) => {
            console.log(error);
        }
    });
}

async function createOrUpdateTransmissor() {
    const data = {
        _id: $('#transmissorId').val(),
        integration: $('#transmissorIntegration').val(),
        name: $('#transmissorName').val(),
        accessIP: $('#transmissorAccessIp').val(),
        accessUsername: $('#transmissorAccessUsername').val(),
        accessPassword: $('#transmissorAcessPassword').val(),
        snmpCommunity: $('#transmissorSnmpCommunity').val(),
        description: $('#transmissorDescription').val()
    }

    const url = data._id ? `/transmissor/updateTransmissor/${data._id}` : '/transmissor/createTranmissor';
    const method = data._id ? 'PUT' : 'POST';

    await $.ajax({
        url,
        method,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: () => {
            console.log('Transmissor Salvo com Sucesso!');
            limparCampos();
            closeNewTransmissorModal();
        },
        error: (xhr, status, error) => {
            console.log(error);
        }
    });
}