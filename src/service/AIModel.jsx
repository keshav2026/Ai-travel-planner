import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
})

export const generateTrip = async (prompt) => {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt + ' Respond ONLY with valid JSON. No markdown, no backticks, no ```json, no explanation. Just the raw JSON object.'
      }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 1,
    max_tokens: 8192,
  })

  let text = response.choices[0]?.message?.content || ''

  // strip markdown code fences if Groq adds them anyway
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

  return text
}