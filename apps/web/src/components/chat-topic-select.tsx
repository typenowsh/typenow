import { Select } from '@base-ui/react/select'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/16/solid'

const topics = ['Course access', 'Billing', 'Technical issue', 'Something else']

export function ChatTopicSelect({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <Select.Root
      value={value}
      onValueChange={(next) => {
        if (next !== null) onValueChange(next)
      }}
      modal={false}
      name="topic"
    >
      <div className="chat-topic">
        <Select.Label>
          About<span className="sr-only"> your question</span>
        </Select.Label>
        <Select.Trigger className="chat-topic-trigger">
          <Select.Value />
          <Select.Icon className="chat-topic-chevron">
            <ChevronDownIcon aria-hidden="true" />
          </Select.Icon>
        </Select.Trigger>
      </div>
      <Select.Portal>
        <Select.Positioner
          className="chat-topic-positioner"
          side="top"
          align="start"
          sideOffset={8}
          alignItemWithTrigger={false}
        >
          <Select.Popup className="chat-topic-popup">
            <Select.List className="chat-topic-list">
              {topics.map((topic) => (
                <Select.Item
                  className="chat-topic-option"
                  key={topic}
                  value={topic}
                >
                  <Select.ItemText>{topic}</Select.ItemText>
                  <Select.ItemIndicator className="chat-topic-check">
                    <CheckIcon aria-hidden="true" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}
