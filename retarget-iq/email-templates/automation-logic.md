# Automation Logic for AI-Generated Pricing Emails

## Overview

This document provides the decision tree, variable extraction logic, and automation rules for AI to generate pricing emails that maintain Retarget IQ's authentic voice.

---

## Decision Tree: Which Template to Use

### Step 1: Analyze Prior Communications

**Check email history for:**
1. Has there been a demo/discovery call? (Look for: calendar invites, "launch call," meeting links)
2. What questions has the customer asked? (Extract key topics)
3. What's their use case? (Agency, direct user, reseller)
4. Have they explicitly asked for pricing? (Direct request vs general inquiry)
5. What stage are they in? (Researching, comparing, ready to buy)

### Step 2: Determine Customer Profile

**Profile A: Quick Buyer**
- Asked directly for pricing
- Had demo call recently (within 3 days)
- Minimal back-and-forth
- Action: Use **Template 1** (Initial Pricing - Brief)

**Profile B: Detail-Oriented**
- Asking about features, add-ons, options
- Multiple questions in email thread
- Comparing plans
- Action: Use **Template 2** (Full Pricing Breakdown)

**Profile C: Agency/White Label Prospect**
- Mentioned: agency, clients, reselling, multiple businesses, white label
- Asked about seats or branding
- Looking at larger plans
- Action: Use **Template 3** (White Label Pricing)

**Profile D: Just Needs Link**
- Already discussed pricing (check history)
- Explicitly said "send me the link"
- Ready to purchase
- Action: Use **Template 4** (Payment Link Follow-Up)

**Profile E: On the Fence**
- Showed interest but didn't commit
- Comparing to competitors (check for competitor names mentioned)
- Concerned about price or value
- Action: Use **Template 1** with **Template 6** elements (add grandfathering urgency)

### Step 3: Select Template

```
IF customer_asked_for_link AND pricing_already_discussed:
    → Template 4 (Payment Link Follow-Up)

ELSE IF customer_mentioned_white_label OR agency_use_case OR needs_multiple_seats:
    → Template 3 (White Label Pricing)

ELSE IF customer_asked_detailed_questions OR asked_about_add_ons:
    → Template 2 (Full Pricing Breakdown)

ELSE IF customer_ready_to_buy AND minimal_questions:
    → Template 1 (Initial Pricing - Brief)

ELSE IF customer_comparing_competitors OR hesitant:
    → Template 1 + Template 6 (Add grandfathering urgency)

DEFAULT:
    → Template 2 (Full Pricing Breakdown - safe default)
```

---

## Variable Extraction Logic

### From Prior Communications

**Extract These Variables:**

1. **[FIRST_NAME]**
   - Source: From email "From:" field or signature
   - Logic: Extract first name only (before space)
   - Example: "Jeff Cline" → "Jeff"
   - Fallback: Use full name if unclear

2. **[USE_CASE]**
   - Source: Prior email content
   - Look for keywords: agency, clients, mortgage, real estate, construction, leads, etc.
   - Store for potential personalization
   - Example: "targeting decision-makers at construction companies"

3. **[PLAN_TYPE]**
   - Source: Customer questions or needs
   - Logic:
     - IF mentioned "multiple clients" OR "seats" → White Label
     - IF mentioned "API" → Core + API add-on
     - IF mentioned "support" OR "help getting started" → Core + VIP Support
     - ELSE → Core platform
   - Default: Core Monthly

4. **[STRIPE_LINK]**
   - Source: Plan type determined above
   - Mapping:
     - Monthly Core → `https://buy.stripe.com/7sY9AUc6U65w1uM36F4gg0l`
     - Quarterly Core → `https://buy.stripe.com/bJe14oef2fG6ehy6iR4gg0f`
     - API Add-on → `https://buy.stripe.com/9B64gA2wk2Tk5L25eN4gg0j`
     - White Label → (Contact manually or custom link)

5. **[SENDER_NAME]**
   - Source: Email routing rules
   - Logic:
     - If from nate@ inbox → "Nate"
     - If from info@ inbox → "Cindy"
     - If from alex@ inbox → "Alex"
   - Match signature style to sender

6. **[MENTIONED_API]**
   - Source: Email content analysis
   - Keywords: "API," "automation," "integration," "webhook," "automated"
   - Boolean: true/false
   - Use to include API pricing section

7. **[COMPETITOR_MENTIONED]**
   - Source: Email content
   - Keywords: competitor names, "other platform," "comparing"
   - Store name if mentioned
   - Use for competitive response elements

