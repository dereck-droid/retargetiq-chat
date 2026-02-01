-- =====================================================
-- RETARGET IQ - SUPABASE DATABASE SCHEMA
-- =====================================================
-- This schema creates tables for storing:
--   1. Support email threads (knowledge base)
--   2. Pricing email threads (proposal templates)
--
-- SETUP INSTRUCTIONS:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire file
-- 4. Run the script
-- =====================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: support_threads
-- Purpose: Store customer support email threads for AI knowledge base
-- =====================================================

CREATE TABLE IF NOT EXISTS support_threads (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Gmail thread identification
    gmail_thread_id TEXT UNIQUE NOT NULL,

    -- Thread metadata
    subject TEXT NOT NULL,
    first_message_date TIMESTAMPTZ NOT NULL,
    last_message_date TIMESTAMPTZ NOT NULL,
    number_of_messages INTEGER NOT NULL DEFAULT 1,

    -- Participants
    participants TEXT[] NOT NULL DEFAULT '{}',

    -- Full thread content
    complete_thread_content TEXT NOT NULL,

    -- AI-generated fields (populated by n8n workflow)
    ai_summary TEXT,
    ai_category TEXT,  -- e.g., "billing", "technical", "onboarding", "account"
    ai_confidence_score DECIMAL(3,2),  -- 0.00 to 1.00
    key_topics TEXT[],  -- Extracted key topics/tags

    -- Search optimization
    content_vector vector(1536),  -- For semantic search (OpenAI embeddings)

    -- Status tracking
    reviewed BOOLEAN DEFAULT FALSE,
    approved_for_kb BOOLEAN DEFAULT FALSE,
    notes TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    processed_by TEXT DEFAULT 'n8n-workflow'
);

-- =====================================================
-- TABLE: pricing_threads
-- Purpose: Store pricing/proposal email threads for automation
-- =====================================================

