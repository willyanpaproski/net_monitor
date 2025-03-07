async function getPppActiveConnectionsDuringDayData(mikrotikId) {
    await $.ajax({
        url: `/pppConnectionsDuringDay/${String(mikrotikId)}`,
        method: 'GET',
        contentType: 'application/json',
        success: (response) => {
            console.log(response);
            loadPppActiveConnectionsDuringDay(response);
        },
        error: (error) => {
            console.log(error);
        }
    });
}

function loadPppActiveConnectionsDuringDay(pppActiveConnectionsGraphData) {
    const ctx = document.getElementById('mikrotikPPPConnectionsDuringDay').getContext('2d');

    if (window.mikrotikPPPActiveConnectionsDuringDayChart) {
        window.mikrotikPPPActiveConnectionsDuringDayChart.destroy();
    }

    const connectionsData = pppActiveConnectionsGraphData.routerActiveConnectionsDuringDay;

    if (!connectionsData || connectionsData.length === 0) {
        console.warn("Nenhum dado recebido para o gráfico.");
        return;
    }

    connectionsData.sort((a, b) => new Date(a.monitoringTime) - new Date(b.monitoringTime));

    const labels = connectionsData.map(item => new Date(item.monitoringTime));
    const data = connectionsData.map(item => item.numberOfConnections);

    window.mikrotikPPPActiveConnectionsDuringDayChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Conexões PPP Ativas',
                data: data,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Data' },
                    type: 'time',
                    time: {
                        unit: 'hour',
                        tooltipFormat: 'yyyy-MM-dd HH:mm',
                        displayFormats: { hour: 'HH:mm' }
                    }
                },
                y: {
                    title: { display: true, text: 'Nº de Conexões' },
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        precision: 0 
                    }
                }
            }
        }
    });
}