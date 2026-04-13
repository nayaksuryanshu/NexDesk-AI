import { useCallback, useEffect, useMemo, useState } from 'react'
import socketService from '../services/socketService.js'
import { ticketService } from '../services/ticketService.js'
import { ChatSharedContext } from './chatSharedContext.js'

export function ChatProvider({ children, ticketId, currentUser }) {
  const [messages, setMessages] = useState([])
  const [aiTyping, setAiTyping] = useState(false)
  const [aiError, setAiError] = useState('')
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState('')

  useEffect(() => {
    if (!ticketId) {
      return undefined
    }

    let cancelled = false

    const bootstrapChat = async () => {
      try {
        setHistoryError('')
        setHistoryLoading(true)
        setMessages([])
        const history = await ticketService.getTicketMessages(ticketId)
        if (!cancelled) {
          setMessages(history)
        }
      } catch (error) {
        if (!cancelled) {
          setHistoryError(error.response?.data?.message || 'Unable to load chat history for this ticket.')
        }
      } finally {
        if (!cancelled) {
          setHistoryLoading(false)
        }
      }

      socketService.connect({
        ticketId,
        onMessage: (message) => {
          setMessages((prev) => [...prev, message])
          if (message?.role === 'ai') {
            setAiTyping(false)
            setAiError('')
          }
        },
        onTyping: (isTyping) => {
          setAiTyping(isTyping)
        },
        onAIError: (errorMessage) => {
          setAiTyping(false)
          setAiError(errorMessage)
        },
        onError: (errorMessage) => {
          setAiError(errorMessage)
        },
      })
    }

    bootstrapChat()

    return () => {
      cancelled = true
      socketService.removeListeners()
    }
  }, [ticketId])

  const sendMessage = useCallback(
    (content) => {
      const trimmed = content.trim()
      if (!trimmed || !ticketId) {
        return
      }

      setAiError('')
      socketService.sendMessage({
        ticketId,
        message: trimmed,
        sender: currentUser?.name || currentUser?.email || 'Customer',
        role: currentUser?.role || 'customer',
      })
    },
    [ticketId, currentUser],
  )

  const dismissAIError = useCallback(() => {
    setAiError('')
  }, [])

  const value = useMemo(
    () => ({
      messages,
      aiTyping,
      aiError,
      historyLoading,
      historyError,
      sendMessage,
      dismissAIError,
    }),
    [messages, aiTyping, aiError, historyLoading, historyError, sendMessage, dismissAIError],
  )

  return <ChatSharedContext.Provider value={value}>{children}</ChatSharedContext.Provider>
}
