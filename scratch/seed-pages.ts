import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pages = [
    { slug: 'about', title: 'About Us', heroHeading: 'About Ceylon Elite Tours', content: 'We are a premier travel agency in Sri Lanka specializing in private luxury journeys.' },
    { slug: 'contact', title: 'Contact', heroHeading: 'Get in Touch', content: 'Reach out to us at hello@ceylonelitetours.com or call +94 11 234 5678.' },
    { slug: 'faq', title: 'Frequently Asked Questions', heroHeading: 'FAQ', content: 'Find answers to common questions about traveling with us.' },
    { slug: 'privacy-policy', title: 'Privacy Policy', heroHeading: 'Privacy Policy', content: 'Your privacy is important to us. We do not share your data.' },
    { slug: 'terms', title: 'Terms & Conditions', heroHeading: 'Terms and Conditions', content: 'Please read our terms carefully before booking.' },
    { slug: 'cookie-policy', title: 'Cookie Policy', heroHeading: 'Cookie Policy', content: 'We use cookies to improve your experience on our site.' }
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        heroHeading: page.heroHeading,
        content: page.content,
        published: true
      },
      create: {
        slug: page.slug,
        title: page.title,
        heroHeading: page.heroHeading,
        content: page.content,
        published: true
      }
    });
    console.log(`Upserted page: ${page.slug}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
