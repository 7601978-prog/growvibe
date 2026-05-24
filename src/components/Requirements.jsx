const mac = [
  'macOS 12 или выше',
  'Apple Silicon M1/M2/M3 или Intel',
  'От 8 ГБ оперативной памяти',
  'От 10 ГБ свободного места',
  'Google Chrome',
  'Стабильный интернет',
  'Доступ к Terminal',
]

const win = [
  'Windows 10 или Windows 11',
  'От 8 ГБ оперативной памяти',
  'От 10 ГБ свободного места',
  'Google Chrome',
  'Стабильный интернет',
  'Права администратора',
]

export default function Requirements({ laptopChecked, setLaptopChecked, flash }) {
  return (
    <section className={`py-20 bg-gray-50 transition-all ${flash ? 'animate-shake animate-glow outline outline-2 outline-[#D97757] rounded-2xl' : ''}`}>
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-[#D97757] font-semibold text-sm uppercase tracking-widest mb-3">Требования</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Проверьте, подходит ли ваш ноутбук</h2>
        <p className="text-gray-500 text-lg mb-10">
          Обучение практическое — участвовать только с телефона невозможно. Нужен личный ноутбук.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍎</span>
              <h3 className="font-semibold text-gray-900">MacBook</h3>
            </div>
            {mac.map(r => (
              <div key={r} className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <span className="text-[#D97757]">✓</span> {r}
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🪟</span>
              <h3 className="font-semibold text-gray-900">Windows</h3>
            </div>
            {win.map(r => (
              <div key={r} className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <span className="text-[#D97757]">✓</span> {r}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
          ⚠️ Если у вас корпоративный ноутбук — проверьте заранее, что можно установить Git, Claude и другие программы.
        </div>

        <label className={`flex items-start gap-3 cursor-pointer bg-white border rounded-xl p-4 hover:border-[#D97757] transition-colors ${flash ? 'border-[#D97757] shadow-[0_0_0_3px_rgba(217,119,87,0.2)]' : 'border-gray-200'}`}>
          <input
            type="checkbox"
            checked={laptopChecked}
            onChange={e => setLaptopChecked(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded accent-[#D97757]"
          />
          <span className="text-gray-700 font-medium">
            Я проверил/проверила, что мой ноутбук подходит для участия
          </span>
        </label>
      </div>
    </section>
  )
}
