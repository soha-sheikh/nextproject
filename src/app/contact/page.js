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

// ─── Main Component ───────────────────────────────────────────
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
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success'
  const [progress, setProgress] = useState(0)

  // ─── Update progress
  useEffect(() => {
    const filled = REQUIRED.filter(key => String(form[key]).trim().length > 0).length
    setProgress(Math.round((filled / REQUIRED.length) * 100))
  }, [form])

  // ─── Revalidate on change
  useEffect(() => {
    if (touched) validateAll()
  }, [form, touched])

  // ─── Focus first input
  useEffect(() => {
    document.querySelector('input[name="firstName"]')?.focus()
  }, [])

  // ─── Handlers
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

  // ─── Render
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

              {/* Name */}
              <div className={styles.row2}>
                <Field label="First name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
                <Field label="Last name"  name="lastName"  value={form.lastName}  onChange={handleChange} error={errors.lastName} required />
              </div>

              {/* Email & Phone */}
              <div className={styles.row2}>
                <Field label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} required />
                <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              </div>

              {/* Subject */}
              <div className={styles.field}>
                <label>Subject *</label>
                <select name="subject" value={form.subject} onChange={handleChange} className={errors.subject ? styles.inputErr : ''}>
                  <option value="">Select a subject</option>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
                {errors.subject && <p className={styles.errMsg}>{errors.subject}</p>}
              </div>

              {/* Priority */}
              <div className={styles.field}>
                <label>Priority</label>
                <div className={styles.radioGroup}>
                  {['low','normal','high','urgent'].map(p => (
                    <label key={p} className={form.priority===p ? styles.radioActive : ''}>
                      <input type="radio" name="priority" value={p} checked={form.priority===p} onChange={handleChange}/>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className={styles.field}>
                <label>Interests</label>
                <div className={styles.checkGrid}>
                  {INTERESTS.map(i => (
                    <label key={i.id} className={form.interests.includes(i.id) ? styles.checkActive : ''}>
                      <input type="checkbox" checked={form.interests.includes(i.id)} onChange={()=>handleInterest(i.id)} />
                      {i.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className={styles.field}>
                <label>Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5} maxLength={500} className={errors.message ? styles.inputErr : ''} />
                <span>{form.message.length}/500</span>
                {errors.message && <p className={styles.errMsg}>{errors.message}</p>}
              </div>

              {/* Agree */}
              <div className={styles.field}>
                <label className={errors.agree ? styles.inputErr : ''}>
                  <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
                  I agree to the privacy policy
                </label>
              </div>

              <button type="submit" disabled={status==='loading'} className={styles.submitBtn}>
                {status==='loading' ? 'Sending...' : 'Send message'}
              </button>

            </form>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────
function Field({ label, name, value, onChange, error, required }) {
  return (
    <div className={styles.field}>
      <label>{label}{required && '*'}</label>
      <input name={name} value={value} onChange={onChange} className={error ? styles.inputErr : ''} />
      {error && <p className={styles.errMsg}>{error}</p>}
    </div>
  )
}

function SuccessScreen({ form, onReset }) {
  return (
    <div className={styles.success}>
      <h2>Message sent successfully!</h2>
      <p>Thanks {form.firstName}, we will contact you at {form.email} soon.</p>
      <button onClick={onReset}>Send another message</button>
    </div>
  )
}