---

## Personalization Rules

### Rule 1: Reference Their Use Case

**IF use_case detected:**
```
Add sentence: "Based on your [use_case], the [recommended_plan] would be the best fit."

Example: "Based on your construction company targeting, the quarterly plan would be the best fit."
```

**WHERE to add:**
- After standard pricing
- Before payment link
- Keep it brief (one sentence)

### Rule 2: Emphasize Relevant Features

**IF agency/white_label_prospect:**
- Lead with white label pricing
- Emphasize: unlimited seats expansion, full branding control, API included
- Mention: 48-hour setup time

**IF mentioned API:**
- Include API add-on pricing prominently
- Mention: Current vs V2 API capabilities
- Include API docs link

**IF mentioned support/help:**
- Emphasize VIP Support option
- Describe: One-on-one Google Meets, strategy help
- Position as optional add-on

### Rule 3: Adjust Urgency Level

**High Urgency (near V2 launch - Feb 15th):**
```
Add: "We're releasing V2 in mid-February, and pricing will increase at that point. Locking in now ensures you stay on the current rate long-term."
```

**Medium Urgency (comparing competitors):**
```
Add grandfathering emphasis: "Any plan you start now is fully grandfathered. That means:
- Your price will never increase
- You'll keep this rate permanently, even as features and data expand"
```

**Low Urgency (just researching):**
```
Keep neutral: "Let me know if you have any questions."
```

### Rule 4: Match Response Length to Theirs

**IF customer_email_length < 50 words:**
- Use brief template
- 3-5 short paragraphs max
- Get to the point fast

**IF customer_email_length > 200 words:**
- Can use full breakdown template
- They want details
- Include all options

**IF customer_asked_multiple_questions:**
- Answer all questions
- Use numbered responses if they numbered questions
- Be thorough

---

## Context Requirements by Template

### Template 1 (Initial Pricing - Brief)

**Required Context:**
- First name
- Demo/call has occurred (within last week)
- No detailed pricing discussion yet

**Check For:**
- Recent calendar event in thread
- References to "demo," "call," "meeting"
- First time pricing is being shared

**Don't Use If:**
- No demo/call evidence
- Pricing already discussed in detail
- Customer already knows the price

### Template 2 (Full Pricing Breakdown)

**Required Context:**
- First name
- Customer asked about "all options" or "complete pricing"
- OR customer asked about specific add-ons

**Check For:**
- Questions about VIP Support, API, features
- Comparing plans/tiers
- Wants to understand everything available

**Don't Use If:**
- Customer already decided on plan
- Just needs payment link
- Quick transaction preferred

### Template 3 (White Label Pricing)

**Required Context:**
- First name
- White label indicators detected
- Agency/reseller use case confirmed

**Check For:**
- Keywords: white label, agency, clients, resell, rebrand, multiple businesses
- Questions about seats, branding, custom domains
- Mention of serving other businesses

**Don't Use If:**
- Single user use case
- No agency indicators
- Direct-to-consumer business

### Template 4 (Payment Link Follow-Up)

**Required Context:**
- First name
- Pricing already discussed (check thread history)
- Customer explicitly requested link

**Check For:**
- "Send me the link"
- "Payment link please"
- "Ready to move forward"
- Prior pricing discussion in thread

**Don't Use If:**
- No prior pricing discussion
- First pricing inquiry
- Customer unclear on what they're buying

---

## Edge Cases and How to Handle

### Edge Case 1: Customer Mentions Multiple Needs

**Scenario:** "I need API and also want to know about white label for my agency"

**Logic:**
1. Determine primary need (usually the larger investment)
2. Present white label pricing (includes API)
3. Note that API is included in white label
4. Avoid confusion of separate pricing

**Template Choice:** Template 3 (White Label)
**Customization:** Explicitly state "API Access included for each account"

### Edge Case 2: Customer Comparing to Competitor

**Scenario:** Email mentions "Audience IQ" or other competitor

