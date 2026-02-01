# n8n Workflow Design: Email Thread Categorization & Storage

## Overview
This workflow processes CSV exports of Gmail threads, categorizes them using AI, and stores them in Supabase tables based on type (support or pricing).

---

## Workflow Architecture

```
CSV File Input
    ↓
Read CSV (Read/Parse CSV node)
    ↓
Split Into Batches (optional - for rate limiting)
    ↓
AI Classification (OpenAI/Anthropic node)
    ↓
Route by Category (Switch/IF node)
    ├─→ Support Thread → Supabase (support_threads table)
    └─→ Pricing Thread → Supabase (pricing_threads table)
```

---

## Node-by-Node Configuration

### 1. **Trigger Node**
- **Node Type:** Manual Trigger or Webhook
- **Purpose:** Start the workflow
- **Configuration:** Use Manual for testing, Webhook for automation

### 2. **Read CSV Node**
- **Node Type:** Read Binary File + CSV Parser
- **Purpose:** Load and parse the CSV file
- **Configuration:**
  ```json
  {
    "mode": "readFromUrl",
    "format": "csv",
    "delimiter": ",",
    "headerRow": true
  }
  ```
- **Expected CSV Columns:**
  - `Thread ID`
  - `Subject`
  - `First Message Date`
  - `Last Message Date`
  - `Number of Messages`
  - `Participants`
  - `Complete Thread Content`
  - `Preview (First 200 chars)`

### 3. **Split in Batches** (Optional)
- **Node Type:** Split in Batches
- **Purpose:** Process threads in groups to avoid rate limits
- **Configuration:**
  ```json
  {
    "batchSize": 10,
    "options": {
      "reset": true
    }
  }
  ```

### 4. **AI Classification Node**
- **Node Type:** OpenAI or Anthropic (Claude)
- **Purpose:** Analyze thread and determine category
- **Configuration:**

#### **Using OpenAI (GPT-4):**
```json
{
  "resource": "chat",
  "operation": "message",
  "model": "gpt-4-turbo-preview",
  "messages": {
    "system": [see AI_CLASSIFICATION_PROMPT below],
    "user": "{{ $json['Complete Thread Content'] }}"
  },
  "responseFormat": "json_object",
  "temperature": 0.1
}
```

#### **Using Anthropic (Claude):**
```json
{
  "resource": "chat",
  "model": "claude-3-5-sonnet-20241022",
  "messages": [
    {
      "role": "user",
      "content": [see AI_CLASSIFICATION_PROMPT below]
    }
  ],
  "temperature": 0.1
}
```

---

## AI Classification Prompt

### **System/User Prompt:**

```
You are an AI assistant analyzing customer email threads for a marketing automation company called Retarget IQ.

Your task is to categorize each email thread into ONE of these categories:
1. SUPPORT - Customer support inquiries, technical issues, billing questions, account help
2. PRICING - Sales conversations where pricing/proposals are being discussed
3. UNCLEAR - Cannot determine or doesn't fit either category

For each thread, analyze the content and return a JSON object with this structure:

{
  "category": "SUPPORT" | "PRICING" | "UNCLEAR",
  "confidence": 0.95,
  "reasoning": "Brief explanation of why you chose this category",
  "subcategory": "More specific categorization",
  "key_topics": ["topic1", "topic2", "topic3"],
  "pricing_indicators": {
    "monthly_price": null,
    "quarterly_price": null,
    "annual_price": null,
    "whitelabel_mentioned": false,
    "custom_pricing": false
  }
}

CLASSIFICATION RULES:

**PRICING threads must contain:**
- Explicit pricing amounts ($X, $X/month, etc.)
- Proposal language ("we can offer", "pricing options", "package includes")
- Discussion of service tiers or plans
- Contract terms or payment schedules

**SUPPORT threads typically contain:**
- Questions about existing services/accounts
- Technical issues or bugs
- "How do I...", "I'm having trouble with...", "Can you help me..."
- Billing questions about existing charges
- Account access issues

**UNCLEAR if:**
- Thread is too short to determine intent
- Contains both support and pricing elements equally
- Is internal communication or automated notifications

IMPORTANT:
- Be conservative - if pricing is not explicitly discussed, it's NOT a pricing thread
- Confidence should be 0.80+ for SUPPORT/PRICING, lower for UNCLEAR
- Extract actual pricing numbers when present

Now analyze this email thread:

{{ $json['Complete Thread Content'] }}
```

---

## AI Response Parsing

### **Code Node** (Extract AI Response)
- **Node Type:** Code (JavaScript)
- **Purpose:** Parse AI response and prepare data for Supabase
- **Code:**

```javascript
// Parse AI response
const aiResponse = JSON.parse($input.first().json.choices[0].message.content);
// For Claude, adjust path: $input.first().json.content[0].text

// Get original CSV data
const csvData = $('Read CSV').first().json;

// Prepare base object
const processedData = {
  gmail_thread_id: csvData['Thread ID'],
  subject: csvData['Subject'],
  first_message_date: csvData['First Message Date'],
  last_message_date: csvData['Last Message Date'],
  number_of_messages: parseInt(csvData['Number of Messages']),
  participants: csvData['Participants'].split(', '),
  complete_thread_content: csvData['Complete Thread Content'],
  ai_summary: aiResponse.reasoning,
  ai_confidence_score: aiResponse.confidence,
  key_topics: aiResponse.key_topics || [],
  processed_by: 'n8n-workflow'
};

// Add category-specific fields
if (aiResponse.category === 'PRICING') {
  processedData.pricing_data = aiResponse.pricing_indicators;
  processedData.pricing_tier = aiResponse.subcategory || 'unknown';
} else if (aiResponse.category === 'SUPPORT') {
  processedData.ai_category = aiResponse.subcategory || 'general';
}

// Return with routing info
return {
  json: {
    category: aiResponse.category,
    data: processedData
  }
};
```

