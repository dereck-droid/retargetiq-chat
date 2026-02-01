# Retarget IQ - Implementation Guide

**Project Status:** Knowledge base and templates complete, ready for deployment
**Client:** Nate Calhoun & Alex Ciereszko (Retarget IQ)
**Budget:** $7,000
**Completion Date:** January 31, 2026

---

## Phase 1: AI Support Chat Interface (CURRENT - Ready to Build)

### Objective
Deploy AI-powered chat interface using the knowledge base for 2 new support hires.

### Deliverables Ready
- ✅ `knowledge-base.json` (127 Q&As across 10 categories)
- ✅ `knowledge-base.md` (human-readable version)
- ✅ `SAMPLE_QAs.md` (curated examples)
- ✅ `STATISTICS.md` (detailed analysis)

### Implementation Steps

#### 1. Choose Chat Platform
**Options:**
- **Voiceflow** (recommended for speed)
  - Import knowledge-base.json
  - Built-in analytics
  - Easy GoHighLevel embedding
  - Est. setup time: 2-4 hours

- **Custom Build** (Anthropic API + React)
  - Full control and customization
  - Use Claude 3.5 Sonnet for responses
  - RAG implementation with knowledge base
  - Est. setup time: 1-2 days

- **ChatBot.com or similar**
  - Quick deployment
  - Limited customization
  - Est. setup time: 1-2 hours

#### 2. Technical Implementation

**If using custom build:**
```javascript
// Basic RAG approach
import Anthropic from '@anthropic-ai/sdk';
import knowledgeBase from './knowledge-base.json';

async function generateResponse(userQuery) {
  // 1. Semantic search for relevant Q&As
  const relevantFAQs = searchKnowledgeBase(userQuery, knowledgeBase);

  // 2. Build context from top 3-5 matches
  const context = relevantFAQs.map(faq =>
    `Q: ${faq.question}\nA: ${faq.answer}`
  ).join('\n\n');

  // 3. Call Claude with context
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `You are a Retarget IQ support assistant. Use this knowledge base to answer the question.

Knowledge Base:
${context}

User Question: ${userQuery}

Provide a helpful, concise answer based on the knowledge base. If the question isn't covered, politely say so and offer to escalate to a human.`
    }]
  });

  return response.content[0].text;
}

