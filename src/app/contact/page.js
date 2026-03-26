'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './contact.module.css'

// ─── Constants ────────────────────────────────────────────────
const SUBJECTS = [
  'General enquiry',
  'Technical support',
  'Billing question',
  'Partnership opportunity',
  'Career / jobs',
  'Other',
]

const INTERESTS = [
  { id: 'updates', label: 'Product updates' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'events', label: 'Events & webinars' },
  { id: 'beta', label: 'Beta testing' },
]

const REQUIRED = ['firstName', 'lastName', 'email', 'subject', 'message']

export default function ContactPage() {

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    priority: 'normal',
    message: '',
    interests: [],
    agree: false,
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)

  // ✅ Progress
  useEffect(() => {
    const filled = REQUIRED.filter(key => String(form[key]).trim().length > 0).length
    setProgress(Math.round((filled / REQUIRED.length) * 100))
  }, [form])

  // ✅ Revalidate
  useEffect(() => {
    if (touched) validateAll()
  }, [form, touched])

  // ✅ Auto focus
  useEffect(() => {
    document.querySelector('input[name="firstName"]')?.focus()
  }, [])

  // ─── Handlers ───────────────────────────────────────────────

  function handleChange(e) {
    const { name, value, type, checked } = e.target

    if (type === 'checkbox' && name === 'agree') {
      setForm(prev => ({ ...prev, agree: checked }))
    } else if (name === 'email') {
      setForm(prev => ({ ...prev, email: value.toLowerCase().trim() }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  function handleInterest(id) {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id],
    }))
  }

  function validateAll() {
    const e = {}

    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.subject) e.subject = 'Please choose a subject'
    if (!form.agree) e.agree = 'You must agree to continue'

    if (!form.email.trim()) {
      e.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address'
    }

    if (!form.message.trim()) {
      e.message = 'Message is required'
    } else if (form.message.trim().length < 20) {
      e.message = 'Message must be at least 20 characters'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)

    if (!validateAll()) {
      const firstError = document.querySelector(`.${styles.inputErr}`)
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setStatus('loading')

    setTimeout(() => {
      setStatus('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1500)
  }

  function resetForm() {
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      priority: 'normal',
      message: '',
      interests: [],
      agree: false,
    })
    setErrors({})
    setTouched(false)
    setStatus('idle')
  }

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      <aside className={styles.sidebar}>
        <Link href="/" className={styles.backLink}>← Back</Link>
        <div className={styles.sideContent}>
          <p className={styles.sideLabel}>Get in touch</p>
          <h1 className={styles.sideTitle}>We'd love<br />to hear<br /><em>from you.</em></h1>
        </div>
      </aside>

      <main className={styles.formPanel}>
        {status === 'success' ? (
          <SuccessScreen form={form} onReset={resetForm} />
        ) : (
          <div className={styles.formWrap}>

            <div className={styles.progressWrap}>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <span className={styles.progressLabel}>{progress}% complete</span>
            </div>

            <form onSubmit={handleSubmit} noValidate className={styles.form}>

              <div className={styles.row2}>
                <Field label="First name" name="firstName" required value={form.firstName} onChange={handleChange} error={errors.firstName} />
                <Field label="Last name" name="lastName" required value={form.lastName} onChange={handleChange} error={errors.lastName} />
              </div>

              <div className={styles.row2}>
                <Field label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
                <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              </div>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className={`${styles.textarea} ${errors.message ? styles.inputErr : ''}`}
              />

              {/* ✅ Character warning */}
              {form.message.length > 450 && (
                <p style={{ color: 'orange' }}>Almost reached max limit!</p>
              )}

              {/* ✅ Live Preview */}
              <div style={{ padding: '10px', border: '1px solid #ddd', marginTop: '10px' }}>
                <p><strong>Name:</strong> {form.firstName} {form.lastName}</p>
                <p><strong>Email:</strong> {form.email}</p>
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || progress < 100 || !form.agree}
                className={styles.submitBtn}
              >
                {status === 'loading' ? 'Sending...' : 'Send message'}
              </button>

            </form>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── Components ───────────────────────────────────────────────

function Field({ label, name, value, onChange, error }) {
  return (
    <div>
      <label>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className={error ? 'error' : ''}
      />
      {error && <p>{error}</p>}
    </div>
  )
}

function SuccessScreen({ form, onReset }) {
  return (
    <div>
      <h2>Success!</h2>
      <p>{form.firstName}, your message is sent.</p>
      <button onClick={onReset}>Reset</button>
    </div>
  )
}