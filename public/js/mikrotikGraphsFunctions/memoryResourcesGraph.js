function loadMikrotikMemoryResourcesGraph() {
    const mikrotikRealTimeMemoryResourcesCtx = document.getElementById('mikrotikMemoryResources');

    if (realtimeMikrotikMemoryResources) {
        realtimeMikrotikMemoryResources.destroy();
    }

    realtimeMikrotikMemoryResources = new Chart(mikrotikRealTimeMemoryResourcesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Usado (MB)', 'Disponível (MB)'],
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