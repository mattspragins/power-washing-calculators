// Configuration file for Building Cleaning Calculator
const calculatorConfig = {
    // Base rates for different building materials
    // buildingsPerDay: How many buildings can be cleaned in one day
    // pricePerBuilding: Base price before adjustments
    materialRates: {
        vinyl: {
            buildingsPerDay: 6,
            pricePerBuilding: 450,
            description: "Standard vinyl siding"
        },
        hardie: {
            buildingsPerDay: 5,
            pricePerBuilding: 565,
            description: "HardiePlank fiber cement siding"
        },
        brick: {
            buildingsPerDay: 4,
            pricePerBuilding: 565,
            description: "Brick exterior"
        },
        stucco: {
            buildingsPerDay: 4,
            pricePerBuilding: 565,
            description: "Stucco finish"
        },
        mixed: {
            buildingsPerDay: 4,
            pricePerBuilding: 565,
            description: "Mixed material exterior"
        }
    },

    // Impact of building height on time and pricing
    heightMultipliers: {
        "2": {
            timeMultiplier: 1.0,    // Base multiplier for 2 stories
            priceMultiplier: 1.0    // Base price multiplier
        },
        "3": {
            timeMultiplier: 0.6,    // Takes longer per building
            priceMultiplier: 1.67   // Higher price for taller buildings
        },
        "4": {
            timeMultiplier: 0.5,    // Even longer for 4 stories
            priceMultiplier: 2.0    // Premium price for tallest buildings
        }
    },

    // Size tiers based on building perimeter (in linear feet)
    sizeTiers: {
        small: 350,    // Buildings up to 350 LF
        medium: 450,   // Buildings up to 450 LF
        large: 550,    // Buildings up to 550 LF
        xlarge: 700,   // Buildings up to 700 LF
        // Anything larger is considered xxlarge
    },

    // Project scale matrix - price multipliers based on size and quantity
    scaleMatrix: {
        small: {
            small: 0.9,     // Small buildings, small quantity
            medium: 1.0,    // Small buildings, medium quantity
            large: 1.1,     // Small buildings, large quantity
            xlarge: 1.2,    // Small buildings, extra large quantity
            xxlarge: 1.3    // Small buildings, maximum quantity
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
    },

    // Project size tiers based on building count
    projectTiers: {
        small: 5,      // Up to 5 buildings
        medium: 15,    // Up to 15 buildings
        large: 25,     // Up to 25 buildings
        xlarge: 40,    // Up to 40 buildings
        // Anything larger is considered xxlarge
    },

    // General calculator settings
    settings: {
        baselineRevenue: 2250,      // Target daily revenue
        minBuildingsPerDay: 1,      // Minimum buildings per day
        roundingPrecision: 100,     // Round prices to nearest $100
        scaleMultiplierPrecision: 2 // Decimal places for scale multiplier
    }
};

// Export the configuration
export default calculatorConfig;
