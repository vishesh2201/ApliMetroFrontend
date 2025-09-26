export const mockTrains = [
  {
    id: 'KM001',
    fitness: { stock: 'OK', signal: 'OK', telecom: 'ExpiresToday' },
    jobCards: {
      count: 2,
      severity: 'Low',
      all: [
        { title: 'Cosmetic issues (paint peel, scratches)', priority: 'Low' },
        { title: 'Non-functional USB/charging points', priority: 'Low' }
      ]
    },
    mileage: { odometer: 45600, lastService: '2024-01-15' },
    branding: { status: true, hoursRemaining: 8 },
    cleaningSlot: true,
    stablingBay: 1,
    override: false,
  },
  {
    id: 'KM002',
    fitness: { stock: 'Expired', signal: 'OK', telecom: 'OK' },
    jobCards: {
      count: 5,
      severity: 'Critical',
      all: [
        { title: 'Brake system fault (pads, discs, calipers)', priority: 'Critical' },
        { title: 'Traction motor failure / overheating', priority: 'Critical' },
        { title: 'Door interlock failure', priority: 'Critical' },
        { title: 'Fire suppression system fault', priority: 'Critical' },
        { title: 'Major telecom blackout (train radio not working)', priority: 'Critical' }
      ]
    },
    mileage: { odometer: 52300, lastService: '2024-01-10' },
    branding: { status: false, hoursRemaining: 0 },
    cleaningSlot: false,
    stablingBay: 2,
    override: true,
  },
  {
    id: 'KM003',
    fitness: { stock: 'OK', signal: 'ExpiresToday', telecom: 'OK' },
    jobCards: {
      count: 1,
      severity: 'Medium',
      all: [
        { title: 'Partial HVAC cooling issue', priority: 'Medium' }
      ]
    },
    mileage: { odometer: 41200, lastService: '2024-01-18' },
    branding: { status: true, hoursRemaining: 12 },
    cleaningSlot: true,
    stablingBay: 3,
    override: false,
  },
  {
    id: 'KM004',
    fitness: { stock: 'OK', signal: 'OK', telecom: 'OK' },
    jobCards: {
      count: 0,
      severity: 'None',
      all: []
    },
    mileage: { odometer: 38900, lastService: '2024-01-20' },
    branding: { status: true, hoursRemaining: 15 },
    cleaningSlot: false,
    stablingBay: 4,
    override: false,
  },
  {
    id: 'KM005',
    fitness: { stock: 'OK', signal: 'Expired', telecom: 'OK' },
    jobCards: {
      count: 3,
      severity: 'High',
      all: [
        { title: 'HVAC complete failure (passenger comfort + overheating risk)', priority: 'High' },
        { title: 'Pantograph / OHE shoe excessive wear', priority: 'High' },
        { title: 'Battery nearing end-of-life with risk of sudden dropout', priority: 'High' }
      ]
    },
    mileage: { odometer: 49800, lastService: '2024-01-12' },
    branding: { status: false, hoursRemaining: 0 },
    cleaningSlot: true,
    stablingBay: 5,
    override: false,
  },
  {
    id: 'KM006',
    fitness: { stock: 'OK', signal: 'OK', telecom: 'OK' },
    jobCards: {
      count: 1,
      severity: 'Low',
      all: [
        { title: 'Seat repairs / broken handles', priority: 'Low' }
      ]
    },
    mileage: { odometer: 43500, lastService: '2024-01-16' },
    branding: { status: true, hoursRemaining: 6 },
    cleaningSlot: false,
    stablingBay: 6,
    override: false,
  },
  {
    id: 'KM007',
    fitness: { stock: 'ExpiresToday', signal: 'OK', telecom: 'OK' },
    jobCards: {
      count: 2,
      severity: 'Medium',
      all: [
        { title: 'Lighting failures in cars (non-emergency lights)', priority: 'Medium' },
        { title: 'Passenger display malfunction', priority: 'Medium' }
      ]
    },
    mileage: { odometer: 47200, lastService: '2024-01-14' },
    branding: { status: true, hoursRemaining: 4 },
    cleaningSlot: true,
    stablingBay: 7,
    override: false,
  },
  {
    id: 'KM008',
    fitness: { stock: 'OK', signal: 'OK', telecom: 'OK' },
    jobCards: {
      count: 0,
      severity: 'None',
      all: []
    },
    mileage: { odometer: 40100, lastService: '2024-01-19' },
    branding: { status: false, hoursRemaining: 0 },
    cleaningSlot: false,
    stablingBay: 8,
    override: false,
  },
  {
    id: 'KM009',
    fitness: { stock: 'OK', signal: 'OK', telecom: 'ExpiresToday' },
    jobCards: {
      count: 4,
      severity: 'High',
      all: [
        { title: 'Bogie abnormal noise/vibration (bearing, axle issues)', priority: 'High' },
        { title: 'Pantograph / OHE shoe excessive wear', priority: 'High' },
        { title: 'CCTV or passenger alarm system failure', priority: 'High' },
        { title: 'Battery nearing end-of-life with risk of sudden dropout', priority: 'High' }
      ]
    },
    mileage: { odometer: 51600, lastService: '2024-01-11' },
    branding: { status: true, hoursRemaining: 20 },
    cleaningSlot: true,
    stablingBay: 9,
    override: false,
  },
  {
    id: 'KM010',
    fitness: { stock: 'OK', signal: 'OK', telecom: 'OK' },
    jobCards: {
      count: 1,
      severity: 'Low',
      all: [
        { title: 'Minor branding wrap tear', priority: 'Low' }
      ]
    },
    mileage: { odometer: 42800, lastService: '2024-01-17' },
    branding: { status: true, hoursRemaining: 10 },
    cleaningSlot: false,
    stablingBay: 10,
    override: false,
  },
  {
    id: 'KM011',
    fitness: { stock: 'Expired', signal: 'OK', telecom: 'OK' },
    jobCards: {
      count: 6,
      severity: 'Critical',
      all: [
        { title: 'Brake system fault (pads, discs, calipers)', priority: 'Critical' },
        { title: 'Traction motor failure / overheating', priority: 'Critical' },
        { title: 'Safety-critical signalling/ATP malfunction', priority: 'Critical' },
        { title: 'Door interlock failure', priority: 'Critical' },
        { title: 'Emergency braking system fault', priority: 'Critical' },
        { title: 'Fire suppression system fault', priority: 'Critical' }
      ]
    },
    mileage: { odometer: 54200, lastService: '2024-01-08' },
    branding: { status: false, hoursRemaining: 0 },
    cleaningSlot: true,
    stablingBay: 11,
    override: true,
  },
  {
    id: 'KM012',
    fitness: { stock: 'OK', signal: 'OK', telecom: 'OK' },
    jobCards: {
      count: 0,
      severity: 'None',
      all: []
    },
    mileage: { odometer: 37500, lastService: '2024-01-21' },
    branding: { status: true, hoursRemaining: 18 },
    cleaningSlot: false,
    stablingBay: 12,
    override: false,
  },
];

