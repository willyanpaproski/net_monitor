function updateMemoryFreeBar(percentage) {
    const progressBar = document.getElementById('freeMemoryPercentBar');

    progressBar.style.width = percentage + '%';

    $('#freeMemoryBarTitle').text(`Memória livre (${percentage} %)`);

    progressBar.setAttribute('aria-valuenow', percentage);
}