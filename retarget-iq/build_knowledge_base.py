#!/usr/bin/env python3
"""
Build Retarget IQ Knowledge Base from email threads and call transcripts
"""
import csv
import json
import re
import sys
from collections import defaultdict
from datetime import datetime

class KnowledgeBaseBuilder:
    def __init__(self):
        self.categories = {
            'Audience Creation & Targeting': [],
            'Data Enrichment & Pulls': [],
            'White Label Setup': [],
            'Pixel/Tracking Integration': [],
            'API & Technical': [],
            'Pricing & Plans': [],
            'Product Capabilities & Features': [],
            'Competitor Comparisons': [],
            'Account & Login Issues': [],
            'Integrations': [],
            'Billing & Cancellations': []
        }
        self.thread_classifications = {
            'SUPPORT': [],
            'PRICING': [],
            'ONBOARDING': [],
            'ADMIN': []
        }
        self.faq_counter = 0

    def parse_csv_with_multiline(self, filepath):
        """Parse CSV handling multiline content in Complete Thread Content field"""
        threads = []

        # Increase CSV field size limit
        max_int = sys.maxsize
        while True:
            try:
                csv.field_size_limit(max_int)
                break
            except OverflowError:
                max_int = int(max_int/10)

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                # Use csv.QUOTE_ALL to handle multiline fields
                reader = csv.DictReader(f, quoting=csv.QUOTE_MINIMAL)
                for row in reader:
                    threads.append(row)
        except Exception as e:
            print(f"Error parsing {filepath}: {e}")
        return threads

    def classify_thread(self, subject, content):
        """Classify thread into SUPPORT, PRICING, ONBOARDING, or ADMIN"""
        subject_lower = subject.lower()
        content_lower = content.lower()[:1000]  # Check first 1000 chars

        # Keywords for classification
        support_keywords = ['how to', 'not working', 'error', 'issue', 'problem', 'question',
                           'help with', 'trouble', 'unable to', "can't", 'pixel', 'audience',
                           'tracking', 'integration', 'setup', 'configure']
        pricing_keywords = ['pricing', 'price', 'cost', 'payment', 'invoice', 'proposal',
                           'quote', '$', 'plan', 'subscription', 'upgrade', 'downgrade']
        onboarding_keywords = ['login', 'credential', 'password', 'access', 'account setup',
                              'getting started', 'welcome', 'onboard']
        admin_keywords = ['cancel', 'cancellation', 'billing issue', 'refund', 'pause account',
                         'delete account', 'unsubscribe']

        if any(kw in subject_lower or kw in content_lower for kw in admin_keywords):
            return 'ADMIN'
        elif any(kw in subject_lower or kw in content_lower for kw in onboarding_keywords):
            return 'ONBOARDING'
        elif any(kw in subject_lower or kw in content_lower for kw in pricing_keywords):
            return 'PRICING'
        elif any(kw in subject_lower or kw in content_lower for kw in support_keywords):
            return 'SUPPORT'
        else:
            # Default to support if unclear
            return 'SUPPORT'

    def extract_messages_from_thread(self, content):
        """Extract individual messages from thread content"""
        messages = []

        # Split by "--- NEXT MESSAGE ---" or by FROM: pattern
        parts = re.split(r'--- NEXT MESSAGE ---|(?=FROM:)', content)

        for part in parts:
            if not part.strip():
                continue

            # Extract from, to, subject, date, body
            from_match = re.search(r'FROM:\s*(.+?)(?:\n|$)', part)
            to_match = re.search(r'TO:\s*(.+?)(?:\n|$)', part)
            subject_match = re.search(r'SUBJECT:\s*(.+?)(?:\n|$)', part)
            date_match = re.search(r'DATE:\s*(.+?)(?:\n|$)', part)

            # Body is everything after the headers
            body_start = part.find('SUBJECT:')
            if body_start != -1:
                # Find first blank line after headers
                headers_end = part.find('\n\n', body_start)
                if headers_end != -1:
                    body = part[headers_end:].strip()
                else:
                    body = ""
            else:
                body = part.strip()

            messages.append({
                'from': from_match.group(1).strip() if from_match else '',
                'to': to_match.group(1).strip() if to_match else '',
                'subject': subject_match.group(1).strip() if subject_match else '',
                'date': date_match.group(1).strip() if date_match else '',
                'body': body
            })

        return messages

    def categorize_question(self, question, answer):
        """Determine which category a Q&A belongs to"""
        text = (question + " " + answer).lower()

        if any(kw in text for kw in ['audience', 'targeting', 'zip code', 'location', 'segment', 'filter']):
            return 'Audience Creation & Targeting'
        elif any(kw in text for kw in ['white label', 'whitelabel', 'subdomain', 'branding', 'logo']):
            return 'White Label Setup'
        elif any(kw in text for kw in ['pixel', 'tracking', 'fire', 'script', 'tag', 'gtm', 'google tag']):
            return 'Pixel/Tracking Integration'
        elif any(kw in text for kw in ['api', 'webhook', 'integration', 'crm', 'hubspot', 'salesforce']):
            return 'API & Technical'
        elif any(kw in text for kw in ['pricing', 'price', 'cost', 'plan', 'subscription']):
            return 'Pricing & Plans'
        elif any(kw in text for kw in ['data', 'enrich', 'pull', 'export', 'download', 'csv']):
            return 'Data Enrichment & Pulls'
        elif any(kw in text for kw in ['login', 'password', 'access', 'account']):
            return 'Account & Login Issues'
        elif any(kw in text for kw in ['billing', 'invoice', 'payment', 'cancel']):
            return 'Billing & Cancellations'
        elif any(kw in text for kw in ['competitor', 'versus', 'vs', 'compare', 'alternative']):
            return 'Competitor Comparisons'
        elif any(kw in text for kw in ['integrate', 'connect', 'sync', 'mailchimp', 'high level']):
            return 'Integrations'
        else:
            return 'Product Capabilities & Features'

    def clean_text(self, text):
        """Clean up email text by removing signatures, quoted text, etc."""
        # Remove quoted text (lines starting with >)
        lines = text.split('\n')
        clean_lines = []
        for line in lines:
            if line.strip().startswith('>'):
                continue
            if 'On ' in line and 'wrote:' in line:
                break
            if re.match(r'^\s*--+\s*$', line):  # Signature separator
                break
            clean_lines.append(line)

        text = '\n'.join(clean_lines).strip()

        # Remove common email footers
        text = re.sub(r'Best regards.*$', '', text, flags=re.IGNORECASE | re.DOTALL)
        text = re.sub(r'Thanks,.*$', '', text, flags=re.IGNORECASE | re.DOTALL)
        text = re.sub(r'Sent from my .*$', '', text, flags=re.IGNORECASE | re.DOTALL)

        return text.strip()

    def is_valid_question(self, text):
        """Check if text is a valid question"""
        if len(text) < 15 or len(text) > 500:
            return False

        # Filter out URLs as questions
        if text.startswith('http') or 'docs.google.com' in text or 'www.' in text:
            return False

        # Filter out image references
        if '[image:' in text.lower() or 'screenshot' in text.lower() and len(text) < 50:
            return False

        # Must contain either a question mark or question keywords
        has_question_mark = '?' in text
        question_words = ['how', 'what', 'why', 'when', 'where', 'who', 'can', 'could',
                         'would', 'should', 'is there', 'are there', 'do you', 'does',
                         'is it', 'are you', 'will you', 'have you']
        has_question_word = any(text.lower().startswith(word) for word in question_words)

        # Filter out non-questions
        invalid_patterns = [
            r'^\[image:',
            r'^following up',
            r'^thanks',
            r'^thank you',
            r'^appreciated',
            r'^sounds good',
            r'^perfect',
            r'^great',
            r'^awesome',
            r'^hi\s*$',
            r'^hello\s*$',
            r'^hey\s*$',
            r'^learn more here:',
            r'^\s*-+\s*$',
            r'^best\s+(regards|wishes)',
            r'^sent from',
            r'^cheers',
        ]

        for pattern in invalid_patterns:
            if re.match(pattern, text, re.IGNORECASE):
                return False

        # Must have at least 3 words
        if len(text.split()) < 3:
            return False

        return has_question_mark or has_question_word

    def extract_qa_from_support_thread(self, thread):
        """Extract Q&A pairs from a support thread"""
        qa_pairs = []

        messages = self.extract_messages_from_thread(thread['Complete Thread Content'])

        # Look for customer questions and Retarget IQ responses
        for i, msg in enumerate(messages):
            is_customer = 'retargetiq.com' not in msg['from'].lower()

            # If customer message, look for next retarget response
            if is_customer and i < len(messages) - 1:
                question_body = self.clean_text(msg['body'])

                # Extract meaningful questions from the body
                sentences = re.split(r'[.!]\s+', question_body)
                for sentence in sentences:
                    if self.is_valid_question(sentence):
                        # Find next response from Retarget IQ
                        for j in range(i + 1, len(messages)):
                            if 'retargetiq.com' in messages[j]['from'].lower():
                                answer_body = self.clean_text(messages[j]['body'])

                                # Get first few paragraphs of answer
                                paragraphs = [p.strip() for p in answer_body.split('\n\n') if p.strip() and len(p.strip()) > 20]
                                answer = '\n\n'.join(paragraphs[:2]) if paragraphs else answer_body[:600]

                                if len(answer) > 30:
                                    category = self.categorize_question(sentence, answer)
                                    self.faq_counter += 1

                                    qa_pairs.append({
                                        'id': f"faq-{self.faq_counter:03d}",
                                        'question': sentence.strip(),
                                        'answer': answer.strip(),
                                        'category': category,
                                        'source': f"email-{thread['Thread ID'][:8]}",
                                        'thread_subject': thread['Subject']
                                    })
                                break
                        break  # Only take first question from each customer message

        return qa_pairs

    def extract_call_insights(self, transcript_path):
        """Extract key insights from call transcript"""
        qa_pairs = []

        try:
            with open(transcript_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract conversation turns
            jon_statements = re.findall(r'\*\*Jon Kluger:\*\* (.+?)(?=\*\*(?:Aaron|Jon)|$)', content, re.DOTALL)
            aaron_statements = re.findall(r'\*\*Aaron Shrestha:\*\* (.+?)(?=\*\*(?:Aaron|Jon)|$)', content, re.DOTALL)

            # Create Q&A pairs from the conversation flow
            all_turns = re.findall(r'\*\*(.+?):\*\* (.+?)(?=\*\*|$)', content, re.DOTALL)

            for i, (speaker, statement) in enumerate(all_turns):
                # If Aaron asks a question
                if speaker == 'Aaron Shrestha' and '?' in statement:
                    question = statement.strip()
                    # Find Jon's next response
                    for j in range(i + 1, min(i + 3, len(all_turns))):
                        if all_turns[j][0] == 'Jon Kluger':
                            answer = all_turns[j][1].strip()

                            # Clean up and truncate
                            question = question[:300] if len(question) > 300 else question
                            answer = answer[:600] if len(answer) > 600 else answer

                            if len(question) > 20 and len(answer) > 30:
                                qa_pairs.append({
                                    'question': question,
                                    'answer': answer,
                                    'type': 'prospect_question'
                                })
                            break

            # Extract key value propositions and feature explanations
            value_props = []
            for statement in jon_statements:
                stmt_lower = statement.lower()
                # Look for key differentiators
                if any(kw in stmt_lower for kw in ['better than', 'competitor', 'fortune 100', 'publicly traded', 'data source']):
                    if len(statement.strip()) > 50:
                        value_props.append({
                            'question': 'What makes Retarget IQ different from competitors?',
                            'answer': statement.strip()[:500],
                            'type': 'value_proposition'
                        })

                # Look for feature explanations
                elif any(kw in stmt_lower for kw in ['super pixel', 'intent data', 'api', 'white label', 'integration']):
                    # Extract the key feature being discussed
                    if 'super pixel' in stmt_lower:
                        feature = 'Super Pixel'
                    elif 'intent data' in stmt_lower:
                        feature = 'Intent Data'
                    elif 'api' in stmt_lower:
                        feature = 'API'
                    elif 'white label' in stmt_lower:
                        feature = 'White Label'
                    elif 'integration' in stmt_lower:
                        feature = 'Integrations'
                    else:
                        continue

                    if len(statement.strip()) > 50:
                        qa_pairs.append({
                            'question': f'How does {feature} work?',
                            'answer': statement.strip()[:500],
                            'type': 'feature_explanation'
                        })

            # Add unique value props (avoid duplicates)
            seen_answers = set()
            for vp in value_props[:3]:  # Top 3 value props
                answer_key = vp['answer'][:100].lower()
                if answer_key not in seen_answers:
                    qa_pairs.append(vp)
                    seen_answers.add(answer_key)

        except Exception as e:
            print(f"Error reading call transcript: {e}")

        return qa_pairs

    def process_all(self, csv1_path, csv2_path, transcript_path):
        """Process all files and build knowledge base"""
        print("Processing email threads from info@ inbox...")
        threads1 = self.parse_csv_with_multiline(csv1_path)
        print(f"  Loaded {len(threads1)} threads from info@ inbox")

        print("Processing email threads from nate@ inbox...")
        threads2 = self.parse_csv_with_multiline(csv2_path)
        print(f"  Loaded {len(threads2)} threads from nate@ inbox")

        all_threads = threads1 + threads2
        print(f"\nTotal threads: {len(all_threads)}")

        # Classify and extract Q&As
        print("\nClassifying threads and extracting Q&A pairs...")
        all_qa_pairs = []

        for i, thread in enumerate(all_threads):
            if i % 50 == 0:
                print(f"  Processing thread {i}/{len(all_threads)}...")

            classification = self.classify_thread(thread.get('Subject', ''),
                                                 thread.get('Complete Thread Content', ''))
            self.thread_classifications[classification].append(thread)

            # Extract Q&As from support threads
            if classification == 'SUPPORT':
                qa_pairs = self.extract_qa_from_support_thread(thread)
                all_qa_pairs.extend(qa_pairs)

                # Add to category
                for qa in qa_pairs:
                    self.categories[qa['category']].append(qa)

        print(f"\nExtracted {len(all_qa_pairs)} Q&A pairs from support threads")
        print(f"Thread classifications:")
        for cat, threads in self.thread_classifications.items():
            print(f"  {cat}: {len(threads)} threads")

        # Process call transcript
        print("\nExtracting insights from call transcript...")
        call_qa_pairs = self.extract_call_insights(transcript_path)

        # Add call insights as Q&As
        for qa in call_qa_pairs:
            self.faq_counter += 1
            category = self.categorize_question(qa['question'], qa['answer'])

            self.categories[category].append({
                'id': f"faq-{self.faq_counter:03d}",
                'question': qa['question'],
                'answer': qa['answer'],
                'category': category,
                'source': 'call-transcript-aaron-s',
                'thread_subject': 'Sales Call - Aaron S'
            })

        print(f"\nTotal Q&As in knowledge base: {self.faq_counter}")

        return all_qa_pairs, call_qa_pairs

    def generate_markdown(self, output_path):
        """Generate markdown knowledge base"""
        md_content = "# Retarget IQ Knowledge Base\n\n"
        md_content += f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n"
        md_content += "---\n\n"

        for category_name, faqs in self.categories.items():
            if not faqs:
                continue

            md_content += f"## {category_name}\n\n"

            # Group similar questions
            unique_faqs = {}
            for faq in faqs:
                # Use first 50 chars of question as key to dedupe
                key = faq['question'][:50].lower()
                if key not in unique_faqs:
                    unique_faqs[key] = faq

            for faq in unique_faqs.values():
                md_content += f"### {faq['question']}\n\n"
                md_content += f"**Answer:** {faq['answer']}\n\n"
                md_content += f"**Source:** {faq['source']}\n\n"
                md_content += "---\n\n"

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(md_content)

        print(f"\nMarkdown knowledge base saved to: {output_path}")

    def generate_json(self, output_path):
        """Generate JSON knowledge base"""
        json_data = {
            'meta': {
                'generated_at': datetime.now().isoformat(),
                'total_faqs': self.faq_counter,
                'total_threads_processed': sum(len(t) for t in self.thread_classifications.values())
            },
            'categories': []
        }

        for category_name, faqs in self.categories.items():
            if not faqs:
                continue

            # Dedupe similar questions
            unique_faqs = {}
            for faq in faqs:
                key = faq['question'][:50].lower()
                if key not in unique_faqs:
                    unique_faqs[key] = faq

            category_data = {
                'name': category_name,
                'faq_count': len(unique_faqs),
                'faqs': []
            }

            for faq in unique_faqs.values():
                # Extract keywords
                keywords = []
                text = (faq['question'] + ' ' + faq['answer']).lower()
                keyword_patterns = [
                    'audience', 'pixel', 'tracking', 'api', 'white label', 'integration',
                    'data', 'pricing', 'crm', 'meta', 'facebook', 'google', 'intent',
                    'export', 'csv', 'login', 'account', 'billing', 'zip code', 'location'
                ]
                for kw in keyword_patterns:
                    if kw in text:
                        keywords.append(kw)

                category_data['faqs'].append({
                    'id': faq['id'],
                    'question': faq['question'],
                    'answer': faq['answer'],
                    'keywords': keywords,
                    'source': faq['source']
                })

            json_data['categories'].append(category_data)

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)

        print(f"JSON knowledge base saved to: {output_path}")

    def generate_summary(self):
        """Generate summary statistics"""
        print("\n" + "="*60)
        print("KNOWLEDGE BASE SUMMARY")
        print("="*60)
        print(f"\nTotal Q&As extracted: {self.faq_counter}")
        print(f"\nCategories created:")
        for category_name, faqs in self.categories.items():
            if faqs:
                print(f"  - {category_name}: {len(faqs)} Q&As")

        # Find top question topics
        print(f"\nTop 10 most common question topics:")
        topic_counts = defaultdict(int)
        for category_name, faqs in self.categories.items():
            for faq in faqs:
                # Extract main topic from question
                question_words = faq['question'].lower().split()
                key_words = [w for w in question_words if len(w) > 4 and w not in ['what', 'how', 'when', 'where', 'does', 'can']]
                if key_words:
                    topic_counts[key_words[0]] += 1

        for i, (topic, count) in enumerate(sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)[:10], 1):
            print(f"  {i}. {topic}: {count} questions")

        print("\n" + "="*60)

def main():
    csv1_path = "/home/user/Business/retarget-iq/Email Export Sent1- Sheet1 (2).csv"
    csv2_path = "/home/user/Business/retarget-iq/Email Export Sent2- Sheet1 (1).csv"
    transcript_path = "/home/user/Business/Business/retarget-iq /call-transcripts/Retarget IQ - Aaron S"

    md_output = "/home/user/Business/retarget-iq/knowledge-base/knowledge-base.md"
    json_output = "/home/user/Business/retarget-iq/knowledge-base/knowledge-base.json"

    builder = KnowledgeBaseBuilder()
    builder.process_all(csv1_path, csv2_path, transcript_path)
    builder.generate_markdown(md_output)
    builder.generate_json(json_output)
    builder.generate_summary()

if __name__ == "__main__":
    main()
