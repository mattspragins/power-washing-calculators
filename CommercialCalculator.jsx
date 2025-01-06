import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const CommercialCalculator = () => {
  const [inputs, setInputs] = useState({
    perimeter: '',
    stories: '2',
    buildingCount: '',
    material: 'vinyl',
  });

  const [results, setResults] = useState(null);

  const baseRates = {
    vinyl: { buildingsPerDay: 6, pricePerBuilding: 450 },
    hardie: { buildingsPerDay: 5, pricePerBuilding: 565 },
    brick: { buildingsPerDay: 4, pricePerBuilding: 565 },
    stucco: { buildingsPerDay: 4, pricePerBuilding: 565 },
    mixed: { buildingsPerDay: 4, pricePerBuilding: 565 }
  };

  const heightImpact = {
    '2': { timeMultiplier: 1, priceMultiplier: 1 },
    '3': { timeMultiplier: 0.6, priceMultiplier: 1.67 },
    '4': { timeMultiplier: 0.5, priceMultiplier: 2.0 }
  };

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
        small: 0.9, medium: 1.0, large: 1.1, xlarge: 1.2, xxlarge: 1.3
      },
      medium: {
        small: 1.0, medium: 1.2, large: 1.3, xlarge: 1.4, xxlarge: 1.5
      },
      large: {
        small: 1.2, medium: 1.4, large: 1.5, xlarge: 1.6, xxlarge: 1.7
      },
      xlarge: {
        small: 1.4, medium: 1.6, large: 1.7, xlarge: 1.8, xxlarge: 1.9
      },
      xxlarge: {
        small: 1.6, medium: 1.8, large: 1.9, xlarge: 2.0, xxlarge: 2.1
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

  const calculateMetrics = () => {
    const roundTo100 = (num) => Math.round(num / 100) * 100;
    
    let buildingsPerDay = baseRates[inputs.material].buildingsPerDay;
    let basePrice = baseRates[inputs.material].pricePerBuilding;

    const scaleMultiplier = getProjectScaleMultiplier(
      Number(inputs.perimeter), 
      Number(inputs.buildingCount)
    );

    buildingsPerDay *= heightImpact[inputs.stories].timeMultiplier;
    buildingsPerDay = Math.max(1, Math.round(buildingsPerDay * 10) / 10);

    let pricePerBuilding = basePrice * scaleMultiplier * heightImpact[inputs.stories].priceMultiplier;
    pricePerBuilding = roundTo100(pricePerBuilding);
    
    const totalDays = Math.ceil(inputs.buildingCount / buildingsPerDay);
    const totalCost = roundTo100(pricePerBuilding * inputs.buildingCount);
    const dailyRevenue = roundTo100(pricePerBuilding * buildingsPerDay);

    setResults({
      pricePerBuilding,
      buildingsPerDay,
      totalDays,
      dailyRevenue,
      totalCost,
      scaleMultiplier: Math.round(scaleMultiplier * 100) / 100,
      baselineRevenue: 2250
    });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Commercial Building Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-2">Building Perimeter (LF)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={inputs.perimeter}
              onChange={(e) => setInputs({...inputs, perimeter: e.target.value})}
              placeholder="Enter perimeter in linear feet"
            />
          </div>
          <div>
            <label className="block mb-2">Number of Stories</label>
            <select
              className="w-full p-2 border rounded"
              value={inputs.stories}
              onChange={(e) => setInputs({...inputs, stories: e.target.value})}
            >
              <option value="2">2 Stories</option>
              <option value="3">3 Stories</option>
              <option value="4">4 Stories</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Number of Buildings</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={inputs.buildingCount}
              onChange={(e) => setInputs({...inputs, buildingCount: e.target.value})}
              placeholder="Total buildings in complex"
            />
          </div>
          <div>
            <label className="block mb-2">Primary Material</label>
            <select
              className="w-full p-2 border rounded"
              value={inputs.material}
              onChange={(e) => setInputs({...inputs, material: e.target.value})}
            >
              <option value="vinyl">Vinyl</option>
              <option value="hardie">HardiePlank</option>
              <option value="brick">Brick</option>
              <option value="stucco">Stucco</option>
              <option value="mixed">Mixed Materials</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={calculateMetrics}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Calculate
        </button>
        
        {results && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-bold mb-4">Project Summary:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Price per Building:</p>
                <p className="text-xl">${results.pricePerBuilding.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Buildings per Day:</p>
                <p className="text-xl">{results.buildingsPerDay}</p>
              </div>
              <div>
                <p className="font-medium">Daily Revenue:</p>
                <p className="text-xl">${results.dailyRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">(Baseline: ${results.baselineRevenue.toLocaleString()})</p>
              </div>
              <div>
                <p className="font-medium">Scale Multiplier:</p>
                <p className="text-xl">{results.scaleMultiplier}x</p>
              </div>
              <div>
                <p className="font-medium">Total Days:</p>
                <p className="text-xl">{results.totalDays}</p>
              </div>
              <div>
                <p className="font-medium">Total Project Cost:</p>
                <p className="text-xl text-blue-600">${results.totalCost.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommercialCalculator;