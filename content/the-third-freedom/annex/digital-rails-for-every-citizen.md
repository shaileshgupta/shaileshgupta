## The plan

1.  **The 99.9% uptime law.** Every citizen-facing portal shows a live status page, measured by an independent monitor, not the agency. Monthly targets:
    -   **Tier 1** (top 100 portals by traffic, plus tax, payments and welfare): 99.95%.
    -   **Tier 2** (all other central and state portals): 99.9%, which allows 43.8 minutes of downtime a month.
    -   **Tier 3** (under 10,000 users a month): 99.5%, hosted on shared government cloud.
    -   **Who pays:** the vendor pays service credits of up to 10% of contract value first. The agency head loses 5% of annual performance pay for each missed month where a 15-day inquiry finds they failed to enforce the contract or fund capacity. After 3 missed months in a row, the agency head is moved off the post.
2.  **Open standards for every service.** Every government service publishes an open API (a standard plug other software can call) and a test sandbox, like UPI, ONDC and the Account Aggregator system. The government runs the switch and the registry. Any certified company, including startups, can build apps, front-ends or hosting on top.
3.  **A privacy ledger for every citizen.** Every access to a person's data is written to a tamper-proof log that the person sees in DigiLocker. The ledger is a permissioned, append-only log run by 5 nodes: MeitY, RBI, CERT-In, ECI and the Supreme Court registry.
    -   **Yes or no answers:** checks such as "over 18?" or "household income below ₹1.2 lakh?" ([Chapter 23](/the-third-freedom/a-hand-up-and-an-equal-chance)) return only yes or no. This starts with signed DigiLocker credentials that work today; zero-knowledge proofs (maths that proves a fact without revealing the data) are piloted in 2 uses during the year.
    -   **Court order only:** police and agencies need a court order. In an emergency, a written 24-hour authorisation must be ratified by a court within 48 hours, or the data is deleted and the officer is penalised.
4.  **Three classes of data, encrypted by default.**
    -   **Public records** (land title summaries, judgments, laws, published asset summaries) are digitally signed, not encrypted.
    -   **Transaction records** are readable by the parties to them, so a bank sees its own customer's payments ([Chapter 1](/the-third-freedom/tax-keep-what-you-earn) needs this).
    -   **Personal records** (health, messages, documents) are end-to-end encrypted on the citizen's device, with keys held by the citizen. Recovery is on by default: the key is split 2-of-3 between the phone, DigiLocker and a bank the citizen picks, so no single holder can open it. Recovery takes under 24 hours at any post office by biometric. A citizen may opt out.
    -   **Lawful access:** a court order names the data, and the citizen or their recovery holders must release it. Refusing a court order is contempt, as with any evidence. There is no master key and no back door.
5.  **Biometric sign-in with a guaranteed fallback.** Face, finger or iris is the default. Every service must also offer OTP, an offline QR code, a nominee or a local officer override. **No one may be refused a benefit because authentication failed.**
6.  **One consent rule for all data.** A hospital, bank, insurer, lender, school, telecom company or app gets a person's data only with that person's consent, on the model of the Account Aggregator consent framework. The person approves each request on their phone. The request names the purpose, the exact fields and the duration, and may ask only for the fields its purpose needs, checked against a published purpose list. Consent is revocable in one tap and lasts at most 12 months.
7.  **KYC once, for life.** The Central KYC Registry (CKYCR) issues each person's verified KYC once as a non-transferable digital credential held in the person's own wallet (DigiLocker or any certified wallet). Any bank, broker, insurer, telecom company or fintech checks it through an open API, with consent, and gets only yes or no answers ("KYC verified", "over 18", "resident"). RBI, SEBI, IRDAI, PFRDA and DoT accept it in one joint notice. A lost phone means the credential is revoked and re-issued.
8.  **AI Seva terminals.** Voice-first AI terminals that work in 22 languages and cover every service go to every gram panchayat (about 2.6 lakh) and post office, first where there is no bank branch or Common Service Centre. They are built to an open hardware and software specification. Any maker that passes the certification test can supply anywhere at the published price (How the government buys) and is paid per successful transaction (Aadhaar playbook).
9.  **A signal in every village by month 9.** Every village without a signal gets satellite broadband first. Satellite operators are licensed within 30 days under the Telecommunications Act 2023, with gateways and data in India (Sovereignty first). Mobile towers follow as work packages on the national rate card: any certified operator claims a village by posting the bond, and is paid only after an independent live-signal test (How the government buys).
10.  **A low-cost smartphone for anyone who asks.** Any person can get one ₹5,000-class, made-in-India smartphone (estimate), one per person ever, tagged to their ID. It is a loan, not a gift, priced at cost plus the government's borrowing rate. People on the [Chapter 23](/the-third-freedom/a-hand-up-and-an-equal-chance) cash transfer repay by a small monthly deduction; everyone else repays by a small bank auto-debit. The same rule applies to every citizen.
11.  **Money-trail monitoring that privacy does not block.** Banks, UPI apps, card networks, brokers and crypto exchanges send transaction data to the Financial Intelligence Unit (FIU-IND) in real time, not in monthly reports. Its AI models flag patterns of terror financing, trafficking, drug money and laundering as they happen. Consent rules do not apply to this channel. The FIU can freeze a flagged account for up to 7 days and hands each case to the NIA, the Enforcement Directorate or the police within 24 hours. Reading anything beyond the money trail, such as messages or personal records, still needs a warrant from a designated High Court judge, decided within 24 hours ([Chapter 26](/the-third-freedom/a-police-force-india-can-trust)).
12.  **A real-time pulse of the nation.** A National Data Analytics Centre receives anonymised, aggregated feeds: payments and GST invoices by district and sector, power use, freight, prices, PAN-linked payroll jobs ([Chapter 7](/the-third-freedom/free-to-build)), school and hospital attendance. It runs a live national dashboard, updated daily, that ministries, the RBI and every chief minister's scorecard use ([Chapter 14](/the-third-freedom/leaders-who-run-their-areas-like-ceos)). Only counts covering 100 or more people leave the centre.

