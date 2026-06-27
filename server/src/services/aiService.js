'use strict'

const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

console.log('Groq Key loaded:', !!process.env.GROQ_API_KEY)

const MODEL = 'llama-3.3-70b-versatile'

// Groq/Llama sometimes adds prose before or after the JSON block.
// Try a direct parse first; fall back to extracting the first {...} match.
function parseJSON(text) {
  const stripped = text.replace(/```json\n?|```/g, '').trim()
  try {
    return JSON.parse(stripped)
  } catch {
    const match = stripped.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error('No valid JSON found in AI response: ' + stripped.slice(0, 120))
  }
}

// ── 1. Proposal Generator ─────────────────────────────────────────────────────

async function generateProposal({ jobTitle, jobDescription, skills, experience, platform, tone }) {
  try {
    const response = await groq.chat.completions.create({
      model:       MODEL,
      max_tokens:  1000,
      temperature: 0.7,
      messages: [
        {
          role:    'system',
          content: 'You are an expert freelance proposal writer. Always respond with valid JSON only. No markdown, no explanation, no extra text.',
        },
        {
          role:    'user',
          content: `Write a freelance proposal and return ONLY this JSON:
{
  "proposal": "full proposal text minimum 200 words",
  "successScore": 85,
  "toneScore": 80,
  "clarityScore": 90
}

Job Title: ${jobTitle}
Description: ${jobDescription}
Skills: ${skills}
Experience: ${experience}
Platform: ${platform}
Tone: ${tone}`,
        },
      ],
    })

    return parseJSON(response.choices[0].message.content)
  } catch (error) {
    console.error('generateProposal error:', error.message)
    throw error
  }
}

// ── 2. Client Reply Generator ─────────────────────────────────────────────────

async function generateClientReply({ clientMessage, tone, platform, conversationHistory = [] }) {
  try {
    // Prior exchanges give the AI context about the client relationship
    const priorHistory = conversationHistory
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }))

    const hasContext = priorHistory.length > 0

    const messages = [
      {
        role:    'system',
        content: `You are an expert freelance communication coach helping a freelancer respond to client messages on ${platform}. Write ${tone.toLowerCase()}, professional replies${hasContext ? ' that maintain continuity with prior exchanges' : ''}. Always respond with valid JSON only. No markdown.`,
      },
      ...priorHistory,
      {
        role:    'user',
        content: `${hasContext ? 'Considering the conversation context, analyze' : 'Analyze'} this client message and generate a reply.
Return ONLY this JSON:
{
  "reply": "professional reply here",
  "detectedPersonality": "Serious"
}
detectedPersonality must be exactly one of: Serious, Budget-Focused, Difficult, Confused

Client Message: ${clientMessage}
Tone: ${tone}
Platform: ${platform}`,
      },
    ]

    const response = await groq.chat.completions.create({
      model:       MODEL,
      max_tokens:  600,
      temperature: 0.7,
      messages,
    })

    return parseJSON(response.choices[0].message.content)
  } catch (error) {
    console.error('generateClientReply error:', error.message)
    throw error
  }
}

// ── 3. Gig Description Generator ─────────────────────────────────────────────

async function generateGigDescription({ skill, experienceLevel, platform }) {
  try {
    const response = await groq.chat.completions.create({
      model:       MODEL,
      max_tokens:  2000,
      temperature: 0.7,
      messages: [
        {
          role:    'system',
          content: 'You are an expert freelance gig writer specializing in high-converting listings on Fiverr and Upwork. Always respond with valid JSON only. No markdown, no extra text.',
        },
        {
          role:    'user',
          content: `Create a complete professional gig listing for a ${skill} freelancer at ${experienceLevel} level targeting ${platform}.

Return ONLY this exact JSON (no markdown, no extra text):
{
  "titles": [
    "SEO-optimized title option 1 under 80 chars",
    "SEO-optimized title option 2 under 80 chars",
    "SEO-optimized title option 3 under 80 chars"
  ],
  "description": "compelling gig description of 300+ words: opening hook, what you offer, why choose me, call to action",
  "packages": {
    "basic": {
      "name": "Starter",
      "tagline": "Perfect for small projects",
      "price": 30,
      "deliveryDays": 3,
      "revisions": 2,
      "includes": ["deliverable 1", "deliverable 2", "deliverable 3"],
      "notIncludes": ["deliverable 4", "deliverable 5"]
    },
    "standard": {
      "name": "Professional",
      "tagline": "Most popular choice",
      "price": 75,
      "deliveryDays": 5,
      "revisions": 3,
      "includes": ["deliverable 1", "deliverable 2", "deliverable 3", "deliverable 4"],
      "notIncludes": ["deliverable 5"]
    },
    "premium": {
      "name": "Premium",
      "tagline": "Complete solution",
      "price": 150,
      "deliveryDays": 10,
      "revisions": -1,
      "includes": ["deliverable 1", "deliverable 2", "deliverable 3", "deliverable 4", "deliverable 5"],
      "notIncludes": []
    }
  },
  "pricingStrategy": "2-3 sentences explaining why these prices are right for this skill and experience level",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keywords": ["kw1", "kw2", "kw3", "kw4", "kw5", "kw6", "kw7", "kw8", "kw9", "kw10"],
  "buyerRequirements": [
    "specific question to ask buyer 1",
    "specific question to ask buyer 2",
    "specific question to ask buyer 3",
    "specific question to ask buyer 4",
    "specific question to ask buyer 5"
  ],
  "faqs": [
    {"question": "Q1", "answer": "A1"},
    {"question": "Q2", "answer": "A2"},
    {"question": "Q3", "answer": "A3"},
    {"question": "Q4", "answer": "A4"},
    {"question": "Q5", "answer": "A5"}
  ],
  "proTips": [
    "actionable tip to rank this gig faster 1",
    "actionable tip 2",
    "actionable tip 3",
    "actionable tip 4",
    "actionable tip 5"
  ]
}

Rules:
- revisions: -1 means Unlimited (use only for premium)
- prices must be realistic for ${experienceLevel} ${skill} on ${platform}
- all deliverables in includes/notIncludes must be specific to ${skill}
- description must be at least 300 words with clear sections`,
        },
      ],
    })

    return parseJSON(response.choices[0].message.content)
  } catch (error) {
    console.error('generateGigDescription error:', error.message)
    throw error
  }
}

