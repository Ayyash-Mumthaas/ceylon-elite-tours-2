export type NavItem = {
  label: string;
  href: string;
  isPrimary?: boolean;
};

export type Journey = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  duration: string;
  startingLocation: string;
  endingLocation: string;
  destinations: string[];
  experiences: string[];
  vehicleCategory: string;
  priceFrom: string;
  difficulty: string;
  idealFor: string[];
  itinerary: string[];
  inclusions: string[];
  exclusions: string[];
  featured?: boolean;
};

export type Destination = {
  slug: string;
  name: string;
  region: string;
  district: string;
  shortDescription: string;
  longDescription: string;
  heroImage: string;
  bestTimeToVisit: string;
  recommendedDuration: string;
  experiences: string[];
  attractions: string[];
  travelNotes: string[];
  featured?: boolean;
};

export type Experience = {
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  relatedDestinations: string[];
  relatedTours: string[];
  featured?: boolean;
};

export type Review = {
  name: string;
  country: string;
  review: string;
  rating: number;
  featured?: boolean;
};

export type JournalEntry = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  publishedAt: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const siteSettings = {
  brandName: 'Ceylon Elite Tours',
  tagline: 'Private Journeys Across Sri Lanka',
  description:
    'Private journeys, thoughtfully planned around the places, experiences and moments that make Sri Lanka unforgettable.',
  whatsapp: '+94 77 123 4567',
  email: 'hello@ceylonelitetours.com',
  phone: '+94 11 234 5678',
  address: 'Colombo 03, Sri Lanka',
  canonicalUrl: 'https://ceylonelitetours.com',
  copyright: '© 2026 Ceylon Elite Tours. All rights reserved.',
};

export const mainNavigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Tours', href: '/tours' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Journal', href: '/journal' },
  { label: 'FAQ', href: '/faq' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Plan Your Journey', href: '/plan-your-journey', isPrimary: true },
];

export const footerNavigation = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'Tours', href: '/tours' },
    { label: 'Destinations', href: '/destinations' },
    { label: 'Journal', href: '/journal' },
    { label: 'FAQ', href: '/faq' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
  ],
};

export const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'WhatsApp', href: 'https://wa.me/94771234567' },
  { label: 'YouTube', href: 'https://youtube.com' },
];

