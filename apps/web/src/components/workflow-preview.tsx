import { useState } from 'react'
import {
  ArrowRightIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  EnvelopeIcon,
  SparklesIcon,
} from '@heroicons/react/16/solid'

const steps = [
  {
    title: 'Give every hello a home.',
    description:
      'Embed a form or chat box, or connect your support email. Questions, bugs, and business inquiries all have a way in.',
    label: 'A customer reaches out',
    shortTitle: 'Get a request',
  },
  {
    title: 'Pick up the conversation.',
    description:
      'Email, forms, and chat arrive in one inbox. Assign a teammate, leave a private note, and see what needs an answer.',
    label: 'One inbox, three ways in',
    shortTitle: 'One inbox',
  },
  {
    title: 'See the person behind it.',
    description:
      'Connect your product to bring in account details, purchases, or access. The useful context sits beside the conversation.',
    label: 'Your product fills in the details',
    shortTitle: 'See context',
  },
  {
    title: 'Answer. Get back to building.',
    description:
      'Write a reply, or ask your AI client for a draft. Review and send it in chat, or continue by email when the customer leaves.',
    label: 'A thoughtful reply, approved by you',
    shortTitle: 'Review a reply',
  },
]

export function WorkflowPreview() {
  const [step, setStep] = useState(0)
  const [animate, setAnimate] = useState(false)

  function select(next: number, pointerInitiated: boolean) {
    setAnimate(pointerInitiated)
    setStep(next)
  }

  return (
    <section className="workflow-section" id="how-it-works">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">From “hey” to “all sorted.”</p>
            <h2>One conversation. The whole picture.</h2>
          </div>
          <p>
            Here's how we're designing it to work.
            <br />
            Walk through a little day at Karnstack.
          </p>
        </div>
        <div className="workflow-layout">
          <ol className="workflow-steps" aria-label="Conversation walkthrough">
            {steps.map((item, index) => (
              <li key={item.title}>
                <button
                  type="button"
                  id={`workflow-step-${index}`}
                  aria-pressed={step === index}
                  aria-controls="workflow-scene"
                  onClick={(event) => select(index, event.detail > 0)}
                >
                  <span className="workflow-number" aria-hidden="true">
                    {index < step ? (
                      <CheckIcon className="size-4" />
                    ) : (
                      `0${index + 1}`
                    )}
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <strong className="workflow-short-title">
                      {item.shortTitle}
                    </strong>
                    <span className="workflow-step-description">
                      {item.description}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="workflow-mobile-description">
            {steps[step].description}
          </p>
          <div className="workflow-preview">
            <div className="workflow-chrome">
              <span className="workflow-wordmark">
                karnstack / customer inbox
              </span>
              <span className="workflow-count">0{step + 1} / 04</span>
            </div>
            <div
              className={`workflow-scene${animate ? ' workflow-scene-enter' : ''}`}
              id="workflow-scene"
              role="region"
              aria-labelledby={`workflow-step-${step}`}
              key={step}
            >
              <WorkflowScene step={step} />
            </div>
            <div className="workflow-controls">
              <p role="status">{steps[step].label}</p>
              <button
                type="button"
                className="workflow-next"
                onClick={(event) =>
                  select((step + 1) % steps.length, event.detail > 0)
                }
              >
                {step === 3 ? 'Start again' : 'Next step'}
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <p className="workflow-disclaimer">
          Product walkthrough · Illustrative data and planned features. Nothing
          is sent.
        </p>
      </div>
    </section>
  )
}

function WorkflowScene({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="workflow-arrival">
        <div className="workflow-message">
          <div className="workflow-card-label">
            <ClipboardDocumentIcon className="size-4" aria-hidden="true" />
            Your website / support form
          </div>
          <h3>How can we help?</h3>
          <div className="workflow-field">
            <span>Email</span>
            <p>alex@example.com</p>
          </div>
          <div className="workflow-field">
            <span>Your question</span>
            <p>I bought the Go course, but I can't find it in my account.</p>
          </div>
          <div className="workflow-form-footer">
            <span>Ready to send</span>
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </div>
        </div>
        <div className="workflow-email-note">
          <EnvelopeIcon className="size-4" aria-hidden="true" />
          Or simply email help@yourcompany.com
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="workflow-inbox">
        <div className="workflow-inbox-title">
          <h3>Needs a reply</h3>
          <span>3 conversations</span>
        </div>
        <div className="workflow-inbox-row workflow-inbox-row-active">
          <span className="workflow-avatar">AM</span>
          <div>
            <strong>Alex Morgan</strong>
            <p>I can't find my course</p>
          </div>
          <span className="workflow-source">Form</span>
        </div>
        <div className="workflow-inbox-row">
          <span className="workflow-avatar">JL</span>
          <div>
            <strong>Jamie Lee</strong>
            <p>A workshop for our engineering team?</p>
          </div>
          <span className="workflow-source">Email</span>
        </div>
        <div className="workflow-inbox-row">
          <span className="workflow-avatar">RP</span>
          <div>
            <strong>Riya Patel</strong>
            <p>Something looks off on mobile</p>
          </div>
          <span className="workflow-source">Chat</span>
        </div>
        <div className="workflow-private-note">
          <span>Private note · Karn</span>
          <p>I'll check Alex's access. Jamie's workshop inquiry is yours.</p>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="workflow-context">
        <div className="workflow-card-label">
          <span className="workflow-avatar">AM</span>
          <div>
            <h3>Alex Morgan</h3>
            <p>alex@example.com</p>
          </div>
        </div>
        <p className="workflow-context-question">“I can't find my course.”</p>
        <div className="workflow-account">
          <div className="workflow-card-label">
            <CheckIcon className="size-4" aria-hidden="true" />
            Connected account / Karnstack
          </div>
          <dl>
            <div>
              <dt>Course</dt>
              <dd>Go foundations</dd>
            </div>
            <div>
              <dt>Access</dt>
              <dd>Active</dd>
            </div>
            <div>
              <dt>Purchased</dt>
              <dd>Yesterday</dd>
            </div>
            <div>
              <dt>Account email</dt>
              <dd>alex@example.com</dd>
            </div>
          </dl>
        </div>
        <p className="workflow-context-hint">
          Less “let me look that up.” More “I can help.”
        </p>
      </div>
    )
  }

  return (
    <div className="workflow-reply">
      <div className="workflow-card-label">
        <EnvelopeIcon className="size-4" aria-hidden="true" />
        Reply to Alex Morgan
      </div>
      <h3>A good answer starts here.</h3>
      <blockquote>
        Hi Alex! Your Go foundations access is active. Could you check that
        you're signed in with alex@example.com? If it still doesn't show up,
        reply here and I'll take a closer look.
      </blockquote>
      <div className="workflow-draft-label">
        <SparklesIcon className="size-4" aria-hidden="true" />
        Optional AI draft · Yours to edit
      </div>
      <div className="workflow-review-label">
        <CheckIcon className="size-4" aria-hidden="true" />
        Ready for your review
      </div>
      <p className="workflow-reply-note">
        Only you decide when to send. Replies stay in this conversation.
      </p>
    </div>
  )
}
