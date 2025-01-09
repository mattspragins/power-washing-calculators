// Utility functions
const roundTo100 = (num) => Math.round(num / 100) * 100;

// Project Scale Matrix - returns multiplier based on building size and count
const getProjectScaleMultiplier = (perimeter, buildingCount) => {
    const sizeTiers = {
        small: perimeter <= 350,
        medium: perimeter <= 450,
        large: perimeter <= 550,
        xlarge: perimeter <= 700,
        xxlarge: perimeter > 700
    };

    const scaleMatrix = {
        small: {
            small: 0.9,
            medium: 1.0,
            large: 1.1,
            xlarge: 1.2,
            xxlarge: 1.3
        },
        medium: {
            small: 1.0,
            medium: 1.2,
            large: 1.3,
            xlarge: 1.4,
            xxlarge: 1.5
        },
        large: {
            small: 1.2,
            medium: 1.4,
            large: 1.5,
            xlarge: 1.6,
            xxlarge: 1.7
        },
        xlarge: {
            small: 1.4,
            medium: 1.6,
            large: 1.7,
            xlarge: 1.8,
            xxlarge: 1.9
        },
        xxlarge: {
            small: 1.6,
            medium: 1.8,
            large: 1.9,
            xlarge: 2.0,
            xxlarge: 2.1
        }
    };

    let sizeTier = 'medium';
    for (const [tier, condition] of Object.entries(sizeTiers)) {
        if (condition) {
            sizeTier = tier;
            break;
        }
    }

    let projectTier = 'medium';
    if (buildingCount <= 5) projectTier = 'small';
    else if (buildingCount <= 15) projectTier = 'medium';
    else if (buildingCount <= 25) projectTier = 'large';
    else if (buildingCount <= 40) projectTier = 'xlarge';
    else projectTier = 'xxlarge';

    return scaleMatrix[sizeTier][projectTier];
};

// Calculate metrics and update UI
const calculateMetrics = () => {
    // Get input values
    const inputs = {
        perimeter: Number(document.getElementById('perimeter').value),
        stories: document.getElementById('stories').value,
        buildingCount: Number(document.getElementById('buildingCount').value),
        material: document.getElementById('material').value
    };

    // Base rates by material type
    const baseRates = {
        vinyl: { buildingsPerDay: 6, pricePerBuilding: 450 },
        hardie: { buildingsPerDay: 5, pricePerBuilding: 565 },
        brick: { buildingsPerDay: 4, pricePerBuilding: 565 },
        stucco: { buildingsPerDay: 4, pricePerBuilding: 565 },
        mixed: { buildingsPerDay: 4, pricePerBuilding: 565 }
    };

    // Validate inputs
    if (!inputs.perimeter || !inputs.buildingCount) {
        alert('Please fill in all required fields');
        return;
    }

    let buildingsPerDay = baseRates[inputs.material].buildingsPerDay;
    let basePrice = baseRates[inputs.material].pricePerBuilding;

    const scaleMultiplier = getProjectScaleMultiplier(inputs.perimeter, inputs.buildingCount);

    const heightImpact = {
        '2': { timeMultiplier: 1, priceMultiplier: 1 },
        '3': { timeMultiplier: 0.6, priceMultiplier: 1.67 },
        '4': { timeMultiplier: 0.5, priceMultiplier: 2.0 }
    };

    buildingsPerDay *= heightImpact[inputs.stories].timeMultiplier;
    buildingsPerDay = Math.max(1, Math.round(buildingsPerDay * 10) / 10);

    let pricePerBuilding = basePrice * scaleMultiplier * heightImpact[inputs.stories].priceMultiplier;
    pricePerBuilding = roundTo100(pricePerBuilding);
    
    const totalDays = Math.ceil(inputs.buildingCount / buildingsPerDay);
    const totalCost = roundTo100(pricePerBuilding * inputs.buildingCount);
    const dailyRevenue = roundTo100(pricePerBuilding * buildingsPerDay);
    const baselineRevenue = 2250;

    // Update UI
    document.getElementById('pricePerBuilding').textContent = `$${pricePerBuilding.toLocaleString()}`;
    document.getElementById('buildingsPerDay').textContent = buildingsPerDay;
    document.getElementById('dailyRevenue').textContent = `$${dailyRevenue.toLocaleString()}`;
    document.getElementById('baselineRevenue').textContent = `(Baseline: $${baselineRevenue.toLocaleString()})`;
    document.getElementById('scaleMultiplier').textContent = `${Math.round(scaleMultiplier * 100) / 100}x`;
    document.getElementById('totalDays').textContent = totalDays;
    document.getElementById('totalCost').textContent = `$${totalCost.toLocaleString()}`;

    // Show results
    document.getElementById('results').classList.remove('hidden');
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculateBtn').addEventListener('click', calculateMetrics);

    // Add enter key support
    const inputs = ['perimeter', 'buildingCount'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateMetrics();
            }
        });
    });
});