function searchKnowledgeBase(query, kb) {
  // Simple keyword matching (upgrade to embeddings for production)
  const queryLower = query.toLowerCase();
  const scored = kb.categories.flatMap(cat =>
    cat.faqs.map(faq => ({
      ...faq,
      score: faq.keywords.filter(kw => queryLower.includes(kw)).length
    }))
  );

  return scored
    .filter(faq => faq.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
```

#### 3. Branding & Styling
**Retarget IQ Brand Colors:**
- Check their website: retargetiq.com
- Match color scheme to existing platform
- Use professional, clean UI
- Mobile-responsive design

#### 4. GoHighLevel Integration
- Embed chat as iframe in GoHighLevel workspace
- Test with both support hires
- Provide training on when to use AI vs escalate

#### 5. Analytics & Monitoring
Track:
- Questions asked (identify gaps in knowledge base)
- Response accuracy (user thumbs up/down)
- Escalation rate (when AI can't answer)
- Most common topics

### Success Metrics
- 60%+ of questions answered by AI without escalation
- <30 second response time
- 80%+ positive feedback from support team
- Knowledge base gaps identified for improvement

---

## Phase 2: Email Response Templates for VAs (READY - Deploy Immediately)

### Objective
Enable virtual assistants to respond faster with consistent voice using copy-paste templates.

### Deliverables Ready
- ✅ `support-email-templates.md` (11 templates)
- ✅ `email-response-guide.md` (voice & style guide)

### Implementation Steps

#### 1. VA Training (1-2 hours)
**Training Checklist:**
- [ ] Review email-response-guide.md (Retarget IQ voice & tone)
- [ ] Study support-email-templates.md (all 11 templates)
- [ ] Practice: Match 10 sample customer emails to correct templates
- [ ] Practice: Fill in variables (names, emails, passwords, etc.)
- [ ] Review signature formats for each team member
- [ ] Quiz: Common phrases they USE vs. things they NEVER do

#### 2. Template Access System
**Options:**
- **Notion Database** (recommended)
  - Create one page per template
  - Add tags for quick filtering
  - VAs can copy directly from Notion

- **Google Docs**
  - One doc with all templates
  - Bookmark for quick access

- **Text Expander / Snippets**
  - Set up shortcuts (e.g., `:welcome` → Template 1)
  - Fastest option for experienced VAs

#### 3. Quality Assurance Process
**First 2 weeks:**
- Review 100% of VA responses before sending
- Provide feedback on voice/tone matching
- Update templates based on gaps found

**After 2 weeks:**
- Spot-check 20% of responses
- Monthly template refresh based on new patterns

### Success Metrics
- Response time reduced from 5-10 min to 2-3 min (50-70% improvement)
- 90%+ emails use correct template
- Voice/tone consistency across all VAs
- Zero missed required elements (referral line, signatures, etc.)

---

## Phase 3: Pricing Email Automation (READY - Needs n8n Integration)

### Objective
AI auto-generates personalized pricing emails while checking prior communications to honor promised pricing.

### Deliverables Ready
- ✅ `pricing-email-templates.md` (6 templates + pricing grid)
- ✅ `automation-logic.md` (decision tree & AI instructions)

### Implementation Steps

#### 1. Build n8n Workflow
**Workflow Architecture:**
```
Email Trigger (new pricing inquiry)
    ↓
Extract Customer Email & Context
    ↓
Search Prior Communications (Gmail API)
    ↓
Claude AI Node (analyze + generate email)
    ↓
Human Review Queue (if confidence < 85%)
    ↓
Auto-send (if confidence ≥ 85%)
```

#### 2. Claude AI Node Configuration
**Prompt Template:**
```
You are a Retarget IQ sales assistant. Your job is to generate a personalized pricing email.

PRIOR COMMUNICATIONS:
{{ prior_emails }}

CUSTOMER PROFILE:
- Name: {{ customer_name }}
- Email: {{ customer_email }}
- Use case: {{ use_case }}
- Company: {{ company }}
- Asked about: {{ inquiry_topics }}

INSTRUCTIONS:
1. Check prior communications for any promised pricing or special terms
2. If custom pricing was promised, honor it exactly
3. Use the appropriate template from pricing-email-templates.md based on:
   - Customer profile type (see automation-logic.md)
   - Complexity of their inquiry
   - Whether they're ready to purchase or just exploring

4. Personalize by:
   - Referencing their specific use case
   - Mentioning details from prior conversations
   - Recommending the plan that fits their needs
   - Including relevant add-ons (API, VIP Support)

5. Match Retarget IQ voice:
   - Brief and direct (Nate's style for pricing)
   - Grandfathering language if appropriate
   - V2 references where relevant
   - Professional but casual tone

6. Include:
   - Appropriate Stripe payment links
   - Clear next steps
   - Correct signature format

OUTPUT FORMAT:
Return JSON:
{
  "email_subject": "Re: ...",
  "email_body": "...",
  "confidence_score": 0.92,
  "template_used": "Template 1: Initial Pricing Presentation",
  "customer_profile": "Ready Buyer - Standard",
  "pricing_honored": "No prior pricing found" | "Honored custom pricing from [date]",
  "recommended_plan": "Quarterly - $497/mo",
  "add_ons_suggested": ["API Access"],
  "human_review_needed": false,
  "review_reason": null
}

Generate the pricing email:
```

#### 3. Human Review Queue Setup
**When to trigger human review:**
- Confidence score < 85%
- Conflicting pricing in prior communications
- Custom enterprise pricing requested
- White label inquiries (high value)
- Edge cases defined in automation-logic.md

**Review Interface:**
- Slack notification or email alert
- Show: AI-generated email + prior communications + confidence score
- Options: Approve, Edit & Send, Reject & Manual Response

#### 4. Gmail Integration
**Search Prior Communications:**
```javascript
// n8n Code Node
const customerEmail = $json.customer_email;

// Search Gmail for all threads with this customer
const gmailQuery = `from:${customerEmail} OR to:${customerEmail}`;

// Use Gmail API node to fetch threads
// Extract: pricing mentions, custom terms, promises made
```

#### 5. Testing Protocol
**Test Cases:**
1. New customer, no prior communications
2. Customer with prior pricing discussion (honor it)
3. Customer promised custom pricing (honor exact terms)
4. White label inquiry (should trigger human review)
5. Edge case: Multiple prior pricing discussions with different terms

### Success Metrics
- 95%+ time reduction in pricing email creation
- 100% accuracy honoring prior pricing promises
- 85%+ confidence score on average
- <15% requiring human review
- Zero instances of conflicting pricing sent

---

## Phase 4: Onboarding Automation (FUTURE UPSELL - $3-5K)

### Opportunity Identified
From email analysis:
- **109 onboarding emails** found (36% of total volume)
- Heavy manual work: credentials creation, welcome emails, training video sending
- 50+ intro calls scheduled
- 20+ login credential emails sent

### Potential Scope
1. **Auto-send welcome email** after payment confirmed (Stripe webhook)
2. **Auto-generate credentials** (password pattern: FirstNameRocks123)
3. **Personalized training video selection** based on use case
4. **Follow-up sequence** (Day 1, Day 3, Day 7)
5. **Setup completion tracking**

### ROI for Client
- Save 15-20 min per new customer
- 10-15 new customers/day = 2.5-5 hours/day saved
- Consistent onboarding experience
- Faster time-to-value for customers

### Pitch Timing
After Phase 1-3 are successfully deployed and client sees value.

---

## Deployment Checklist

### Phase 1: Chat Interface
- [ ] Choose platform (Voiceflow recommended)
- [ ] Import knowledge-base.json
- [ ] Configure RAG or semantic search
- [ ] Apply Retarget IQ branding
- [ ] Test with 20 sample questions
- [ ] Embed in GoHighLevel
- [ ] Train support team (2 hours)
- [ ] Deploy to production
- [ ] Set up analytics tracking

### Phase 2: VA Email Templates
- [ ] Create template access system (Notion/Docs)
- [ ] Schedule VA training session (1-2 hours)
- [ ] Provide practice exercises
- [ ] Review first 20 VA responses
- [ ] Collect feedback and refine
- [ ] Deploy fully

### Phase 3: Pricing Automation
- [ ] Build n8n workflow (Email → AI → Review)
- [ ] Configure Claude AI node with prompt
- [ ] Set up Gmail API integration
- [ ] Create human review queue (Slack/Email)
- [ ] Test with all 6 test cases
- [ ] Run parallel for 1 week (AI generates, human sends)
- [ ] Review accuracy
- [ ] Enable auto-send for high confidence
- [ ] Monitor and iterate

---

## Support & Maintenance

### Knowledge Base Updates
Run `build_knowledge_base.py` when:
- New support patterns emerge
- Product updates (V2 launch)
- New FAQs from chat analytics
- Pricing changes

### Email Template Updates
Update templates when:
- Voice/tone shifts
- New team members join
- Product offerings change
- New edge cases discovered

### Monitoring
**Weekly:**
- Review chat analytics for knowledge gaps
- Check pricing automation accuracy
- Collect VA feedback on templates

**Monthly:**
- Refresh knowledge base with new data
- Update templates based on patterns
- Review automation confidence scores
- Identify opportunities for improvement

---

## Technical Requirements

### Chat Interface
- Anthropic API key (Claude 3.5 Sonnet)
- Hosting (Vercel, Netlify, or Voiceflow)
- Domain/subdomain for embedding
- Analytics tool (Mixpanel, Amplitude, or built-in)

### Email Automation
- n8n instance (self-hosted or cloud)
- Gmail API credentials
- Anthropic API key
- Slack webhook (for human review queue)
- Stripe webhook (for onboarding Phase 4)

### Access Required
- Retarget IQ Gmail accounts (API access)
- GoHighLevel account (for embedding)
- Stripe account (payment links, webhooks)
- Brand assets (logo, colors, fonts)

---

## Client Handoff

### Documentation to Provide
1. This implementation guide
2. PROJECT-METRICS.md (showcase value delivered)
3. Knowledge base files + usage instructions
4. Email template files + VA training materials
5. Automation logic documentation

### Training Sessions
1. **Support Team** (1 hour): How to use chat interface
2. **VAs** (2 hours): Email templates + voice/tone
3. **Admin** (1 hour): How to update knowledge base
4. **Technical** (1 hour): n8n workflow maintenance (if applicable)

### Ongoing Support Options
- **Bronze:** Email support for questions
- **Silver:** Monthly knowledge base refresh
- **Gold:** Full automation monitoring + optimization

---

## Timeline Estimates

**Phase 1: Chat Interface**
- Setup & deployment: 1-2 days
- Testing & refinement: 2-3 days
- Training: 1 day
- **Total: 4-6 days**

**Phase 2: VA Templates**
- Setup access system: 0.5 days
- VA training: 0.5 days
- QA period: 1-2 weeks (parallel to other work)
- **Total: 1 day + ongoing QA**

**Phase 3: Pricing Automation**
- n8n workflow build: 2-3 days
- Testing: 1-2 days
- Parallel run: 1 week
- **Total: 1-2 weeks**

**Total Project Timeline: 2-3 weeks for full deployment**

---

## Questions for Client Before Starting

1. **Chat Interface:**
   - Preferred platform? (Voiceflow vs custom build)
   - Brand colors, logo, fonts?
   - Where to embed? (GoHighLevel URL/location)

2. **Email Automation:**
   - n8n instance available or need to set up?
   - Who should receive human review notifications?
   - What confidence threshold for auto-send? (Recommend 85%)

3. **Access & Credentials:**
   - Gmail API access approval
   - Stripe webhook setup assistance
   - GoHighLevel admin access for embedding

4. **Training:**
   - When to schedule VA training?
   - Who are the 2 support hires?
   - Preferred training format? (Live vs recorded)

---

**This implementation guide should be reviewed with Nate/Alex before beginning deployment.**