export const journeys: Journey[] = [
  {
    slug: 'the-cultural-triangle',
    title: 'The Cultural Triangle',
    shortDescription: 'Ancient kingdoms, sacred sites and heritage-rich landscapes.',
    description:
      'A carefully paced journey through iconic cultural heritage sites, including Sigiriya, Dambulla and Anuradhapura, designed for travellers who want to connect with the stories and spiritual depth of Sri Lanka.',
    heroImage:
      'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1200&q=80',
    duration: '5 days',
    startingLocation: 'Colombo',
    endingLocation: 'Kandy',
    destinations: ['Sigiriya', 'Dambulla', 'Kandy', 'Anuradhapura'],
    experiences: ['Heritage', 'Culture', 'Scenic'],
    vehicleCategory: 'Premium SUV',
    priceFrom: 'From LKR 72,000',
    difficulty: 'Easy to moderate',
    idealFor: ['Couples', 'Families', 'First-time visitors'],
    itinerary: [
      'Arrival and private transfer to your first heritage destination.',
      'Guided exploration of Sigiriya and nearby sites.',
      'Temple visits and cultural immersion across the central plains.',
      'Scenic drive to Kandy with free time to explore the city.',
      'Final heritage and city experience before departure.',
    ],
    inclusions: ['Private chauffeur', 'Accommodation planning assistance', 'Daily itinerary guidance'],
    exclusions: ['Flights', 'Entry fees', 'Personal shopping'],
    featured: true,
  },
  {
    slug: 'kandy-and-the-highlands',
    title: 'Kandy & The Highlands',
    shortDescription: 'Tea country, misty mountains and spiritual calm.',
    description:
      'From Kandy to Nuwara Eliya, this journey is designed for travellers who want a slower rhythm, cooler air and unforgettable mountain scenery.',
    heroImage:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    duration: '4 days',
    startingLocation: 'Colombo',
    endingLocation: 'Nuwara Eliya',
    destinations: ['Kandy', 'Nuwara Eliya', 'Ella', 'Tea Country'],
    experiences: ['Tea Country', 'Scenic', 'Wellness'],
    vehicleCategory: 'Luxury Van',
    priceFrom: 'From LKR 68,000',
    difficulty: 'Easy',
    idealFor: ['Couples', 'Nature lovers'],
    itinerary: ['Private transfer through the central highlands', 'Tea estate experience', 'Kandy cultural evening', 'Highland scenic stops'],
    inclusions: ['Vehicle coordination', 'Destination planning', 'Support throughout the trip'],
    exclusions: ['Meals', 'Guided activities', 'Optional upgrades'],
    featured: true,
  },
  {
    slug: 'ella-and-tea-country',
    title: 'Ella & Tea Country',
    shortDescription: 'Waterfalls, mountain viewpoints and slow mornings in the hills.',
    description:
      'A scenic escape designed around tea estates, railway panoramas, waterfall walks and leisurely afternoons in the highlands.',
    heroImage:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    duration: '3 days',
    startingLocation: 'Colombo',
    endingLocation: 'Ella',
    destinations: ['Ella', 'Nuwara Eliya', 'Badulla'],
    experiences: ['Scenic', 'Adventure', 'Tea Country'],
    vehicleCategory: 'SUV',
    priceFrom: 'From LKR 52,000',
    difficulty: 'Moderate',
    idealFor: ['Friends', 'Couples'],
    itinerary: ['Arrival and hill-country transfer', 'Scenic viewpoints and tea estate stop', 'Sunrise or waterfall walk', 'Return journey with leisure stops'],
    inclusions: ['Chauffeur support', 'Route planning', 'Travel guidance'],
    exclusions: ['Accommodation', 'Tickets', 'Optional extras'],
    featured: false,
  },
  {
    slug: 'wild-sri-lanka',
    title: 'Wild Sri Lanka',
    shortDescription: 'Safari, jungle and coastal rhythms for curious travellers.',
    description:
      'For travellers who want memorable wildlife encounters, this route pairs protected parks with comfortable, private transfer planning and carefully timed stops.',
    heroImage:
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    duration: '6 days',
    startingLocation: 'Colombo',
    endingLocation: 'Yala',
    destinations: ['Yala', 'Udawalawe', 'Mirissa'],
    experiences: ['Wildlife', 'Adventure', 'Beaches'],
    vehicleCategory: 'Van',
    priceFrom: 'From LKR 80,000',
    difficulty: 'Moderate',
    idealFor: ['Families', 'Wildlife lovers'],
    itinerary: ['Transfer to southern wildlife areas', 'Safari planning and route sequencing', 'Coastal response and rest stops', 'Final park and beach experience'],
    inclusions: ['Route planning', 'Private transport arrangements', 'Itinerary management'],
    exclusions: ['Park entry fees', 'Meals', 'Optional excursions'],
    featured: false,
  },
  {
    slug: 'southern-coast-escape',
    title: 'Southern Coast Escape',
    shortDescription: 'Golden beaches, surf towns and ocean-side leisure.',
    description:
      'Blend beach time with scenic coastal drives and easygoing afternoons in Sri Lanka’s south, ideal for a relaxing private escape.',
    heroImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    duration: '4 days',
    startingLocation: 'Colombo',
    endingLocation: 'Galle',
    destinations: ['Galle', 'Mirissa', 'Bentota', 'Hikkaduwa'],
    experiences: ['Beaches', 'Culinary', 'Romance'],
    vehicleCategory: 'Premium Sedan',
    priceFrom: 'From LKR 58,000',
    difficulty: 'Easy',
    idealFor: ['Couples', 'Friends'],
    itinerary: ['Coastal transfer and check-in', 'Beach and sunset stops', 'Galle heritage walk', 'Departure with flexibility'],
    inclusions: ['Private transfers', 'Flexible timing', 'Support for route adjustments'],
    exclusions: ['Accommodation', 'Meals', 'Water activities'],
    featured: false,
  },
  {
    slug: 'sri-lanka-grand-journey',
    title: 'Sri Lanka Grand Journey',
    shortDescription: 'A comprehensive private route through the island’s highlights.',
    description:
      'This full-island itinerary balances culture, scenery, wildlife and coastal relaxation across a richer, more immersive Sri Lankan experience.',
    heroImage:
      'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80',
    duration: '10 days',
    startingLocation: 'Colombo',
    endingLocation: 'Colombo',
    destinations: ['Sigiriya', 'Kandy', 'Ella', 'Galle', 'Mirissa'],
    experiences: ['Culture', 'Wildlife', 'Scenic', 'Beaches'],
    vehicleCategory: 'Luxury Van',
    priceFrom: 'From LKR 118,000',
    difficulty: 'Moderate',
    idealFor: ['Families', 'Couples', 'Luxury travellers'],
    itinerary: ['Heritage circuit', 'Hill-country route', 'Wildlife and coastal segment', 'Final city days'],
    inclusions: ['Trip planning', 'Route coordination', 'Multistop support'],
    exclusions: ['International flights', 'Entry tickets', 'Personal purchases'],
    featured: true,
  },
];

