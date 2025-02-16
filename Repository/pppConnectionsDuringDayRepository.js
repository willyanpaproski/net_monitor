const PppConnectionsDuringDay = require('../models/pppConnectionsDuringDay');
const moment = require('moment');

class PppConnectionsDuringDayRepository {

    async create(pppConnectionsData) {
        const pppConnections = new PppConnectionsDuringDay(pppConnectionsData);
        return await pppConnections.save();
    }

    async getRouterActiveConnectionsData(routerId) {

        const startOfDay = moment.utc().startOf('day').toDate();
        const endOfDay = moment.utc().endOf('day').toDate();

        console.log(`Start: ${startOfDay}`);
        console.log(`End: ${endOfDay}`);

        // Busca os registros do dia
        const connections = await PppConnectionsDuringDay.find({
            nasId: routerId,
            monitoringTime: { $gte: startOfDay, $lte: endOfDay }
        });

        // Criar um mapa para armazenar os valores agrupados por meia hora
        const connectionMap = new Map();

        // Percorre os dados e agrupa por intervalos de 30 minutos
        connections.forEach(({ monitoringTime, numberOfConnections }) => {
            const roundedTime = moment.utc(monitoringTime).startOf('hour').add(
                moment.utc(monitoringTime).minute() < 30 ? 0 : 30, 'minutes'
            ).format('HH:mm'); // Formato de hora legível (ex: "00:00", "00:30")

            // Converte BigInt para Number (caso seja necessário)
            const connectionsCount = Number(numberOfConnections);

            // Adiciona ao mapa somando valores se já existir o mesmo horário
            connectionMap.set(roundedTime, (connectionMap.get(roundedTime) || 0) + connectionsCount);
        });

        // Ordena os horários corretamente
        const sortedTimes = Array.from(connectionMap.keys()).sort();

        // Retorna um objeto pronto para o gráfico
        return {
            labels: sortedTimes, // Horários no eixo X
            data: sortedTimes.map(time => connectionMap.get(time) || 0) // Valores no eixo Y
        };
    }

}

module.exports = new PppConnectionsDuringDayRepository();