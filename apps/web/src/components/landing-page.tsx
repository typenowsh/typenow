import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { WorkflowPreview } from './workflow-preview'
import { WebSdkPreview } from './web-sdk-preview'
import { HeroPreview } from './hero-preview'
import { InboxPreview } from './inbox-preview'
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  Bars2Icon,
  CheckIcon,
  ClipboardDocumentIcon,
  CodeBracketIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  PlusIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/16/solid'

const github = 'https://github.com/typenowsh/typenow'
const inviteEmail = 'mail@karnstack.com'
const mcpExample =
  'Connect Typenow to your AI client.\n\nFind the course-access request from Alex.\nCheck their account context, then draft\na helpful reply for me to review.'

const plans = [
  {
    name: 'Self-hosted',
    price: 'Free',
    detail: 'Your Cloudflare. Your inbox.',
    features: [
      'The open source core',
      'Unlimited forms and submissions',
      'Your data, in your account',
      'Embeddable web chat',
      'API and MCP access',
      'Pay your own infrastructure',
    ],
    action: 'View on GitHub',
  },
  {
    name: 'Cloud Free',
    price: '$0',
    detail: 'A small inbox to get you started.',
    features: [
      '1 shared inbox · 2 teammates',
      'Email and unlimited forms',
      'Embeddable web chat',
      '1,000 form submissions / month',
      '100 outgoing messages / month',
      '500 MB of storage',
    ],
    action: 'Get early access',
  },
  {
    name: 'Cloud Starter',
    price: '$15',
    detail: 'A little room for your growing team.',
    features: [
      '5 teammates, one workspace',
      'Email and unlimited forms',
      'Embeddable web chat',
      '10,000 form submissions / month',
      '1,000 outgoing messages / month',
      '5 GB of storage',
    ],
    action: 'Get early access',
    note: 'Per workspace, not per seat',
  },
]

const faqs = [
  [
    'What is Typenow?',
    'Typenow is an open source customer inbox we are building for small software teams. Email, forms, and web chat will land in one place, with the product context you need to answer customers.',
  ],
  [
    'Can I use it yet?',
    'Not yet. We are building and testing Typenow privately with Karnstack first. Leave us an introduction if you would like to hear when it is ready. The previews illustrate the planned product; they are not a live support service.',
  ],
  [
    'Can I host it myself?',
    'That is the plan. The open source core will run in your own Cloudflare account, with a documented deployment and upgrade path. You will pay Cloudflare and any model provider directly.',
  ],
  [
    'Can I add chat to my own website?',
    'Yes, that is part of the plan. A JavaScript SDK and React wrapper will embed a small chat widget in your site or app, using Typenow Cloud or your own hosted instance. Messages will enter the same inbox as email and forms. When a visitor leaves, you can continue by email after collecting their address. The SDK example and widget here are local previews, not a published package.',
  ],
  [
    'Do I have to use AI?',
    'No. The inbox is being designed to work on its own. AI summaries and drafts will be optional. Your existing AI client can also access permissioned Typenow tools through MCP when that integration ships.',
  ],
  [
    'Does my Claude or Codex subscription cover the AI?',
    'Your AI client can use Typenow tools under its own supported billing arrangement. Background AI generated inside Typenow needs a separate model API key or hosted allowance. We will make that distinction clear.',
  ],
  [
    'How final is the pricing?',
    'These are proposed launch plans, with unlimited forms on every tier. Cloud plans have separate monthly submission, outgoing email, and storage allowances. We will confirm the limits before launch. Hosted AI will be separate or use your own API key.',
  ],
]

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  const Icon = diagonal ? ArrowUpRightIcon : ArrowRightIcon
  return <Icon aria-hidden="true" className="size-4 shrink-0" />
}