export const destinations: Destination[] = [
  { slug: 'kandy', name: 'Kandy', region: 'Central Sri Lanka', district: 'Kandy', shortDescription: 'Temple-lined hills and city culture.', longDescription: 'Kandy is a refined cultural city where temple visits, scenic lakes and heritage streets shape a peaceful yet vibrant atmosphere.', heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80', bestTimeToVisit: 'December to April', recommendedDuration: '2-3 days', experiences: ['Culture', 'Heritage', 'Scenic'], attractions: ['Temple of the Tooth', 'Kandy Lake', 'Cultural dance'], travelNotes: ['Best visited during cultural events', 'Ideal for relaxed city exploration'], featured: true },
  { slug: 'ella', name: 'Ella', region: 'Uva Province', district: 'Badulla', shortDescription: 'Ridge views, waterfalls and mountain air.', longDescription: 'Ella offers dramatic mountain scenery, railway views and a laid-back highland rhythm that is ideal for scenic journeys.', heroImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', bestTimeToVisit: 'January to March', recommendedDuration: '2 days', experiences: ['Scenic', 'Tea Country', 'Adventure'], attractions: ['Little Adam’s Peak', 'Nine Arch Bridge', 'Ella Rock'], travelNotes: ['Bring layers for cooler evenings', 'Great for scenic drives'], featured: true },
  { slug: 'sigiriya', name: 'Sigiriya', region: 'Central Sri Lanka', district: 'Matale', shortDescription: 'Ancient rock fortresses and iconic views.', longDescription: 'Sigiriya is defined by its famous rock fortress, dramatic surroundings and the remarkable story of Sri Lanka’s ancient royal past.', heroImage: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=1200&q=80', bestTimeToVisit: 'May to September', recommendedDuration: '1-2 days', experiences: ['Heritage', 'Adventure'], attractions: ['Sigiriya Rock', 'Dambulla Cave Temple'], travelNotes: ['Early starts are best for the climb'], featured: true },
  { slug: 'dambulla', name: 'Dambulla', region: 'Central Sri Lanka', district: 'Matale', shortDescription: 'Cave temples and cultural depth.', longDescription: 'Dambulla blends spiritual heritage with practical access to the cultural triangle, making it a thoughtful stop for heritage-focused journeys.', heroImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=80', bestTimeToVisit: 'Year-round', recommendedDuration: '1 day', experiences: ['Heritage', 'Culture'], attractions: ['Dambulla Cave Temple', 'Golden Temple'], travelNotes: ['Wear comfortable walking shoes'], featured: false },
  { slug: 'nuwara-eliya', name: 'Nuwara Eliya', region: 'Central Highlands', district: 'Nuwara Eliya', shortDescription: 'Cool air, tea estates and colonial charm.', longDescription: 'This elegant hill-country town is known for its cool climate, tea plantations and gentle, reflective atmosphere.', heroImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80', bestTimeToVisit: 'March to May', recommendedDuration: '2 days', experiences: ['Tea Country', 'Scenic', 'Wellness'], attractions: ['Tea factory tours', 'Waterfalls', 'Botanical gardens'], travelNotes: ['Ideal for slow travel and scenic stops'], featured: false },
  { slug: 'galle', name: 'Galle', region: 'Southern Coast', district: 'Galle', shortDescription: 'Historic fort and coastal elegance.', longDescription: 'Galle brings together a historic fort, ocean views and a graceful southern coastal atmosphere that suits relaxed luxury journeys.', heroImage: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', bestTimeToVisit: 'November to April', recommendedDuration: '1-2 days', experiences: ['Culture', 'Beaches', 'Romance'], attractions: ['Galle Fort', 'Coastal walks', 'Harbour views'], travelNotes: ['A great stop for slow afternoons and sunset dinners'], featured: true },
  { slug: 'yala', name: 'Yala', region: 'Southern Sri Lanka', district: 'Hambantota', shortDescription: 'Wildlife and protected landscapes.', longDescription: 'Yala is one of Sri Lanka’s best-known protected areas, offering extraordinary wildlife encounters combined with open, scenic landscapes.', heroImage: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1200&q=80', bestTimeToVisit: 'February to June', recommendedDuration: '1-2 days', experiences: ['Wildlife', 'Adventure'], attractions: ['Safari drives', 'Birdlife', 'Nature trails'], travelNotes: ['Plan early starts for wildlife viewing'], featured: false },
  { slug: 'mirissa', name: 'Mirissa', region: 'Southern Coast', district: 'Matara', shortDescription: 'Beach days and ocean light.', longDescription: 'Mirissa brings together golden beaches, gentle surf and a laid-back atmosphere that suits leisurely coastal travel.', heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', bestTimeToVisit: 'December to April', recommendedDuration: '2 days', experiences: ['Beaches', 'Wellness', 'Romance'], attractions: ['Beach clubs', 'Sunset viewpoints', 'Whale watching'], travelNotes: ['Ideal for scenic sunset evenings'], featured: false },
  { slug: 'bentota', name: 'Bentota', region: 'Southwest Coast', district: 'Galle', shortDescription: 'Waterfront leisure and easy access.', longDescription: 'Bentota is a practical and relaxing coastal getaway for travellers who prefer easier access to beaches, water activities and quiet resorts.', heroImage: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80', bestTimeToVisit: 'Year-round', recommendedDuration: '1-2 days', experiences: ['Beaches', 'Culinary', 'Wellness'], attractions: ['Beachfront stays', 'River cruises', 'Spa experiences'], travelNotes: ['Suitable for family travel and easy coastal itineraries'], featured: false },
];

export const experiences: Experience[] = [
  { slug: 'heritage', name: 'Heritage', description: 'Archaeological sites, ancient capitals and culture-rich routes.', heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', relatedDestinations: ['sigiriya', 'kandy', 'dambulla'], relatedTours: ['the-cultural-triangle', 'sri-lanka-grand-journey'], featured: true },
  { slug: 'wildlife', name: 'Wildlife', description: 'National parks, safaris and unforgettable encounters with nature.', heroImage: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80', relatedDestinations: ['yala', 'udawalawe'], relatedTours: ['wild-sri-lanka'], featured: true },
  { slug: 'scenic', name: 'Scenic', description: 'Cliffs, valley roads, tea gardens and panoramic viewpoints.', heroImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', relatedDestinations: ['ella', 'nuwara-eliya'], relatedTours: ['ella-and-tea-country', 'kandy-and-the-highlands'], featured: true },
  { slug: 'adventure', name: 'Adventure', description: 'Hikes, cliffside routes and active exploration in the landscape.', heroImage: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80', relatedDestinations: ['sigiriya', 'ella'], relatedTours: ['wild-sri-lanka'], featured: false },
  { slug: 'wellness', name: 'Wellness', description: 'Slower, restorative travel with restorative spaces and calm routines.', heroImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80', relatedDestinations: ['nuwara-eliya', 'bentota'], relatedTours: ['kandy-and-the-highlands'], featured: false },
  { slug: 'culinary', name: 'Culinary', description: 'Local flavours, markets and unforgettable dining experiences.', heroImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80', relatedDestinations: ['galle', 'kandy'], relatedTours: ['southern-coast-escape'], featured: false },
  { slug: 'beaches', name: 'Beaches', description: 'Sun, sea and easy coastal escapes across Sri Lanka’s shorelines.', heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', relatedDestinations: ['mirissa', 'galle', 'bentota'], relatedTours: ['southern-coast-escape'], featured: true },
  { slug: 'tea-country', name: 'Tea Country', description: 'Plantations, highland trails and slow, scenic afternoons.', heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80', relatedDestinations: ['nuwara-eliya', 'ella'], relatedTours: ['kandy-and-the-highlands', 'ella-and-tea-country'], featured: false },
];

export const reviews: Review[] = [
  { name: 'Emma & James', country: 'United Kingdom', review: 'Every detail felt considered. We had a smooth, private trip that matched exactly what we wanted.', rating: 5, featured: true },
  { name: 'Priya S.', country: 'Australia', review: 'The route felt personal rather than generic. We moved comfortably and never felt rushed.', rating: 5, featured: true },
  { name: 'Daniel M.', country: 'Germany', review: 'The planning was thoughtful, the support was responsive and the journey ran beautifully from start to finish.', rating: 5 },
];

export const journalEntries: JournalEntry[] = [
  { slug: 'best-places-to-visit-in-kandy', title: 'Best places to visit in Kandy', excerpt: 'A slow city guide to temples, viewpoints and cultural corners worth lingering in.', category: 'Destinations', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80', publishedAt: 'April 2026' },
  { slug: 'tea-country-routes-for-slow-travel', title: 'Tea country routes for slow travel', excerpt: 'How to shape a scenic highland journey around views, stops and thoughtful pacing.', category: 'Travel Tips', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', publishedAt: 'March 2026' },
  { slug: 'planning-a-sri-lanka-family-journey', title: 'Planning a Sri Lanka family journey', excerpt: 'A family-friendly way to balance culture, wildlife and beach time without rushing.', category: 'Planning Sri Lanka', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', publishedAt: 'February 2026' },
];

export const faqs: FaqItem[] = [
  { question: 'Do you offer private tours only?', answer: 'Yes. Ceylon Elite Tours focuses on tailored private journeys arranged around your preferred destinations, pace and travel style.' },
  { question: 'Can I customise my itinerary?', answer: 'Absolutely. Your journey can be tailored around duration, interests, comfort, destinations and vehicle preference.' },
  { question: 'Do you arrange the transport?', answer: 'We coordinate the required travel arrangements, including vehicle and driver requirements through our operational network.' },
  { question: 'How do I start planning?', answer: 'Use the Plan Your Journey form and our team will review your requirements and prepare a personalised proposal.' },
];

export const whyChooseUs = [
  'Personalized planning around your pace and interests',
  'Private journeys built around your preferred style',
  'Flexible itineraries with thoughtfully selected stops',
  'Carefully arranged transport through trusted operational coordination',
  'Responsive support before and during travel planning',
  'Attention to detail from first enquiry to final itinerary',
];

export const howItWorks = [
  'Tell us your vision.',
  'We design your journey.',
  'We arrange the required travel services.',
  'Travel Sri Lanka with confidence.',
];

export const siteStats = [
  { label: 'Private routes crafted', value: 'Tailored for each traveller' },
  { label: 'Visible destinations', value: '15+ locations' },
  { label: 'Travel style', value: 'Luxury, private and flexible' },
];

export const adminHighlights = [
  { title: 'Inquiries', value: '24', detail: 'New and awaiting response' },
  { title: 'Bookings', value: '18', detail: 'Confirmed and upcoming' },
  { title: 'Quoted journeys', value: '7', detail: 'Waiting on confirmation' },
  { title: 'Vehicles', value: '12', detail: 'Partner requests and status tracking' },
];
