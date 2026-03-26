// src/app/contact/page.js
// The star of the show — a fully featured contact form.
//
// What this file teaches:
//   1. 'use client' — needed for useState, useEffect, event handlers
//   2. useState      — managing form data, errors, UI state
//   3. useEffect     — running code when state changes (progress bar)
//   4. Form handling — onChange, onSubmit, e.preventDefault()
//   5. Validation    — checking fields before allowing submit
//   6. Conditional rendering — showing/hiding sections based on state

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
  { id: 'updates',    label: 'Product updates' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'events',     label: 'Events & webinars' },
  { id: 'beta',       label: 'Beta testing' },
]

// Required fields (used to calculate progress)
const REQUIRED = ['firstName', 'lastName', 'email', 'subject', 'message']

// ─── Main Component ───────────────────────────────────────────
export default function ContactPage() {

  // All form field values in one object
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

  // Which fields have errors — only shown after first submit attempt
  const [errors, setErrors] = useState({})

  // Has the user tried to submit yet?
  const [touched, setTouched] = useState(false)

  // UI states
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success'
  const [progress, setProgress] = useState(0)

  // Recalculate progress whenever form changes
  useEffect(() => {
    const filled = REQUIRED.filter(key => String(form[key]).trim().length > 0).length
    setProgress(Math.round((filled / REQUIRED.length) * 100))
  }, [form])

  // Re-validate whenever form changes (but only after first submit)
  useEffect(() => {
    if (touched) validateAll()
  }, [form, touched])

  // ─── Handlers ───────────────────────────────────────────────

  // Universal change handler — works for all text inputs
  function handleChange(e) {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox' && name === 'agree') {
      setForm(prev => ({ ...prev, agree: checked }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  // Handles the checkboxes in the "interests" group
  function handleInterest(id) {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id],
    }))
  }

  // Validate all fields — returns true if form is valid
  function validateAll() {
    const e = {}
    if (!form.firstName.trim())  e.firstName = 'First name is required'
    if (!form.lastName.trim())   e.lastName  = 'Last name is required'
    if (!form.subject)           e.subject   = 'Please choose a subject'
    if (!form.agree)             e.agree     = 'You must agree to continue'

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

  // Called when the form is submitted
  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)

    if (!validateAll()) return

    // Simulate an API call with a 1.5s delay
    setStatus('loading')
    setTimeout(() => setStatus('success'), 1500)
  }

  function resetForm() {
    setForm({ firstName:'', lastName:'', email:'', phone:'', subject:'', priority:'normal', message:'', interests:[], agree:false })
    setErrors({})
    setTouched(false)
    setStatus('idle')
  }

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* Left panel — decorative sidebar */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.backLink}>← Back</Link>
        <div className={styles.sideContent}>
          <p className={styles.sideLabel}>Get in touch</p>
          <h1 className={styles.sideTitle}>We'd love<br />to hear<br /><em>from you.</em></h1>
          <div className={styles.sideDetails}>
            <SideRow icon="✉" label="Email"    value="hello@example.com" />
            <SideRow icon="📍" label="Location" value="Bangalore, India" />
            <SideRow icon="⏱" label="Response" value="Within 24 hours" />
          </div>
        </div>
      </aside>

      {/* Right panel — the form */}
      <main className={styles.formPanel}>

        {status === 'success' ? (
          <SuccessScreen form={form} onReset={resetForm} />
        ) : (
          <div className={styles.formWrap}>

            {/* Progress indicator */}
            <div className={styles.progressWrap}>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <span className={styles.progressLabel}>{progress}% complete</span>
            </div>

            <form onSubmit={handleSubmit} noValidate className={styles.form}>

              {/* ── Row 1: Name ── */}
              <div className={styles.row2}>
                <Field
                  label="First name" name="firstName" required
                  value={form.firstName} onChange={handleChange}
                  error={errors.firstName} placeholder="Aarav"
                />
                <Field
                  label="Last name" name="lastName" required
                  value={form.lastName} onChange={handleChange}
                  error={errors.lastName} placeholder="Shah"
                />
              </div>

              {/* ── Row 2: Contact ── */}
              <div className={styles.row2}>
                <Field
                  label="Email address" name="email" type="email" required
                  value={form.email} onChange={handleChange}
                  error={errors.email} placeholder="aarav@example.com"
                />
                <Field
                  label="Phone (optional)" name="phone" type="tel"
                  value={form.phone} onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* ── Subject ── */}
              <div className={styles.field}>
                <label className={styles.label}>
                  Subject <span className={styles.req}>*</span>
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className={`${styles.select} ${errors.subject ? styles.inputErr : ''}`}
                >
                  <option value="">Select a topic...</option>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
                {errors.subject && <p className={styles.errMsg}>{errors.subject}</p>}
              </div>

              {/* ── Priority ── */}
              <div className={styles.field}>
                <label className={styles.label}>Priority</label>
                <div className={styles.radioGroup}>
                  {['low', 'normal', 'high', 'urgent'].map(p => (
                    <label key={p} className={`${styles.radioItem} ${form.priority === p ? styles.radioActive : ''}`}>
                      <input
                        type="radio" name="priority" value={p}
                        checked={form.priority === p}
                        onChange={handleChange}
                        className={styles.radioInput}
                      />
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Message ── */}
              <div className={styles.field}>
                <label className={styles.label}>
                  Message <span className={styles.req}>*</span>
                  <span className={styles.charCount}>{form.message.length} / 500</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  maxLength={500}
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className={`${styles.textarea} ${errors.message ? styles.inputErr : ''}`}
                />
                {errors.message && <p className={styles.errMsg}>{errors.message}</p>}
              </div>

              {/* ── Interests ── */}
              <div className={styles.field}>
                <label className={styles.label}>I&apos;m interested in</label>
                <div className={styles.checkGrid}>
                  {INTERESTS.map(({ id, label }) => (
                    <label key={id} className={`${styles.checkItem} ${form.interests.includes(id) ? styles.checkActive : ''}`}>
                      <input
                        type="checkbox"
                        checked={form.interests.includes(id)}
                        onChange={() => handleInterest(id)}
                        className={styles.checkInput}
                      />
                      <span className={styles.checkBox}>
                        {form.interests.includes(id) && (
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <polyline points="2,6 4.5,8.5 9,3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                          </svg>
                        )}
                      </span>
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Agreement ── */}
              <div className={styles.field}>
                <label className={`${styles.agreeRow} ${errors.agree ? styles.agreeErr : ''}`}>
                  <input
                    type="checkbox" name="agree"
                    checked={form.agree}
                    onChange={handleChange}
                    className={styles.checkInput}
                  />
                  <span className={styles.checkBox}>
                    {form.agree && (
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <polyline points="2,6 4.5,8.5 9,3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    )}
                  </span>
                  <span className={styles.agreeText}>
                    I agree to the <a href="#" className={styles.link}>privacy policy</a> and consent to being contacted.
                  </span>
                </label>
                {errors.agree && <p className={styles.errMsg}>{errors.agree}</p>}
              </div>

              {/* ── Submit row ── */}
              <div className={styles.submitRow}>
                <button type="button" onClick={resetForm} className={styles.clearBtn}>
                  Clear form
                </button>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={styles.submitBtn}
                >
                  {status === 'loading' ? (
                    <span className={styles.spinner} />
                  ) : (
                    'Send message'
                  )}
                </button>
              </div>

              {/* Show error count if submit was attempted */}
              {touched && Object.keys(errors).length > 0 && (
                <p className={styles.globalErr}>
                  Please fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''} above.
                </p>
              )}

            </form>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────

// Reusable text input field with label + error
function Field({ label, name, type = 'text', value, onChange, error, placeholder, required }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label} {required && <span className={styles.req}>*</span>}
      </label>
      <input
        type={type} name={name} value={value}
        onChange={onChange} placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputErr : ''}`}
      />
      {error && <p className={styles.errMsg}>{error}</p>}
    </div>
  )
}

// Sidebar info row
function SideRow({ icon, label, value }) {
  return (
    <div className={styles.sideRow}>
      <span className={styles.sideIcon}>{icon}</span>
      <div>
        <p className={styles.sideRowLabel}>{label}</p>
        <p className={styles.sideRowValue}>{value}</p>
      </div>
    </div>
  )
}

// Success screen shown after submission
function SuccessScreen({ form, onReset }) {
  const interests = form.interests.length
    ? INTERESTS.filter(i => form.interests.includes(i.id)).map(i => i.label).join(', ')
    : 'None selected'

  return (
    <div className={styles.success}>
      <div className={styles.successIcon}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5"/>
          <polyline points="8,14 12,18 20,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 className={styles.successTitle}>Message received!</h2>
      <p className={styles.successSub}>
        Thanks <strong>{form.firstName}</strong> — we&apos;ll reply to <em>{form.email}</em> within 24 hours.
      </p>

      <div className={styles.summaryCard}>
        <p className={styles.summaryHeading}>Submission summary</p>
        {[
          ['Name',      `${form.firstName} ${form.lastName}`],
          ['Email',     form.email],
          ['Subject',   form.subject],
          ['Priority',  form.priority.charAt(0).toUpperCase() + form.priority.slice(1)],
          ['Interests', interests],
          ['Message',   form.message],
        ].map(([k, v]) => (
          <div key={k} className={styles.summaryRow}>
            <span className={styles.summaryKey}>{k}</span>
            <span className={styles.summaryVal}>{v}</span>
          </div>
        ))}
      </div>

      <button onClick={onReset} className={styles.newBtn}>
        Send another message
      </button>
    </div>
  )
}
