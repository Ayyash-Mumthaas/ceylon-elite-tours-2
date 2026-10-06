import Link from 'next/link';
import type { ReactNode } from 'react';
import { getPublicSite, whatsappHref } from '@/lib/public';
import { ClientNav } from './client-nav';
export async function SiteShell({ children }: { children: ReactNode }) {
  const { settings, nav, social } = await getPublicSite();

  const mainNav = nav.filter(n => n.location === 'main');
  const footerCompany = nav.filter(n => n.location === 'footer-company');
  const footerLegal = nav.filter(n => n.location === 'footer-legal');

  return (
    <div className="site-shell">
      <ClientNav 
        mainNav={mainNav} 
        brandName={settings.brandName || 'Ceylon Elite Tours'} 
        tagline={settings.tagline || 'Private Journeys Across Sri Lanka'} 
      />

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <p className="eyebrow">{settings.brandName || 'Ceylon Elite Tours'}</p>
            <h3>{settings.tagline || 'Private Journeys Across Sri Lanka'}</h3>
            <p>{settings.description || 'Private journeys, thoughtfully planned around the places, experiences and moments that make Sri Lanka unforgettable.'}</p>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              {footerCompany.map((item) => (
                <li key={item.id}><Link href={item.url} target={item.newTab ? "_blank" : undefined}>{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            <ul>
              {footerLegal.map((item) => (
                <li key={item.id}><Link href={item.url} target={item.newTab ? "_blank" : undefined}>{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              {settings.phone && <li><a href={`tel:${settings.phone}`}>{settings.phone}</a></li>}
              {settings.email && <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>}
              {settings.whatsapp && <li><a href={whatsappHref(settings) || `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`}>WhatsApp</a></li>}
              {settings.address && <li>{settings.address}</li>}
            </ul>
            <div className="social-row">
              {social.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>{settings.copyright || '© 2026 Ceylon Elite Tours'}</span>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </footer>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="section-heading">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
