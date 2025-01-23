const socket = io('http://localhost:9090', {
    transports: ['polling']
});

socket.on('connect', () => {
    console.log('Conectado ao servidor WebSocket.');
});

// socket.on('mikrotikUptime', (data) => {
//     console.log('Dados recebidos:', data);

//     // Atualize a interface com os dados
//     data.forEach(({ ip, uptime, error }) => {
//         if (error) {
//             console.error(`Erro no dispositivo ${ip}: ${error}`);
//         } else {
//             console.log(`Dispositivo ${ip}: Uptime: ${uptime}`);
//         }
//     });
// });

// socket.on('mikrotikSystemIdentity', (data) => {
//     console.log('Dados recebidos:', data);

//     // Atualize a interface com os dados
//     data.forEach(({ ip, systemIdentity, error }) => {
//         if (error) {
//             console.error(`Erro no dispositivo ${ip}: ${error}`);
//         } else {
//             console.log(`Dispositivo ${ip}: Identity: ${systemIdentity}`);
//         }
//     });
// });

// socket.on('mikrotikSystemUsedMemory', (data) => {
//     console.log('Dados recebidos:', data);

//     // Atualize a interface com os dados
//     data.forEach(({ ip, systemUsedMemory, error }) => {
//         if (error) {
//             console.error(`Erro no dispositivo ${ip}: ${error}`);
//         } else {
//             console.log(`Dispositivo ${ip}: Uso de memória: ${systemUsedMemory}`);
//         }
//     });
// });

// socket.on('mikrotikSystemTotalMemory', (data) => {
//     console.log('Dados recebidos:', data);

//     // Atualize a interface com os dados
//     data.forEach(({ ip, systemTotalMemory, error }) => {
//         if (error) {
//             console.error(`Erro no dispositivo ${ip}: ${error}`);
//         } else {
//             console.log(`Dispositivo ${ip}: Total de memória: ${systemTotalMemory}`);
//         }
//     });
// });

// socket.on('mikrotikSystemFreeMemory', (data) => {
//     console.log('Dados recebidos:', data);

//     // Atualize a interface com os dados
//     data.forEach(({ ip, systemFreeMemory, error }) => {
//         if (error) {
//             console.error(`Erro no dispositivo ${ip}: ${error}`);
//         } else {
//             console.log(`Dispositivo ${ip}: Total de memória livre: ${systemFreeMemory}`);
//         }
//     });
// });

// socket.on('mikrotikFirmwareVersion', (data) => {
//     console.log('Dados recebidos:', data);

//     // Atualize a interface com os dados
//     data.forEach(({ ip, systemFirmwareVersion, error }) => {
//         if (error) {
//             console.error(`Erro no dispositivo ${ip}: ${error}`);
//         } else {
//             console.log(`Dispositivo ${ip}: Versão do Firmware: ${systemFirmwareVersion}`);
//         }
//     });
// });

// socket.on('mikrotikCpuFrequency', (data) => {
//     console.log('Dados recebidos:', data);

//     // Atualize a interface com os dados
//     data.forEach(({ ip, systemCpuFrequency, error }) => {
//         if (error) {
//             console.error(`Erro no dispositivo ${ip}: ${error}`);
//         } else {
//             console.log(`Dispositivo ${ip}: Frequência da CPU: ${systemCpuFrequency}`);
//         }
//     });
// });

socket.on('mikrotikCpuUtilizationPercent', (data) => {
    console.log('Dados recebidos:', data);

    // Atualize a interface com os dados
    data.forEach(({ ip, systemCpuUtilizationPercent, error }) => {
        if (error) {
            console.error(`Erro no dispositivo ${ip}: ${error}`);
        } else {
            console.log(`Dispositivo ${ip}: Utilização de CPU: ${systemCpuUtilizationPercent}`);
        }
    });
});

socket.on('disconnect', () => {
    console.log('Desconectado do servidor WebSocket.');
});