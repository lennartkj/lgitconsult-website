import { Link } from '@/components/ui/Link';
import type { Metadata } from 'next';

// Generate minimal static metadata
export const metadata: Metadata = {
    title: '404 - Page Not Found',
    description: 'The requested page could not be found.',
};

// Dies ist ein reiner Server Component, der keine Client-Hooks ausführen kann.
export default function NotFound() {
    return (
        <section className="flex items-center justify-center min-h-screen text-center py-24 bg-muted">
            <div className="container mx-auto px-4">
                <h1 className="text-8xl font-extrabold text-accent">404</h1>
                <h2 className="text-3xl font-bold mt-4 mb-4">Page Not Found</h2>
                <p className="text-lg text-fg/70 mb-8">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for.
                </p>
                <Link href="/" variant="button">
                    Go Back Home
                </Link>
            </div>
        </section>
    );
}
