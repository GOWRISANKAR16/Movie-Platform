import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import heroImage from '../money-heist-hero.png'

const initialForm = {
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

export default function SignupPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()
  const { signup } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.username.trim()) {
      nextErrors.username = 'Username is required.'
    }
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!form.phone.trim()) {
      nextErrors.phone = 'Phone is required.'
    } else if (!/^\d+$/.test(form.phone)) {
      nextErrors.phone = 'Phone must be numeric only.'
    }
    if (!form.password) {
      nextErrors.password = 'Password is required.'
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }
    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password.'
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      await signup({
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      })
      navigate('/login', { replace: true })
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Signup failed. Please try again.'
      setServerError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt="Netflix style background"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
      </div>

      <header className="flex items-center justify-between px-6 py-4 sm:px-12">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-sm bg-netflix-red" />
          <span className="text-2xl font-bold tracking-widest text-netflix-red">
            MOVIE FLIX
          </span>
        </div>
      </header>

      <main className="flex justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md rounded-md bg-black/75 px-6 py-8 shadow-xl backdrop-blur">
          <h1 className="mb-6 text-3xl font-semibold">Sign Up</h1>

          {serverError && (
            <div className="mb-4 rounded bg-red-600/80 px-3 py-2 text-sm">
              {serverError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-1">
              <label htmlFor="username" className="text-sm text-neutral-200">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className="w-full rounded bg-neutral-800 px-3 py-2 text-sm outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-netflix-red"
                value={form.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-xs text-red-400">{errors.username}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm text-neutral-200">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="w-full rounded bg-neutral-800 px-3 py-2 text-sm outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-netflix-red"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm text-neutral-200">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="w-full rounded bg-neutral-800 px-3 py-2 text-sm outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-netflix-red"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="text-xs text-red-400">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm text-neutral-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="w-full rounded bg-neutral-800 px-3 py-2 text-sm outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-netflix-red"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="text-sm text-neutral-200"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="w-full rounded bg-neutral-800 px-3 py-2 text-sm outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-netflix-red"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 inline-flex w-full items-center justify-center rounded bg-netflix-red px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-800/70"
            >
              {submitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-sm text-neutral-300">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-white hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

