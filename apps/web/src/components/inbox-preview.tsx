import { useState } from 'react'
import {
  ChatBubbleLeftRightIcon,
  CheckIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from '@heroicons/react/16/solid'

const conversations = [
  {
    name: 'Alex Morgan',
    initials: 'AM',
    company: 'Acme Studio',
    channel: 'Chat',
    icon: ChatBubbleLeftRightIcon,
    subject: 'A little help with course access',
    preview: 'I bought the course, but can’t find it in my account.',
    time: '2m',
    message:
      'Hey! I bought the Cloudflare course yesterday, but it isn’t showing up in my account. Could you take a look?',
    context: 'Cloudflare course',
    detail: 'Payment received · $49',
    reply:
      'Hey Alex! I found your purchase under your other email address. I’ve moved access to this account, so you should be all set. Let me know how you get on!',
  },
  {
    name: 'Rina Patel',
    initials: 'RP',
    company: 'Northstar',
    channel: 'Form',
    icon: DocumentTextIcon,
    subject: 'A question about team access',
    preview: 'Can I invite the rest of our engineering team?',
    time: '12m',
    message:
      'Hi Karnstack! We’re interested in the course for our engineering team. Do you offer team access for five people?',
    context: 'Team inquiry',
    detail: '5 engineers · New customer',
    reply:
      'Hey Rina! Thanks for reaching out. We can set up access for your whole team. I’ll send over the details and help you get everyone started.',
  },
  {
    name: 'Sam Wilson',
    initials: 'SW',
    company: 'Linear Labs',
    channel: 'Email',
    icon: EnvelopeIcon,
    subject: 'Thanks for the quick reply',
    preview: 'That did the trick. Everything is working now.',
    time: '35m',
    message:
      'That did the trick — everything is working now. Thanks for the quick reply, and for making the course so easy to follow!',
    context: 'Course member',
    detail: 'Active access · Since September',
    reply:
      'Really glad to hear that, Sam. Thanks for letting me know. Enjoy the course, and drop us a message whenever you need a hand.',
  },
]

export function InboxPreview() {
  const [selected, setSelected] = useState(0)
  const conversation = conversations[selected]
  const ChannelIcon = conversation.icon

  return (
    <div className="inbox-concept">
      <div className="inbox-concept-list">
        <header className="inbox-concept-list-header">
          <span className="inbox-workspace">
            <span className="inbox-workspace-mark">k</span> Karnstack
          </span>
          <h3>
            All conversations <span>3</span>
          </h3>
          <p>Every hello, in one place.</p>
        </header>
        <div
          className="inbox-concept-threads"
          aria-label="Example conversations"
        >
          {conversations.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.name}
                type="button"
                className="inbox-concept-thread"
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
              >
                <span className="inbox-thread-top">
                  <strong>{item.name}</strong>
                  <span>{item.time}</span>
                </span>
                <span className="inbox-thread-subject">{item.subject}</span>
                <span className="inbox-thread-preview">{item.preview}</span>
                <span className="inbox-thread-channel">
                  <Icon aria-hidden="true" />
                  {item.channel}
                </span>
              </button>
            )
          })}
        </div>
        <p className="inbox-list-footer">
          <span className="status-dot" /> A quieter kind of support.
        </p>
      </div>
      <div className="inbox-concept-conversation">
        <header className="inbox-concept-conversation-header">
          <span>
            <ChannelIcon aria-hidden="true" />
            {conversation.channel} conversation
          </span>
          <span className="inbox-open-status">Open</span>
        </header>
        <div className="inbox-concept-body" aria-live="polite">
          <p className="inbox-date">Today, 10:42 AM</p>
          <div className="inbox-customer-heading">
            <span className="inbox-avatar">{conversation.initials}</span>
            <div>
              <strong>{conversation.name}</strong>
              <span>{conversation.company}</span>
            </div>
          </div>
          <h3>{conversation.subject}</h3>
          <p className="inbox-customer-message">{conversation.message}</p>
          <div className="inbox-context-event">
            <CheckIcon aria-hidden="true" />
            <span>Customer context connected</span>
            <span>Just now</span>
          </div>
          <div className="inbox-draft">
            <div className="inbox-draft-heading">
              <span>
                <SparklesIcon aria-hidden="true" /> A little help with the reply
              </span>
              <span>Example draft</span>
            </div>
            <p>{conversation.reply}</p>
            <div className="inbox-draft-footer">
              <span>You review every reply.</span>
              <PaperAirplaneIcon aria-hidden="true" />
            </div>
          </div>
        </div>
        <footer className="inbox-conversation-footer">
          <span className="inbox-avatar inbox-team-avatar">K</span>
          <span>Assigned to you</span>
          <span>Interactive concept · Nothing is sent</span>
        </footer>
      </div>
      <aside
        className="inbox-concept-context"
        aria-label="Example customer context"
      >
        <p className="inbox-context-label">THE PERSON BEHIND THE MESSAGE</p>
        <span className="inbox-avatar inbox-profile-avatar">
          {conversation.initials}
        </span>
        <h4>{conversation.name}</h4>
        <p>{conversation.company}</p>
        <div className="inbox-profile-fields">
          <div>
            <span>Customer since</span>
            <strong>September 2026</strong>
          </div>
          <div>
            <span>Conversations</span>
            <strong>{selected === 0 ? '2' : '1'}</strong>
          </div>
          <div>
            <span>Owner</span>
            <strong>Karn</strong>
          </div>
        </div>
        <div className="inbox-product-context">
          <span className="inbox-context-label">FROM YOUR PRODUCT</span>
          <strong>{conversation.context}</strong>
          <p>{conversation.detail}</p>
          <span className="inbox-connected">
            <span className="status-dot" /> Connected to Karnstack
          </span>
        </div>
        <p className="inbox-context-footnote">
          The useful details.
          <br />
          Right where you need them.
        </p>
      </aside>
    </div>
  )
}
