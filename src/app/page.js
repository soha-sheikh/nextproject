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
          Beautiful forms,<br /><em>beautifully built.</em>
        </h1>
        <p className={`${styles.sub} anim-fade-3`}>
          A complete contact form with validation, multi-step UX,
          animated feedback, and a polished success state.
        </p>
        <Link href="/contact" className={`${styles.cta} anim-fade-4`}>
          Open the form →
        </Link>

        {/* Feature pills */}
        <div className={`${styles.pills} anim-fade-4`}>
          {['Live validation', 'Progress tracking', 'Animated states', 'Success summary', 'Reset & retry'].map(f => (
            <span key={f} className={styles.pill}>{f}</span>
          ))}
        </div>
      </div>
    </main>
  )
}
