import { useState } from 'react'
import './App.css'
import ReactMarkdown from 'react-markdown'

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Settings state
  const [model, setModel] = useState('gpt-3.5-turbo')
  const [format, setFormat] = useState('text')
  const [temperature, setTemperature] = useState(1.0)
  const [tokens, setTokens] = useState(2048)
  const [topP, setTopP] = useState(1.0)
  const [store, setStore] = useState(true)
  const [variables, setVariables] = useState('')
  const [tools, setTools] = useState('')
  const [systemMessage, setSystemMessage] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
    setLoading(true)
    setError(null)
    try {
      // Call OpenAI API with apiKey and input
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            ...(systemMessage ? [{ role: 'system', content: systemMessage }] : []),
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: input },
          ],
          temperature,
          max_tokens: tokens,
          top_p: topP,
          // format, variables, tools, store are not standard OpenAI params, but included for UI completeness
        }),
      })
      if (!response.ok) {
        throw new Error('OpenAI API error: ' + response.status)
      }
      const data = await response.json()
      const aiContent = data.choices?.[0]?.message?.content || 'No response.'
      setMessages(msgs => [
        ...msgs,
        { role: 'assistant', content: aiContent },
      ])
    } catch (err) {
      setError((err instanceof Error ? err.message : 'Failed to get response from OpenAI API.'))
    } finally {
      setLoading(false)
    }
  }

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      setError('API key cannot be empty.')
      return
    }
    setShowSettings(false)
    setError(null)
  }

  return (
    <div className="gpt-wrapper-root">
      <header className="gpt-header">
        <div className="gpt-title">GPT Wrapper</div>
        <button className="gpt-settings-btn" onClick={() => setShowSettings(true)} title="Settings">
          <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Zm7.43-2.9c.04-.21.07-.43.07-.65s-.03-.44-.07-.65l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.03 7.03 0 0 0-1.13-.65l-.38-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.38 2.65c-.4.17-.78.36-1.13.65l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.21-.07.43-.07.65s.03.44.07.65l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.14.24.44.33.7.22l2.49-1c.35.24.73.46 1.13.65l.38 2.65c.05.28.28.42.5.42h4c.22 0 .45-.14.5-.42l.38-2.65c.4-.19.78-.41 1.13-.65l2.49 1c.26.11.56.02.7-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65ZM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/></svg>
        </button>
      </header>
      <main className="gpt-chat-area">
        <div className="gpt-chat-messages">
          {messages.length === 0 && <div className="gpt-empty">Start a conversation with GPT!</div>}
          {messages.map((msg, idx) => (
            <div key={idx} className={`gpt-message gpt-message-${msg.role}`}>
              {msg.role === 'assistant' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
            </div>
          ))}
          {loading && <div className="gpt-message gpt-message-assistant gpt-loading">Loading...</div>}
        </div>
        {error && <div className="gpt-error">{error}</div>}
        <form className="gpt-input-row" onSubmit={e => { e.preventDefault(); handleSend(); }}>
          <input
            className="gpt-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            autoFocus
          />
          <button className="gpt-send-btn" type="submit" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </main>
      {showSettings && (
        <div className="gpt-modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="gpt-modal" onClick={e => e.stopPropagation()}>
            <div className="gpt-modal-title">Settings</div>
            <label className="gpt-modal-label">OpenAI API Key</label>
            <input
              className="gpt-modal-input"
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="API Key"
            />
            <div className="gpt-modal-section">
              <div className="gpt-modal-subtitle">Model</div>
              <select className="gpt-modal-select" value={model} onChange={e => setModel(e.target.value)}>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                <option value="gpt-4">gpt-4</option>
              </select>
            </div>
            <div className="gpt-modal-section">
              <div className="gpt-modal-subtitle">text.format</div>
              <select className="gpt-modal-select" value={format} onChange={e => setFormat(e.target.value)}>
                <option value="text">text</option>
                <option value="json">json</option>
              </select>
            </div>
            <div className="gpt-modal-section">
              <div className="gpt-modal-subtitle">temp</div>
              <input className="gpt-modal-input" type="number" step="0.01" min="0" max="2" value={temperature} onChange={e => setTemperature(Number(e.target.value))} />
            </div>
            <div className="gpt-modal-section">
              <div className="gpt-modal-subtitle">tokens</div>
              <input className="gpt-modal-input" type="number" min="1" max="4096" value={tokens} onChange={e => setTokens(Number(e.target.value))} />
            </div>
            <div className="gpt-modal-section">
              <div className="gpt-modal-subtitle">top_p</div>
              <input className="gpt-modal-input" type="number" step="0.01" min="0" max="1" value={topP} onChange={e => setTopP(Number(e.target.value))} />
            </div>
            <div className="gpt-modal-section">
              <div className="gpt-modal-subtitle">store</div>
              <input type="checkbox" checked={store} onChange={e => setStore(e.target.checked)} />
            </div>
            <div className="gpt-modal-section">
              <div className="gpt-modal-subtitle">Variables</div>
              <input className="gpt-modal-input" type="text" value={variables} onChange={e => setVariables(e.target.value)} placeholder="Variables (optional)" />
            </div>
            <div className="gpt-modal-section">
              <div className="gpt-modal-subtitle">Tools</div>
              <input className="gpt-modal-input" type="text" value={tools} onChange={e => setTools(e.target.value)} placeholder="Tools (optional)" />
            </div>
            <div className="gpt-modal-section">
              <div className="gpt-modal-subtitle">System message</div>
              <textarea className="gpt-modal-input" value={systemMessage} onChange={e => setSystemMessage(e.target.value)} placeholder="Describe desired model behavior (tone, tool usage, response style)"></textarea>
            </div>
            <button className="gpt-modal-save" onClick={handleSaveApiKey}>Save</button>
            <button className="gpt-modal-cancel" onClick={() => setShowSettings(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
