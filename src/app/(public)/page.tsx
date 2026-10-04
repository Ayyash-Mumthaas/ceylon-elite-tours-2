import Link from 'next/link';
import { SectionHeading } from '@/components/site-shell';
import { howItWorks, whyChooseUs } from '@/lib/site-data';
import { getPublicSite } from '@/lib/public';

export default async function Home() {
  const { settings: siteSettings, tours: journeys, destinations, reviews, journal, experiences, faqs } = await getPublicSite();

  const featuredJourneys = journeys.filter((journey) => journey.featured);
  const featuredDestinations = destinations.filter((destination) => destination.featured);
  const featuredExperiences = experiences.filter((exp) => exp.featured).slice(0, 3);
  const featuredReviews = reviews.filter((review) => review.featured);
  const featuredJournal = journal.slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">Sri Lanka • Private journeys</p>
            <h1>
              Discover Sri Lanka.
              <br />
              Travel Exceptionally.
            </h1>
            <p>{siteSettings.description}</p>
            <div className="hero-actions">
              <Link href="/plan-your-journey" className="button button-primary">
                Plan Your Journey
              </Link>
              <Link href="/destinations" className="button button-secondary">
                Explore Sri Lanka
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split-grid">
            <div className="story-card">
              <p className="eyebrow">Your Sri Lanka, your way</p>
              <h3>Tailored around the way you travel.</h3>
              <p>
                Every journey can be shaped around your preferred duration, destinations,
                interests, group size, comfort, vehicle preference and travel style.
              </p>
              <ul className="feature-list">
                <li>Duration that matches your pace, from fast-moving highlights to slow luxury travel.</li>
                <li>Destinations selected around the experiences you care about most, from heritage to wildlife.</li>
                <li>Private travel planning that keeps comfort, flexibility and ease at the center of the journey.</li>
              </ul>
            </div>

            <div className="image-stack">
              <img
                src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80"
                alt="Sri Lankan landscape"
              />
              <img
                src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80"
                alt="Temple city"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Signature journeys"
            title="Curated routes for different ways to discover Sri Lanka"
            description="From heritage-rich itineraries to slow hill-country escapes, every journey is crafted around your style of travel."
          />
          <div className="cards-grid">
            {featuredJourneys.map((journey) => (
              <article key={journey.slug} className="journey-card">
                <img src={journey.heroImageId || ''} alt={journey.title} />
                <div className="card-body">
                  <div className="meta-row">
                    <span>{journey.duration}</span>
                    <span>{journey.vehicleCategory}</span>
                  </div>
                  <h3>{journey.title}</h3>
                  <p>{journey.shortDescription}</p>
                  <div className="meta-row">
                    <span>{journey.startingLocation}</span>
                    <span>{journey.startingPrice ? `${journey.currency} ${journey.startingPrice}` : 'On Request'}</span>
                  </div>
                  <Link href={`/tours/${journey.slug}`} className="card-link">
                    Explore journey
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Destinations"
            title="Places that shape a memorable Sri Lanka"
            description="Explore the landscapes, cultural centres and coastal escapes that give the island its depth and rhythm."
          />
          <div className="cards-grid">
            {featuredDestinations.map((destination) => (
              <article key={destination.slug} className="destination-card">
                <img src={destination.heroImageId || ''} alt={destination.name} />
                <div className="card-body">
                  <div className="meta-row">
                    <span>{destination.region}</span>
                    <span>{destination.recommendedDuration}</span>
                  </div>
                  <h3>{destination.name}</h3>
                  <p>{destination.shortDescription}</p>
                  <Link href={`/destinations/${destination.slug}`} className="card-link">
                    Discover destination
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Experiences"
            title="Travel styles designed for different kinds of curiosity"
            description="Whether you are drawn to heritage, wildlife, beaches or highland scenery, the experience can be shaped around what matters most."
          />
          <div className="cards-grid">
            {featuredExperiences.map((journey) => (
              <article key={journey.slug} className="experience-card">
                <img src={journey.heroImageId || ''} alt={journey.name} />
                <div className="card-body">
                  <h3>{journey.name}</h3>
                  <p>{journey.description}</p>
                  <Link href={`/experiences/${journey.slug}`} className="card-link">
                    View experience
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Why Ceylon Elite"
            title="Thoughtful planning, private journeys and a premium approach to travel"
          />
          <div className="trust-bar">
            {whyChooseUs.map((item, index) => (
              <div key={item} className="feature-card">
                <strong>{String(index + 1).padStart(2, '0')}</strong>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="How it works"
            title="Simple steps from first idea to final itinerary"
          />
          <div className="timeline">
            {howItWorks.map((step, index) => (
              <div key={step} className="timeline-step">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h4>{step}</h4>
                <p>
                  {index === 0 && 'Share your preferred destinations, travel style and ideal pace.'}
                  {index === 1 && 'We design a route around your interests and requirements.'}
                  {index === 2 && 'We arrange the needed travel services through the relevant operational channels.'}
                  {index === 3 && 'Your journey is prepared with clarity, comfort and confidence.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Trust"
            title="Guest stories from journeys thoughtfully planned"
            description="Only verified and approved reviews are displayed here."
          />
          <div className="review-grid">
            {featuredReviews.map((review) => (
              <article key={`${review.customerName}-${review.country}`} className="review-card">
                <div className="stars">★★★★★</div>
                <p>&ldquo;{review.review}&rdquo;</p>
                <h4>{review.customerName}</h4>
                <small>{review.country}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Journal"
            title="Stories, guides and practical inspiration"
            description="Travel notes and destination ideas to help shape your next Sri Lanka journey."
          />
          <div className="journal-grid">
            {featuredJournal.map((entry) => (
              <article key={entry.slug} className="journal-card">
                <img src={entry.heroImageId || ''} alt={entry.title} />
                <div className="card-body">
                  <div className="meta-row">
                    <span>{entry.category?.name || 'Journal'}</span>
                    <span>{entry.publishedAt ? new Date(entry.publishedAt).toLocaleDateString() : ''}</span>
                  </div>
                  <h3>{entry.title}</h3>
                  <p>{entry.excerpt}</p>
                  <Link href={`/journal/${entry.slug}`} className="card-link">
                    Read article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="FAQ" title="Common questions before you begin" />
          <div className="faq-grid">
            {faqs.map((item) => (
              <div key={item.question} className="faq-item">
                <h4>{item.question}</h4>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-panel">
            <div>
              <p className="eyebrow">Begin your journey</p>
              <h3>Your Sri Lanka story starts here.</h3>
            </div>
            <Link href="/plan-your-journey" className="button button-primary">
              Plan Your Journey
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
