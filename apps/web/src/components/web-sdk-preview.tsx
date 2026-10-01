import { useRef, useState } from 'react'
import { ChatWidgetDemo } from './chat-widget-demo'
import {
  ChatBubbleLeftRightIcon,
  CheckIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/16/solid'

const sdkExample = `import { createTypenow } from '@typenow/web'

const support = createTypenow({
  workspaceId: 'your-public-workspace-id',
  endpoint: 'https://support.example.com',
})

support.open()`

export function WebSdkPreview() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [animateChat, setAnimateChat] = useState(false)
  const launcher = useRef<HTMLButtonElement>(null)

  function close() {
    setOpen(false)
    launcher.current?.focus()
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(sdkExample)
      setCopied(true)
      setCopyError(false)
    } catch {
      setCopyError(true)
    }
  }

  return (
    <section className="web-sdk-section" id="web-sdk">
      <div className="container split-grid">
        <div className="section-copy">
          <p className="eyebrow">A hello, right inside your product.</p>
          <h2>Be there when the question happens.</h2>
          <p>
            A small chat box for your website or app. Your customer stays in the
            flow; you get the conversation in Typenow, with their product
            context alongside it.
          </p>
          <p>
            Reply while they're there. Follow up by email when they're away.
            It's the same conversation, wherever they pick it up.
          </p>
          <div className="sdk-platforms" aria-label="Planned SDK options">
            <span>JavaScript</span>
            <span>React</span>
            <span>Cloud or self-hosted</span>
          </div>
          <div className="sdk-code">
            <div className="sdk-code-header">
              <p>Proposed SDK API · Not published yet</p>
              <button
                type="button"
                className="icon-button"
                onClick={copy}
                aria-label={
                  copied ? 'SDK example copied' : 'Copy proposed SDK example'
                }
              >
                {copied ? (
                  <CheckIcon className="size-4" aria-hidden="true" />
                ) : (
                  <ClipboardDocumentIcon
                    className="size-4"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
            <pre>
              <code>{sdkExample}</code>
            </pre>
            <p className="sdk-copy-status" role="status">
              {copyError
                ? 'Copy unavailable. You can select the code.'
                : copied
                  ? 'Proposed API example copied.'
                  : 'A public workspace ID. Your own endpoint.'}
            </p>
          </div>
        </div>
        <div>
          <div className="sdk-browser">
            <div className="sdk-browser-bar">
              <span>karnstack / learn</span>
              <span>Example app</span>
            </div>
            <div className="sdk-lesson">
              <p className="eyebrow">Go foundations / Chapter 04</p>
              <h3>
                Good questions.
                <br />
                Better understanding.
              </h3>
              <p>You shouldn't have to leave a lesson to ask for a hand.</p>
              <div className="sdk-lesson-note">
                <CheckIcon className="size-4" aria-hidden="true" />
                <span>Pick up where you left off.</span>
              </div>
            </div>
            <ChatWidgetDemo open={open} animate={animateChat} onClose={close} />
            <button
              type="button"
              className="sdk-launcher"
              ref={launcher}
              aria-expanded={open}
              aria-controls="sdk-chat-panel"
              onClick={(event) => {
                setAnimateChat(event.detail > 0)
                if (open) close()
                else {
                  setOpen(true)
                }
              }}
            >
              <ChatBubbleLeftRightIcon className="size-4" aria-hidden="true" />
              {open ? 'Close chat' : 'Ask a question'}
            </button>
          </div>
          <p className="sdk-preview-caption">
            Try the chat box · Local demo of the planned web SDK.
          </p>
        </div>
      </div>
    </section>
  )
}
