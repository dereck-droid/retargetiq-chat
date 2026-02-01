# Retarget IQ - Email Knowledge Base Project

**Client:** Retarget IQ (Nate Calhoun & Alex Ciereszko)
**Budget:** $7,000 (upgraded from $4,500)
**Status:** In Development - Data Pipeline Phase
**Priority:** HIGH (Support team needs this urgently)

---

## 🎯 Project Goal

Build an AI-powered support knowledge base system:
1. Extract all support and pricing emails from Gmail
2. Categorize and structure using AI
3. Store in Supabase database
4. Build chat interface for support team (GHL embedded)

---

## 📁 Project Files

| File | Purpose | Status |
|------|---------|--------|
| `IMPLEMENTATION-GUIDE.md` | **START HERE** - Complete step-by-step guide | ✅ Ready |
| `gmail-thread-export-script.js` | Google Apps Script to export Gmail threads to CSV | ✅ Ready |
| `supabase-schema.sql` | SQL commands to create database tables | ✅ Ready |
| `n8n-workflow-design.md` | Detailed n8n workflow with AI prompts | ✅ Ready |

---

## 🚀 Quick Start

### 1. Export Gmail Threads
```bash
# Use Google Apps Script
→ Open Google Sheets
→ Extensions > Apps Script
→ Paste gmail-thread-export-script.js
→ Configure SEARCH_QUERY for support@retargetiq.com
→ Run exportGmailThreadsToSheet()
→ Download as CSV
```

### 2. Set Up Supabase Database
```bash
# Create database tables
→ Go to supabase.com
→ Create new project
→ SQL Editor > New Query
→ Paste supabase-schema.sql
→ Run script
```

### 3. Build n8n Workflow
```bash
# Process emails with AI
→ Follow n8n-workflow-design.md
→ Add OpenAI/Anthropic credentials
→ Build workflow (10 nodes)
→ Test with sample CSV
→ Run full import
```

### 4. Client Review
```bash
# Get approval
→ Give Nate/Alex access to Supabase
→ Review AI categorization
→ Approve threads for KB
```

### 5. Build Chat Interface (Next Phase)
```bash
# Coming soon
→ RAG system with embeddings
→ Branded UI
→ GHL integration
```

---

## ⏱️ Time Estimates

| Phase | Time | Status |
|-------|------|--------|
| Gmail Export Setup | 30-60 min | ⏳ Not Started |
| Supabase Database Setup | 30 min | ⏳ Not Started |
| n8n Workflow Build | 2-3 hours | ⏳ Not Started |
| Full Import & Testing | 1-2 hours | ⏳ Not Started |
| Client Review | 1-2 hours (their time) | ⏳ Not Started |
| **Total (Data Pipeline)** | **5-8 hours** | ⏳ Not Started |
| Chat Interface | 8-12 hours | ⏳ Next Phase |

---

## 📊 Current Status

### ✅ Completed
- Solution architecture designed
- Google Apps Script written and documented
- Supabase schema created with full features
- n8n workflow designed with AI prompts
- Implementation guide written

### ⏳ To Do (This Weekend/Week)
1. Run Gmail export script
2. Create Supabase project and tables
3. Build n8n workflow
4. Test with sample data
5. Run full import
6. Send to Nate/Alex for review

### 📅 Next Phase (After Data Review)
- Build chat interface with RAG system
- Brand for Retarget IQ
- Embed in GoHighLevel
- Train support team
- Monitor and optimize

### 🔗 External Repository: Chat Interface
The chat interface is maintained in a separate repository for Vercel deployment:
- **Local path:** `/home/user/retargetiq-chat/`
- **GitHub:** `dereck-droid/retargetiq-chat` (create this repo)
- **Stack:** React + Vite + Tailwind + reachat
- **Deployment:** Vercel

---

## 💡 Key Technical Decisions

### Why Google Apps Script?
- Free, no external tools needed
- Direct Gmail API access
- Handles threading automatically
- Easy for client to run updates themselves

### Why Supabase?
- Free tier sufficient
- Built-in auth and APIs
- Vector search support (pgvector)
- Real-time capabilities
- Easy client access for review

### Why n8n?
- Visual workflow (easier to debug)
- Built-in AI nodes (OpenAI, Claude)
- Error handling and retries
- Can be reused for ongoing imports

### AI Model Choice
- **OpenAI GPT-4 Turbo:** Better at structured output, faster
- **Claude 3.5 Sonnet:** Often more accurate for classification
- Recommend: Start with GPT-4, switch to Claude if accuracy issues

---

## 🎯 Success Criteria

### Data Pipeline
- [ ] >90% of support emails exported
- [ ] >85% AI categorization accuracy
- [ ] <5% duplicate threads
- [ ] Zero data loss

### Business Impact (Post-Chat Interface)
- [ ] Support response time reduced 50%
- [ ] Support team handles 2x volume
- [ ] Consistent answer quality
- [ ] Faster new hire ramp-up

---

## 📞 Client Context

### Why This Matters
- Recently acquired (cash flow no longer an issue)
- Rapid growth: 20 new clients, 10-15 sales calls/day
- 2 new support hires starting immediately
- Need knowledge base ASAP for support scaling

### Relationship
- Existing client (you're admin on their GHL)
- High trust (paid $7K immediately)
- Potential for larger Lead Supercharger partnership ($4-8K/month recurring)
- This project proves your capability for bigger deal

### Communication
- WhatsApp group (fast, casual)
- Responsive and engaged
- Open to iteration and feedback

---

## 🐛 Common Issues & Solutions

**Issue:** Apps Script times out
**Fix:** Reduce MAX_THREADS to 250, add date filters

**Issue:** AI classification inaccurate
**Fix:** Tune prompt, add examples, try Claude 3.5

**Issue:** Supabase duplicate key error
**Fix:** Add deduplication check in n8n (see workflow design)

**Issue:** OpenAI rate limits
**Fix:** Increase batch delay, reduce batch size

---

## 📚 Resources

### Documentation
- [Google Apps Script Docs](https://developers.google.com/apps-script)
- [Supabase Docs](https://supabase.com/docs)
- [n8n Docs](https://docs.n8n.io/)
- [OpenAI API](https://platform.openai.com/docs)

### Tools Used
- **Gmail API** - Email thread export
- **Google Apps Script** - Automation
- **Supabase** - PostgreSQL database + auth
- **n8n** - Workflow automation
- **OpenAI GPT-4** - AI classification
- **GoHighLevel** - Iframe embedding

---

## 🎉 Let's Build This!

**Start with:** `IMPLEMENTATION-GUIDE.md` - it has everything you need.

**Estimated completion:** This weekend + early next week

**Next milestone:** Client review by [DATE TBD]

---

*Last updated: 2026-01-30*
*Project files located: `/home/user/Business/retarget-iq/`*