// ── 4. AI Chatbot ─────────────────────────────────────────────────────────────

async function chatbotResponse({ message, conversationHistory = [] }) {
  try {
    // conversationHistory from the client already contains the current user
    // message at the end. Exclude it with slice(0, -1) to avoid sending it twice.
    const priorHistory = conversationHistory
      .slice(0, -1)
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }))

    const messages = [
      {
        role:    'system',
        content: 'You are Truelancer AI, a helpful assistant specialized in freelancing advice. Help freelancers grow their business, write better proposals, handle clients, and price their services correctly. Be friendly and concise.',
      },
      ...priorHistory,
      { role: 'user', content: message },
    ]

    const response = await groq.chat.completions.create({
      model:       MODEL,
      max_tokens:  500,
      temperature: 0.7,
      messages,
    })

    return { reply: response.choices[0].message.content }
  } catch (error) {
    console.error('chatbotResponse error:', error.message)
    throw error
  }
}

// ── 5. Pricing Suggestion ─────────────────────────────────────────────────────

async function generatePricingSuggestion({
  jobTitle, jobDescription, skills, experience,
  projectType, complexity, estimatedHours,
  location, deliveryTime, platforms, clientBudget,
}) {
  const platformsList = Array.isArray(platforms) && platforms.length
    ? platforms.join(', ')
    : 'upwork, fiverr, freelancer, direct'

  try {
    const response = await groq.chat.completions.create({
      model:       MODEL,
      max_tokens:  900,
      temperature: 0.6,
      messages: [
        {
          role:    'system',
          content: 'You are a freelancing pricing expert with deep knowledge of global market rates on Upwork, Fiverr, and Freelancer.com. Always respond with valid JSON only. No markdown, no extra text.',
        },
        {
          role:    'user',
          content: `Analyze this freelancer profile and project, then provide comprehensive pricing recommendations.
Return ONLY this exact JSON with realistic USD integers for all price fields:
{
  "minPrice": 100,
  "sweetSpotPrice": 200,
  "premiumPrice": 400,
  "hourlyRate": 25,
  "platformPricing": {
    "fiverr": 150,
    "upwork": 200,
    "freelancer": 180,
    "direct": 250
  },
  "breakdown": {
    "baseRate": 150,
    "complexityMultiplier": 1.3,
    "rushFee": 0,
    "platformFeeNote": "Add 20% to cover Fiverr fees"
  },
  "advice": ["specific actionable tip 1", "specific actionable tip 2", "specific actionable tip 3"],
  "negotiationTips": ["negotiation strategy 1", "negotiation strategy 2"],
  "marketRates": {
    "beginner": "50-150",
    "intermediate": "150-350",
    "expert": "350-700"
  },
  "redFlags": ["specific red flag 1", "specific red flag 2"]
}

Rules:
- All price fields must be plain integers (no $ signs, no strings)
- marketRates values must be "min-max" strings without $ signs
- Only include platformPricing keys for: ${platformsList}
- rushFee should be 0 unless delivery is rush/fast
- complexityMultiplier: Simple=1.0, Medium=1.3, Complex=1.7, Enterprise=2.5
- Adjust for location: South Asia/Africa rates lower, North America/Western Europe higher

FREELANCER PROFILE:
Skills: ${skills || 'General freelancing'}
Experience: ${experience}
Location: ${location}

PROJECT DETAILS:
Job Title: ${jobTitle || 'Freelance Project'}
Description: ${jobDescription || 'Not specified'}
Project Type: ${projectType}
Complexity: ${complexity}
Estimated Hours: ${estimatedHours || 'Not specified'}
Delivery: ${deliveryTime}
Platforms: ${platformsList}
Client Budget: ${clientBudget || 'Unknown'}`,
        },
      ],
    })

    return parseJSON(response.choices[0].message.content)
  } catch (error) {
    console.error('generatePricingSuggestion error:', error.message)
    throw error
  }
}

// ── Exports ───────────────────────────────────────────────────────────────────

module.exports = {
  generateProposal,
  generateClientReply,
  generateGigDescription,
  chatbotResponse,
  generatePricingSuggestion,
}
