import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import * as XLSX from 'xlsx'
import Lightbox from '../components/Lightbox'
import { Icons } from '../components/Icons'

export default function HRDashboard({ onLogout }) {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [lightbox, setLightbox] = useState({ open: false, src: '', label: '' })

  const fetchTeachers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('submitted_at', { ascending: false })

      if (error) throw error
      setTeachers(data || [])
    } catch (err) {
      console.error('Error fetching teachers:', err)
      alert('خطأ في جلب البيانات من Supabase: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const filteredTeachers = teachers.filter((t) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.id_number && t.id_number.includes(q)) ||
      (t.email && t.email.toLowerCase().includes(q)) ||
      (t.phone && t.phone.includes(q))
    )
  })

  // Statistics
  const totalCount = teachers.length
  const primaryCount = teachers.filter((t) => t.sections?.includes('ابتدائي')).length
  const middleCount = teachers.filter((t) => t.sections?.includes('متوسط')).length
  const highCount = teachers.filter((t) => t.sections?.includes('ثانوي')).length
  const intlCount = teachers.filter((t) => t.sections?.includes('عالمي')).length

  const handleExportExcel = () => {
    if (filteredTeachers.length === 0) {
      alert('لا توجد بيانات للتصدير')
      return
    }

    const headers = [
      '#',
      'الاسم الكامل',
      'رقم الهوية',
      'رقم الجوال',
      'البريد الإلكتروني',
      'رابط صورة المؤهل العلمي',
      'التخصص',
      'العمل الحالي',
      'القسم',
      'تاريخ المباشرة',
      'الخبرات السابقة',
      'رابط صورة الهوية',
      'رابط صورة الجواز',
      'تاريخ الإرسال',
    ]

    const rows = filteredTeachers.map((t, index) => [
      index + 1,
      t.name || '',
      t.id_number || '',
      t.phone || '',
      t.email || '',
      t.degree || '',
      t.major || '',
      t.position || '',
      (t.sections || []).join(' | '),
      t.start_date || '',
      t.experience || '',
      t.id_image || '',
      t.pass_image || '',
      t.submitted_at ? new Date(t.submitted_at).toLocaleString('ar-SA') : '',
    ])

    const wsData = [headers, ...rows]
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    ws['!cols'] = headers.map(() => ({ wch: 22 }))
    XLSX.utils.book_append_sheet(wb, ws, 'بيانات المعلمين')
    XLSX.writeFile(wb, 'بيانات_المعلمين_HR.xlsx')
  }

  return (
    <div className="page" style={{ maxWidth: 1400 }}>
      <div className="hr-header">
        <div>
          <div className="card-title" style={{ fontSize: '1.65rem' }}>
            <Icons.Building /> لوحة تحكم الموارد البشرية
          </div>
          <div className="card-subtitle" style={{ marginBottom: 0 }}>
            إدارة فورية لكادر التدريس والمرفقات الرسمية المدعومة بـ Supabase
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-bar-wrapper">
            <Icons.Search />
            <input
              type="text"
              className="search-bar"
              placeholder="بحث بالاسم، الهوية، الجوال..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-green" onClick={handleExportExcel}>
            <Icons.Download /> تصدير Excel
          </button>
          <button className="btn btn-ghost" onClick={fetchTeachers} title="تحديث البيانات">
            <Icons.RefreshCw /> تحديث
          </button>
          <button className="btn btn-ghost" onClick={onLogout}>
            <Icons.LogOut /> خروج
          </button>
        </div>
      </div>

      <div className="hr-stats">
        <div className="stat-card">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">إجمالي المعلمين</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{primaryCount}</div>
          <div className="stat-label">ابتدائي</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{middleCount}</div>
          <div className="stat-label">متوسط</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{highCount}</div>
          <div className="stat-label">ثانوي</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{intlCount}</div>
          <div className="stat-label">عالمي</div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>رقم الهوية</th>
              <th>الجوال</th>
              <th>البريد الإلكتروني</th>
              <th>المؤهل</th>
              <th>التخصص</th>
              <th>العمل الحالي</th>
              <th>القسم</th>
              <th>المباشرة</th>
              <th>الخبرات</th>
              <th>صورة الهوية</th>
              <th>صورة الجواز</th>
              <th>تاريخ الإرسال</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="14" style={{ textAlign: 'center', padding: '40px' }}>
                  <span className="spinner"></span> جلب البيانات من السيرفر...
                </td>
              </tr>
            ) : filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan="14">
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>لا توجد بيانات مطابقة.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTeachers.map((t, index) => (
                <tr key={t.id || index}>
                  <td className="td-index">{index + 1}</td>
                  <td className="td-name">{t.name}</td>
                  <td>{t.id_number}</td>
                  <td dir="ltr">{t.phone}</td>
                  <td dir="ltr" style={{ fontSize: '0.78rem' }}>
                    {t.email}
                  </td>
                  <td>
                    {t.degree?.startsWith('http') ? (
                      <img
                        src={t.degree}
                        alt={`مؤهل ${t.name}`}
                        className="thumb"
                        onClick={() =>
                          setLightbox({
                            open: true,
                            src: t.degree,
                            label: `صورة مؤهل: ${t.name}`,
                          })
                        }
                      />
                    ) : (
                      <div className="thumb-placeholder">{t.degree || 'لا صورة'}</div>
                    )}
                  </td>
                  <td>{t.major}</td>
                  <td>{t.position}</td>
                  <td>
                    <div className="sections-tags">
                      {(t.sections || []).map((s, idx) => (
                        <span key={idx} className="sec-tag">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td dir="ltr" style={{ whiteSpace: 'nowrap' }}>
                    {t.start_date}
                  </td>
                  <td
                    style={{
                      maxWidth: 180,
                      fontSize: '0.78rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {t.experience || '—'}
                  </td>
                  <td>
                    {t.id_image ? (
                      <img
                        src={t.id_image}
                        alt={`هوية ${t.name}`}
                        className="thumb"
                        onClick={() =>
                          setLightbox({
                            open: true,
                            src: t.id_image,
                            label: `صورة هوية: ${t.name}`,
                          })
                        }
                      />
                    ) : (
                      <div className="thumb-placeholder">لا صورة</div>
                    )}
                  </td>
                  <td>
                    {t.pass_image ? (
                      <img
                        src={t.pass_image}
                        alt={`جواز ${t.name}`}
                        className="thumb"
                        onClick={() =>
                          setLightbox({
                            open: true,
                            src: t.pass_image,
                            label: `صورة جواز: ${t.name}`,
                          })
                        }
                      />
                    ) : (
                      <div className="thumb-placeholder">لا صورة</div>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                    {t.submitted_at
                      ? new Date(t.submitted_at).toLocaleDateString('ar-SA')
                      : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Lightbox
        src={lightbox.open ? lightbox.src : null}
        label={lightbox.label}
        onClose={() => setLightbox({ open: false, src: '', label: '' })}
      />
    </div>
  )
}
