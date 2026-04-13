import { useContext } from 'react'
import { ChatSharedContext } from './chatSharedContext.js'

export function useChat() {
  const context = useContext(ChatSharedContext)

  if (!context) {
    throw new Error('useChat must be used inside ChatProvider')
  }

  return context
}
