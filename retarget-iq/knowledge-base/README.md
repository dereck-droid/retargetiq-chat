# Retarget IQ Knowledge Base

## Overview

This knowledge base was automatically generated from Retarget IQ's email support threads and sales call transcripts. It contains 127 high-quality Q&A pairs extracted from 299 email threads and 1 sales call transcript.

**Generated:** 2026-01-31

## Source Data

### Email Threads Processed
- **info@ inbox:** 172 email threads
- **nate@ inbox:** 127 email threads
- **Total threads:** 299

### Thread Classifications
- **SUPPORT:** 132 threads (technical issues, how-to questions, troubleshooting)
- **PRICING:** 52 threads (pricing discussions, proposals, payment)
- **ONBOARDING:** 109 threads (credentials, login, setup)
- **ADMIN:** 6 threads (cancellations, billing issues, administrative)

### Call Transcripts
- **Sales Call - Aaron S:** 1 transcript (44 minutes, prospect questions and feature explanations)

## Knowledge Base Contents

### Total Q&As Extracted: 127

### Categories

1. **Audience Creation & Targeting** - 15 Q&As
   - Creating audiences with multiple filters
   - Combining audiences and exporting data
   - Facebook audience integration
   - SIC code filtering for B2B
   - Multi-topic searches (coming in V2)

2. **Data Enrichment & Pulls** - 22 Q&As
   - Unlimited data credits
   - B2B and B2C data pulls
   - Email validation filters
   - CSV exports and enrichment
   - Data accuracy and quality

3. **White Label Setup** - 8 Q&As
   - White label dashboard customization
   - Logo placement and branding
   - Sub-account setup
   - Domain configuration

4. **Pixel/Tracking Integration** - 4 Q&As
   - Super Pixel installation
   - Website visitor tracking
   - Pixel firing and validation
   - Multiple domain support

5. **API & Technical** - 24 Q&As
   - API endpoint access
   - Webhook integrations
   - CRM connections (HubSpot, Salesforce, etc.)
   - API rate limits and authentication
   - Enrichment API usage

6. **Pricing & Plans** - 7 Q&As
   - Monthly vs quarterly pricing
   - White label pricing ($4000/month)
   - Single license pricing ($500-750/month)
   - API access add-on ($249/month)
   - V1 vs V2 pricing grandfathering

7. **Product Capabilities & Features** - 44 Q&As
   - Intent data explanation
   - Super Pixel capabilities
   - Audience refresh scheduling
   - Integration options
   - V2 platform features (launching Feb 15th)

8. **Competitor Comparisons** - 1 Q&A
   - Comparison with Audience Lab, ZoomInfo, Apollo
   - Data source advantages (Fortune 100 partnership)
   - Unlimited audiences vs competitors

9. **Account & Login Issues** - 1 Q&A
   - Access changes and permissions

10. **Billing & Cancellations** - 1 Q&A
    - Billing issues and account management

## Output Files

### 1. knowledge-base.md
**Format:** Markdown
**Purpose:** Human-readable documentation
**Size:** 1,520 lines

Organized by category with:
- Question as heading
- Answer with full explanation
- Source reference (email thread ID or call transcript)

**Example:**
```markdown
### How do I search so that I get actual b2b saas companies

**Answer:** For B2B SaaS, make sure you are filtering by the right SIC codes or
industry terms in the B2B Intent section. That should tighten up the
results significantly.

**Source:** email-19bf1f9e
```

### 2. knowledge-base.json
**Format:** JSON
**Purpose:** Chat interface / AI assistant integration
**Size:** 1,019 lines

Structured data with:
- Unique FAQ ID
- Question text
- Answer text
- Relevant keywords for search
- Source reference

**Example:**
```json
{
  "id": "faq-005",
  "question": "How do I search so that I get actual b2b saas companies",
  "answer": "For B2B SaaS, make sure you are filtering...",
  "keywords": ["intent", "audience"],
  "source": "email-19bf1f9e"
}
```