---

## Routing & Storage

### **Switch Node** (Route by Category)
- **Node Type:** Switch
- **Purpose:** Route to correct Supabase table
- **Rules:**
  ```
  Rule 0: {{ $json.category }} equals "SUPPORT" → Output 0
  Rule 1: {{ $json.category }} equals "PRICING" → Output 1
  Rule 2: {{ $json.category }} equals "UNCLEAR" → Output 2 (log/skip)
  ```

### **Supabase Node - Support Threads**
- **Node Type:** Supabase
- **Operation:** Insert
- **Table:** `support_threads`
- **Configuration:**
  ```json
  {
    "operation": "insert",
    "table": "support_threads",
    "data": "{{ $json.data }}"
  }
  ```

### **Supabase Node - Pricing Threads**
- **Node Type:** Supabase
- **Operation:** Insert
- **Table:** `pricing_threads`
- **Configuration:**
  ```json
  {
    "operation": "insert",
    "table": "pricing_threads",
    "data": "{{ $json.data }}"
  }
  ```

### **Logging Node (for UNCLEAR)**
- **Node Type:** HTTP Request or Write to File
- **Purpose:** Log unclear threads for manual review
- **Configuration:** POST to webhook or write to log file

---

## Error Handling

### **Error Trigger**
Add error handling nodes after each critical operation:

1. **After AI Node:**
   - Catch API errors (rate limits, timeouts)
   - Retry with exponential backoff
   - Log failed threads to separate file

2. **After Supabase Nodes:**
   - Catch duplicate thread errors (gmail_thread_id already exists)
   - Log constraint violations
   - Continue processing remaining threads

**Example Error Node Configuration:**
```json
{
  "continue": true,
  "output": "append",
  "outputSchema": {
    "error": "{{ $json.error }}",
    "thread_id": "{{ $json.gmail_thread_id }}",
    "timestamp": "{{ $now }}"
  }
}
```

---

## Advanced Features (Optional)

### **Deduplication Check**
Before inserting, check if thread already exists:

```javascript
// In Code node before Supabase insert
const threadId = $json.data.gmail_thread_id;

// Query Supabase to check if exists
const existingThread = await this.helpers.httpRequest({
  method: 'GET',
  url: `${supabaseUrl}/rest/v1/support_threads?gmail_thread_id=eq.${threadId}`,
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  }
});

if (existingThread.length > 0) {
  // Thread exists, skip or update
  return { json: { action: 'skip', reason: 'duplicate' } };
}

return { json: $json };
```

### **Vector Embeddings** (for semantic search)
Add OpenAI Embeddings node before Supabase insert:

```json
{
  "resource": "embeddings",
  "model": "text-embedding-3-small",
  "input": "{{ $json.data.complete_thread_content }}"
}
```

Then add embedding to data:
```javascript
processedData.content_vector = embeddingResponse.data[0].embedding;
```

---

## Testing the Workflow

### **Test Data CSV**
Create a small CSV with 2-3 threads:
- 1 obvious support thread
- 1 obvious pricing thread
- 1 ambiguous thread

### **Validation Steps**
1. Run workflow with test CSV
2. Check n8n execution logs for AI responses
3. Query Supabase to verify data inserted correctly:
   ```sql
   SELECT * FROM support_threads ORDER BY created_at DESC LIMIT 5;
   SELECT * FROM pricing_threads ORDER BY created_at DESC LIMIT 5;
   ```
4. Verify AI categorization accuracy
5. Test error handling by introducing malformed data

---

## Production Optimization

### **Rate Limiting**
- OpenAI: 3,500 requests/min (Tier 2)
- Anthropic: varies by plan
- Use Split in Batches with delays: 10 threads/batch, 2s delay

### **Cost Estimation**
**For 500 email threads:**
- OpenAI GPT-4 Turbo: ~$5-10 (depends on thread length)
- Claude 3.5 Sonnet: ~$7-15
- Total processing time: 10-20 minutes

### **Monitoring**
Add a final summary node:
```javascript
const supportCount = $('Supabase Support').itemMatches('all').length;
const pricingCount = $('Supabase Pricing').itemMatches('all').length;
const unclearCount = $('Logging').itemMatches('all').length;

return {
  json: {
    total_processed: supportCount + pricingCount + unclearCount,
    support_threads: supportCount,
    pricing_threads: pricingCount,
    unclear_threads: unclearCount,
    timestamp: new Date().toISOString()
  }
};
```

---

## Complete Workflow JSON

Save this as a template in n8n (workflow JSON export available upon request).

**Key Dependencies:**
- n8n version: 1.0+
- Required nodes: OpenAI/Anthropic, Supabase, Code, Switch
- External services: Supabase project, OpenAI/Anthropic API key

---

## Next Steps

1. ✅ Export Gmail threads to CSV using Apps Script
2. ✅ Create Supabase tables using schema.sql
3. ⏭️ Build n8n workflow following this design
4. ⏭️ Test with sample data
5. ⏭️ Run full import
6. ⏭️ Review and approve threads in Supabase
7. ⏭️ Build chat interface using approved data