export const mockInductionList = [
  {
    trainId: 'KM004',
    score: 95,
    reason: 'Perfect fitness, optimal mileage, active branding',
    override: false,
    violations: [],
  },
  {
    trainId: 'KM012',
    score: 92,
    reason: 'No job cards, recent service, good branding hours',
    override: false,
    violations: [],
  },
  {
    trainId: 'KM006',
    score: 88,
    reason: 'Good overall status, minor job card',
    override: false,
    violations: ['Branding expires in 6 hours'],
  },
  {
    trainId: 'KM010',
    score: 85,
    reason: 'Stable performance, adequate branding',
    override: false,
    violations: [],
  },
  {
    trainId: 'KM001',
    score: 78,
    reason: 'Telecom certificate expires today',
    override: false,
    violations: ['Telecom certificate expires today'],
  },
  {
    trainId: 'KM003',
    score: 75,
    reason: 'Signal certificate expires today',
    override: false,
    violations: ['Signal certificate expires today'],
  },
  {
    trainId: 'KM007',
    score: 72,
    reason: 'Stock certificate expires today, short branding',
    override: false,
    violations: ['Stock certificate expires today', 'Branding expires in 4 hours'],
  },
  {
    trainId: 'KM009',
    score: 65,
    reason: 'High severity job cards, telecom expires',
    override: false,
    violations: ['High severity job cards', 'Telecom certificate expires today'],
  },
];

export const mockDashboardMetrics = {
  totalSelected: 8,
  brandingSLA: 87.5,
  mileageVariance: 12.3,
  cleaningSlotsUsed: 5,
  totalCleaningSlots: 6,
  shuntingCost: 245,
  alertsCount: 3,
};

export const mockBaselineMetrics = {
  brandingSLA: 87.5,
  mileageVariance: 12.3,
  cleaningSlots: 5,
  shuntingCost: 245,
};

export const mockScenarioMetrics = {
  brandingSLA: 92.1,
  mileageVariance: 8.7,
  cleaningSlots: 6,
  shuntingCost: 267,
};
