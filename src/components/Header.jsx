import { Icons } from './Icons'

export default function Header({ view, onLogout }) {
  let badgeText = 'تعبئة البيانات'
  let titleText = 'فورم بيانات المعلمين'

  if (view === 'hr-login') {
    badgeText = 'دخول HR'
    titleText = 'الموارد البشرية'
  } else if (view === 'hr-dashboard') {
    badgeText = 'لوحة HR'
    titleText = 'لوحة بيانات المعلمين'
  }

  return (
    <header className="site-header">
      <div className="header-logo">
        <Icons.Building />
      </div>
      <div className="header-text">
        <h1 id="header-title">{titleText}</h1>
        <p id="header-sub">بوابة إدارة الكادر التعليمي والتوظيف الذكي</p>
      </div>
      <span className="header-badge">{badgeText}</span>
    </header>
  )
}
