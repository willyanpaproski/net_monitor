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

socket.on('mikrotikSystemIdentity', (data) => {
    console.log('Dados recebidos:', data);

    // Atualize a interface com os dados
    data.forEach(({ ip, systemIdentity, error }) => {
        if (error) {
            console.error(`Erro no dispositivo ${ip}: ${error}`);
        } else {
            console.log(`Dispositivo ${ip}: Identity: ${systemIdentity}`);
        }
    });
});

socket.on('disconnect', () => {
    console.log('Desconectado do servidor WebSocket.');
});