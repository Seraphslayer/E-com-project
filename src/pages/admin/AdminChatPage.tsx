import { useState } from 'react'
import { Send, Circle, Search } from 'lucide-react'
import { chatMessages, ChatMessage } from '../../data/mockData'

const conversations = [
  { id: 'c1', customer: 'Omar Khalid', preview: 'I actually wanted the Portable Speaker...', time: '10:06 AM', unread: 1, status: 'open' },
  { id: 'c2', customer: 'Elena Vasquez', preview: 'Thank you! The order arrived in perfect...', time: '9:42 AM', unread: 0, status: 'resolved' },
  { id: 'c3', customer: 'Priya Sharma', preview: 'When will the Merino sweater restock in...', time: 'Yesterday', unread: 2, status: 'open' },
  { id: 'c4', customer: 'James Thornton', preview: 'The RGB software doesn\'t work on macOS', time: 'Yesterday', unread: 0, status: 'open' },
  { id: 'c5', customer: 'Marcus Webb', preview: 'Received the wrong item — shipped a...', time: 'Aug 7', unread: 0, status: 'resolved' },
]

export default function AdminChatPage() {
  const [activeConv, setActiveConv] = useState('c1')
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages)
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, {
      id: `cm${Date.now()}`,
      sender: 'support',
      name: 'Support Agent',
      message: input.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: true,
    }])
    setInput('')
  }

  return (
    <div className="h-[calc(100vh-56px)] flex">
      {/* Conversation list */}
      <div className="w-64 border-r border-[#E2E2E2] bg-white flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-[#E2E2E2]">
          <p className="font-mono text-[10px] text-[#6B6B6B] tracking-widest uppercase mb-2">Chat Plugin — Service 07</p>
          <div className="flex items-center gap-2 border border-[#E2E2E2] px-2 py-1.5">
            <Search size={12} className="text-[#6B6B6B]" />
            <input type="text" placeholder="Search..." className="flex-1 font-sans text-xs outline-none placeholder:text-[#D0D0D0]" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-[#E2E2E2]">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className={`w-full px-4 py-3 text-left hover:bg-[#F8F8F8] transition-colors ${activeConv === conv.id ? 'bg-[#EEF2FF]' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Circle
                    size={6}
                    className={conv.status === 'open' ? 'text-[#00875A] fill-[#00875A]' : 'text-[#D0D0D0] fill-[#D0D0D0]'}
                  />
                  <span className="font-sans text-sm font-semibold text-[#0D0D0D]">{conv.customer}</span>
                </div>
                <span className="font-mono text-[10px] text-[#6B6B6B]">{conv.time}</span>
              </div>
              <p className="font-sans text-xs text-[#6B6B6B] truncate pl-4">{conv.preview}</p>
              {conv.unread > 0 && (
                <div className="mt-1 pl-4">
                  <span className="bg-[#0047FF] text-white font-mono text-[9px] px-1.5 py-0.5">{conv.unread} new</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-white border-b border-[#E2E2E2] px-6 py-3 flex items-center justify-between">
          <div>
            <p className="font-sans font-semibold text-[#0D0D0D] text-sm">Omar Khalid</p>
            <p className="font-mono text-[10px] text-[#6B6B6B]">o.khalid@email.com · Order ORD-20089</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-mono text-[10px] px-2 py-1 bg-[#FFF3E0] text-[#FF8C00]">
              <Circle size={5} className="fill-[#FF8C00]" /> Open
            </span>
            <button className="border border-[#E2E2E2] px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase hover:border-[#0D0D0D] transition-colors">
              Resolve
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8F8F8]">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'support' ? 'flex-row-reverse' : ''}`}>
              <div className="w-7 h-7 bg-[#F0F0F0] flex items-center justify-center font-mono text-[10px] font-semibold text-[#0D0D0D] flex-shrink-0">
                {msg.sender === 'customer' ? 'OK' : 'SA'}
              </div>
              <div className="max-w-md">
                <div className={`px-4 py-3 ${msg.sender === 'support' ? 'bg-[#0047FF] text-white' : 'bg-white border border-[#E2E2E2] text-[#0D0D0D]'}`}>
                  <p className="font-sans text-sm leading-relaxed">{msg.message}</p>
                </div>
                <p className={`font-mono text-[10px] text-[#6B6B6B] mt-1 ${msg.sender === 'support' ? 'text-right' : ''}`}>
                  {msg.name} · {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Canned responses */}
        <div className="bg-white border-t border-[#E2E2E2] px-4 py-2 flex gap-2 overflow-x-auto">
          {['Issue refund', 'Update order status', 'Check tracking', 'Escalate to manager'].map(r => (
            <button
              key={r}
              onClick={() => setInput(r)}
              className="flex-shrink-0 border border-[#E2E2E2] px-3 py-1 font-mono text-[10px] text-[#6B6B6B] hover:border-[#0047FF] hover:text-[#0047FF] transition-colors whitespace-nowrap"
            >
              {r}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-[#E2E2E2] flex">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Type a reply..."
            rows={2}
            className="flex-1 px-5 py-3 font-sans text-sm outline-none resize-none placeholder:text-[#D0D0D0]"
          />
          <button
            onClick={send}
            className="px-6 bg-[#0047FF] text-white hover:bg-[#0035CC] transition-colors flex items-center"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
