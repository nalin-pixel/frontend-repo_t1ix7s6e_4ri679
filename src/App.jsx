import { useEffect, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { Loader2, Send, Moon, Sun, Bot, Image as ImageIcon, FileText, Upload, Settings } from 'lucide-react'

function App() {
  const [dark, setDark] = useState(true)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome! I am your responsible AI assistant. Ask me anything.' }
  ])
  const endRef = useRef(null)

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: `Error: ${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${dark ? 'dark bg-neutral-950 text-white' : 'bg-white text-neutral-900'} relative overflow-hidden`}> 
      {/* Hero with Spline */}
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 via-blue-500 to-orange-400" />
          <span className="font-semibold">Higher-Responsible AI</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDark((d) => !d)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 backdrop-blur hover:bg-white/10">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            <span className="text-sm">{dark ? 'Light' : 'Dark'} mode</span>
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 backdrop-blur hover:bg-white/10">
            <Settings size={16} />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 pb-32 pt-24 md:grid-cols-3">
        {/* Left: Features */}
        <section className="col-span-1 space-y-3 md:space-y-4">
          <h1 className="text-3xl font-bold md:text-4xl">Your Responsible AI Copilot</h1>
          <p className="text-white/80">
            Chat smartly, process documents, generate content, and keep everything safe and private.
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { icon: <Bot size={16} />, label: 'Advanced Chat' },
              { icon: <FileText size={16} />, label: 'Docs & Summaries' },
              { icon: <ImageIcon size={16} />, label: 'Vision Ready' },
              { icon: '🛡️', label: 'Safety First' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span>{typeof f.icon === 'string' ? f.icon : f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Chat */}
        <section className="col-span-2">
          <div className="rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur">
            <div className="h-[50vh] overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`mb-3 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${m.role === 'user' ? 'bg-blue-600/80' : 'bg-white/10'} max-w-[80%] rounded-2xl px-4 py-2 text-sm`}>{m.content}</div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-white/80"><Loader2 className="animate-spin" size={16} /> Thinking...</div>
              )}
              <div ref={endRef} />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 inline-flex items-center gap-2">
                <Upload size={16} /> Upload
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask anything responsibly..."
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none placeholder:text-white/50"
              />
              <button onClick={sendMessage} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500">
                <Send size={16} /> Send
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-10 text-xs text-white/60">
        Built for learning, research, productivity and more. Stay safe and responsible.
      </footer>
    </div>
  )
}

export default App
