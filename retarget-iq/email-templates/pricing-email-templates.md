# Pricing Email Templates

## Template 1: Initial Pricing Presentation (Core Platform)

### When to Use
- After demo call when customer asks for pricing
- First-time pricing inquiry
- Customer ready to move forward

### Template

```
Hi [FIRST_NAME]

Here's a quick breakdown of pricing and how the upgrade options work:

Pricing
- Monthly: $797/month (month-to-month)
- Quarterly: $1,500 billed every 3 months (effectively $500/month)

If you start on the monthly plan, you have a grace period during the first few weeks where you can roll that payment directly into either:
- the quarterly plan, or
- the annual plan

Your initial monthly payment will be credited, so you're not paying twice.

Grandfathered Pricing
Any plan you start now is fully grandfathered. That means:
- Your price will never increase
- You'll keep this rate permanently, even as features and data expand

We're releasing V2 in mid-February, and pricing will increase at that point. Locking in now ensures you stay on the current rate long-term.

If you'd like, I can also walk you through which plan makes the most sense based on how you plan to use the platform.

Monthly payment link: [STRIPE_LINK]

Best,
Nate
```

### Variables to Replace
- `[FIRST_NAME]` - Customer's first name
- `[STRIPE_LINK]` - Actual Stripe payment link for monthly plan

### Required Context
- Had demo/discovery call
- Customer expressed interest in moving forward
- Discussed use case during call

### Personalization Points
- Reference specific use case from call
- Mention which plan makes most sense for their volume
- Can add quarterly link if they prefer that option

### Example

```
Hi Joseph

Here's a quick breakdown of pricing and how the upgrade options work:

Pricing
- Monthly: $797/month (month-to-month)
- Quarterly: $1,500 billed every 3 months (effectively $500/month)

If you start on the monthly plan, you have a grace period during the first few weeks where you can roll that payment directly into either:
- the quarterly plan, or
- the annual plan

Your initial monthly payment will be credited, so you're not paying twice.

Grandfathered Pricing
Any plan you start now is fully grandfathered. That means:
- Your price will never increase
- You'll keep this rate permanently, even as features and data expand

We're releasing V2 in mid-February, and pricing will increase at that point. Locking in now ensures you stay on the current rate long-term.

If you'd like, I can also walk you through which plan makes the most sense based on how you plan to use the platform.

Monthly payment link: https://buy.stripe.com/7sY9AUc6U65w1uM36F4gg0l

Best,
Nate
```

---

## Template 2: Full Pricing Breakdown (Core + Add-Ons)

### When to Use
- Customer wants complete pricing picture
- Asking about all options and add-ons
- Considering API or VIP Support

### Template

```
Hi [FIRST_NAME]!

I am attaching below a full breakdown of our current plans that will be grandfathered in before we release our V2 platform, this means that any prices listed here you will have forever!

Core Platform Pricing

*Quarterly plan:* $497/month, billed quarterly

   (*$1,500 every 3 months*)

*Optional Add-Ons*

   *VIP Support:* $297/month
   (One-on-one Google Meet sessions with our team for setup help, pulling lists, strategy, etc.)

   *API Access:* $297/month
   (Full enterprise API access for automation and integrations)

Both add-ons are completely optional and can be added at any point in the future.

White-Label Plan

   *$2,999.99/month*

   Includes *up to 10 seats*

   *Additional seats:* $100/month per seat

   *API Access included* for each account

   *No record caps at all*

------------------------------

Let me know if you have any questions.


--
Sincerely,

Cindy
Retarget IQ Support


Know a business? Refer us for up to $1,000 in recurring commission!
```

### Variables to Replace
- `[FIRST_NAME]` - Customer's first name

### Required Context
- Customer asked about white label or complete pricing
- May have mentioned agency/resale use case
- Looking at all options

### Personalization Points
- If they mentioned API needs, emphasize that
- If agency use case, highlight white label benefits
- Can add specific use case examples

---

## Template 3: White Label Pricing Email

### When to Use
- Customer specifically asks about white label
- Agency/reseller use case
- Multiple seat requirements

### Template

```
Hi [FIRST_NAME]!

I am attaching below a full breakdown of our current plans that will be grandfathered in before we release our V2 platform, this means that any prices listed here you will have forever!

White-Label Plan

   *$2,999.99/month*

   Includes *up to 10 seats*

   *Additional seats:* $100/month per seat

   *API Access included* for each account

   *No record caps at all*

[IF THEY ASKED ABOUT BRANDING:]
Yes whitelabel is whitelabeled fully. The pixel will be your domain, the login url. No one will know its retarget IQ.

Everything will be under your domain. Pixel code, login URL, portal, logo, name, even the api documentation.

Usually takes 48 hours once payment is recieved to have everything white labeled for you.

------------------------------

Let me know if you have any questions.


--
Sincerely,

Cindy
Retarget IQ Support


Know a business? Refer us for up to $1,000 in recurring commission!
```

### Variables to Replace
- `[FIRST_NAME]` - Customer's first name
- Include branding section if they asked about it

### Required Context
- Customer has agency/reseller business model
- Mentioned need for multiple clients or seats
- Asked about white labeling capabilities

### Personalization Points
- Number of seats they'll need
- Their specific branding requirements
- Timeline for launch

---

## Template 4: Payment Link Follow-Up

### When to Use
- Customer asked for payment link
- Ready to purchase
- Quick transaction

### Template

