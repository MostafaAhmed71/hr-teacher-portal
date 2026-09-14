import { useState } from 'react'
import { Icons } from '../components/Icons'

export default function HRLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const HR_PASSWORD = import.meta.env.VITE_HR_PASSWORD || 'hr2026'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === HR_PASSWORD) {
      setError('')
      onSuccess()
    } else {
      setError('كلمة السر غير صحيحة')
      setPassword('')
    }
  }

  return (
    <div className="page" style={{ maxWidth: 440 }}>
      <div className="pw-card">
        <div className="pw-icon-box">
          <Icons.Lock />
        </div>
        <div className="pw-title">لوحة الموارد البشرية</div>
        <div className="pw-subtitle">هذه المنطقة محمية. أدخل كلمة السر للمتابعة.</div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="كلمة السر"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              background: 'var(--navy-surface)',
              border: '1.5px solid var(--navy-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-white)',
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '1.1rem',
              padding: '12px 16px',
              outline: 'none',
              textAlign: 'center',
              letterSpacing: '0.15em',
              marginBottom: 16,
              display: 'block',
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }}>
            <Icons.Unlock /> دخول لوحة التحكم
          </button>
        </form>

        {error && <div className="alert alert-error" style={{ marginTop: 0 }}>{error}</div>}
      </div>
    </div>
  )
}
