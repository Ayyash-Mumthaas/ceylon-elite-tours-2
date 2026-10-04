import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  siteSettings,
  mainNavigation,
  footerNavigation,
  socialLinks,
  destinations,
  experiences,
  journeys,
  reviews,
  faqs,
  journalEntries,
} from '../src/lib/site-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Admin User
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ceylonelitetours.com' },
    update: {},
    create: {
      email: 'admin@ceylonelitetours.com',
      name: 'Admin User',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  // 2. Settings
  const settingsData = [
    { key: 'brandName', value: siteSettings.brandName, group: 'general' },
    { key: 'tagline', value: siteSettings.tagline, group: 'general' },
    { key: 'description', value: siteSettings.description, group: 'general' },
    { key: 'whatsapp', value: siteSettings.whatsapp, group: 'contact' },
    { key: 'email', value: siteSettings.email, group: 'contact' },
    { key: 'phone', value: siteSettings.phone, group: 'contact' },
    { key: 'address', value: siteSettings.address, group: 'contact' },
    { key: 'canonicalUrl', value: siteSettings.canonicalUrl, group: 'seo' },
    { key: 'copyright', value: siteSettings.copyright, group: 'general' },
  ];
  for (const s of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group },
      create: { key: s.key, value: s.value, group: s.group },
    });
  }

  // 3. Navigation
  await prisma.navigationItem.deleteMany({});
  
  let navSortOrder = 0;
  for (const nav of mainNavigation) {
    await prisma.navigationItem.create({
      data: {
        location: 'main',
        label: nav.label,
        url: nav.href,
        isCta: !!nav.isPrimary,
        sortOrder: navSortOrder++,
      },
    });
  }

  navSortOrder = 0;
  for (const nav of footerNavigation.company) {
    await prisma.navigationItem.create({
      data: {
        location: 'footer-company',
        label: nav.label,
        url: nav.href,
        sortOrder: navSortOrder++,
      },
    });
  }

  navSortOrder = 0;
  for (const nav of footerNavigation.legal) {
    await prisma.navigationItem.create({
      data: {
        location: 'footer-legal',
        label: nav.label,
        url: nav.href,
        sortOrder: navSortOrder++,
      },
    });
  }

  // 4. Social Links
  await prisma.socialLink.deleteMany({});
  let socialSortOrder = 0;
  for (const link of socialLinks) {
    await prisma.socialLink.create({
      data: {
        platform: link.label,
        label: link.label,
        url: link.href,
        sortOrder: socialSortOrder++,
      },
    });
  }

  // 5. Destinations
  const destinationMap = new Map();
  for (const dest of destinations) {
    const created = await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: {
        name: dest.name,
        region: dest.region,
        district: dest.district,
        shortDescription: dest.shortDescription,
        longDescription: dest.longDescription,
        heroImageId: dest.heroImage,
        bestTimeToVisit: dest.bestTimeToVisit,
        recommendedDuration: dest.recommendedDuration,
        attractionsJson: JSON.stringify(dest.attractions),
        travelNotesJson: JSON.stringify(dest.travelNotes),
        featured: dest.featured || false,
        published: true,
      },
      create: {
        slug: dest.slug,
        name: dest.name,
        region: dest.region,
        district: dest.district,
        shortDescription: dest.shortDescription,
        longDescription: dest.longDescription,
        heroImageId: dest.heroImage,
        bestTimeToVisit: dest.bestTimeToVisit,
        recommendedDuration: dest.recommendedDuration,
        attractionsJson: JSON.stringify(dest.attractions),
        travelNotesJson: JSON.stringify(dest.travelNotes),
        featured: dest.featured || false,
        published: true,
      },
    });
    destinationMap.set(dest.slug, created.id);
  }

  // 6. Experiences
  const experienceMap = new Map();
  for (const exp of experiences) {
    const created = await prisma.experience.upsert({
      where: { slug: exp.slug },
      update: {
        name: exp.name,
        description: exp.description,
        heroImageId: exp.heroImage,
        featured: exp.featured || false,
        published: true,
      },
      create: {
        slug: exp.slug,
        name: exp.name,
        description: exp.description,
        heroImageId: exp.heroImage,
        featured: exp.featured || false,
        published: true,
      },
    });
    experienceMap.set(exp.slug, created.id);
  }

  // 7. Tours (Journeys)
  for (const tour of journeys) {
    const startingPrice = parseFloat(tour.priceFrom.replace(/[^0-9.]/g, '')) || null;
    
    const createdTour = await prisma.tour.upsert({
      where: { slug: tour.slug },
      update: {
        title: tour.title,
        shortDescription: tour.shortDescription,
        fullDescription: tour.description,
        heroImageId: tour.heroImage,
        duration: tour.duration,
        startingLocation: tour.startingLocation,
        endingLocation: tour.endingLocation,
        vehicleCategory: tour.vehicleCategory,
        itineraryJson: JSON.stringify(tour.itinerary),
        inclusionsJson: JSON.stringify(tour.inclusions),
        exclusionsJson: JSON.stringify(tour.exclusions),
        idealForJson: JSON.stringify(tour.idealFor),
        difficulty: tour.difficulty,
        startingPrice: startingPrice,
        featured: tour.featured || false,
        published: true,
      },
      create: {
        slug: tour.slug,
        title: tour.title,
        shortDescription: tour.shortDescription,
        fullDescription: tour.description,
        heroImageId: tour.heroImage,
        duration: tour.duration,
        startingLocation: tour.startingLocation,
        endingLocation: tour.endingLocation,
        vehicleCategory: tour.vehicleCategory,
        itineraryJson: JSON.stringify(tour.itinerary),
        inclusionsJson: JSON.stringify(tour.inclusions),
        exclusionsJson: JSON.stringify(tour.exclusions),
        idealForJson: JSON.stringify(tour.idealFor),
        difficulty: tour.difficulty,
        startingPrice: startingPrice,
        featured: tour.featured || false,
        published: true,
      },
    });
    
    // Links to destinations
    await prisma.tourDestination.deleteMany({ where: { tourId: createdTour.id } });
    for (const destName of tour.destinations) {
       const destSlug = destName.toLowerCase().replace(/ /g, '-');
       const destId = destinationMap.get(destSlug);
       if (destId) {
         await prisma.tourDestination.create({
           data: { tourId: createdTour.id, destinationId: destId },
         });
       }
    }
  }

  // 8. Reviews
  await prisma.review.deleteMany({});
  for (const rev of reviews) {
    await prisma.review.create({
      data: {
        customerName: rev.name,
        country: rev.country,
        review: rev.review,
        rating: rev.rating,
        featured: rev.featured || false,
        published: true,
      }
    });
  }

  // 9. FAQs
  await prisma.faq.deleteMany({});
  let faqSortOrder = 0;
  for (const faq of faqs) {
    await prisma.faq.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        sortOrder: faqSortOrder++,
        published: true,
      }
    });
  }

  // 10. Journal
  for (const entry of journalEntries) {
    await prisma.journalPost.upsert({
      where: { slug: entry.slug },
      update: {
        title: entry.title,
        excerpt: entry.excerpt,
        content: `Content for ${entry.title}`,
        heroImageId: entry.image,
        published: true,
      },
      create: {
        slug: entry.slug,
        title: entry.title,
        excerpt: entry.excerpt,
        content: `Content for ${entry.title}`,
        heroImageId: entry.image,
        published: true,
      }
    })
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
