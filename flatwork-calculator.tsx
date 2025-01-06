import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const FlatworkCalculator = () => {
  const [inputs, setInputs] = useState({
    calculationType: 'garage',
    sfPerFloor: '',
    floors: '1',
    cleaningType: 'deep',
    severity: 'normal',
    walkwayLength: '',
    walkwayWidth: '3',
  });

  const [results, setResults] = useState(null);

  const walkwayTiers = [
    { length: 10, pricePerFt: 2.50, timeOne: 5, timeTwo: 5 },
    { length: 25, pricePerFt: 2.00, timeOne: 5, timeTwo: 5 },
    { length: 50, pricePerFt: 1.50, timeOne: 5, timeTwo: 5 },
    { length: 75, pricePerFt: 1.33, timeOne: 10, timeTwo: 5 },
    { length: 100, pricePerFt: 1.25, timeOne: 15, timeTwo: 10 },
    { length: 150, pricePerFt: 1.00, timeOne: 20, timeTwo: 15 },
  ];

  const getWalkwayPricing = (length) => {
    for (const tier of walkwayTiers) {
      if (length <= tier.length) {
        return {
          pricePerFt: tier.pricePerFt,
          timeOne: tier.timeOne,
          timeTwo: tier.timeTwo
        };
      }
    }
    return {
      pricePerFt: 1.00,
      timeOne: 25,
      timeTwo: 20
    };
  };

  const calculateMetrics = () => {
    if (inputs.calculationType === 'garage') {
      const totalSf = Number(inputs.sfPerFloor) * Number(inputs.floors);
      const sfPerDay = inputs.cleaningType === 'deep' ? 30000 : 60000;
      const daysRequired = Math.ceil(totalSf / sfPerDay);
      const dailyRate = inputs.severity === 'high' ? 2000 : 1800;
      const totalPrice = daysRequired * dailyRate;
      const pricePerSf = totalPrice / totalSf;

      setResults({
        type: 'garage',
        totalSf,
        daysRequired,
        pricePerSf,
        totalPrice,
        dailyRate,
        floors: Number(inputs.floors)
      });
    } else {
      const length = Number(inputs.walkwayLength);
      const width = Number(inputs.walkwayWidth);
      const pricing = getWalkwayPricing(length);
      const totalSf = length * width;
      const totalPrice = Math.round(length * pricing.pricePerFt * (width / 3));
      
      setResults({
        type: 'walkway',
        length,
        width,
        totalSf,
        pricePerFt: pricing.pricePerFt,
        totalPrice,
        timeOne: pricing.timeOne,
        timeTwo: pricing.timeTwo
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Flatwork Cleaning Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="block mb-2">Calculation Type</label>
          <select
            className="w-full p-2 border rounded"
            value={inputs.calculationType}
            onChange={(e) => setInputs({...inputs, calculationType: e.target.value})}
          >
            <option value="garage">Parking Garage</option>
            <option value="walkway">Walkway/Sidewalk</option>
          </select>
        </div>

        {inputs.calculationType === 'garage' ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block mb-2">SF per Floor</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={inputs.sfPerFloor}
                  onChange={(e) => setInputs({...inputs, sfPerFloor: e.target.value})}
                  placeholder="Square feet per floor"
                />
              </div>
              <div>
                <label className="block mb-2">Number of Floors</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={inputs.floors}
                  onChange={(e) => setInputs({...inputs, floors: e.target.value})}
                  placeholder="Number of floors"
                />
              </div>
              <div>
                <label className="block mb-2">Cleaning Type</label>
                <select
                  className="w-full p-2 border rounded"
                  value={inputs.cleaningType}
                  onChange={(e) => setInputs({...inputs, cleaningType: e.target.value})}
                >
                  <option value="deep">Deep Clean</option>
                  <option value="wash">Wash Down</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Cleaning Severity</label>
                <select
                  className="w-full p-2 border rounded"
                  value={inputs.severity}
                  onChange={(e) => setInputs({...inputs, severity: e.target.value})}
                >
                  <option value="normal">Normal ($1,800/day)</option>
                  <option value="high">High ($2,000/day)</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-2">Walkway Length (LF)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={inputs.walkwayLength}
                onChange={(e) => setInputs({...inputs, walkwayLength: e.target.value})}
                placeholder="Linear feet"
              />
            </div>
            <div>
              <label className="block mb-2">Walkway Width (ft)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={inputs.walkwayWidth}
                onChange={(e) => setInputs({...inputs, walkwayWidth: e.target.value})}
                placeholder="Width in feet"
              />
            </div>
          </div>
        )}

        <button
          onClick={calculateMetrics}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Calculate
        </button>

        {results && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-bold mb-4">Project Summary:</h3>
            {results.type === 'garage' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Total Square Footage:</p>
                  <p className="text-xl">{results.totalSf.toLocaleString()} sf</p>
                </div>
                <div>
                  <p className="font-medium">Days Required:</p>
                  <p className="text-xl">{results.daysRequired}</p>
                </div>
                <div>
                  <p className="font-medium">Daily Rate:</p>
                  <p className="text-xl">${results.dailyRate.toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium">Price per SF:</p>
                  <p className="text-xl">${results.pricePerSf.toFixed(3)}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Total Project Cost:</p>
                  <p className="text-xl text-blue-600">${results.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Total Square Footage:</p>
                  <p className="text-xl">{results.totalSf.toLocaleString()} sf</p>
                </div>
                <div>
                  <p className="font-medium">Price per Linear Foot:</p>
                  <p className="text-xl">${results.pricePerFt.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-medium">Time Required (1 person):</p>
                  <p className="text-xl">{results.timeOne} mins</p>
                </div>
                <div>
                  <p className="font-medium">Time Required (2 people):</p>
                  <p className="text-xl">{results.timeTwo} mins</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Total Project Cost:</p>
                  <p className="text-xl text-blue-600">${results.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlatworkCalculator;