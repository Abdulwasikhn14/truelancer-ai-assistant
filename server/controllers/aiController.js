const {
  generateProposal,
  generateClientReply,
  generateGigDescription,
  chatbotResponse,
  generatePricingSuggestion,
} = require('../src/services/aiService')
const { saveHistory } = require('../models/historyModel')

// ── handleProposal ────────────────────────────────────────────────────────────

const handleProposal = async (req, res) => {
  const { jobTitle, jobDescription, skills, experience, platform, tone } = req.body

  if (!jobTitle || !jobDescription || !skills || !experience || !platform || !tone) {
    return res.status(400).json({ message: 'All fields are required: jobTitle, jobDescription, skills, experience, platform, tone' })
  }
  if (jobDescription.length > 2000) {
    return res.status(400).json({ message: 'Job description must be 2000 characters or less.' })
  }

  try {
    const result = await generateProposal({ jobTitle, jobDescription, skills, experience, platform, tone })
    saveHistory(req.user.id, 'proposal', jobTitle, result.proposal, platform, result.successScore).catch(() => {})
    return res.status(200).json(result)
  } catch (error) {
    console.error('handleProposal error:', error.message)
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ message: 'API quota exceeded. Please check your OpenAI plan.' })
    }
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ message: 'Invalid API key. Please check your configuration.' })
    }
    return res.status(500).json({ message: 'AI service error: ' + error.message })
  }
}

// ── handleClientReply ─────────────────────────────────────────────────────────

const handleClientReply = async (req, res) => {
  const { clientMessage, tone, platform, conversationHistory } = req.body
  console.log('Client reply request:', { clientMessage: clientMessage?.slice(0, 80), tone, platform })

  if (!clientMessage || !tone || !platform) {
    return res.status(400).json({ message: 'All fields are required: clientMessage, tone, platform' })
  }
  if (clientMessage.length > 2000) {
    return res.status(400).json({ message: 'Client message must be 2000 characters or less.' })
  }

  try {
    const result = await generateClientReply({
      clientMessage, tone, platform,
      conversationHistory: conversationHistory || [],
    })
    saveHistory(req.user.id, 'message', clientMessage.substring(0, 50), result.reply, platform).catch(() => {})
    return res.status(200).json(result)
  } catch (error) {
    console.error('handleClientReply error:', error.message)
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ message: 'API quota exceeded. Please check your OpenAI plan.' })
    }
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ message: 'Invalid API key. Please check your configuration.' })
    }
    return res.status(500).json({ message: 'AI service error: ' + error.message })
  }
}

// ── handleGigDescription ──────────────────────────────────────────────────────

const handleGigDescription = async (req, res) => {
  const { skill, experienceLevel, platform } = req.body

  if (!skill) {
    return res.status(400).json({ message: 'Field required: skill' })
  }

  try {
    const result = await generateGigDescription({
      skill,
      experienceLevel: experienceLevel || 'Intermediate',
      platform:        platform        || 'Fiverr',
    })
    saveHistory(req.user.id, 'gig', skill.substring(0, 50), result.description, platform).catch(() => {})
    return res.status(200).json(result)
  } catch (error) {
    console.error('handleGigDescription error:', error.message)
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ message: 'API quota exceeded. Please check your Groq plan.' })
    }
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ message: 'Invalid API key. Please check your configuration.' })
    }
    return res.status(500).json({ message: 'AI service error: ' + error.message })
  }
}

// ── handleChatbot ─────────────────────────────────────────────────────────────

const handleChatbot = async (req, res) => {
  const { message, conversationHistory } = req.body

  if (!message) {
    return res.status(400).json({ message: 'Field required: message' })
  }

  try {
    const result = await chatbotResponse({ message, conversationHistory: conversationHistory || [] })
    saveHistory(req.user.id, 'chat', message.substring(0, 50), result.reply).catch(() => {})
    return res.status(200).json(result)
  } catch (error) {
    console.error('handleChatbot error:', error.message)
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ message: 'API quota exceeded. Please check your OpenAI plan.' })
    }
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ message: 'Invalid API key. Please check your configuration.' })
    }
    return res.status(500).json({ message: 'AI service error: ' + error.message })
  }
}

// ── handlePricing ─────────────────────────────────────────────────────────────

const handlePricing = async (req, res) => {
  const {
    jobTitle, jobDescription,
    skills, serviceType,  // serviceType kept for backward compat
    experience, projectType, complexity,
    estimatedHours, location, deliveryTime,
    platforms, clientBudget,
  } = req.body

  const effectiveSkills = skills || serviceType

  if (!effectiveSkills || !experience || !projectType || !complexity || !location || !deliveryTime) {
    return res.status(400).json({
      message: 'Required fields: skills, experience, projectType, complexity, location, deliveryTime',
    })
  }

  try {
    const result = await generatePricingSuggestion({
      jobTitle, jobDescription,
      skills: effectiveSkills,
      experience, projectType, complexity,
      estimatedHours, location, deliveryTime,
      platforms, clientBudget,
    })
    return res.status(200).json(result)
  } catch (error) {
    console.error('handlePricing error:', error.message)
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ message: 'API quota exceeded. Please check your plan.' })
    }
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ message: 'Invalid API key. Please check your configuration.' })
    }
    return res.status(500).json({ message: 'AI service error: ' + error.message })
  }
}

module.exports = { handleProposal, handleClientReply, handleGigDescription, handleChatbot, handlePricing }
