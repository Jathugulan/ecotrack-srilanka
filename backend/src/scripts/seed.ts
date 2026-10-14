import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { Organization } from '../modules/organizations/organization.model.js';
import { User } from '../modules/users/user.model.js';
import { ServiceZone } from '../modules/service-zones/serviceZone.model.js';
import { Vehicle } from '../modules/vehicles/vehicle.model.js';
import { CollectionSchedule } from '../modules/schedules/schedule.model.js';
import { WasteReport } from '../modules/waste-reports/wasteReport.model.js';
import { CollectionTask } from '../modules/collection-tasks/collectionTask.model.js';
import { RecyclingCenter } from '../modules/recycling-centers/recyclingCenter.model.js';
import { RecyclingTransaction } from '../modules/recycling-transactions/recyclingTransaction.model.js';
import { RewardLedger } from '../modules/rewards/rewardLedger.model.js';

async function seed() {
  console.log('[Seed] Connecting to MongoDB...');
  await mongoose.connect(env.MONGODB_URI);
  console.log('[Seed] Connected.');

  // Clean existing collections
  await Promise.all([
    Organization.deleteMany({}),
    User.deleteMany({}),
    ServiceZone.deleteMany({}),
    Vehicle.deleteMany({}),
    CollectionSchedule.deleteMany({}),
    WasteReport.deleteMany({}),
    CollectionTask.deleteMany({}),
    RecyclingCenter.deleteMany({}),
    RecyclingTransaction.deleteMany({}),
    RewardLedger.deleteMany({}),
  ]);
  console.log('[Seed] Cleared existing data.');

  // 1. Create Organizations
  const cmc = await Organization.create({
    name: 'Colombo Municipal Council',
    organizationType: 'MUNICIPAL_COUNCIL',
    district: 'Colombo',
    address: 'Town Hall, Colombo 07, Sri Lanka',
    contactDetails: {
      phone: '+94112693151',
      email: 'info@colombo.mc.gov.lk',
      website: 'https://colombo.mc.gov.lk',
    },
    isActive: true,
  });

  const kmc = await Organization.create({
    name: 'Kandy Municipal Council',
    organizationType: 'MUNICIPAL_COUNCIL',
    district: 'Kandy',
    address: 'City Hall, Kandy, Sri Lanka',
    contactDetails: {
      phone: '+94812222275',
      email: 'info@kandy.mc.gov.lk',
    },
    isActive: true,
  });

  const ecospindlesOrg = await Organization.create({
    name: 'EcoSpindles Circular Recycling',
    organizationType: 'RECYCLING_CONSORTIUM',
    district: 'Colombo',
    address: '15 Baseline Road, Kirulapone, Colombo 05',
    contactDetails: {
      phone: '+94112508899',
      email: 'info@ecospindles.lk',
    },
    isActive: true,
  });

  // 2. Create Service Zones for Colombo
  const zoneCinnamon = await ServiceZone.create({
    organizationId: cmc._id,
    name: 'District 2B - Cinnamon Gardens & Kollupitiya',
    district: 'Colombo',
    localAuthority: 'Colombo Municipal Council',
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [79.8510, 6.9150],
          [79.8700, 6.9150],
          [79.8700, 6.8950],
          [79.8510, 6.8950],
          [79.8510, 6.9150],
        ],
      ],
    },
    isActive: true,
  });

  const zonePettah = await ServiceZone.create({
    organizationId: cmc._id,
    name: 'District 1 - Fort & Pettah Market',
    district: 'Colombo',
    localAuthority: 'Colombo Municipal Council',
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [79.8400, 6.9450],
          [79.8600, 6.9450],
          [79.8600, 6.9300],
          [79.8400, 6.9300],
          [79.8400, 6.9450],
        ],
      ],
    },
    isActive: true,
  });

  // 3. Create Seed Users
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  const resident = await User.create({
    fullName: 'Kasun Perera',
    email: 'resident@ecotrack.lk',
    phone: '+94771234567',
    passwordHash,
    role: 'RESIDENT',
    preferredLanguage: 'en',
    isEmailVerified: true,
  });

  const officer = await User.create({
    fullName: 'Eng. Shamila Mohamed',
    email: 'officer@colombo.mc.gov.lk',
    phone: '+94712345678',
    passwordHash,
    role: 'MUNICIPAL_OFFICER',
    organizationId: cmc._id,
    serviceZoneId: zoneCinnamon._id,
    preferredLanguage: 'en',
    isEmailVerified: true,
  });

  const worker = await User.create({
    fullName: 'Kamal Jayasinghe',
    email: 'worker@colombo.mc.gov.lk',
    phone: '+94781234567',
    passwordHash,
    role: 'COLLECTION_WORKER',
    organizationId: cmc._id,
    serviceZoneId: zoneCinnamon._id,
    preferredLanguage: 'si',
    isEmailVerified: true,
  });

  const driver = await User.create({
    fullName: 'Bandara Jayawardena',
    email: 'driver@colombo.mc.gov.lk',
    phone: '+94751234567',
    passwordHash,
    role: 'DRIVER',
    organizationId: cmc._id,
    preferredLanguage: 'si',
    isEmailVerified: true,
  });

  const partner = await User.create({
    fullName: 'Nimal Fernando',
    email: 'partner@ecospindles.lk',
    phone: '+94701234567',
    passwordHash,
    role: 'RECYCLING_PARTNER',
    organizationId: ecospindlesOrg._id,
    preferredLanguage: 'en',
    isEmailVerified: true,
  });

  const admin = await User.create({
    fullName: 'System Administrator',
    email: 'admin@ecotrack.lk',
    phone: '+94119999999',
    passwordHash,
    role: 'SYSTEM_ADMIN',
    preferredLanguage: 'en',
    isEmailVerified: true,
  });

  // 4. Create Vehicles
  const vehicle1 = await Vehicle.create({
    organizationId: cmc._id,
    registrationNumber: 'WP-DA-4892',
    vehicleType: 'COMPACTOR_TRUCK',
    capacity: 7.5,
    capacityUnit: 'METRIC_TON',
    status: 'ACTIVE',
    assignedDriverId: driver._id,
  });

  const vehicle2 = await Vehicle.create({
    organizationId: cmc._id,
    registrationNumber: 'WP-LH-1029',
    vehicleType: 'TIPPER',
    capacity: 4.0,
    capacityUnit: 'METRIC_TON',
    status: 'ACTIVE',
  });

  // 5. Create Schedules
  await CollectionSchedule.create({
    organizationId: cmc._id,
    serviceZoneId: zoneCinnamon._id,
    wasteCategories: ['ORGANIC'],
    collectionDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
    startTime: '06:30',
    endTime: '10:30',
    effectiveFrom: new Date(),
    isActive: true,
  });

  await CollectionSchedule.create({
    organizationId: cmc._id,
    serviceZoneId: zoneCinnamon._id,
    wasteCategories: ['PLASTIC', 'PAPER', 'METAL'],
    collectionDays: ['TUESDAY', 'THURSDAY', 'SATURDAY'],
    startTime: '08:00',
    endTime: '12:00',
    effectiveFrom: new Date(),
    isActive: true,
  });

  // 6. Create Recycling Centers
  const depot1 = await RecyclingCenter.create({
    name: 'EcoSpindles Kirulapone Aggregation Hub',
    organizationId: ecospindlesOrg._id,
    location: {
      type: 'Point',
      coordinates: [79.8712, 6.8911],
    },
    address: '15 Baseline Road, Kirulapone, Colombo 05',
    acceptedMaterials: ['PLASTIC', 'PAPER', 'METAL'],
    openingHours: 'Mon - Sat: 08:30 - 17:00',
    contactDetails: {
      phone: '+94112508899',
      email: 'depot@ecospindles.lk',
    },
    isActive: true,
  });

  await RecyclingCenter.create({
    name: 'CEA Community Resource Recovery Center',
    location: {
      type: 'Point',
      coordinates: [79.9125, 6.9015],
    },
    address: 'Denzil Kobbekaduwa Mawatha, Battaramulla',
    acceptedMaterials: ['PLASTIC', 'GLASS', 'E_WASTE', 'PAPER'],
    openingHours: 'Mon - Sun: 08:00 - 18:00',
    contactDetails: {
      phone: '+94112872278',
    },
    isActive: true,
  });

  // 7. Create Sample Reports
  const report1 = await WasteReport.create({
    referenceNumber: 'ET-202610-00101',
    residentId: resident._id,
    organizationId: cmc._id,
    serviceZoneId: zoneCinnamon._id,
    category: 'PLASTIC',
    description: 'Pile of beverage bottles and polythene bags dumped beside the pedestrian pavement.',
    severity: 'HIGH',
    images: ['https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800'],
    location: {
      type: 'Point',
      coordinates: [79.8610, 6.9075],
    },
    address: 'Near Viharamahadevi Park Entrance, Colombo 07',
    aiClassification: {
      suggestedCategory: 'PLASTIC',
      confidence: 0.94,
      requiresHumanReview: false,
      evaluatedAt: new Date(),
    },
    status: 'ASSIGNED',
    statusHistory: [
      {
        status: 'SUBMITTED',
        changedBy: resident._id,
        notes: 'Complaint submitted by citizen',
        timestamp: new Date(Date.now() - 3600000 * 5),
      },
      {
        status: 'ASSIGNED',
        changedBy: officer._id,
        notes: 'Assigned to morning truck crew',
        timestamp: new Date(Date.now() - 3600000 * 2),
      },
    ],
  });

  const report2 = await WasteReport.create({
    referenceNumber: 'ET-202610-00102',
    residentId: resident._id,
    organizationId: cmc._id,
    serviceZoneId: zonePettah._id,
    category: 'ORGANIC',
    description: 'Decomposing vegetable and market fruit waste accumulating near canal railing.',
    severity: 'CRITICAL',
    images: ['https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800'],
    location: {
      type: 'Point',
      coordinates: [79.8520, 6.9350],
    },
    address: 'Near Pettah Floating Market, Bastian Mawatha, Colombo 11',
    aiClassification: {
      suggestedCategory: 'ORGANIC',
      confidence: 0.91,
      requiresHumanReview: false,
      evaluatedAt: new Date(),
    },
    status: 'SUBMITTED',
    statusHistory: [
      {
        status: 'SUBMITTED',
        changedBy: resident._id,
        notes: 'Complaint submitted',
        timestamp: new Date(Date.now() - 3600000 * 1),
      },
    ],
  });

  const report3 = await WasteReport.create({
    referenceNumber: 'ET-202610-00103',
    residentId: resident._id,
    organizationId: cmc._id,
    serviceZoneId: zoneCinnamon._id,
    category: 'E_WASTE',
    description: 'Discarded computer monitors and cables left near roadside transformer.',
    severity: 'MEDIUM',
    images: ['https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800'],
    location: {
      type: 'Point',
      coordinates: [79.8565, 6.9020],
    },
    address: 'Dharmapala Mawatha, Colombo 03',
    aiClassification: {
      suggestedCategory: 'E_WASTE',
      confidence: 0.88,
      requiresHumanReview: false,
      evaluatedAt: new Date(),
    },
    status: 'RESOLVED',
    resolvedAt: new Date(Date.now() - 3600000 * 10),
    statusHistory: [
      {
        status: 'SUBMITTED',
        changedBy: resident._id,
        notes: 'Complaint logged',
        timestamp: new Date(Date.now() - 3600000 * 20),
      },
      {
        status: 'RESOLVED',
        changedBy: officer._id,
        notes: 'Collected by specialized e-waste unit',
        timestamp: new Date(Date.now() - 3600000 * 10),
      },
    ],
  });

  // 8. Create Collection Task linked to Report 1
  const task1 = await CollectionTask.create({
    reportId: report1._id,
    organizationId: cmc._id,
    assignedWorkerId: worker._id,
    assignedDriverId: driver._id,
    vehicleId: vehicle1._id,
    scheduledAt: new Date(),
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    syncStatus: 'SYNCED',
  });

  await WasteReport.findByIdAndUpdate(report1._id, {
    assignedTaskId: task1._id,
  });

  // 9. Create Sample Recycling Transaction and Ledger Entry
  const sampleTx = await RecyclingTransaction.create({
    idempotencyKey: 'tx-seed-sample-001',
    residentId: resident._id,
    recyclingCenterId: depot1._id,
    verifiedBy: partner._id,
    materials: [
      {
        category: 'PLASTIC',
        subType: 'PET Bottles',
        quantity: 5.0,
        quantityUnit: 'KG',
        pointsPerUnit: 10,
        awardedPoints: 50,
      },
      {
        category: 'PAPER',
        subType: 'Cardboard Boxes',
        quantity: 8.0,
        quantityUnit: 'KG',
        pointsPerUnit: 5,
        awardedPoints: 40,
      },
    ],
    verificationStatus: 'VERIFIED',
    totalRewardPoints: 90,
    verifiedAt: new Date(Date.now() - 86400000 * 2),
  });

  await RewardLedger.create({
    residentId: resident._id,
    transactionId: sampleTx._id,
    transactionType: 'CREDIT',
    points: 90,
    balanceAfter: 90,
    description: 'Verified Drop-Off at Kirulapone Hub: 5kg PET, 8kg Cardboard',
    createdAt: new Date(Date.now() - 86400000 * 2),
  });

  console.log('[Seed] Database populated successfully with authentic Sri Lankan datasets!');
  console.log('-----------------------------------------------------------------');
  console.log('Sample Logins (Password for all: Password123!)');
  console.log('👤 Resident:          resident@ecotrack.lk');
  console.log('🏛️ Municipal Officer: officer@colombo.mc.gov.lk');
  console.log('👷 Field Worker:      worker@colombo.mc.gov.lk');
  console.log('🚛 Driver:            driver@colombo.mc.gov.lk');
  console.log('♻️ Recycling Partner: partner@ecospindles.lk');
  console.log('🛡️ System Admin:      admin@ecotrack.lk');
  console.log('-----------------------------------------------------------------');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
