async function loadCSVData() {
    try {
        const files = [
            { name: 'rainfall', path: 'new rainfall data.csv' },
            { name: 'humidity', path: 'new Rh avg.csv' },
            { name: 'temp_min', path: 'new temperature_min.csv' },
            { name: 'temp_max', path: 'new tmax.csv' },
            { name: 'wind', path: 'new wind speed.csv' },
            { name: 'normal', path: 'rainfall normal.csv' }
        ];
        
        for (const file of files) {
            const response = await fetch(file.path);
            const csvText = await response.text();
            
            Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: function(results) {
                    if (file.name === 'normal') {
                        rainfallNormalData = processNormalData(results.data);
                    } else {
                        // Store in appropriate variable
                        switch(file.name) {
                            case 'rainfall': rainfallData = processData(results.data); break;
                            case 'humidity': humidityData = processData(results.data); break;
                            case 'temp_min': tempMinData = processData(results.data); break;
                            case 'temp_max': tempMaxData = processData(results.data); break;
                            case 'wind': windData = processData(results.data); break;
                        }
                    }
                }
            });
        }
        
        // Wait a bit for parsing to complete
        setTimeout(() => {
            extractBlocksFromData();
            updateDashboard();
        }, 1000);
        
    } catch (error) {
        console.error('Error loading CSV files:', error);
    }
}