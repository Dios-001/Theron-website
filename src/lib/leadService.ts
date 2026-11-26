export interface LeadPayload {
  fullName: string
  company: string
  email: string
  industry: string
  solution: string
  message: string
  submittedAt: string
  source: 'theron-website'
}

export type LeadResult = { mode: 'live' } | { mode: 'demo' }

/**
 * Sends a lead to the backend configured in VITE_LEADS_ENDPOINT.
 *
 * With no endpoint configured this is a DEMO: it waits briefly, sends nothing, and reports
 * mode 'demo' so the UI can say so. To go live, set VITE_LEADS_ENDPOINT to an API that accepts
 * the JSON in LeadPayload, returns a 2xx on success, and validates and rate-limits on the server.
 */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const endpoint = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined
  if (!endpoint) {
    await new Promise((resolve) => setTimeout(resolve, 900))
    return { mode: 'demo' }
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
  return { mode: 'live' }
}

export const isDemoMode = () => !(import.meta.env.VITE_LEADS_ENDPOINT as string | undefined)
