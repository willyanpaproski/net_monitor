async function getPppActiveConnectionsDuringDayData(mikrotikId) {

    await $.ajax({
        url: `/pppConnectionsDuringDay/${String(mikrotikId)}`,
        method: 'GET',
        contentType: 'application/json',
        success: (response) => {
            let pppActiveConnectionsGraphData = response;
            console.log(pppActiveConnectionsGraphData);
            loadPppActiveConnectionsDuringDay(pppActiveConnectionsGraphData);
        },
        error: (error) => {
            console.log(error);
        }
    });
}

function loadPppActiveConnectionsDuringDay(pppActiveConnectionsGraphData) {
    const mikrotikPPPActiveConnectionsDuringDayCtx = document.getElementById('mikrotikPPPConnectionsDuringDay').getContext('2d');

    if (mikrotikPPPActiveConnectionsDuringDayChart) {
        mikrotikPPPActiveConnectionsDuringDayChart.destroy();
    }

    mikrotikPPPActiveConnectionsDuringDayChart = new Chart(mikrotikPPPActiveConnectionsDuringDayCtx, {
        type: 'line',
        data: {
            labels: pppActiveConnectionsGraphData.labels, // Eixo X (horários)
            datasets: [{
                label: 'Conexões PPPoE',
                data: pppActiveConnectionsGraphData.data, // Eixo Y (quantidade de conexões)
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Horário' } },
                y: { title: { display: true, text: 'Nº de Conexões' }, beginAtZero: true }
            }
        }
    });
}
