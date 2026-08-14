import { useState } from 'react'
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react'
import { chatMessages, ChatMessage } from '../data/mockData'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages)
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    const newMsg: ChatMessage = {
      id: `cm${Date.now()}`,
      sender: 'customer',
      name: 'Elena Vasquez',
      message: input.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    }
    setMessages(prev => [...prev, newMsg])
    setInput('')

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `cm${Date.now()}`,
        sender: 'support',
        name: 'Support Agent',
        message: "Thank you for reaching out! Let me look into that for you right away.",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        read: false,
      }])
    }, 1200)
  }

  const unread = messages.filter(m => !m.read && m.sender === 'support').length

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#0047FF] text-white shadow-lg hover:bg-[#0035CC] transition-colors flex items-center justify-center"
        >
          <MessageCircle size={20} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF3B00] text-white font-mono text-[10px] flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 shadow-2xl border border-[#E2E2E2] bg-white flex flex-col" style={{ height: 420 }}>
          {/* Header */}
          <div className="bg-[#0047FF] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00FF88] rounded-full" />
              <div>
                <p className="font-display font-semibold text-white text-sm">Merx Support</p>
                <p className="font-mono text-[10px] text-white/60">Chat Plugin — Service 07</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setOpen(false)} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                <Minimize2 size={14} />
              </button>
              <button onClick={() => setOpen(false)} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#F8F8F8]">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.sender === 'customer' ? 'bg-[#0047FF] text-white' : 'bg-white border border-[#E2E2E2] text-[#0D0D0D]'} px-3 py-2`}>
                  <p className="font-sans text-xs leading-relaxed">{msg.message}</p>
                  <p className={`font-mono text-[9px] mt-1 ${msg.sender === 'customer' ? 'text-white/50' : 'text-[#6B6B6B]'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex border-t border-[#E2E2E2] flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-3 font-sans text-sm outline-none placeholder:text-[#D0D0D0]"
            />
            <button
              onClick={send}
              className="px-4 bg-[#0047FF] text-white hover:bg-[#0035CC] transition-colors flex items-center"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