export function LandingPage() {
  const inviteDialog = useRef<HTMLDialogElement>(null)
  const [plan, setPlan] = useState('Early access')

  function requestInvite(nextPlan = 'Early access') {
    setPlan(nextPlan)
    inviteDialog.current?.showModal()
  }

  return (
    <div className="site isolate">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <a href="/" aria-label="Typenow homepage" className="brand">
            <img src="/brand.svg" alt="Typenow" width="151" height="32" />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#product">Product</a>
            <a href="#open-source">Open source</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <div className="header-actions">
            <a
              href={github}
              className="github-link"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <Arrow diagonal />
            </a>
            <button
              type="button"
              className="button button-secondary button-small"
              onClick={() => requestInvite()}
            >
              Get early access <Arrow />
            </button>
          </div>
          <details
            className="mobile-menu"
            onClick={(event) => {
              if (
                event.target instanceof Element &&
                event.target.closest('nav a, nav button')
              ) {
                event.currentTarget.open = false
              }
            }}
          >
            <summary aria-label="Open navigation">
              <Bars2Icon className="size-4" aria-hidden="true" />
            </summary>
            <nav aria-label="Mobile navigation">
              <a href="#product">Product</a>
              <a href="#open-source">Open source</a>
              <a href="#pricing">Pricing</a>
              <a href={github}>GitHub ↗</a>
              <button type="button" onClick={() => requestInvite()}>
                Get early access ↗
              </button>
            </nav>
          </details>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="container">
            <div className="hero-topline">
              <p className="eyebrow">
                <span className="status-dot" /> A quieter inbox is on its way.
              </p>
            </div>
            <div className="hero-layout">
              <div className="hero-main">
                <h1>
                  A little less inbox.
                  <br />A lot more{' '}
                  <span className="highlight-word">building.</span>
                </h1>
                <div className="hero-bottom">
                  <div className="hero-copy">
                    <p>
                      Email, forms, chat, and the context to answer.
                      <br className="desktop-break" /> One calm place to be
                      there for your customers.
                    </p>
                    <div className="hero-cta">
                      <button
                        className="button button-primary"
                        type="button"
                        onClick={() => requestInvite()}
                      >
                        Get early access <Arrow />
                      </button>
                      <a className="text-link" href="#how-it-works">
                        See how it works{' '}
                        <ArrowDownIcon aria-hidden="true" className="size-4" />
                      </a>
                    </div>
                    <p className="microcopy">
                      Open source. Self-hostable. Yours by design.
                    </p>
                  </div>
                </div>
              </div>
              <HeroPreview />
            </div>
          </div>
        </section>

        <section
          id="product"
          className="product-section"
          aria-label="Explore the product direction"
        >
          <div className="container">
            <ProductPreview />
            <div className="preview-caption">
              <p>Less tab-hopping. More helping.</p>
              <p>Interface exploration · Coming soon</p>
            </div>
          </div>
        </section>

        <section className="principles-section">
          <div className="container">
            <p className="eyebrow">Small team. Real customers.</p>
            <div className="section-heading">
              <h2>
                Stay close to your customers.
                <br />
                Keep your head in the build.
              </h2>
              <p>
                Support questions, bug reports, and “hey, can we work together?”
                deserve a home of their own.
              </p>
            </div>
            <dl className="principle-grid">
              <div>
                <dt>
                  <span className="feature-index">01</span>Every hello,
                  together.
                </dt>
                <dd>
                  A form on your site. A chat in your app. An email in your
                  inbox. The same conversation, with a clear next step.
                </dd>
              </div>
              <div>
                <dt>
                  <span className="feature-index">02</span>The useful details,
                  right there.
                </dt>
                <dd>
                  Bring in account and product context so you can spend less
                  time asking and more time answering.
                </dd>
              </div>
              <div>
                <dt>
                  <span className="feature-index">03</span>A little help. Your
                  call.
                </dt>
                <dd>
                  Draft with your own AI tools. Review before you send. Or keep
                  it entirely human.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <WorkflowPreview />

        <WebSdkPreview />

        <section className="ai-section" id="your-ai">
          <div className="container split-grid">
            <div className="section-copy">
              <p className="eyebrow">Your tools are invited.</p>
              <h2>
                Bring your AI.
                <br />
                Keep your judgment.
              </h2>
              <p>
                Your customers live in Typenow. Your AI can meet them there.
                We're building MCP access so you can investigate a request and
                draft a reply in the tools you already use.
              </p>
              <a href="#faq" className="text-link">
                How the AI part works <Arrow diagonal />
              </a>
              <div
                className="provider-list"
                aria-label="Planned AI client support"
              >
                <span>Claude</span>
                <span>Codex</span>
                <span>Your choice</span>
              </div>
            </div>
            <AgentPreview />
          </div>
        </section>

        <section id="open-source" className="ownership-section">
          <div className="container split-grid">
            <div
              className="ownership-art"
              role="img"
              aria-label="Your inbox and data stay within your own infrastructure"
            >
              <div className="ownership-grid" />
              <div className="own-stamp">
                <CodeBracketIcon className="size-4" aria-hidden="true" />
                <p>Yours to run</p>
                <span>typenow.sh</span>
              </div>
              <div className="ownership-note">
                <CheckIcon className="size-4" aria-hidden="true" />
                <p>Your account. Your data.</p>
              </div>
              <div className="ownership-edge">OWNERSHIP, INCLUDED.</div>
            </div>
            <div className="section-copy">
              <p className="eyebrow">A good home. No locked doors.</p>
              <h2>
                Your inbox.
                <br />
                Actually yours.
              </h2>
              <p>
                Use our cloud when you want it taken care of. Run it in your own
                Cloudflare account when you want the keys. We're building the
                same useful core for both.
              </p>
              <dl className="ownership-points">
                <div>
                  <dt>An open source core</dt>
                  <dd>Inspect the code. Host it on your terms.</dd>
                </div>
                <div>
                  <dt>A way in. And a way out.</dt>
                  <dd>Useful APIs and portable customer data.</dd>
                </div>
              </dl>
              <a
                className="text-link"
                href={github}
                target="_blank"
                rel="noreferrer"
              >
                Typenow on GitHub <Arrow diagonal />
              </a>
            </div>
          </div>
        </section>

        <section className="pricing-section" id="pricing">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Small price. Room to grow.</p>
                <h2>
                  A welcome mat
                  <br />
                  for every little team.
                </h2>
              </div>
              <p>
                Start small. Stay as long as you like.
                <br />
                Our proposed launch plans:
              </p>
            </div>
            <div className="pricing-grid">
              {plans.map((item) => (
                <article className="pricing-card" key={item.name}>
                  <div>
                    <div className="plan-label">
                      <h3>{item.name}</h3>
                      {item.note && (
                        <span className="plan-note">For small teams</span>
                      )}
                    </div>
                    <p className="plan-price">
                      {item.price}
                      {item.price === '$15' && <span>/ month</span>}
                    </p>
                    <p className="plan-description">{item.detail}</p>
                    <ul role="list">
                      {item.features.map((feature) => (
                        <li key={feature}>
                          <CheckIcon
                            aria-hidden="true"
                            className="size-4 shrink-0"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="plan-footnote">
                      {item.note ||
                        (item.name === 'Self-hosted'
                          ? 'Infrastructure billed separately'
                          : 'No card to start')}
                    </p>
                    {item.name === 'Self-hosted' ? (
                      <a
                        href={github}
                        className="button button-secondary"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.action} <Arrow diagonal />
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => requestInvite(item.name)}
                      >
                        {item.action} <Arrow />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <p className="pricing-disclaimer">
              Proposed launch pricing. Unlimited forms; monthly cloud usage
              allowances apply. AI usage is separate or uses your own API key.
            </p>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="container split-grid">
            <div>
              <p className="eyebrow">A few good questions.</p>
              <h2>Glad you asked.</h2>
              <p className="faq-intro">
                Something else on your mind?
                <br />
                <a href={`mailto:${inviteEmail}?subject=Hello%20Typenow`}>
                  Talk to the founder <span aria-hidden="true">↗</span>
                </a>
              </p>
            </div>
            <div className="faq-list">
              {faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <PlusIcon aria-hidden="true" className="size-4 shrink-0" />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="closing-section">
          <div className="container closing-inner">
            <div>
              <p className="eyebrow">Let's make room for the good stuff.</p>
              <h2>
                Your customers,
                <br />a little closer.
              </h2>
            </div>
            <div className="closing-action">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => requestInvite()}
              >
                Keep me posted <Arrow diagonal />
              </button>
              <p>
                We're testing it with Karnstack. You'll hear when it's ready.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-top">
          <a href="/" aria-label="Typenow homepage">
            <img src="/brand.svg" alt="Typenow" width="132" height="28" />
          </a>
          <p>A little less inbox. A lot more building.</p>
          <div>
            <a href={github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a href={`mailto:${inviteEmail}?subject=Hello%20Typenow`}>
              Say hello ↗
            </a>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© {new Date().getFullYear()} Typenow</p>
          <p>
            Made with care, by{' '}
            <a href="https://karnstack.com" target="_blank" rel="noreferrer">
              Karnstack
            </a>
            .
          </p>
          <a href="#main">Back to top ↑</a>
        </div>
      </footer>
      <InviteDialog dialogRef={inviteDialog} plan={plan} />
    </div>
  )
}

function ProductPreview() {
  const [tab, setTab] = useState('inbox')
  const tabs = [
    { id: 'inbox', label: 'One inbox', Icon: EnvelopeIcon },
    { id: 'forms', label: 'Thoughtful forms', Icon: ClipboardDocumentIcon },
    { id: 'context', label: 'A little context', Icon: SparklesIcon },
  ]
  return (
    <div className="product-frame">
      <div className="preview-toolbar">
        <div
          className="preview-tabs"
          role="tablist"
          aria-label="Product previews"
        >
          {tabs.map(({ id, label, Icon }) => (
            <button
              type="button"
              key={id}
              id={`tab-${id}`}
              role="tab"
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              onKeyDown={(event) => {
                const index = tabs.findIndex((item) => item.id === tab)
                if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                  event.preventDefault()
                  const next =
                    tabs[
                      (index +
                        (event.key === 'ArrowRight' ? 1 : -1) +
                        tabs.length) %
                        tabs.length
                    ]
                  setTab(next.id)
                  document.getElementById(`tab-${next.id}`)?.focus()
                }
              }}
              tabIndex={tab === id ? 0 : -1}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>
        <p className="preview-toolbar-note">
          <span className="status-dot" /> Designed for your day
        </p>
      </div>
      {tabs.map(({ id }) => (
        <div
          className="preview-panel"
          id={`panel-${id}`}
          role="tabpanel"
          aria-labelledby={`tab-${id}`}
          key={id}
          hidden={tab !== id}
        >
          {id === 'inbox' ? (
            <InboxPreview />
          ) : id === 'forms' ? (
            <FormPreview />
          ) : (
            <ContextPreview />
          )}
        </div>
      ))}
    </div>
  )
}

function FormPreview() {
  const [sent, setSent] = useState(false)
  return (
    <div className="form-preview">
      <div className="form-preview-copy">
        <p className="eyebrow">Every conversation starts somewhere.</p>
        <h3>
          A nicer way
          <br />
          to say hello.
        </h3>
        <p>
          A useful question. A thoughtful form.
          <br />
          Straight into the same inbox.
        </p>
        <span className="demo-label">
          Interactive concept · Nothing is sent
        </span>
      </div>
      <form
        className="sample-form"
        onSubmit={(event) => {
          event.preventDefault()
          setSent(true)
        }}
      >
        <div className="sample-form-heading">
          <span className="form-brand">karnstack</span>
          <p>How can we help?</p>
          <span>A question, an idea, or your next big thing.</span>
        </div>
        {sent ? (
          <div className="sample-success" role="status">
            <CheckIcon className="size-4" aria-hidden="true" />
            <p>That's a good start.</p>
            <span>In Typenow, this would start a conversation.</span>
            <button
              type="button"
              className="text-link"
              onClick={() => setSent(false)}
            >
              Try again <Arrow />
            </button>
          </div>
        ) : (
          <>
            <label htmlFor="sample-email">Your email</label>
            <input
              id="sample-email"
              type="email"
              name="sample-email"
              placeholder="you@company.com"
              required
            />
            <label htmlFor="sample-message">What's on your mind?</label>
            <textarea
              id="sample-message"
              name="sample-message"
              placeholder="Tell us a little about it…"
              required
              rows={3}
            />
            <button className="button button-secondary" type="submit">
              Preview your request <Arrow />
            </button>
          </>
        )}
      </form>
    </div>
  )
}

function ContextPreview() {
  return (
    <div className="context-preview">
      <div className="context-thread">
        <p className="eyebrow">Example conversation</p>
        <h3>“I can't find my course.”</h3>
        <div className="conversation-bubble">
          <p>
            Hey! I bought the Go course yesterday but it's not showing up in my
            account. Could you help?
          </p>
          <span>Alex · Learner support</span>
        </div>
        <div className="draft-bubble">
          <p>
            <SparklesIcon aria-hidden="true" className="size-4" /> A useful
            starting point
          </p>
          <blockquote>
            Hi Alex, I can see your purchase. Let's check you're signed in with
            the email you used at checkout.
          </blockquote>
          <span>Draft only. You review before sending.</span>
        </div>
      </div>
      <aside className="context-card">
        <p className="eyebrow">Customer context</p>
        <h4>Alex Morgan</h4>
        <p>Verified learner</p>
        <dl>
          <div>
            <dt>Course</dt>
            <dd>Go foundations</dd>
          </div>
          <div>
            <dt>Access</dt>
            <dd>
              <CheckIcon className="size-4" aria-hidden="true" /> Active
            </dd>
          </div>
          <div>
            <dt>Purchased</dt>
            <dd>Yesterday</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>Karnstack account</dd>
          </div>
        </dl>
        <span className="demo-label">Illustrative account data</span>
      </aside>
    </div>
  )
}

function AgentPreview() {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [showDraft, setShowDraft] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(mcpExample)
      setCopied(true)
      setCopyError(false)
    } catch {
      setCopyError(true)
    }
  }
  return (
    <div className="agent-preview">
      <div className="agent-header">
        <p>
          <CodeBracketIcon aria-hidden="true" className="size-4" /> A
          conversation with your tools
        </p>
        <button
          type="button"
          className="icon-button"
          onClick={copy}
          aria-label={copied ? 'Example copied' : 'Copy example prompt'}
        >
          {copied ? (
            <CheckIcon className="size-4" />
          ) : (
            <ClipboardDocumentIcon className="size-4" />
          )}
        </button>
      </div>
      <p className="agent-meta">you / a little help, please</p>
      <p className="agent-prompt">
        Find Alex's course-access request.
        <br />
        Check the account context and
        <br />
        draft a reply for me to review.
      </p>
      <div className="tool-events">
        <p>
          <CheckIcon aria-hidden="true" className="size-4" /> Found the
          conversation
        </p>
        <p>
          <CheckIcon aria-hidden="true" className="size-4" /> Checked course
          access
        </p>
        <p>
          <CheckIcon aria-hidden="true" className="size-4" /> Prepared a reply
          draft
        </p>
      </div>
      {showDraft && (
        <div className="agent-draft" role="status">
          <p>
            Hi Alex, I can see your course access is active. Could you check
            that you're signed in with the email you used at checkout?
          </p>
          <span>Example draft · No message sent</span>
        </div>
      )}
      <button
        type="button"
        className="agent-review"
        aria-expanded={showDraft}
        onClick={() => setShowDraft(!showDraft)}
      >
        {showDraft ? 'Close the draft' : 'Review the draft'}
        <Arrow />
      </button>
      <p className="agent-footer" role="status">
        {copyError
          ? 'Copy unavailable. You can select the example text.'
          : copied
            ? 'Example prompt copied.'
            : 'MCP concept · Your tools. Your approval.'}
      </p>
    </div>
  )
}

function InviteDialog({
  dialogRef,
  plan,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>
  plan: string
}) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [draftOpened, setDraftOpened] = useState(false)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const subject = encodeURIComponent(`Typenow early access: ${plan}`)
    const body = encodeURIComponent(
      `Hi Karn,\n\nI'd like to try Typenow.\n\nName: ${name}\nEmail: ${email}\nInterested in: ${plan}\n\nHere's what I currently use for customer support:\n`,
    )
    window.location.href = `mailto:${inviteEmail}?subject=${subject}&body=${body}`
    setDraftOpened(true)
  }
  return (
    <dialog
      ref={dialogRef}
      className="invite-dialog"
      aria-labelledby="invite-title"
      onClose={() => setDraftOpened(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            event.currentTarget.close()
        }
      }}
    >
      <div className="dialog-top">
        <p className="eyebrow">For when it is ready.</p>
        <button
          type="button"
          className="icon-button"
          aria-label="Close early access dialog"
          onClick={() => dialogRef.current?.close()}
        >
          <XMarkIcon className="size-4" aria-hidden="true" />
        </button>
      </div>
      <h2 id="invite-title">Be one of the first.</h2>
      <p>
        Tell Karn a little about your team. We'll get in touch when Typenow is
        ready to try.
      </p>
      <form onSubmit={submit}>
        <label htmlFor="invite-name">Your name</label>
        <input
          id="invite-name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoFocus
        />
        <label htmlFor="invite-email">Your email</label>
        <input
          id="invite-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button type="submit" className="button button-primary">
          Prepare my introduction{' '}
          <PaperAirplaneIcon aria-hidden="true" className="size-4" />
        </button>
        <p className="dialog-help">
          Opens a draft in your email app. Send it when you're ready. We haven't
          saved your details.
        </p>
        {draftOpened && (
          <p className="dialog-confirmation" role="status">
            Email draft requested. If no app opened,{' '}
            <a href={`mailto:${inviteEmail}`}>email Karn directly</a>.
          </p>
        )}
      </form>
    </dialog>
  )
}