## Cost and return

**Core build (estimate):**

| Item | Working | Cost (₹ crore) |
| --- | --- | --- |
| API gateway, sandbox and independent monitoring |  | 300 |
| Privacy ledger and yes-or-no proofs |  | 500 |
| Terminals | 2.6 lakh × ₹1.5 lakh = ₹3,900 crore, plus about ₹1,000 crore a year to run | 3,900 |
| KYC credential: registry upgrade, issuance and open API |  | 300 |
| **Total** | 300 + 500 + 3,900 + 300 | **about 5,000** |

-   **Terminal break-even (estimate):** departments pay ₹15 per completed transaction from existing service budgets. ₹1,000 crore ÷ ₹15 = 67 crore transactions a year, about 7 a day per terminal.
-   **Village coverage (estimate):** satellite terminals for all 10,100 villages as the year-1 bridge: 10,100 × ₹50,000 ≈ ₹50 crore. Towers cost about ₹1.1 crore per village, the average of the existing 4G saturation project (₹26,316 crore for over 24,000 villages), so 10,100 villages cost at most about ₹11,100 crore. This is paid from the Digital Bharat Nidhi, the universal service fund telecom operators already pay into, and part of it is already committed under the 4G saturation project.
-   **Phones (estimate):** if 10 crore people take one, 10 crore × ₹5,000 = ₹50,000 crore, advanced once through a bank credit line guaranteed by the Centre and repaid in full. At ₹200 a month (10% of the full ₹2,000 transfer), a phone is repaid in 25 months. A ₹5,000 crore loss provision (10%) is a visible budget line.
-   **KYC savings (estimate):** KYC costs about ₹6 per customer through Aadhaar e-KYC and up to about ₹1,000 on paper (Economic Survey 2023-24), and every firm repeats it for the same person. A check at ₹1 or less brings that close to zero.
-   **Market (estimate):** if 10% of new government software spending (about ₹10,000 crore a year, an estimate; Gartner put total government IT spending at about $9.5 billion in 2021) moves to open-API builders, Indian firms and startups gain about ₹1,000 crore of business a year.
-   **Jobs:** about 2.6 lakh terminal operators, building on the Common Service Centre network.

## Timeline

**First 30 days:**

-   MeitY notifies the uptime standard. Live status pages go up for the top 100 portals, and STQC (the government testing agency) starts independent monitoring from 10 cities.
-   Open APIs and sandboxes are published for 10 high-volume services, including tax, land, birth and death certificates and vehicle registration.
-   The biometric fallback rule is made mandatory by government order, and daily failure rates by district go public.
-   The terminal and smartphone specifications, certification tests and published prices are released; every maker that passes qualifies nationwide.
-   Satellite broadband licences open; the village work packages and the live-signal test are published.
-   RBI, SEBI, IRDAI, PFRDA and DoT issue the joint KYC notice.

**Within 1 year:**

-   The uptime law covers every portal, with penalties in every contract.
-   The privacy ledger is live for Aadhaar, DigiLocker, tax and health records. Citizen-held encryption is the default for personal records on every public rail.
-   Parliament amends Section 17 of the DPDP Act so the privacy ledger opens only by court order or the 48-hour emergency route.
-   2.6 lakh terminals are installed.
-   By month 9, before cash ends ([Chapter 2](/the-third-freedom/every-rupee-digital)), every village has a live signal by tower, fibre or satellite, and phones are available to anyone who asks.
-   Every person with a CKYCR or Aadhaar e-KYC record holds a KYC credential, and every regulated firm accepts it.

**Outcomes after year 1:** towers and BharatNet fibre reach the last villages in hills, forests and border areas that satellite covers in year 1.

## Guardrails

