function updateMemoryUsageBar(percentage) {
    const progressBar = document.getElementById('usedMemoryPercentBar');

    progressBar.style.width = percentage + '%';

    $('#usedMemoryBarTitle').text(`Memória utilizada (${percentage} %)`);

    progressBar.setAttribute('aria-valuenow', percentage);
}