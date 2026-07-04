import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Lock, Eye, EyeOff, Save, Calendar,
  CheckCircle2, ShieldCheck, Camera, Trash2, Check,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import UserAvatar, { BuiltinAvatar, BUILTIN_AVATARS, getAvatarState } from '../../components/ui/UserAvatar'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d) {
  if (!d) return 'Unknown'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function notifyAvatarChanged() {
  window.dispatchEvent(new CustomEvent('profileUpdated'))
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PasswordInput({ label, value, onChange, show, onToggle, placeholder }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9CA3AF', pointerEvents: 'none' }} />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ width: '100%', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 8, paddingLeft: 42, paddingRight: 44, paddingTop: 12, paddingBottom: 12, fontSize: 14, color: '#0A0A0A', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          onFocus={e => { e.target.style.borderColor = '#0284C7'; e.target.style.boxShadow = '0 0 0 3px rgba(2,132,199,0.08)' }}
          onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center', padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = '#374151'}
          onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
        >
          {show ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
        </button>
      </div>
    </div>
  )
}

function SaveBtn({ status, idleLabel, savingLabel, successLabel, icon: Icon }) {
  const saving  = status === 'saving'
  const success = status === 'success'
  return (
    <motion.button
      type="submit"
      disabled={saving}
      whileHover={!saving ? { scale: 1.02 } : {}}
      whileTap={!saving ? { scale: 0.98 } : {}}
      style={{ background: 'linear-gradient(135deg, #0284C7, #38BDF8)', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: 8, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'inherit' }}
    >
      {saving  ? <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} /> :
       success ? <CheckCircle2 style={{ width: 16, height: 16 }} /> :
                 <Icon style={{ width: 16, height: 16 }} />}
      {saving ? savingLabel : success ? successLabel : idleLabel}
    </motion.button>
  )
}

function ErrMsg({ msg }) {
  return (
    <AnimatePresence mode="wait">
      {msg && (
        <motion.p
          key={msg}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          style={{ color: '#EF4444', fontSize: 14, margin: 0 }}
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const fileRef = useRef(null)

  // ── Avatar state ──────────────────────────────────────────────────────────
  const [avatarState, setAvatarState] = useState(() => getAvatarState(user?.id))

  const hasPhoto        = avatarState.type === 'photo'
  const selectedBuiltin = avatarState.type === 'builtin' ? avatarState.id : null

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target.result
      localStorage.setItem(`profile_picture_${user.id}`, base64)
      localStorage.removeItem(`selected_avatar_${user.id}`)
      const next = { type: 'photo', src: base64 }
      setAvatarState(next)
      notifyAvatarChanged()
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleRemovePhoto = () => {
    localStorage.removeItem(`profile_picture_${user.id}`)
    const id = localStorage.getItem(`selected_avatar_${user.id}`)
    const next = id ? { type: 'builtin', id } : { type: 'initials' }
    setAvatarState(next)
    notifyAvatarChanged()
  }

  const handleSelectBuiltin = (id) => {
    localStorage.removeItem(`profile_picture_${user.id}`)
    localStorage.setItem(`selected_avatar_${user.id}`, id)
    const next = { type: 'builtin', id }
    setAvatarState(next)
    notifyAvatarChanged()
  }

  const handleRemoveBuiltin = () => {
    localStorage.removeItem(`selected_avatar_${user.id}`)
    setAvatarState({ type: 'initials' })
    notifyAvatarChanged()
  }

  // ── Name form ─────────────────────────────────────────────────────────────
  const [fullName,   setFullName]   = useState(user?.full_name || '')
  const [nameStatus, setNameStatus] = useState(null)
  const [nameError,  setNameError]  = useState('')

  const handleSaveName = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) { setNameError('Name cannot be empty'); return }
    setNameStatus('saving'); setNameError('')
    try {
      await updateProfile({ full_name: fullName.trim() })
      setNameStatus('success')
      setTimeout(() => setNameStatus(null), 3000)
    } catch (err) {
      setNameError(err?.response?.data?.message || 'Failed to update profile')
      setNameStatus(null)
    }
  }

  // ── Password form ─────────────────────────────────────────────────────────
  const [pwForm,   setPwForm]   = useState({ current: '', next: '', confirm: '' })
  const [showPw,   setShowPw]   = useState({ current: false, next: false, confirm: false })
  const [pwStatus, setPwStatus] = useState(null)
  const [pwError,  setPwError]  = useState('')

  const setPw      = (f) => (e) => { setPwForm((p) => ({ ...p, [f]: e.target.value })); if (pwError) setPwError('') }
  const toggleShow = (f) => () => setShowPw((p) => ({ ...p, [f]: !p[f] }))

  const handleSavePassword = async (e) => {
    e.preventDefault()
    if (!pwForm.current)               { setPwError('Current password is required'); return }
    if (pwForm.next.length < 8)        { setPwError('New password must be at least 8 characters'); return }
    if (pwForm.next !== pwForm.confirm) { setPwError('Passwords do not match'); return }
    setPwStatus('saving'); setPwError('')
    try {
      await updateProfile({ currentPassword: pwForm.current, newPassword: pwForm.next })
      setPwStatus('success')
      setPwForm({ current: '', next: '', confirm: '' })
      setTimeout(() => setPwStatus(null), 3000)
    } catch (err) {
      setPwError(err?.response?.data?.message || 'Failed to update password')
      setPwStatus(null)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ padding: '24px 32px', maxWidth: 672, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}
    >

      {/* Avatar card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
      >
        {/* Avatar with camera overlay */}
        <div style={{ position: 'relative' }}
          onMouseEnter={e => { const btn = e.currentTarget.querySelector('.cam-hover'); if (btn) btn.style.opacity = '1' }}
          onMouseLeave={e => { const btn = e.currentTarget.querySelector('.cam-hover'); if (btn) btn.style.opacity = '0' }}
        >
          <div style={{ boxShadow: '0 0 0 4px rgba(2,132,199,0.15)', borderRadius: '50%', display: 'inline-flex' }}>
            <UserAvatar size={100} showBorder={false} />
          </div>

          {/* Online dot */}
          <span style={{ position: 'absolute', bottom: 6, right: 6, width: 16, height: 16, background: '#10B981', borderRadius: '50%', border: '2px solid #ffffff' }} />

          {/* Camera button on hover */}
          <motion.button
            className="cam-hover"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileRef.current?.click()}
            style={{ position: 'absolute', bottom: -4, right: -4, width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #0284C7, #38BDF8)', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s' }}
          >
            <Camera style={{ width: 14, height: 14, color: 'white' }} />
          </motion.button>

          {/* Always-visible camera badge when no photo/avatar */}
          {avatarState.type === 'initials' && (
            <button
              onClick={() => fileRef.current?.click()}
              style={{ position: 'absolute', bottom: -4, right: -4, width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #0284C7, #38BDF8)', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Camera style={{ width: 14, height: 14, color: 'white' }} />
            </button>
          )}
        </div>

        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif" style={{ display: 'none' }} onChange={handleFileChange} />

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0A0A0A', margin: 0 }}>{user?.full_name || 'User'}</h2>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>{user?.email}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6B7280', background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '6px 14px', borderRadius: 99 }}>
          <Calendar style={{ width: 14, height: 14 }} />
          Member since {formatDate(user?.created_at)}
        </div>

        {/* Upload / remove actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => fileRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280', border: '1px solid #E5E7EB', background: '#ffffff', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#0284C7'; e.currentTarget.style.borderColor = 'rgba(2,132,199,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB' }}
          >
            <Camera style={{ width: 14, height: 14 }} />
            {hasPhoto ? 'Replace Photo' : 'Upload Photo'}
          </motion.button>

          {hasPhoto && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRemovePhoto}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', background: '#ffffff', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'}
            >
              <Trash2 style={{ width: 14, height: 14 }} />
              Remove Photo
            </motion.button>
          )}

          {selectedBuiltin && !hasPhoto && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRemoveBuiltin}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9CA3AF', border: '1px solid #E5E7EB', background: '#ffffff', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#D1D5DB' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = '#E5E7EB' }}
            >
              <Trash2 style={{ width: 14, height: 14 }} />
              Remove Avatar
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Built-in avatar picker */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(2,132,199,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User style={{ width: 14, height: 14, color: '#0284C7' }} />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>Choose an Avatar</h3>
        </div>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>Select a built-in character or upload your own photo above.</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {BUILTIN_AVATARS.map((av, i) => {
            const isSelected = !hasPhoto && selectedBuiltin === av.id
            return (
              <motion.button
                key={av.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.12 + i * 0.05 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectBuiltin(av.id)}
                title={av.label}
                style={{
                  position: 'relative', width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: 'none', padding: 0, cursor: 'pointer',
                  boxShadow: isSelected
                    ? '0 0 0 3px #0284C7, 0 0 12px rgba(2,132,199,0.4)'
                    : '0 0 0 2px transparent',
                  transition: 'box-shadow 0.2s',
                }}
              >
                <BuiltinAvatar id={av.id} className="w-full h-full" />
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,132,199,0.25)', borderRadius: '50%' }}
                  >
                    <Check style={{ width: 20, height: 20, color: 'white', strokeWidth: 3 }} />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 12 }}>Uploaded photos take priority over avatar selections.</p>
      </motion.div>

      {/* Edit Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(2,132,199,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User style={{ width: 14, height: 14, color: '#0284C7' }} />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>Edit Profile</h3>
        </div>

        <form onSubmit={handleSaveName} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 6 }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9CA3AF', pointerEvents: 'none' }} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setNameError(''); setNameStatus(null) }}
                placeholder="Your full name"
                style={{ width: '100%', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 8, paddingLeft: 42, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, color: '#0A0A0A', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = '#0284C7'; e.target.style.boxShadow = '0 0 0 3px rgba(2,132,199,0.08)' }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 6 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9CA3AF', pointerEvents: 'none' }} />
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                style={{ width: '100%', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, paddingLeft: 42, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, color: '#9CA3AF', outline: 'none', cursor: 'not-allowed', boxSizing: 'border-box' }}
              />
            </div>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>Email address cannot be changed</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 6 }}>Member Since</label>
            <div style={{ position: 'relative' }}>
              <Calendar style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9CA3AF', pointerEvents: 'none' }} />
              <input
                type="text"
                value={formatDate(user?.created_at)}
                readOnly
                style={{ width: '100%', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, paddingLeft: 42, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, color: '#9CA3AF', outline: 'none', cursor: 'not-allowed', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <ErrMsg msg={nameError} />
          <SaveBtn status={nameStatus} icon={Save}
            idleLabel="Save Changes" savingLabel="Saving…" successLabel="Saved!" />
        </form>
      </motion.div>

      {/* Change Password card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(2,132,199,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck style={{ width: 14, height: 14, color: '#0284C7' }} />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>Change Password</h3>
        </div>

        <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <PasswordInput label="Current Password" value={pwForm.current} onChange={setPw('current')}
            show={showPw.current} onToggle={toggleShow('current')} placeholder="Enter current password" />
          <PasswordInput label="New Password" value={pwForm.next} onChange={setPw('next')}
            show={showPw.next} onToggle={toggleShow('next')} placeholder="Min. 8 characters" />
          <PasswordInput label="Confirm New Password" value={pwForm.confirm} onChange={setPw('confirm')}
            show={showPw.confirm} onToggle={toggleShow('confirm')} placeholder="Repeat new password" />
          <ErrMsg msg={pwError} />
          <SaveBtn status={pwStatus} icon={Lock}
            idleLabel="Update Password" savingLabel="Updating…" successLabel="Password Updated!" />
        </form>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </motion.div>
  )
}
