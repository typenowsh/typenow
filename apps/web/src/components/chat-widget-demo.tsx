import { useEffect, useRef, useState } from 'react'
import { ChatTopicSelect } from './chat-topic-select'
import {
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  HomeIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from '@heroicons/react/16/solid'

type Message = {
  id: number
  from: 'customer' | 'team'
  text: string
  preview?: boolean
}
const initialMessages: Message[] = [
  {
    id: 1,
    from: 'customer',
    text: "Hey! I bought the Go course, but I can't find it in my account.",
  },
  {
    id: 2,
    from: 'team',
    text: "Hi Alex! I can help with that. I'll take a look at your course access.",
  },
]
const prompts = [
  { text: "I can't find my course", topic: 'Course access' },
  { text: 'A question about billing', topic: 'Billing' },
  { text: 'Something looks broken', topic: 'Technical issue' },
]

export function ChatWidgetDemo({
  open,
  animate,
  onClose,
}: {
  open: boolean
  animate: boolean
  onClose: () => void
}) {
  const [view, setView] = useState<'home' | 'messages'>('home')
  const [messages, setMessages] = useState(initialMessages)
  const [message, setMessage] = useState('')
  const [topic, setTopic] = useState('Course access')
  const composer = useRef<HTMLTextAreaElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const log = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open)
      (view === 'messages' ? composer.current : closeButton.current)?.focus()
  }, [open, view])

  useEffect(() => {
    if (open && view === 'messages' && log.current)
      log.current.scrollTop = log.current.scrollHeight
  }, [open, view, messages])

  function append(text: string, from: Message['from']) {
    setMessages((previous) => [
      ...previous,
      { id: (previous.at(-1)?.id ?? 0) + 1, from, text, preview: true },
    ])
  }

  function startQuestion(text = '', nextTopic = 'Course access') {
    setMessages([])
    setMessage(text)
    setTopic(nextTopic)
    setView('messages')
  }

  return (
    <div
      className="sdk-chat-panel"
      id="sdk-chat-panel"
      hidden={!open}
      data-motion={animate}
      role="region"
      aria-label="Example support chat"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !event.defaultPrevented) {
          event.stopPropagation()
          onClose()
        }
      }}
    >
      <header className="chat-header">
        <div className="chat-brand">
          <span className="chat-brand-mark" aria-hidden="true">
            k
          </span>
          <div>
            <strong>Karnstack</strong>
            <span>Support, a little closer.</span>
          </div>
        </div>
        <button
          ref={closeButton}
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="Close example chat"
        >
          <XMarkIcon className="size-4" aria-hidden="true" />
        </button>
      </header>

      {view === 'home' ? (
        <div className="chat-home">
          <div className="chat-welcome">
            <div className="chat-team" aria-hidden="true">
              <span>K</span>
              <span>A</span>
              <span>S</span>
            </div>
            <p className="chat-example-label">Example customer / Alex Morgan</p>
            <h4>
              Hey Alex.
              <br />A little help?
            </h4>
            <p>A question or a snag? We're all ears.</p>
          </div>
          <button
            className="chat-start"
            type="button"
            onClick={() => startQuestion()}
          >
            <span>
              <strong>Ask a new question</strong>
              <span>Right here, without leaving your app.</span>
            </span>
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </button>
          {messages.length > 0 && (
            <button
              className="chat-resume"
              type="button"
              onClick={() => setView('messages')}
            >
              <span className="chat-person-avatar" aria-hidden="true">
                K
              </span>
              <span>
                <strong>{topic}</strong>
                <span>{messages.at(-1)?.text}</span>
              </span>
              <ChevronLeftIcon
                className="size-4 chat-resume-arrow"
                aria-hidden="true"
              />
            </button>
          )}
          <div className="chat-suggestions">
            <p>A good place to start</p>
            {prompts.map((prompt) => (
              <button
                key={prompt.text}
                type="button"
                onClick={() => startQuestion(prompt.text, prompt.topic)}
              >
                {prompt.text}
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-conversation">
          <div className="chat-conversation-top">
            <button
              type="button"
              className="icon-button"
              aria-label="Back to chat home"
              onClick={() => setView('home')}
            >
              <ChevronLeftIcon className="size-4" aria-hidden="true" />
            </button>
            <div>
              <strong>Your conversation</strong>
              <span>Example thread · Replies in one place</span>
            </div>
          </div>
          <div className="chat-customer-context">
            <CheckIcon className="size-4" aria-hidden="true" />
            <span>Go foundations</span>
            <strong>Access active</strong>
          </div>
          <div
            ref={log}
            className="chat-message-log"
            role="log"
            aria-label="Example conversation messages"
            aria-live="polite"
          >
            <p className="chat-thread-date">
              Illustrative conversation · Today
            </p>
            {messages.length === 0 && (
              <div className="chat-empty">
                <ChatBubbleLeftRightIcon
                  className="size-4"
                  aria-hidden="true"
                />
                <p>Start with what's on your mind.</p>
                <span>Your message would arrive in the Typenow inbox.</span>
              </div>
            )}
            {messages.map((item) => (
              <div
                key={item.id}
                className={`chat-message chat-message-${item.from}`}
              >
                <span className="chat-message-author">
                  {item.from === 'team' ? 'Karn / support' : 'You'}
                </span>
                <p>{item.text}</p>
                <span className="chat-message-meta">
                  {item.preview
                    ? 'Local preview · Not sent'
                    : 'Example message'}
                </span>
              </div>
            ))}
            {messages.at(-1)?.from === 'customer' && (
              <button
                type="button"
                className="chat-preview-reply"
                onClick={() =>
                  append(
                    "Your course access is active. Try signing in with the email you used at checkout, and let me know if it still doesn't appear.",
                    'team',
                  )
                }
              >
                Preview an example team reply{' '}
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <form
            className="chat-composer"
            onSubmit={(event) => {
              event.preventDefault()
              if (!message.trim()) return
              append(message.trim(), 'customer')
              setMessage('')
              composer.current?.focus()
            }}
          >
            <ChatTopicSelect value={topic} onValueChange={setTopic} />
            <label className="sr-only" htmlFor="sdk-message">
              Your message
            </label>
            <textarea
              ref={composer}
              id="sdk-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              maxLength={1000}
              rows={2}
              placeholder="Write your message…"
              onKeyDown={(event) => {
                if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
            />
            <div className="chat-composer-actions">
              <span>Local demo. Nothing is sent.</span>
              <button
                type="submit"
                disabled={!message.trim()}
                aria-label="Add message to demo"
              >
                <PaperAirplaneIcon className="size-4" aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>
      )}
      <nav className="chat-navigation" aria-label="Chat demo navigation">
        <button
          type="button"
          aria-current={view === 'home' ? 'page' : undefined}
          onClick={() => setView('home')}
        >
          <HomeIcon className="size-4" aria-hidden="true" />
          Home
        </button>
        <button
          type="button"
          aria-current={view === 'messages' ? 'page' : undefined}
          onClick={() => setView('messages')}
        >
          <ChatBubbleLeftRightIcon className="size-4" aria-hidden="true" />
          Messages
        </button>
      </nav>
      <div className="chat-powered">
        <span>Made for a more human hello.</span>
        <strong>typenow</strong>
      </div>
    </div>
  )
}
