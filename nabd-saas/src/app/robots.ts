import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/'], // Protect API and Admin from crawling
        },
        sitemap: 'https://nabd.amiraq.online/sitemap.xml',
    };
}
