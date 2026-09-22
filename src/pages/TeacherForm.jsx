import { useState } from 'react'
import { supabase } from '../lib/supabase'
import FileUpload from '../components/FileUpload'
import SuccessOverlay from '../components/SuccessOverlay'
import { Icons } from '../components/Icons'

const SECTIONS = ['ابتدائي', 'متوسط', 'ثانوي', 'عالمي']

export default function TeacherForm() {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    phone: '',
    email: '',
    major: '',
    position: '',
    startDate: '',
    experience: '',
    sections: [],
  })

  const [idFile, setIdFile] = useState(null)
  const [idPreview, setIdPreview] = useState(null)
  const [degreeFile, setDegreeFile] = useState(null)
  const [degreePreview, setDegreePreview] = useState(null)
  const [passFile, setPassFile] = useState(null)
  const [passPreview, setPassPreview] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSectionToggle = (sec) => {
    setFormData((prev) => {
      const exists = prev.sections.includes(sec)
      return {
        ...prev,
        sections: exists ? prev.sections.filter((s) => s !== sec) : [...prev.sections, sec],
      }
    })
  }

  const handleIdFileChange = (file) => {
    setIdFile(file)
    setIdPreview(URL.createObjectURL(file))
  }

  const handleDegreeFileChange = (file) => {
    setDegreeFile(file)
    setDegreePreview(URL.createObjectURL(file))
  }

  const handlePassFileChange = (file) => {
    setPassFile(file)
    setPassPreview(URL.createObjectURL(file))
  }

  const uploadFileToSupabase = async (file, folder) => {
    if (!file) return null
    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('teacher-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage Upload Error:', uploadError)
      throw new Error(`خطأ في رفع الملف (${folder}): ${uploadError.message}`)
    }

    const { data: publicUrlData } = supabase.storage
      .from('teacher-images')
      .getPublicUrl(fileName)

    return publicUrlData?.publicUrl || null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const missing = []
    if (!formData.name.trim()) missing.push('الاسم الكامل')
    if (!formData.idNumber.trim()) missing.push('رقم الهوية الوطنية')
    if (!formData.phone.trim()) missing.push('رقم الجوال')
    if (!formData.email.trim()) missing.push('البريد الإلكتروني')
    if (!degreeFile) missing.push('صورة المؤهل العلمي')
    if (!formData.major.trim()) missing.push('التخصص')
    if (!formData.position.trim()) missing.push('العمل الحالي')
    if (!formData.startDate) missing.push('تاريخ المباشرة')
    if (formData.sections.length === 0) missing.push('القسم')
    if (!idFile) missing.push('صورة الهوية')

    if (missing.length > 0) {
      setError('يرجى إكمال الحقول التالية: ' + missing.join('، '))
      return
    }

    setLoading(true)

    try {
      // 1. Upload Images to Supabase Storage
      const idImageUrl = await uploadFileToSupabase(idFile, 'id-cards')
      const degreeImageUrl = await uploadFileToSupabase(degreeFile, 'qualifications')
      let passImageUrl = null
      if (passFile) {
        passImageUrl = await uploadFileToSupabase(passFile, 'passports')
      }

      // 2. Insert into Supabase table 'teachers'
      const { error: insertError } = await supabase.from('teachers').insert([
        {
          name: formData.name.trim(),
          id_number: formData.idNumber.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          degree: degreeImageUrl,
          major: formData.major.trim(),
          position: formData.position.trim(),
          start_date: formData.startDate,
          experience: formData.experience.trim() || null,
          sections: formData.sections,
          id_image: idImageUrl,
          pass_image: passImageUrl,
        },
      ])

      if (insertError) {
        throw new Error(`خطأ في حفظ البيانات: ${insertError.message}`)
      }

      setIsSuccess(true)
    } catch (err) {
      setError(err.message || 'حدث خطأ غير متوقع أثناء الحفظ.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      idNumber: '',
      phone: '',
      email: '',
      major: '',
      position: '',
      startDate: '',
      experience: '',
      sections: [],
    })
    setIdFile(null)
    setIdPreview(null)
    setDegreeFile(null)
    setDegreePreview(null)
    setPassFile(null)
    setPassPreview(null)
    setError('')
    setIsSuccess(false)
  }

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">
          <Icons.FileText /> استمارة تسجيل بيانات المعلم
        </div>
        <div className="card-subtitle">
          أهلاً بك في البوابة الأكاديمية. يُرجى استكمال كافة الحقول وتزويدنا بالمرفقات الرسمية بدقة لضمان تسجيلك المباشر في النظام.
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label>
                الاسم الكامل <span className="req">*</span>
              </label>
              <input
                type="text"
                placeholder="مثال: أحمد عبدالله العمري"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>
                رقم الهوية الوطنية <span className="req">*</span>
              </label>
              <input
                type="text"
                maxLength={10}
                placeholder="10 أرقام"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>
                رقم الجوال <span className="req">*</span>
              </label>
              <input
                type="tel"
                placeholder="05XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>
                البريد الإلكتروني <span className="req">*</span>
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <FileUpload
              label="صورة المؤهل العلمي"
              required
              icon={<Icons.FileText />}
              subtext="صورة واضحة للمؤهل بصيغة JPG / PNG / WebP"
              file={degreeFile}
              preview={degreePreview}
              onChange={handleDegreeFileChange}
            />

            <div className="form-group">
              <label>
                التخصص <span className="req">*</span>
              </label>
              <input
                type="text"
                placeholder="مثال: رياضيات، لغة عربية..."
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>
                العمل الحالي بالمدرسة <span className="req">*</span>
              </label>
              <input
                type="text"
                placeholder="مثال: معلم / مشرف / منسق..."
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>
                تاريخ المباشرة الأول <span className="req">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="form-group full">
              <label>الخبرات السابقة</label>
              <textarea
                placeholder="اذكر خبراتك السابقة في مجال التعليم أو المجالات ذات الصلة..."
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>

            <div className="form-group full">
              <label>
                القسم <span className="req">*</span>
              </label>
              <div className="checkbox-group">
                {SECTIONS.map((sec) => {
                  const isChecked = formData.sections.includes(sec)
                  return (
                    <div
                      key={sec}
                      className={`check-chip ${isChecked ? 'checked' : ''}`}
                      onClick={() => handleSectionToggle(sec)}
                    >
                      {isChecked && <Icons.Check />}
                      {sec}
                    </div>
                  )
                })}
              </div>
            </div>

            <FileUpload
              label="صورة الهوية الوطنية"
              required
              icon={<Icons.IdCard />}
              file={idFile}
              preview={idPreview}
              onChange={handleIdFileChange}
            />

            <FileUpload
              label="صورة جواز السفر"
              icon={<Icons.Passport />}
              subtext="JPG / PNG / WebP (اختياري)"
              file={passFile}
              preview={passPreview}
              onChange={handlePassFileChange}
            />
          </div>

          <div className="divider"></div>

          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> جارٍ المعالجة والرفع...
                </>
              ) : (
                <>
                  <Icons.Check /> إرسال البيانات
                </>
              )}
            </button>
            <button type="button" className="btn btn-ghost" onClick={handleReset} disabled={loading}>
              <Icons.RefreshCw /> إعادة تعيين
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
        </form>
      </div>

      {isSuccess && <SuccessOverlay onReset={handleReset} />}
    </div>
  )
}
