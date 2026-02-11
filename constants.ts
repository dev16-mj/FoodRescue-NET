
import { NGO, WasteStat } from './types';

export const TN_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 
  'Kallakurichi', 'Kancheepuram', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 
  'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 
  'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 
  'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
];

export const MOCK_NGOS: NGO[] = [
  { id: 'n1', name: 'Ariyalur Social Welfare Trust', type: 'NGO', description: 'Rural development and food security programs for local laborers.', address: 'Market Road, Ariyalur', district: 'Ariyalur', phone: '+91-4329-222333', coordinates: { lat: 11.1388, lng: 79.0741 }, isVerified: true },
  { id: 'n2', name: 'Chengalpattu Life Line', type: 'Charity', description: 'Supporting industrial workers with surplus food recovery.', address: 'GST Road, Chengalpattu', district: 'Chengalpattu', phone: '+91-44-27421122', coordinates: { lat: 12.6841, lng: 79.9836 }, isVerified: true },
  { id: 'n3', name: 'Akshaya Patra Foundation', type: 'NGO', description: 'Providing mid-day meals to school children and supporting urban hunger programs.', address: 'Sarjapur Road, Chennai', district: 'Chennai', phone: '+91-44-24213911', coordinates: { lat: 13.0827, lng: 80.2707 }, isVerified: true },
  { id: 'n4', name: 'No Food Waste', type: 'Charity', description: 'Dedicated food recovery and distribution network for weddings and events.', address: 'Vadavalli Road, Coimbatore', district: 'Coimbatore', phone: '+91-9087790877', coordinates: { lat: 11.0168, lng: 76.9558 }, isVerified: true },
  { id: 'n5', name: 'Cuddalore Coastal Care', type: 'NGO', description: 'Fishermen support and surplus food distribution in coastal belts.', address: 'Beach Road, Cuddalore', district: 'Cuddalore', phone: '+91-4142-230001', coordinates: { lat: 11.7480, lng: 79.7714 }, isVerified: true },
  { id: 'n6', name: 'Dharmapuri Tribal Support', type: 'Charity', description: 'Feeding programs in hilly and tribal regions of Dharmapuri.', address: 'Hogenakkal Road, Dharmapuri', district: 'Dharmapuri', phone: '+91-4342-260002', coordinates: { lat: 12.1277, lng: 78.1582 }, isVerified: true },
  { id: 'n7', name: 'Dindigul Care Network', type: 'NGO', description: 'Agricultural surplus management and community kitchens.', address: 'Palani Road, Dindigul', district: 'Dindigul', phone: '+91-451-2423344', coordinates: { lat: 10.3673, lng: 77.9803 }, isVerified: true },
  { id: 'n8', name: 'Erode Seva Sangam', type: 'Charity', description: 'Zero-waste initiative focusing on textile hub community centers.', address: 'Perundurai Road, Erode', district: 'Erode', phone: '+91-424-2256789', coordinates: { lat: 11.3410, lng: 77.7172 }, isVerified: true },
  { id: 'n9', name: 'Kallakurichi Grama Seva', type: 'NGO', description: 'Rural upliftment through surplus grain distribution.', address: 'Salem Main Road, Kallakurichi', district: 'Kallakurichi', phone: '+91-4151-222003', coordinates: { lat: 11.7380, lng: 78.9639 }, isVerified: true },
  { id: 'n10', name: 'Kancheepuram Silk City Relief', type: 'Charity', description: 'Supporting weaver communities with nutritional aid.', address: 'Temple City Road, Kancheepuram', district: 'Kancheepuram', phone: '+91-44-27221122', coordinates: { lat: 12.8342, lng: 79.7036 }, isVerified: true },
  { id: 'n11', name: 'Karur Industrial Support', type: 'NGO', description: 'Food rescue from industrial canteens in Karur.', address: 'Bypass Road, Karur', district: 'Karur', phone: '+91-4324-240004', coordinates: { lat: 10.9504, lng: 78.0844 }, isVerified: true },
  { id: 'n12', name: 'Krishnagiri Hill Rescue', type: 'Charity', description: 'Logistics support for food delivery in difficult terrains.', address: 'Hosur Road, Krishnagiri', district: 'Krishnagiri', phone: '+91-4343-230005', coordinates: { lat: 12.5186, lng: 78.2137 }, isVerified: true },
  { id: 'n13', name: 'Madurai Food Bank', type: 'Charity', description: 'City-wide food security program serving the homeless.', address: 'East Masi Street, Madurai', district: 'Madurai', phone: '+91-452-1234567', coordinates: { lat: 9.9252, lng: 78.1198 }, isVerified: true },
  { id: 'n14', name: 'Mayiladuthurai Holy Charity', type: 'NGO', description: 'Redistributing temple offering surplus to pilgrims and the needy.', address: 'Cauvery Bank, Mayiladuthurai', district: 'Mayiladuthurai', phone: '+91-4364-222333', coordinates: { lat: 11.1017, lng: 79.6521 }, isVerified: true },
  { id: 'n15', name: 'Nagai Fishermen Relief', type: 'Charity', description: 'Support for coastal villages during off-seasons.', address: 'Nagore Road, Nagapattinam', district: 'Nagapattinam', phone: '+91-4365-240006', coordinates: { lat: 10.7672, lng: 79.8444 }, isVerified: true },
  { id: 'n16', name: 'Namakkal Poultry Belt Care', type: 'NGO', description: 'Providing meals to truck drivers and logistics workers.', address: 'Trichy Road, Namakkal', district: 'Namakkal', phone: '+91-4286-220007', coordinates: { lat: 11.2189, lng: 78.1677 }, isVerified: true },
  { id: 'n17', name: 'Nilgiris Eco Rescue', type: 'Charity', description: 'Sustainable food rescue in hill stations and tea estates.', address: 'Commercial Road, Ooty', district: 'Nilgiris', phone: '+91-423-2441122', coordinates: { lat: 11.4102, lng: 76.6950 }, isVerified: true },
  { id: 'n18', name: 'Perambalur Rural Uplift', type: 'NGO', description: 'Farmer-to-consumer surplus bridge program.', address: 'Collectorate Road, Perambalur', district: 'Perambalur', phone: '+91-4328-220008', coordinates: { lat: 11.2342, lng: 78.8821 }, isVerified: true },
  { id: 'n19', name: 'Pudukkottai Heritage NGO', type: 'Charity', description: 'Historical site community feeding initiatives.', address: 'Palace Road, Pudukkottai', district: 'Pudukkottai', phone: '+91-4322-220009', coordinates: { lat: 10.3833, lng: 78.8167 }, isVerified: true },
  { id: 'n20', name: 'Ramnad Drought Relief', type: 'NGO', description: 'Water and food security in water-scarce regions.', address: 'Pamban Road, Ramanathapuram', district: 'Ramanathapuram', phone: '+91-4567-220010', coordinates: { lat: 9.3622, lng: 78.8394 }, isVerified: true },
  { id: 'n21', name: 'Ranipet Leather Belt Relief', type: 'Charity', description: 'Nutritional programs for industrial labor camps.', address: 'Walaja Road, Ranipet', district: 'Ranipet', phone: '+91-4172-230011', coordinates: { lat: 12.9272, lng: 79.3323 }, isVerified: true },
  { id: 'n22', name: 'Helping Hearts Salem', type: 'NGO', description: 'Urban hunger relief and community kitchens in Salem city.', address: 'Trichy Road, Salem', district: 'Salem', phone: '+91-427-2441122', coordinates: { lat: 11.6643, lng: 78.1460 }, isVerified: true },
  { id: 'n23', name: 'Sivaganga Royal Care', type: 'Charity', description: 'Traditional community feeding revived for the modern era.', address: 'Court Road, Sivaganga', district: 'Sivaganga', phone: '+91-4575-240012', coordinates: { lat: 9.8433, lng: 78.4833 }, isVerified: true },
  { id: 'n24', name: 'Tenkasi Waterfall Relief', type: 'NGO', description: 'Supporting seasonal workers and pilgrims in Tenkasi.', address: 'Courtallam Road, Tenkasi', district: 'Tenkasi', phone: '+91-4633-220013', coordinates: { lat: 8.9592, lng: 77.3150 }, isVerified: true },
  { id: 'n25', name: 'Thanjavur Delta Rescue', type: 'Charity', description: 'Managing rice mill surplus for regional distribution.', address: 'Big Temple Road, Thanjavur', district: 'Thanjavur', phone: '+91-4362-274000', coordinates: { lat: 10.7870, lng: 79.1378 }, isVerified: true },
  { id: 'n26', name: 'Theni Highland Care', type: 'NGO', description: 'Farmer surplus collection and tribal area delivery.', address: 'Bodi Road, Theni', district: 'Theni', phone: '+91-4546-240014', coordinates: { lat: 10.0104, lng: 77.4768 }, isVerified: true },
  { id: 'n27', name: 'Thoothukudi Port Aid', type: 'Charity', description: 'Feeding dock workers and migrant families at the port.', address: 'Harbour Road, Thoothukudi', district: 'Thoothukudi', phone: '+91-461-230015', coordinates: { lat: 8.7642, lng: 78.1348 }, isVerified: true },
  { id: 'n28', name: 'Tiruchirappalli Rockfort Aid', type: 'NGO', description: 'Urban hunger relief project serving the slum clusters.', address: 'Anna Salai, Tiruchirappalli', district: 'Tiruchirappalli', phone: '+91-431-2400000', coordinates: { lat: 10.8505, lng: 78.6856 }, isVerified: true },
  { id: 'n29', name: 'Nellai Food Rescue', type: 'NGO', description: 'Recovering food from religious gatherings and local festivals.', address: 'South Mount Road, Tirunelveli', district: 'Tirunelveli', phone: '+91-462-2334455', coordinates: { lat: 8.7139, lng: 77.7567 }, isVerified: true },
  { id: 'n30', name: 'Tirupathur Border Support', type: 'Charity', description: 'Aid for highway travelers and rural border communities.', address: 'Vaniyambadi Road, Tirupathur', district: 'Tirupathur', phone: '+91-4179-220016', coordinates: { lat: 12.4930, lng: 78.5684 }, isVerified: true },
  { id: 'n31', name: 'Tiruppur Textile Surplus', type: 'NGO', description: 'Industrial canteen surplus rescue and worker feeding.', address: 'Avinashi Road, Tiruppur', district: 'Tiruppur', phone: '+91-421-2220017', coordinates: { lat: 11.1085, lng: 77.3411 }, isVerified: true },
  { id: 'n32', name: 'Tiruvallur Industrial Relief', type: 'Charity', description: 'Supporting auto-hub factory workers with nutritional support.', address: 'Chennai Bypass, Tiruvallur', district: 'Tiruvallur', phone: '+91-44-27660018', coordinates: { lat: 13.1437, lng: 79.9129 }, isVerified: true },
  { id: 'n33', name: 'Tiruvannamalai Annadhanam', type: 'NGO', description: 'Supporting pilgrims with organized surplus distribution.', address: 'Girivalam Path, Tiruvannamalai', district: 'Tiruvannamalai', phone: '+91-4175-223344', coordinates: { lat: 12.2274, lng: 79.0707 }, isVerified: true },
  { id: 'n34', name: 'Tiruvarur Farmers Friend', type: 'Charity', description: 'Grains and vegetables rescue in the paddy heartland.', address: 'Thanjavur Road, Tiruvarur', district: 'Tiruvarur', phone: '+91-4366-240019', coordinates: { lat: 10.7667, lng: 79.6333 }, isVerified: true },
  { id: 'n35', name: 'Vellore Community Kitchen', type: 'NGO', description: 'Nutritious surplus food to transit workers and families.', address: 'Old Katpadi Road, Vellore', district: 'Vellore', phone: '+91-416-2224455', coordinates: { lat: 12.9165, lng: 79.1325 }, isVerified: true },
  { id: 'n36', name: 'Viluppuram Central Care', type: 'Charity', description: 'Connecting highway motels with rural feeding points.', address: 'Gingee Road, Viluppuram', district: 'Viluppuram', phone: '+91-4146-240020', coordinates: { lat: 11.9401, lng: 79.4861 }, isVerified: true },
  { id: 'n37', name: 'Virudhunagar Fire Relief', type: 'NGO', description: 'Safety and nutrition support for local industry laborers.', address: 'Sivakasi Road, Virudhunagar', district: 'Virudhunagar', phone: '+91-4562-240021', coordinates: { lat: 9.5850, lng: 77.9492 }, isVerified: true },
  // 15 additional NGOs
  { id: 'n38', name: 'Hunger Zero Chennai', type: 'NGO', description: 'Metro-wide food rescue network operating 24/7.', address: 'T. Nagar, Chennai', district: 'Chennai', phone: '+91-44-28283000', coordinates: { lat: 13.0418, lng: 80.2341 }, isVerified: true },
  { id: 'n39', name: 'Kovai Food Rescuers', type: 'Charity', description: 'Connecting large kitchens with night shelters in Coimbatore.', address: 'Race Course Road, Coimbatore', district: 'Coimbatore', phone: '+91-422-2301010', coordinates: { lat: 11.0018, lng: 76.9691 }, isVerified: true },
  { id: 'n40', name: 'Temple City Feeders', type: 'NGO', description: 'Serving the elderly around the Meenakshi Temple area.', address: 'Chithirai Street, Madurai', district: 'Madurai', phone: '+91-452-2333000', coordinates: { lat: 9.9195, lng: 78.1193 }, isVerified: true },
  { id: 'n41', name: 'Delta Hunger Relief', type: 'Charity', description: 'Mobile pantry service for delta region farm hands.', address: 'Chatram Bus Stand, Tiruchirappalli', district: 'Tiruchirappalli', phone: '+91-431-2700800', coordinates: { lat: 10.8286, lng: 78.6883 }, isVerified: true },
  { id: 'n42', name: 'Steel City Surplus Support', type: 'NGO', description: 'Industrial belt food recovery and distribution specialist.', address: 'Five Roads, Salem', district: 'Salem', phone: '+91-427-2334000', coordinates: { lat: 11.6811, lng: 78.1332 }, isVerified: true },
  { id: 'n43', name: 'Knitwear Belt Charity', type: 'Charity', description: 'Supporting textile migrant workers with evening meal packs.', address: 'Palladam Road, Tiruppur', district: 'Tiruppur', phone: '+91-421-2245000', coordinates: { lat: 11.0967, lng: 77.3483 }, isVerified: true },
  { id: 'n44', name: 'Fort City Community Meals', type: 'NGO', description: 'Regular breakfast and lunch service for transit populations.', address: 'Sankaranpalayam, Vellore', district: 'Vellore', phone: '+91-416-2244001', coordinates: { lat: 12.9125, lng: 79.1350 }, isVerified: true },
  { id: 'n45', name: 'Turmeric Valley Food Bank', type: 'Charity', description: 'Food rescue and preservation experts in Erode.', address: 'Brough Road, Erode', district: 'Erode', phone: '+91-424-2223000', coordinates: { lat: 11.3410, lng: 77.7172 }, isVerified: true },
  { id: 'n46', name: 'Chola Land Grain Bank', type: 'NGO', description: 'Community-led grain and pulse bank for seasonal drought relief.', address: 'Kumbakonam Road, Thanjavur', district: 'Thanjavur', phone: '+91-4362-234500', coordinates: { lat: 10.7870, lng: 79.1378 }, isVerified: true },
  { id: 'n47', name: 'Southern Cross Aid', type: 'Charity', description: 'Distributing coastal harvest and dry rations to remote villages.', address: 'Nagercoil Road, Kanyakumari', district: 'Kanyakumari', phone: '+91-4652-234567', coordinates: { lat: 8.0883, lng: 77.5385 }, isVerified: true },
  { id: 'n48', name: 'Halwa City Relief', type: 'NGO', description: 'Recovering surplus from commercial establishments and sweet shops.', address: 'Vannarpettai, Tirunelveli', district: 'Tirunelveli', phone: '+91-462-2501001', coordinates: { lat: 8.7139, lng: 77.7567 }, isVerified: true },
  { id: 'n49', name: 'Pearl City Pantry', type: 'Charity', description: 'Port-side food recovery and sailor family support.', address: 'WGC Road, Thoothukudi', district: 'Thoothukudi', phone: '+91-461-2321000', coordinates: { lat: 8.7642, lng: 78.1348 }, isVerified: true },
  { id: 'n50', name: 'Chettinad Charity Network', type: 'NGO', description: 'Leveraging traditional kitchens to serve modern nutrition needs.', address: 'Karaikudi Bypass, Sivaganga', district: 'Sivaganga', phone: '+91-4575-234000', coordinates: { lat: 10.0733, lng: 78.7833 }, isVerified: true },
  { id: 'n51', name: 'Blue Mountain Food Security', type: 'Charity', description: 'Ensuring food supply chains in high-altitude plantations.', address: 'Coonoor Road, Nilgiris', district: 'Nilgiris', phone: '+91-423-2234001', coordinates: { lat: 11.4102, lng: 76.6950 }, isVerified: true },
  { id: 'n52', name: 'Temple Town Nutrition Hub', type: 'NGO', description: 'Specialized nutrition packs for the elderly near pilgrimage sites.', address: 'Sannadhi Street, Kancheepuram', district: 'Kancheepuram', phone: '+91-44-27223001', coordinates: { lat: 12.8342, lng: 79.7036 }, isVerified: true }
];

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const DISTRICT_POPS: Record<string, string> = {
  'Ariyalur': '825,410', 'Chengalpattu': '3,940,649', 'Chennai': '4,646,732', 'Coimbatore': '3,458,410', 
  'Cuddalore': '2,605,914', 'Dharmapuri': '1,506,843', 'Dindigul': '2,159,742', 'Erode': '2,254,998', 
  'Kallakurichi': '1,370,281', 'Kancheepuram': '1,365,420', 'Karur': '1,064,493', 'Krishnagiri': '1,879,809', 
  'Madurai': '1,448,580', 'Mayiladuthurai': '918,356', 'Nagapattinam': '697,372', 'Namakkal': '1,726,601', 
  'Nilgiris': '735,394', 'Perambalur': '565,223', 'Pudukkottai': '1,618,345', 'Ramanathapuram': '1,353,445', 
  'Ranipet': '1,210,277', 'Salem': '1,661,700', 'Sivaganga': '1,339,101', 'Tenkasi': '1,407,627', 
  'Thanjavur': '2,405,890', 'Theni': '1,245,899', 'Thoothukudi': '1,750,176', 'Tiruchirappalli': '2,914,604', 
  'Tirunelveli': '1,633,512', 'Tirupathur': '1,111,812', 'Tiruppur': '2,457,957', 'Tiruvallur': '3,727,352', 
  'Tiruvannamalai': '2,464,875', 'Tiruvarur': '1,264,277', 'Vellore': '1,546,509', 'Viluppuram': '2,765,031', 
  'Virudhunagar': '1,942,288'
};