-   **Maintenance:** at most 4 hours a month, only between 1 am and 5 am, with 72 hours' notice. Anything else counts as downtime.
-   **Outages:** a root-cause report is published within 72 hours of any outage longer than 30 minutes.
-   **Biometric failure:** if failures in any district exceed 1% in a month, that district switches to fallback by default and the district officer reports within 7 days.
-   **API builders:** pass a CERT-In-empanelled security audit, carry ₹10 crore of liability cover, face per-app limits for their first 90 days, and can be cut off within 15 minutes.
-   **No vendor lock-in:** every terminal and phone runs open standards, so any certified maker can replace another within 30 days. A terminal with no transactions for 60 days is moved.
-   **Transparency:** an annual report counts every court-ordered and emergency data access, by agency.
-   **Encryption:** an independent cryptography audit of every public rail every 12 months, published within 30 days. A breach caused by a vendor's weak encryption means a lifetime ban from government work and a fine of ₹10,000 per affected citizen, paid to each citizen within 90 days.
-   **Consent:** over-collecting data costs ₹1 lakh per record. Refusing service because a person declined fields the purpose does not need is an offence.
-   **KYC credential:** each check needs fresh consent and is logged; the fee is at most ₹1, and zero where the checker gains nothing commercially; the registry refreshes KYC once a year and firms may not demand documents in between; liability for a wrong KYC sits with the registry; any app that keeps KYC data beyond the yes or no answer is fined ₹1 lakh per record; a lost phone is revoked within 1 hour and re-issued within 24 hours.
-   **Phone repayment:** deductions never exceed 10% of a household's monthly transfer; a bank auto-debit never exceeds ₹250 a month or takes a balance below ₹1,000; any balance unpaid after 36 months is written off against the provision, and no phone is ever taken back.
-   **Phone software:** an open operating system with no government app beyond DigiLocker and UPI preinstalled. A theft report blocks the phone nationally (CEIR registry) within 1 hour.
-   **Coverage:** a public map shows live signal by village, refreshed every month. An operator that misses its live date pays ₹1 lakh per site per month.
-   **Monitoring:** every flag, freeze and case referral is logged on the privacy ledger, and the person sees it once the case closes, or after 1 year if no charge is filed. A freeze longer than 7 days needs a court order. The false-flag rate is published every quarter, and the models are audited by an independent auditor every year.
-   **Misuse:** any official who looks up a person without an open case is dismissed and prosecuted, with up to 5 years in jail. Trying to re-identify people from the national dashboard is a criminal offence, and no dashboard figure may cover fewer than 100 people.

## Limits to know

Where a citizen opts out of key recovery and refuses a court order, the state cannot read that person's encrypted personal records; the court can only draw an adverse inference. That is the price of having no back door. The money trail is different: payment data is always open to FIU monitoring, so encryption never shields terror financing or laundering.

**Sources:** [Free Press Journal: UPI October 2026](https://www.freepressjournal.in/business/upi-transactions-hit-2547-billion-in-october-value-soars-to-3153-lakh-crore) · [UIDAI: 231 crore authentications, November 2025](https://uidai.gov.in/images/UIDAI_records_231_crore_Aadhaar_authentication_transactions_in_November_2025.pdf) · [StudyCafe: ₹4,242 crore income-tax portal](https://studycafe.in/?p=100205) · [YourStory: FM's deadline to Infosys](https://yourstory.com/2021/08/it-portal-glitches-fm-sets-sept-15-deadline-infosys/amp) · [NBER: Muralidharan, Niehaus and Sukhtankar, Jharkhand PDS study](https://www.nber.org/papers/w26744.pdf) · [Free Press Journal: 6,34,019 of 6,44,131 villages covered](https://www.freepressjournal.in/tech/india-expands-ofc-network-to-4236-lakh-kms-mobile-connectivity-reaches-634-lakh-villages) · [Swarajya: ₹26,316 crore 4G saturation project](https://swarajyamag.com/amp/story/tech/govt-clears-rs-26316-crore-project-to-provide-4g-mobile-services-in-over-24000-uncovered-villages-across-india) · [Deccan Herald: DPDP Rules notified, 12 to 18 month phase-in](https://www.deccanherald.com/amp/story/india%2Fcentre-notifies-dpdp-rules-implementation-planned-in-phases-spread-over-12-18-months-3798465) · [Hogan Lovells: DPDP Act in force](https://ca.hoganlovells.com/en/publications/indias-digital-personal-data-protection-act-2023-brought-into-force-) · [e-Estonia: Data Tracker](https://e-estonia.com/data-tracker-build-citizen-trust/) · [Sahamati: Account Aggregator crosses 100 million consents](https://www.sahamati.org.in/media-article/indias-account-aggregator-framework-crosses-100-million-consents-in-three-years/) · [Economic Survey: KYC cost down to ₹6 from about ₹1,000 (Business Standard)](https://www.business-standard.com/amp/economy/news/economic-survey-dpi-brings-down-kyc-costs-to-rs-6-from-about-rs-1-000-124072201118_1.html) · [Gartner: government IT spending $9.5 billion (IIFL)](https://www.indiainfoline.com/news/markets/government-to-increase-current-years-it-spending-by-12-1-to-9-5-billion-gartner) · Justice K.S. Puttaswamy v. Union of India (2017) 10 SCC 1