**Logic:**
1. Use standard pricing template (don't address competitor in pricing email)
2. IF they ask direct comparison, add data quality paragraph
3. Use: "All I can say is our base layer data source is the same provider that the Fortune 100 and Fortune 500 companies use."
4. Don't bash competitor by name

**Template Choice:** Template 1 or 2
**Customization:** May add competitive positioning if they directly asked

### Edge Case 3: Customer Asked About Pricing Days/Weeks Ago

**Scenario:** Old pricing inquiry in thread, no response sent, now following up

**Logic:**
1. Check if demo call occurred
2. If yes, treat as normal pricing email
3. If no, acknowledge delay briefly: "Apologies for the delay!"
4. Then proceed with standard pricing

**Template Choice:** Based on context, but acknowledge delay
**Customization:** Add brief apology opening

### Edge Case 4: Customer Already Has Account, Asking About Upgrade

**Scenario:** Current customer wants to add API or upgrade to white label

**Logic:**
1. Present only the add-on pricing, not full platform
2. For API: Just the $297/month add-on
3. For white label: Explain it's a different plan level
4. May need manual handling for transition

**Template Choice:** Custom - use pieces from Template 2
**Customization:** Focus only on incremental cost

### Edge Case 5: Customer Asks "What's the Price?" with No Context

**Scenario:** Very brief inquiry, no demo, no context

**Logic:**
1. Don't send pricing immediately
2. AI should flag for human review
3. OR respond asking about their use case first
4. Get demo scheduled before pricing

**Template Choice:** Don't send pricing template
**Alternative:** "Happy to walk you through pricing! Do you have time for a quick call to discuss your use case?"

### Edge Case 6: Customer Mentions Budget Constraint

**Scenario:** "What's your pricing? My budget is $X"

**Logic:**
1. If budget ≥ $797/month → Present monthly plan
2. If budget ≥ $500/month → Present quarterly plan (emphasize monthly equivalent)
3. If budget < $500/month → Flag for human, may need custom pricing
4. Don't immediately discount without human approval

**Template Choice:** Template 1, choose monthly vs quarterly based on budget
**Customization:** Lead with the plan that fits their budget

### Edge Case 7: Pricing Changed (This is Time-Sensitive)

**Scenario:** Prices in templates don't match current prices

**Logic:**
1. AI should flag if pricing differs from templates
2. Human must update templates before automation continues
3. Never guess at pricing
4. When in doubt, flag for human review

**Template Choice:** ERROR - Manual review required
**Action:** Alert human operator

### Edge Case 8: Multiple Team Members in Thread

**Scenario:** Email thread has Nate, Alex, Cindy all CC'd

**Logic:**
1. Check who customer most recently replied to
2. Match sender to that person
3. OR use whoever typically handles pricing (Nate)
4. Keep all same people CC'd in response

**Template Choice:** Any appropriate template
**Customization:** Sender = most recent Retarget IQ team member in thread

---

## AI Checks Before Sending

### Pre-Flight Checklist

**1. Variable Validation**
```python
REQUIRED_VARIABLES = ['FIRST_NAME', 'STRIPE_LINK', 'SENDER_NAME']

for var in REQUIRED_VARIABLES:
    if var in template and not replaced:
        FLAG_FOR_REVIEW("Missing variable: {var}")
```

**2. Context Validation**
```python
if using_template_4:  # Payment link follow-up
    if not pricing_discussed_in_thread:
        FLAG_FOR_REVIEW("Payment link sent without prior pricing discussion")

if using_template_3:  # White label
    if not white_label_indicators_found:
        FLAG_FOR_REVIEW("White label pricing sent without clear use case")
```

**3. Link Validation**
```python
if STRIPE_LINK in email:
    if not STRIPE_LINK.startswith("https://buy.stripe.com/"):
        FLAG_FOR_REVIEW("Invalid Stripe link format")
```

**4. Tone Validation**
```python
FORBIDDEN_PHRASES = [
    "Dear Sir/Madam",
    "To Whom It May Concern",
    "Sincerely yours",
    "Warm regards"
]

for phrase in FORBIDDEN_PHRASES:
    if phrase in email_body:
        FLAG_FOR_REVIEW("Incorrect tone detected: {phrase}")
```

**5. Completeness Check**
```python
if template_number in [1, 2, 3]:  # Pricing templates
    if "grandfathered" not in email_body.lower():
        FLAG_FOR_REVIEW("Missing grandfathering language")

    if SENDER_NAME == "Cindy" and "Know a business?" not in email_body:
        FLAG_FOR_REVIEW("Missing referral line for Cindy's signature")
```

---

## Personalization Points by Priority

### High Priority (Always Do If Possible)
1. **Use their first name** - Required in greeting
2. **Match sender signature style** - Cindy vs Nate formats are different
3. **Include correct payment link** - Based on plan type
4. **Reference demo/call** - If it occurred

### Medium Priority (Do When Context Allows)
5. **Mention their use case** - If clearly stated in prior emails
6. **Emphasize relevant features** - API if they asked about it
7. **Add urgency if appropriate** - Near V2 launch date
8. **Reference specific questions** - If they asked multiple things

### Low Priority (Nice to Have)
9. **Industry-specific example** - If they mentioned their industry
10. **Timeline personalization** - If they mentioned when they want to start
11. **Volume/scale personalization** - If they mentioned traffic or data needs

---

## Decision Matrix: Automation vs Human Review

### Fully Automate (High Confidence)

**Criteria:**
- Template 1 or 2 selected
- All variables extracted successfully
- Demo call confirmed in thread
- Customer explicitly asked for pricing
- No edge cases detected
- All validation checks passed

**Action:** Send email automatically

### Automate with Notification (Medium Confidence)

**Criteria:**
- Template selected with good confidence
- All variables extracted
- Minor personalization opportunities missed
- Standard scenario

**Action:**
- Send email automatically
- Notify human: "Pricing email sent to [customer]"
- Include email copy for review

### Human Review Required (Low Confidence)

**Criteria:**
- Edge case detected (see Edge Cases section)
- Missing critical variables
- Competitor mentioned
- Budget constraint mentioned
- No demo/call evidence
- White label pricing but weak indicators
- Multiple decision points unclear

**Action:**
- Draft email but don't send
- Flag for human review
- Provide reasoning: "REVIEW NEEDED: [reason]"
- Include draft for human to edit/approve

### Never Automate (Safety Check)

**Criteria:**
- Pricing doesn't match templates (outdated)
- Customer explicitly asked for human contact
- Legal/contract language in thread
- Complaint or frustration detected
- Request for custom pricing/discounts
- Enterprise-level inquiry (>$10k/month)

**Action:**
- Don't draft
- Immediately escalate to human
- Alert: "MANUAL HANDLING REQUIRED: [reason]"

---

## Learning & Improvement

### Track These Metrics

**Email Performance:**
1. Response rate to pricing emails
2. Conversion rate (pricing sent → payment received)
3. Time to payment after pricing sent
4. Template usage distribution
5. Human override rate (AI suggested X, human used Y)

**Quality Indicators:**
1. How often are drafts edited before sending?
2. What edits are most common?
3. Which templates perform best?
4. Which edge cases are most common?

**Failure Points:**
1. When does AI get template choice wrong?
2. Which variables are hardest to extract?
3. What context clues are being missed?
4. When do humans have to step in?

### Continuous Improvement Loop

```
1. AI generates pricing email
2. Human reviews/edits/approves
3. Log: original vs final version
4. Analyze: what changed and why
5. Update: extraction rules or templates
6. Retrain: AI on new patterns
7. Repeat
```

**Update Frequency:**
- Weekly review of flagged cases
- Monthly analysis of metrics
- Quarterly template updates
- Immediate updates for pricing changes

---

## Special Scenarios

### Scenario: Customer on Call but Didn't Commit

**Situation:** Had demo, seemed interested, but didn't ask for pricing

**Timing:**
- Wait 4-24 hours after call
- Don't send pricing immediately after call
- Let them reach out OR
- Follow up asking if they have questions

**Template:** If they ask for pricing after call → Template 1

### Scenario: Customer Went Dark After Pricing

**Situation:** Sent pricing, no response for 3+ days

**AI Action:** Flag for human follow-up
**Don't:** Send automated "just checking in"
**Do:** Let human craft personalized follow-up

### Scenario: Customer Negotiating Price

**Situation:** "That's too expensive" or "Can you do better?"

**AI Action:** Immediately flag for human
**Don't:** Send automated discount
**Template:** N/A - human handles all negotiations

### Scenario: Referral or Partner Deal

**Situation:** Mentioned by Jon, marked as referral, partner pricing

**AI Action:** Flag for human - special pricing may apply
**Don't:** Send standard pricing
**Check:** For keywords: referral, partner, affiliate, JV

---

## Integration with Support Templates

### When Customer Needs Both Support and Pricing

**Example:** "My pixel isn't working and also what's your pricing?"

**Logic:**
1. Prioritize support issue first
2. Address pricing second OR in separate email
3. Don't combine templates unless very brief

**Approach:**
```
Hi [Name],

[Address support issue using support template]

[2-3 line breaks]

[Address pricing using brief pricing template OR]
[If lengthy pricing needed: "I'll send over pricing in a separate email so this doesn't get too long!"]
```

### When to Split into Multiple Emails

**Split if:**
- Support issue is complex AND pricing request is detailed
- Multiple topics that would make email >300 words
- Different team members should handle each part

**Don't split if:**
- Quick answer to both
- Related topics (e.g., "what features do you have and how much?")

---

## Final AI Automation Rules

### Golden Rules

1. **When in doubt, flag for human review** - Better safe than sorry
2. **Never guess at pricing** - Must match exact template pricing
3. **Always validate variables** - No [BRACKETS] in sent emails
4. **Match the voice** - Casual but professional, like the team
5. **Personalize when possible** - But generic is better than wrong
6. **Check the context** - Read the whole thread, not just last email
7. **Respect the timing** - Don't spam pricing if they just got it
8. **Include signature** - Match the sender's actual signature style
9. **Link accuracy critical** - Wrong payment link is a disaster
10. **Flag edge cases** - Unusual scenarios need human judgment

### Confidence Thresholds

**Send Automatically:**
- Confidence ≥ 95%
- All checks passed
- Standard scenario
- Clear template match

**Draft for Review:**
- Confidence 70-94%
- Most checks passed
- Some ambiguity
- Could go either way

**Flag for Human:**
- Confidence < 70%
- Failed critical checks
- Edge case detected
- Missing key context

### Emergency Stops

**Immediately halt and alert human if:**
1. Pricing in template ≠ current pricing
2. Legal terms detected in thread
3. Explicit request for human contact
4. Angry/frustrated customer language
5. Enterprise deal (>$10k/month mentioned)
6. Contract or SLA mentioned
7. Security or compliance questions
8. Data privacy concerns raised

---

## Testing Protocol

### Before Going Live

**Test Scenarios:**
1. Standard pricing request after demo
2. White label inquiry from agency
3. API-only add-on request
4. Customer comparing to competitor
5. Budget constraint mentioned
6. Multiple questions in one email
7. Old thread resurrection
8. No demo, cold pricing request

**For Each Test:**
- Run AI automation
- Compare to expected output
- Check: template choice, variables, personalization
- Verify: links, signature, tone
- Human grades: A (perfect), B (good), C (needs work), F (wrong)

**Passing Criteria:**
- 90%+ A or B grades
- 0% F grades (wrong template or critical error)
- <10% edge cases requiring human override

### Ongoing Quality Assurance

**Daily:**
- Review all automated emails sent
- Check for any customer confusion/questions

**Weekly:**
- Analyze human override patterns
- Update templates if needed
- Retrain on new patterns

**Monthly:**
- Full metrics review
- Template performance analysis
- Process improvement identification

---

## Appendix: Quick Reference Codes

### Template Selection Codes
```
T1 = Initial Pricing (Brief)
T2 = Full Pricing Breakdown
T3 = White Label Pricing
T4 = Payment Link Follow-Up
T5 = Access Timeline (use with T4)
T6 = Grandfathering Urgency (add to T1 or T2)
```

### Use Case Codes
```
UC_AGENCY = Agency/reseller model
UC_DIRECT = Direct user, single business
UC_TECH = Technical user, API focused
UC_SCALE = High volume, enterprise-level
UC_STARTER = Small business, just starting
```

### Confidence Levels
```
HIGH = 95-100% (auto-send)
MED = 70-94% (draft for review)
LOW = 50-69% (flag for human)
NONE = <50% (immediate human escalation)
```

### Flag Codes for Human Review
```
FLAG_EDGE = Edge case detected
FLAG_MISS = Missing critical variable
FLAG_CONF = Low confidence template choice
FLAG_COMP = Competitor mentioned
FLAG_NEG = Negotiation/discount request
FLAG_TECH = Technical complexity
FLAG_CUSTOM = Custom pricing needed
FLAG_URGENT = Urgent customer request
FLAG_ERROR = System error or validation failed
```

---

## Summary Workflow

```
1. Receive email inquiry
   ↓
2. Extract context from thread history
   ↓
3. Identify customer profile (A-E)
   ↓
4. Select template (T1-T6)
   ↓
5. Extract variables (name, use case, etc.)
   ↓
6. Apply personalization rules
   ↓
7. Run validation checks
   ↓
8. Calculate confidence level
   ↓
9. Decision:
   - HIGH → Send automatically
   - MED → Draft for review
   - LOW/NONE → Flag for human
   ↓
10. Log for learning & improvement
```

**Result:** Authentic, helpful, on-brand pricing emails that convert.
