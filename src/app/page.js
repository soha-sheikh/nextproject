// src/app/page.js
// Homepage — shows a minimal hero and a link to the form

import Link from 'next/link'
import styles from './page.module.css'

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <p className={`${styles.eyebrow} anim-fade`}>Next.js Form Demo</p>

        <h1 className={`${styles.title} anim-fade-2`}>
          Beautiful forms,<br />
          <em>beautifully built.</em>
        </h1>

        <p className={`${styles.sub} anim-fade-3`}>
          A complete contact form with live validation, progress tracking,
          and a polished success screen. Try it yourself!
        </p>

        <Link href="/contact" className={`${styles.cta} anim-fade-4`}>
          Open the form →
        </Link>

        {/* Feature pills */}
        <div className={`${styles.pills} anim-fade-4`}>
          {[
            'Live validation',
            'Progress tracking',
            'Animated states',
            'Success summary',
            'Reset & retry',
            'Responsive layout',
          ].map(f => (
            <span key={f} className={styles.pill}>{f}</span>
          ))}
        </div>

        {/* Optional: Add a small note */}
        <p className={`${styles.note} anim-fade-5`}>
          Built with Next.js 13+, React hooks, and modern CSS.
        </p>
      </div>
    </main>
  )
}