export const WASTE_STATS: WasteStat[] = [];

MONTHS.forEach(month => {
  TN_DISTRICTS.forEach(district => {
    // Enhanced weights to ensure some districts consistently rank higher in specific seasons
    const isMajorCity = ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Vellore'].includes(district);
    const baseRate = isMajorCity ? 17.5 : 11.5;
    
    // Seasonal variability: Harvest months and festive times increase rates
    let seasonalFactor = 0;
    if (['January', 'April', 'May'].includes(month)) seasonalFactor = 1.2;
    if (['October', 'November', 'December'].includes(month)) seasonalFactor = 2.1;
    
    const randomVariation = (Math.random() * 3) - 1.5;
    const rateVal = baseRate + seasonalFactor + randomVariation;
    const popValue = parseInt(DISTRICT_POPS[district]?.replace(/,/g, '') || '1000000');
    
    // Tonnage logic: Higher in cities, adjusted for random monthly intake
    const wasteTons = Math.floor((popValue * (rateVal / 1000) * (Math.random() * 0.15 + 0.1))); 
    
    WASTE_STATS.push({
      district,
      month,
      year: 2024,
      rate: rateVal.toFixed(1) + '%',
      waste: wasteTons.toLocaleString() + ' tons',
      population: DISTRICT_POPS[district] || '1,000,000'
    });
  });
});
