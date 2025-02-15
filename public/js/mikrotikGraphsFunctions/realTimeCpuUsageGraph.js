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