import { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'

// ========================================
// TYPES
// ========================================

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  timestamp: Date
}

// ========================================
// SUGGESTED QUESTIONS (from Knowledge Base)
// ========================================

const SUGGESTED_QUESTIONS = [
  'How do I set up the tracking pixel?',
  'What\'s included in white-label?',
  'How does data enrichment work?',
  'What are the API rate limits?',
]

// ========================================
// MAIN COMPONENT
// ========================================

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle sending a message
  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // TODO: Replace with actual API call to Claude backend
    // Simulated response for design preview
    setTimeout(() => {
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: getPlaceholderResponse(text),
        sources: ['Product Capabilities', 'API & Technical'],
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-container flex flex-col h-full bg-white">
      {/* Header */}
      <Header />

      {/* Messages */}
      <div className="message-list flex-1 overflow-y-auto p-4 space-y-3 bg-brand-bg-secondary">
        {messages.length === 0 ? (
          <WelcomeMessage onSelectQuestion={handleSend} />
        ) : (
          <>
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input flex items-center gap-3 p-4 border-t border-chat-border bg-white">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          disabled={isLoading}
          className="chat-input__field flex-1 px-4 py-2.5 bg-chat-input-bg border border-chat-border rounded-full text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-shadow"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="chat-input__send w-10 h-10 rounded-full bg-brand-primary text-white hover:bg-brand-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  )
}

// ========================================
// SUB-COMPONENTS
// ========================================

function Header() {
  return (
    <header className="flex items-center gap-3 px-4 py-3 bg-brand-text-dark text-white">
      {/* TODO: Replace with RetargetIQ logo */}
      <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
        <span className="text-sm font-bold text-white">R</span>
      </div>
      <div>
        <h1 className="text-base font-semibold font-sans">AI Support Assistant</h1>
        <p className="text-xs opacity-80">Powered by RetargetIQ</p>
      </div>
    </header>
  )
}

function WelcomeMessage({ onSelectQuestion }: { onSelectQuestion: (q: string) => void }) {
  return (
    <div className="welcome-message text-center py-8 px-4">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-primary/20 flex items-center justify-center">
        <span className="text-2xl">💬</span>
      </div>
      <h2 className="text-lg font-semibold text-brand-text-dark mb-2 font-sans">
        Hi! I'm your AI support assistant.
      </h2>
      <p className="text-sm text-brand-text-body mb-6">
        How can I help you today?
      </p>
      <div className="space-y-2">
        {SUGGESTED_QUESTIONS.map((question, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(question)}
            className="suggested-question w-full px-4 py-2.5 text-sm text-left text-brand-text-dark bg-white border border-chat-border rounded-lg hover:border-brand-primary hover:bg-brand-bg-secondary transition-colors"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={clsx('message flex animate-fade-in', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-brand-primary text-white rounded-br-sm'
            : 'bg-white text-chat-ai-text border border-chat-border rounded-bl-sm shadow-sm'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {/* Sources (AI messages only) */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-chat-border">
            <span className="text-xs text-brand-text-body">
              📚 Sources: {message.sources.join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="message flex justify-start">
      <div className="bg-white border border-chat-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="typing-indicator flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

// ========================================
// PLACEHOLDER RESPONSES (remove in production)
// ========================================

function getPlaceholderResponse(question: string): string {
  const q = question.toLowerCase()

  if (q.includes('pixel') || q.includes('tracking')) {
    return "To set up the RetargetIQ tracking pixel:\n\n1. Go to Settings > Pixel Installation\n2. Copy your unique pixel code\n3. Paste it in your website's <head> section\n4. Verify installation using our pixel debugger\n\nThe pixel is lightweight and won't impact page load speed. Need help with a specific platform like Shopify or WordPress?"
  }

  if (q.includes('white') || q.includes('label')) {
    return "White-label includes:\n\n• Full platform branding (your logo, colors, domain)\n• Up to 10 seats included\n• API access for all accounts\n• Custom subdomain setup\n• Priority support\n\nPricing: $2,999.99/month\nAdditional seats: $100/month each\n\nWould you like me to send over the white-label pricing details?"
  }

  if (q.includes('enrichment') || q.includes('data')) {
    return "Data enrichment works by:\n\n1. Capturing anonymous visitor data via your pixel\n2. Matching visitors against our 250M+ consumer database\n3. Appending demographics, interests, and contact info\n4. Delivering enriched profiles to your CRM in real-time\n\nWe can identify up to 70% of your anonymous traffic!"
  }

  if (q.includes('api') || q.includes('rate') || q.includes('limit')) {
    return "API rate limits:\n\n• Standard: 100 requests/minute\n• With VIP Support ($297/mo): 500 requests/minute\n• Enterprise/White-label: Custom limits available\n\nAll API access requires the API add-on ($297/month) unless you're on the white-label plan where it's included."
  }

  return "I'd be happy to help with that! Let me look into our knowledge base for the most accurate answer.\n\nIn the meantime, you can also check our training videos or reach out to support@retargetiq.com for urgent matters."
}
