import { useState } from 'react'
import { sessions } from '../data/sessions'

const SCRIPT_URL = import.meta.env.VITE_SHEETS_SCRIPT_URL || ''

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' })
}

// Генерирует .ics файл и скачивает его
function downloadICS(session) {
  const [startH, endH] = session.time.split('–')
  const d = new Date(session.date)
  const pad = n => String(n).padStart(2, '0')
  const dateStr = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  const toTime = t => t.replace(':', '') + '00'

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GrowVibe//RU',
    'BEGIN:VEVENT',
    `DTSTART:${dateStr}T${toTime(startH)}`,
    `DTEND:${dateStr}T${toTime(endH)}`,
    `SUMMARY:🚀 Гроу Вайб — AI-практикум (${session.city})`,
    `DESCRIPTION:Вайб-кодинг практикум. Адрес придёт после оплаты.`,
    `LOCATION:${session.location}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Напоминание: через час начинается практикум Гроу Вайб!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'growvibe-praktikum.ics'
  a.click()
  URL.revokeObjectURL(url)
}

// Ссылка на Google Calendar
function googleCalLink(session) {
  const [startH, endH] = session.time.split('–')
  const d = new Date(session.date)
  const pad = n => String(n).padStart(2, '0')
  const dateStr = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  const toTime = t => t.replace(':', '') + '00'
  const start = `${dateStr}T${toTime(startH)}`
  const end   = `${dateStr}T${toTime(endH)}`
  const text  = encodeURIComponent(`Гроу Вайб — AI-практикум (${session.city})`)
  const loc   = encodeURIComponent(session.location)
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&location=${loc}&details=${encodeURIComponent('Вайб-кодинг практикум. Адрес придёт после оплаты.')}`
}

export default function RegistrationForm({ canRegister, selectedSession, onBlockedClick, onSeatsUpdate }) {
  const [form, setForm]       = useState({ name: '', phone: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [touched, setTouched] = useState(false)

  const session   = sessions.find(s => s.id === selectedSession)
  const formValid = form.name.trim() && form.phone.trim() && form.email.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canRegister) { onBlockedClick?.(); return }
    setTouched(true)
    if (!formValid) return

    setLoading(true)
    setError(null)

    try {
      if (SCRIPT_URL) {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Apps Script requires no-cors
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:        form.name,
            phone:       form.phone,
            email:       form.email,
            sessionId:   session?.id,
            city:        session?.city,
            sessionDate: session?.date,
          }),
        })
        // После успешной отправки — уведомить родителя об уменьшении мест
        onSeatsUpdate?.(session?.id)
      }
      setSubmitted(true)
    } catch {
      setError('Ошибка отправки. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  // ── Экран успеха ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <section id="register" className="py-20 bg-[#0f0f0f]">
        <div className="max-w-2xl mx-auto px-6 text-center text-white">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold mb-3">Заявка принята!</h2>
          <p className="text-white/60 mb-10">
            Мы свяжемся с тобой в ближайшее время для подтверждения и оплаты.
          </p>

          {session && (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-8 text-left">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Твоё занятие</p>
              <p className="text-white font-bold text-lg">{session.city} · {formatDate(session.date)}</p>
              <p className="text-white/60 text-sm mt-1">{session.time}</p>
            </div>
          )}

          <p className="text-white/50 text-sm mb-5">Добавь в календарь, чтобы не забыть:</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={session ? googleCalLink(session) : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
            >
              <span className="text-lg">📅</span>
              Google Calendar
            </a>

            {session && (
              <button
                onClick={() => downloadICS(session)}
                className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-white/20 transition-colors"
              >
                <span className="text-lg">📲</span>
                Apple / Outlook (.ics)
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  // ── Форма ─────────────────────────────────────────────────────────────────
  return (
    <section id="register" className="py-20 bg-[#0f0f0f]">
      <div className="max-w-2xl mx-auto px-6">
        <p className="text-[#D97757] font-semibold text-sm uppercase tracking-widest mb-3">Регистрация</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Оставить заявку</h2>

        {!canRegister && (
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-8 text-white/60 text-sm">
            ⚠️ Для подачи заявки нужно пройти подготовку, выбрать дату и подтвердить готовность.
          </div>
        )}

        {session && (
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-8">
            <p className="text-white/60 text-sm mb-1">Выбранное занятие:</p>
            <p className="text-white font-semibold">{session.city} · {formatDate(session.date)}</p>
            <p className="text-white/60 text-sm">{session.time} · {session.price}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'name',  label: 'Имя и фамилия',  placeholder: 'Айгерим Назарова',    type: 'text'  },
            { name: 'phone', label: 'Номер телефона',  placeholder: '+7 (777) 000-00-00',  type: 'tel'   },
            { name: 'email', label: 'Email',           placeholder: 'example@gmail.com',   type: 'email' },
          ].map(f => {
            const isEmpty = touched && canRegister && !form[f.name].trim()
            return (
              <div key={f.name}>
                <label className="block text-white/60 text-sm mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                  className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none text-sm transition-colors ${
                    isEmpty ? 'border-red-400' : 'border-white/20 focus:border-[#D97757]'
                  }`}
                />
                {isEmpty && <p className="text-red-400 text-xs mt-1">Заполните это поле</p>}
              </div>
            )
          })}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-4 rounded-xl text-base transition-colors ${
              !canRegister
                ? 'bg-white/20 hover:bg-white/30 text-white/70 border border-white/20'
                : formValid
                  ? 'bg-[#D97757] hover:bg-[#c4674a] text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white/70 border border-white/20'
            } ${loading ? 'opacity-60 cursor-wait' : ''}`}
          >
            {loading
              ? '⏳ Отправляем...'
              : !canRegister
                ? '⚠️ Выполните все шаги выше'
                : formValid
                  ? 'Оставить заявку →'
                  : '📝 Заполните все поля'}
          </button>
        </form>
      </div>
    </section>
  )
}
