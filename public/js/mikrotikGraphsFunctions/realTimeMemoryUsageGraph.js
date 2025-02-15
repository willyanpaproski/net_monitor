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