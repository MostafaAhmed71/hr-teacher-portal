import { useEffect } from 'react'

export default function Lightbox({ src, label, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!src) return null

  return (
    <div id="lightbox" onClick={onClose}>
      <button id="lightbox-close" onClick={onClose} title="إغلاق">✕</button>
      <img src={src} alt={label || 'صورة مكبّرة'} onClick={(e) => e.stopPropagation()} />
      {label && <div id="lightbox-label">{label}</div>}
    </div>
  )
}