## Top Question Topics

Based on keyword analysis, the most common question topics are:

1. **work?** - 7 questions (How does X work?)
2. **nate,** - 5 questions (Questions directed to Nate)
3. **intent** - 5 questions (Intent data related)
4. **retargetiq** - 4 questions (General platform questions)
5. **white** - 4 questions (White label setup)
6. **alex,** - 4 questions (Questions directed to Alex)
7. **would** - 4 questions (Feature requests)
8. **integrations** - 4 questions (Integration questions)
9. **could** - 3 questions (Capability questions)
10. **confirm** - 3 questions (Confirmation requests)

## Key Insights from Call Transcript

### Value Propositions (from Sales Call - Aaron S)
- Partnership with Fortune 100 data provider (publicly traded company)
- Access to better data than competitors (waterfall enrichment from 200+ sources)
- Unlimited audiences, updates, and records (no caps like competitors)
- 90% SHA256 match rate for Meta targeting
- $8 CAC for booked meetings (highly targeted ads)
- V1 pricing locked in before Feb 6th (50-75% discount vs V2)

### Common Prospect Questions
- How accurate is the intent data?
- Can I integrate with my CRM (Odoo, HubSpot, etc.)?
- How does the Super Pixel work?
- Can I pull data via API?
- What's the pricing structure?
- How does this compare to Apollo/ZoomInfo?

### Feature Explanations
- **Intent Data:** Real-time signals from 2-week window, graded as Low/Medium/High
- **Super Pixel:** Captures visitor income, net worth, demographics, behaviors
- **API:** Robust API with integrations to HubSpot, Salesforce, Go High Level, etc.
- **White Label:** Full customization with sub-accounts and branding options
- **Audience Building:** Unlimited audiences with daily auto-refresh to Meta/Google/CRM

## Usage Recommendations

### For AI Chat Interface
1. Load `knowledge-base.json` into your vector database or search index
2. Use the `keywords` field for semantic search matching
3. Return the `question` and `answer` fields in chat responses
4. Include `source` for transparency and trust

### For Documentation
1. Use `knowledge-base.md` as a starting point for help docs
2. Organize by category for easy navigation
3. Add screenshots and examples where applicable
4. Link to relevant sources in email threads

### For Training
1. Use Q&As to train support team on common issues
2. Review competitor comparison Q&As for sales training
3. Study pricing Q&As for handling objections
4. Learn feature explanations from call transcript insights

## Maintenance

### Updating the Knowledge Base
To regenerate the knowledge base with new email threads or transcripts:

```bash
cd /home/user/Business/retarget-iq
python3 build_knowledge_base.py
```

The script will:
1. Parse all CSV files for email threads
2. Classify threads by type (SUPPORT, PRICING, ONBOARDING, ADMIN)
3. Extract Q&A pairs from support threads
4. Extract insights from call transcripts
5. Generate both markdown and JSON output files

### Adding New Sources
Edit `build_knowledge_base.py` and update the file paths in the `main()` function:
- Add new CSV export files
- Add new call transcript files
- The script will automatically process and categorize them

## Quality Notes

The extraction process filters out:
- Non-questions (greetings, thank yous, etc.)
- Incomplete sentences or fragments
- URLs and image references
- Email signatures and quoted text
- Duplicate questions

Each Q&A has been:
- Validated as a legitimate question
- Paired with the appropriate answer from Retarget IQ
- Categorized by topic
- Cleaned of email metadata

## Support

For questions about this knowledge base, contact:
- Email: info@retargetiq.com or nate@retargetiq.com
- Source threads available in original CSV exports

---

**Files Generated:**
- `/home/user/Business/retarget-iq/knowledge-base/knowledge-base.md`
- `/home/user/Business/retarget-iq/knowledge-base/knowledge-base.json`
- `/home/user/Business/retarget-iq/knowledge-base/README.md`
- `/home/user/Business/retarget-iq/build_knowledge_base.py` (generator script)
