import { Icons } from './Icons'

export default function SuccessOverlay({ onReset }) {
  return (
    <div id="success-overlay">
      <div className="success-icon-box">
        <Icons.CheckCircle />
      </div>
      <h2>تم الإرسال بنجاح!</h2>
      <p>تم حفظ بياناتك ورفع المرفقات بنجاح في النظام. شكراً لك، يمكنك إغلاق هذه الصفحة الآن.</p>
      <button className="btn btn-ghost" onClick={onReset}>
        <Icons.RefreshCw /> إرسال نموذج آخر
      </button>
    </div>
  )
}
