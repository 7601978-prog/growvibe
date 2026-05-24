import { useState } from 'react'
import { sessions } from '../data/sessions'

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' })
}

export default function RegistrationForm({ canRegister, selectedSession, onBlockedClick }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState(false)

  const session = sessions.find(s => s.id === selectedSession)

  const formValid = form.name.trim() && form.phone.trim() && form.email.trim()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canRegister) {
      onBlockedClick?.()
      return
    }
    setTouched(true)
    if (!formValid) return
    setSubmitted(true)
  }

  const btnState = !canRegister ? 'flow' : !formValid && touched ? 'fields' : canRegister ? 'ready' : 'flow'

  if (submitted) {
    return (
      <section id="register" className="py-20 bg-[#0f0f0f]">
        <div className="max-w-2xl mx-auto px-6 text-center text-white">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Заявка принята!</h2>
          <p className="text-white/60">
            Мы свяжемся с тобой в ближайшее время для подтверждения и оплаты.
          </p>
        </div>
      </section>
    )
  }

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
            { name: 'name', label: 'Имя и фамилия', placeholder: 'Айгерим Назарова', type: 'text' },
            { name: 'phone', label: 'Номер телефона', placeholder: '+7 (777) 000-00-00', type: 'tel' },
            { name: 'email', label: 'Email', placeholder: 'example@gmail.com', type: 'email' },
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
                    isEmpty
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-white/20 focus:border-[#D97757]'
                  }`}
                />
                {isEmpty && (
                  <p className="text-red-400 text-xs mt-1">Заполните это поле</p>
                )}
              </div>
            )
          })}

          <button
            type="submit"
            className={`w-full font-semibold py-4 rounded-xl text-base transition-colors ${
              !canRegister
                ? 'bg-white/20 hover:bg-white/30 text-white/70 border border-white/20'
                : formValid
                  ? 'bg-[#D97757] hover:bg-[#c4674a] text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white/70 border border-white/20'
            }`}
          >
            {!canRegister
              ? '⚠️ Выполните все шаги выше'
              : formValid
                ? 'Оставить заявку и оплатить →'
                : '📝 Заполните все поля'}
          </button>
        </form>
      </div>
    </section>
  )
}