CREATE TABLE IF NOT EXISTS pricing_threads (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Gmail thread identification
    gmail_thread_id TEXT UNIQUE NOT NULL,

    -- Thread metadata
    subject TEXT NOT NULL,
    first_message_date TIMESTAMPTZ NOT NULL,
    last_message_date TIMESTAMPTZ NOT NULL,
    number_of_messages INTEGER NOT NULL DEFAULT 1,

    -- Participants
    participants TEXT[] NOT NULL DEFAULT '{}',

    -- Full thread content
    complete_thread_content TEXT NOT NULL,

    -- AI-extracted pricing information (populated by n8n workflow)
    pricing_data JSONB,  -- Structured pricing extracted from email
    /*
    Example pricing_data structure:
    {
      "monthly_price": 1500,
      "quarterly_price": 4000,
      "annual_price": 15000,
      "whitelabel_mentioned": true,
      "whitelabel_price": 2000,
      "custom_terms": "20% discount for annual",
      "services_included": ["ad management", "landing pages", "reporting"]
    }
    */

    -- AI analysis
    ai_summary TEXT,
    ai_confidence_score DECIMAL(3,2),  -- 0.00 to 1.00

    -- Categorization
    pricing_tier TEXT,  -- e.g., "starter", "professional", "enterprise", "custom"
    service_type TEXT,  -- e.g., "retargeting", "full-service", "consulting"

    -- Search optimization
    content_vector vector(1536),  -- For semantic search

    -- Status tracking
    reviewed BOOLEAN DEFAULT FALSE,
    approved_for_template BOOLEAN DEFAULT FALSE,
    notes TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    processed_by TEXT DEFAULT 'n8n-workflow'
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- Support threads indexes
CREATE INDEX IF NOT EXISTS idx_support_threads_gmail_id ON support_threads(gmail_thread_id);
CREATE INDEX IF NOT EXISTS idx_support_threads_category ON support_threads(ai_category);
CREATE INDEX IF NOT EXISTS idx_support_threads_date ON support_threads(last_message_date DESC);
CREATE INDEX IF NOT EXISTS idx_support_threads_approved ON support_threads(approved_for_kb);
CREATE INDEX IF NOT EXISTS idx_support_threads_reviewed ON support_threads(reviewed);

-- Pricing threads indexes
CREATE INDEX IF NOT EXISTS idx_pricing_threads_gmail_id ON pricing_threads(gmail_thread_id);
CREATE INDEX IF NOT EXISTS idx_pricing_threads_tier ON pricing_threads(pricing_tier);
CREATE INDEX IF NOT EXISTS idx_pricing_threads_date ON pricing_threads(last_message_date DESC);
CREATE INDEX IF NOT EXISTS idx_pricing_threads_approved ON pricing_threads(approved_for_template);
CREATE INDEX IF NOT EXISTS idx_pricing_threads_reviewed ON pricing_threads(reviewed);

-- Full-text search indexes (for keyword search)
CREATE INDEX IF NOT EXISTS idx_support_content_search ON support_threads USING gin(to_tsvector('english', complete_thread_content));
CREATE INDEX IF NOT EXISTS idx_pricing_content_search ON pricing_threads USING gin(to_tsvector('english', complete_thread_content));

-- =====================================================
-- TRIGGERS for automatic timestamp updates
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for support_threads
DROP TRIGGER IF EXISTS update_support_threads_updated_at ON support_threads;
CREATE TRIGGER update_support_threads_updated_at
    BEFORE UPDATE ON support_threads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for pricing_threads
DROP TRIGGER IF EXISTS update_pricing_threads_updated_at ON pricing_threads;
CREATE TRIGGER update_pricing_threads_updated_at
    BEFORE UPDATE ON pricing_threads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Optional but recommended
-- =====================================================

-- Enable RLS on both tables
ALTER TABLE support_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_threads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access (for n8n)
-- Replace 'service_role' with your actual service role if different

CREATE POLICY "Enable all access for service role" ON support_threads
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON pricing_threads
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- If you want authenticated users to have read access:
-- CREATE POLICY "Enable read for authenticated users" ON support_threads
--     FOR SELECT
--     TO authenticated
--     USING (approved_for_kb = true);

-- =====================================================
-- UTILITY VIEWS
-- =====================================================

-- View: Approved support threads for knowledge base
CREATE OR REPLACE VIEW kb_approved_support AS
SELECT
    id,
    subject,
    ai_summary,
    ai_category,
    key_topics,
    complete_thread_content,
    last_message_date
FROM support_threads
WHERE approved_for_kb = true
ORDER BY last_message_date DESC;

-- View: Approved pricing templates
CREATE OR REPLACE VIEW approved_pricing_templates AS
SELECT
    id,
    subject,
    pricing_data,
    pricing_tier,
    service_type,
    complete_thread_content,
    last_message_date
FROM pricing_threads
WHERE approved_for_template = true
ORDER BY last_message_date DESC;

-- View: Threads needing review
CREATE OR REPLACE VIEW threads_pending_review AS
SELECT
    'support' as thread_type,
    id,
    subject,
    ai_category as category,
    ai_confidence_score,
    created_at
FROM support_threads
WHERE reviewed = false
UNION ALL
SELECT
    'pricing' as thread_type,
    id,
    subject,
    pricing_tier as category,
    ai_confidence_score,
    created_at
FROM pricing_threads
WHERE reviewed = false
ORDER BY created_at ASC;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function: Get support thread statistics
CREATE OR REPLACE FUNCTION get_support_stats()
RETURNS TABLE (
    total_threads BIGINT,
    reviewed_threads BIGINT,
    approved_threads BIGINT,
    avg_confidence DECIMAL,
    unique_categories BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_threads,
        COUNT(*) FILTER (WHERE reviewed = true)::BIGINT as reviewed_threads,
        COUNT(*) FILTER (WHERE approved_for_kb = true)::BIGINT as approved_threads,
        AVG(ai_confidence_score) as avg_confidence,
        COUNT(DISTINCT ai_category)::BIGINT as unique_categories
    FROM support_threads;
END;
$$ LANGUAGE plpgsql;

-- Function: Get pricing thread statistics
CREATE OR REPLACE FUNCTION get_pricing_stats()
RETURNS TABLE (
    total_threads BIGINT,
    reviewed_threads BIGINT,
    approved_threads BIGINT,
    avg_confidence DECIMAL,
    unique_tiers BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_threads,
        COUNT(*) FILTER (WHERE reviewed = true)::BIGINT as reviewed_threads,
        COUNT(*) FILTER (WHERE approved_for_template = true)::BIGINT as approved_threads,
        AVG(ai_confidence_score) as avg_confidence,
        COUNT(DISTINCT pricing_tier)::BIGINT as unique_tiers
    FROM pricing_threads;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE QUERIES (for testing)
-- =====================================================

-- Get all support threads by category
-- SELECT ai_category, COUNT(*) as count
-- FROM support_threads
-- GROUP BY ai_category
-- ORDER BY count DESC;

-- Get pricing threads with whitelabel mentions
-- SELECT subject, pricing_data->>'whitelabel_price' as whitelabel_price
-- FROM pricing_threads
-- WHERE pricing_data->>'whitelabel_mentioned' = 'true';

-- Search support threads by keyword
-- SELECT subject, ai_summary
-- FROM support_threads
-- WHERE to_tsvector('english', complete_thread_content) @@ to_tsquery('billing & refund');

-- Get threads needing review
-- SELECT * FROM threads_pending_review LIMIT 10;

-- Get statistics
-- SELECT * FROM get_support_stats();
-- SELECT * FROM get_pricing_stats();

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Retarget IQ database schema created successfully!';
    RAISE NOTICE '';
    RAISE NOTICE 'Created tables:';
    RAISE NOTICE '  - support_threads';
    RAISE NOTICE '  - pricing_threads';
    RAISE NOTICE '';
    RAISE NOTICE 'Created views:';
    RAISE NOTICE '  - kb_approved_support';
    RAISE NOTICE '  - approved_pricing_templates';
    RAISE NOTICE '  - threads_pending_review';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '  1. Configure n8n workflow to populate these tables';
    RAISE NOTICE '  2. Test with sample data';
    RAISE NOTICE '  3. Review and approve threads for production use';
END $$;
