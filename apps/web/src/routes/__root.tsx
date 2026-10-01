import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import styles from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Typenow | A little less inbox. A lot more building.' },
      {
        name: 'description',
        content:
          'An open source customer inbox for small teams. Email, forms, and web chat together, connected to your product. Typenow is coming soon.',
      },
      { name: 'theme-color', content: '#fafbf7' },
      {
        property: 'og:title',
        content: 'Typenow | Your customers, a little closer.',
      },
      {
        property: 'og:description',
        content:
          'Email. Forms. Web chat. One calm, open source inbox connected to your product.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://typenow.sh/' },
      { property: 'og:image', content: 'https://typenow.sh/social-card.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: styles },
      {
        rel: 'preload',
        href: '/fonts/InterVariable.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      { rel: 'icon', href: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { rel: 'canonical', href: 'https://typenow.sh/' },
    ],
  }),
  component: Root,
  notFoundComponent: () => (
    <main className="not-found">
      <p className="eyebrow">404 / A wrong turn</p>
      <h1>This conversation went elsewhere.</h1>
      <a className="button button-secondary" href="/">
        Back to Typenow
      </a>
    </main>
  ),
})

function Root() {
  return (
    <html lang="en" className="antialiased">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
