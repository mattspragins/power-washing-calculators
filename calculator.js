// Import configuration
import config from './config.js';

// Utility functions
const roundTo100 = (num) => Math.round(num / config.settings.roundingPrecision) * config.settings.roundingPrecision;

// Project Scale Matrix - returns multiplier based on building size and count
const getProjectScaleMultiplier = (perimeter, buildingCount) => {
    // Determine size tier
    let sizeTier = 'xxlarge';
    for (const [tier, maxSize] of Object.entries(config.sizeTiers)) {
        if (perimeter <= maxSize) {
            sizeTier = tier;
            break;
        }
    }

    // Determine project tier
    let projectTier = 'xxlarge';
    for (const [tier, maxCount] of Object.entries(config.projectTiers)) {
        if (buildingCount <= maxCount) {
            projectTier = tier;
            break;
        }
    }

    return config.scaleMatrix[sizeTier][projectTier];
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

    // Validate inputs
    if (!inputs.perimeter || !inputs.buildingCount) {
        alert('Please fill in all required fields');
        return;
    }

    let buildingsPerDay = config.materialRates[inputs.material].buildingsPerDay;
    let basePrice = config.materialRates[inputs.material].pricePerBuilding;

    const scaleMultiplier = getProjectScaleMultiplier(inputs.perimeter, inputs.buildingCount);
    const heightImpact = config.heightMultipliers[inputs.stories];

    buildingsPerDay *= heightImpact.timeMultiplier;
    buildingsPerDay = Math.max(config.settings.minBuildingsPerDay, 
                              Math.round(buildingsPerDay * 10) / 10);

    let pricePerBuilding = basePrice * scaleMultiplier * heightImpact.priceMultiplier;
    pricePerBuilding = roundTo100(pricePerBuilding);
    
    const totalDays = Math.ceil(inputs.buildingCount / buildingsPerDay);
    const totalCost = roundTo100(pricePerBuilding * inputs.buildingCount);
    const dailyRevenue = roundTo100(pricePerBuilding * buildingsPerDay);

    // Update UI
    document.getElementById('pricePerBuilding').textContent = 
        `$${pricePerBuilding.toLocaleString()}`;
    document.getElementById('buildingsPerDay').textContent = buildingsPerDay;
    document.getElementById('dailyRevenue').textContent = 
        `$${dailyRevenue.toLocaleString()}`;
    document.getElementById('baselineRevenue').textContent = 
        `(Baseline: $${config.settings.baselineRevenue.toLocaleString()})`;
    document.getElementById('scaleMultiplier').textContent = 
        `${scaleMultiplier.toFixed(config.settings.scaleMultiplierPrecision)}x`;
    document.getElementById('totalDays').textContent = totalDays;
    document.getElementById('totalCost').textContent = 
        `$${totalCost.toLocaleString()}`;

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
