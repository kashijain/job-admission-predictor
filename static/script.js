// static/script.js

document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('predictionChart');
    
    if(ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Placement', 'Admission'],
                datasets: [{
                    label: 'Probability (%)',
                    data: [placementProb, admissionProb],
                    backgroundColor: [
                        'rgba(25, 135, 84, 0.7)',  // Success Green
                        'rgba(13, 202, 240, 0.7)'  // Info Blue
                    ],
                    borderColor: [
                        'rgba(25, 135, 84, 1)',
                        'rgba(13, 202, 240, 1)'
                    ],
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }
});
