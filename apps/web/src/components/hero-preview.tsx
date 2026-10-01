import {
  ArrowUpRightIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  EnvelopeIcon,
} from '@heroicons/react/16/solid'

export function HeroPreview() {
  return (
    <aside className="hero-preview" aria-label="Example customer conversation">
      <div className="hero-preview-label">
        <span className="status-dot" /> A little context goes a long way.
      </div>
      <div className="hero-conversation">
        <div className="hero-conversation-heading">
          <span className="hero-customer-avatar">AM</span>
          <div>
            <strong>Alex Morgan</strong>
            <span>A question about course access</span>
          </div>
          <ChatBubbleLeftRightIcon className="size-4" aria-hidden="true" />
        </div>
        <div className="hero-customer-message">
          <span>Alex / web chat</span>
          <p>Hey! I bought the Go course, but I can't find it in my account.</p>
        </div>
        <div className="hero-account-context">
          <div>
            <CheckIcon className="size-4" aria-hidden="true" />
            <strong>Go foundations</strong>
          </div>
          <span>Access active · Purchased yesterday</span>
        </div>
        <div className="hero-reply-preview">
          <span>Karn / reply draft</span>
          <p>
            Hi Alex! Your access is active. Let's check the email you're signed
            in with.
          </p>
        </div>
        <div className="hero-conversation-footer">
          <span>Context found. Answer ready.</span>
          <CheckIcon className="size-4" aria-hidden="true" />
        </div>
      </div>
      <div
        className="hero-channel-strip"
        aria-label="Three ways into the same inbox"
      >
        <span>
          <EnvelopeIcon className="size-4" aria-hidden="true" /> Email
        </span>
        <span>
          <ClipboardDocumentIcon className="size-4" aria-hidden="true" /> Forms
        </span>
        <span>
          <ChatBubbleLeftRightIcon className="size-4" aria-hidden="true" /> Chat
        </span>
      </div>
      <a href="#how-it-works" className="hero-preview-link">
        One inbox. The whole story.{' '}
        <ArrowUpRightIcon className="size-4" aria-hidden="true" />
      </a>
      <p className="hero-preview-caption">Illustrative product preview</p>
    </aside>
  )
}
