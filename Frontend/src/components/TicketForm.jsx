import { useMemo, useState } from 'react'

const initialFormState = {
  title: '',
  description: '',
  priority: 'medium',
}

export default function TicketForm({ initialValues, onSubmit, submitLabel = 'Save Ticket', disabled = false }) {
  const defaults = useMemo(
    () => ({
      ...initialFormState,
      ...initialValues,
    }),
    [initialValues],
  )

  const [formData, setFormData] = useState(defaults)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit?.(formData)
  }

  return (
    <form className="support-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Title</span>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Example: Billing issue after plan change"
          required
          disabled={disabled}
        />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          name="description"
          rows="5"
          value={formData.description}
          onChange={handleChange}
          placeholder="Share the issue and any context your team should see."
          required
          disabled={disabled}
        />
      </label>

      <label className="field">
        <span>Priority</span>
        <select name="priority" value={formData.priority} onChange={handleChange} disabled={disabled}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </label>

      <button type="submit" className="button" disabled={disabled}>
        {submitLabel}
      </button>
    </form>
  )
}
