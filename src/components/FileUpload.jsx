import { useState, useRef } from 'react'

export default function FileUpload({ label, required, accept, icon, subtext, file, preview, onChange }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="form-group">
      <label>
        {label} {required && <span className="req">*</span>}
      </label>
      <div
        className={`file-upload-area ${isDragOver ? 'drag' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept || 'image/*'}
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onChange(e.target.files[0])
            }
          }}
        />
        <div className="upload-icon-box">
          {icon}
        </div>
        <div className="upload-label">
          <strong>{file ? file.name : `اضغط لرفع ${label}`}</strong>
          <br />
          {subtext || 'صيغ الصور المدعومة: JPG / PNG / WebP'}
        </div>
        {preview && (
          <img
            src={preview}
            alt="معاينة"
            className="preview-thumb"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>
  )
}