```
Payment Link: [STRIPE_LINK]

[IF API RELEVANT:]
If you want to add api as well let me know and I'll shoot over stuff for that.

Let me know once this is taken care of and we'll generate your login and shoot over your credentials.


Thanks
[SENDER_NAME]
```

### Variables to Replace
- `[STRIPE_LINK]` - Appropriate Stripe link for their plan
- `[SENDER_NAME]` - Nate, Cindy, etc.
- API section only if relevant

### Required Context
- Customer explicitly asked for payment link
- Already discussed pricing
- Ready to move forward

### Personalization Points
- None needed - keep it simple and fast

### Example

```
Payment Link: https://buy.stripe.com/bJe14oef2fG6ehy6iR4gg0f

If you want to add api as well let me know and I'll shoot over stuff for that.

Let me know once this is taken care of and we'll generate your login and shoot over your credentials.


Thanks
Nate
```

---

## Template 5: Access Timeline After Payment

### When to Use
- Customer asks when they'll get access
- Just before payment
- Managing expectations

### Template

```
Once paid you'll get access very quickly. Anywhere from a couple minutes from payment to a couple hours.

[IF RELEVANT - ADD SPECIFIC VALUE POINTS:]
Website identification you'll get anywhere from 30-70%+ website visitors identified (range depends on source of website traffic) usually see 40-50% on average.

Let me know if you have any other questions or need us to shoot over that payment link. Once taken care of we will generate your account.


Thanks
[SENDER_NAME]
```

### Variables to Replace
- `[SENDER_NAME]` - Nate, Cindy, etc.
- Add value points if customer asked specific performance questions

### Required Context
- Customer asked about access timing
- May have asked about performance/results
- Close to purchasing

### Personalization Points
- Add specific metrics if they asked
- Reference their use case for identification rates

### Example

```
Once paid you'll get access very quickly. Anywhere from a couple minutes from payment to a couple hours.

Website identification you'll get anywhere from 30-70%+ website visitors identified (range depends on source of website traffic) usually see 40-50% on average.

Let me know if you have any other questions or need us to shoot over that payment link. Once taken care of we will generate your account.


Thanks
Nate
```

---

## Template 6: Grandfathering Language (Urgency)

### When to Use
- Customer is on the fence
- Need to create urgency
- V2 launch is approaching

### Template

```
Hi [FIRST_NAME]!

I am attaching below a full breakdown of our current plans that will be grandfathered in before we release our V2 platform, this means that any prices listed here you will have forever!

[PRICING DETAILS]

We're releasing V2 in mid-February, and pricing will increase at that point. Locking in now ensures you stay on the current rate long-term.

[REST OF PRICING EMAIL]
```

### Variables to Replace
- `[FIRST_NAME]` - Customer's first name
- `[PRICING DETAILS]` - Appropriate pricing based on their needs

### Required Context
- Customer showed interest but hasn't purchased
- Near V2 launch date
- Want to create urgency without being pushy

### Personalization Points
- Emphasize value of grandfathered pricing
- Reference V2 improvements they'll get at same price
- Timeline to V2 launch

---

## Pricing Quick Reference

### Core Platform Options
- **Monthly:** $797/month (month-to-month)
- **Quarterly:** $497/month, billed as $1,500 every 3 months
- **Annual:** (Less commonly mentioned, confirm before quoting)

### Add-Ons (Optional, can be added anytime)
- **VIP Support:** $297/month - One-on-one Google Meet sessions for setup, strategy, list pulling
- **API Access:** $297/month - Full enterprise API access

### White Label
- **Base:** $2,999.99/month
- **Includes:** Up to 10 seats, API access for all accounts, unlimited records
- **Additional Seats:** $100/month per seat

### Payment Links (Common Examples)
- Monthly Core: `https://buy.stripe.com/7sY9AUc6U65w1uM36F4gg0l`
- Quarterly Core: `https://buy.stripe.com/bJe14oef2fG6ehy6iR4gg0f`
- API Add-on: `https://buy.stripe.com/9B64gA2wk2Tk5L25eN4gg0j`

### Key Selling Points
1. **Grandfathered Pricing** - Lock in current rate forever
2. **V2 Launch** - Feb 15th, pricing increases after
3. **Upgrade Grace Period** - First few weeks can roll monthly into quarterly/annual with credit
4. **Data Source** - Same provider Fortune 100/500 companies use
5. **Identification Rate** - 30-70%+ website visitors identified (typically 40-50%)
6. **Unlimited Data** - No record caps on core platform (white label explicitly states this)

### White Label Specifics
- **48-hour setup** after payment received
- **Fully white labeled:** Pixel, login URL, portal, logo, name, API docs
- **Your domain** for everything
- **No Retarget IQ branding** visible to end users

### API Notes
- Current API: Website visitor info only
- V2 API (Feb 15th): Full query and audience data pulls, automated

### Grace Period Details
- Start on monthly plan
- Within first few weeks, can switch to quarterly/annual
- Initial monthly payment credited
- Not paying twice

---

## Payment Follow-Up Scenarios

### If Payment Succeeds
- Send Template 1 from Support Templates (Welcome Email / Credentials)
- Include login, password, training videos
- Set expectation: Access within minutes to couple hours

### If Payment Fails
- Card declined: Ask them to contact credit card company or check billing address/name
- Can confirm on your end it didn't go through
- Be helpful and non-judgmental

### After Sending Payment Link
- Wait for confirmation
- Once confirmed paid, immediately send credentials
- Include training videos and API docs if relevant
