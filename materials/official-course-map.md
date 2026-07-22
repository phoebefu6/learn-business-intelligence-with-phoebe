# Official course map - learn-business-intelligence-with-phoebe

Built 2026-07-21 from fetched official syllabi (URLs in appendix). Fast-moving product note:
Power BI facts verified against the PL-300 study guide "Skills measured as of April 20, 2026" -
re-verify the Microsoft changelog before each delivery.

## Source universe

| # | Source | Type | What it anchors |
|---|--------|------|-----------------|
| S1 | Microsoft PL-300 exam skills outline (Apr 2026) | cert outline | Power BI spine: prepare 25-30%, model 25-30%, visualize 25-30%, manage/secure 15-20% |
| S2 | Microsoft Learn PL-300 prep (5 paths, 23 modules) | official training | per-module deltas incl. Copilot + Fabric |
| S3 | Tableau Desktop Specialist exam guide | cert outline | Tableau fundamentals + "why Tableau aggregates" concepts |
| S4 | Tableau Certified Data Analyst exam guide | cert outline | Tableau depth: LODs, table calcs, publish/manage |
| S5 | Google Looker / Looker Studio official courses + docs | official training | LookML semantic model, Looker Studio free hands-on lane |
| S6 | Google BI Professional Certificate (Coursera) | cert syllabus | BI strategy framing, BI vs analytics, org impact |
| S7 | Stephen Few, Information Dashboard Design 2e (full TOC) | canon book | dashboard grammar, 13 mistakes, bullet/sparkline library |
| S8 | Knaflic, Storytelling with Data (chapter list) | canon book | context, decluttering, attention, narrative |
| S9 | IBCS SUCCESS standard | standard | notation consistency (Say/Unify/Condense/Check/Express/Simplify/Structure). CAVEAT: 2.0/ISO-24896 detail flagged - re-verify before quoting on a page |
| S10 | Semantic-layer landscape: PBI semantic models, LookML, dbt MetricFlow | official docs | the tool-agnostic metrics-layer session |

## The overlap finding (scoping lever)

PL-300 (S1), Tableau Data Analyst (S4), and Google BI cert (S6) share ~80% of one spine:
connect/prepare data -> model it (semantic layer) -> visualize/analyze -> share/govern.
This course teaches the shared spine ONCE, tool-agnostic, on the Daybreak warehouse; every
builder session carries an "In Power BI / In Tableau" sidebar for the vendor deltas
(the DataOps AWS-sidebar pattern).

## Leader track coverage (a1-a6)

| Session | Covers | Source rows |
|---------|--------|-------------|
| a1 What BI is (and is not) | BI vs analytics vs data science, BI value chain, why dashboards fail | S6 ✓ (Foundations), S7 ◐ (ch1-2) |
| a2 Reading a dashboard like a leader | KPI cards, trend vs snapshot, drill paths, the questions to ask before trusting a number | S7 ✓ (ch4-5), S8 ◐ (ch1) |
| a3 One number, one truth | semantic/metrics layer, why two dashboards disagree, metric governance | S10 ✓, S1 ◐ (semantic model terminology) |
| a4 Commissioning dashboards that get used | requirements, audience, frequency, 13 common mistakes, acceptance checklist | S7 ✓ (ch2-4, 13-14), S6 ◐ |
| a5 Self-service BI without chaos | org models, certified/promoted content, RLS as a leader concern, data culture | S1 ✓ (manage/secure domain), S3 ◐ (Tableau Blueprint roles) |
| a6 Tool landscape + AI in BI | Power BI vs Tableau vs Looker vs OSS, Copilot/NL-Q&A, build-vs-buy, ROI | S1 ✓ (Copilot sub-skills), S2 ✓, S5 ◐ |

## Builder track coverage (b1-b10, Daybreak running case)

| Session | Covers | Source rows |
|---------|--------|-------------|
| b1 From SQL to BI | BI workflow anatomy, import vs live/DirectQuery/DirectLake, meet the Daybreak warehouse + bi-live playground | S1 ✓ (get/connect), S2 ✓, S3 ◐ (live vs extract) |
| b2 Shape the data | profiling, cleaning, transforms, pivot/unpivot, merge vs append, keys | S1 ✓ (profile/clean/transform), S4 ◐ (Prep), S2 ✓ |
| b3 Model like a pro | star schema, fact vs dimension, cardinality, cross-filter, date table, role-playing dims | S1 ✓ (design model), S5 ◐ (LookML views/explores) |
| b4 Measures that mean something | measures vs calculated columns, filter context, CALCULATE-style thinking, time intelligence (MTD/YoY), semi-additive | S1 ✓ (DAX domain), S2 ✓ (5 DAX modules), S4 ◐ (LOD/table calcs) |
| b5 Chart choice + dashboard grammar | chart-per-question grammar, Few's graph library, bullet/sparkline, bad-chart makeovers | S7 ✓ (ch7-11), S8 ✓ (ch2-3), S9 ◐ (Express/Simplify) |
| b6 Build the dashboard | layout + hierarchy, slicers/filters/drillthrough, interactions, mobile, accessibility | S1 ✓ (create reports + usability), S4 ✓ (create content), S7 ✓ (ch12-13) |
| b7 Storytelling + analytics extras | Knaflic narrative arc, annotations, reference lines, forecasting, anomaly detection, AI visuals | S8 ✓ (ch1,4,7-8), S1 ✓ (patterns/trends), S4 ◐ (analytics pane) |
| b8 Ship it | workspaces/apps, scheduled refresh, gateways, RLS static/dynamic, endorsement, subscriptions/alerts | S1 ✓ (manage/secure), S2 ✓, S4 ◐ (publish domain) |
| b9 Case study: the March dip | end-to-end capstone: model -> measures -> exec dashboard answering the Daybreak March-dip mystery | all ◐ applied |
| b10 BI at scale + the modern stack | semantic layer across PBI/LookML/dbt, performance (Performance Analyzer mindset, granularity), Fabric/DirectLake, Copilot-era BI, cert map (PL-300/Tableau) | S10 ✓, S1 ✓ (optimize + Copilot), S5 ✓ (LookML), S4 ◐ |

## Not covered by design (honest list)

- Hands-on Power BI Desktop click-paths (Windows-only tool; concepts taught here, clicks belong to S2/Maven courses)
- Paginated reports, Power BI Report Builder
- Tableau Prep flow authoring, Tableau Server administration
- Fabric administration, capacities, deployment pipelines
- DAX mastery beyond core patterns (CALCULATE, time intelligence) - Maven Advanced DAX owns that
- Official certificates/videos/assessments stay with the vendors - this course maps to them, it does not replace them

## From your subscriptions - top 10 to take (finish-before-lapse list)

1. Google Business Intelligence Professional Certificate - Coursera, ~56h (best curriculum architecture; strategy -> modeling -> dashboards)
2. Microsoft Power BI Data Analyst Professional Certificate - Coursera, ~153h (canonical PL-300 path; skim, don't grind)
3. Power BI Desktop for Business Intelligence - Udemy, Maven Analytics ~15h (best practitioner teaching, running-project style)
4. Advanced DAX for Data Analysis - Udemy, Maven Analytics ~11.5h (deepest public DAX treatment)
5. Data Modeling in Power BI (course 4 of the Microsoft cert) - Coursera, 28h (star schema + performance as a unit)
6. Tableau A-Z - Udemy, Kirill Eremenko ~8.5h (fast credible Tableau fluency)
7. Become a Business Intelligence Specialist path - LinkedIn Learning, 22h (how the BI role is packaged; competitive teardown)
8. Data Visualization: Storytelling - LinkedIn Learning, Bill Shander 1.5h (highest ROI-per-hour on narrative)
9. Power BI + Intro to DAX + Power Query and Data Modeling - 365 Data Science, ~13h combined (extract before cancel)
10. DeepLearning.AI Data Analytics Professional Certificate (only DLAI-adjacent option; gen-AI-in-analytics angle)

White space confirmed: no platform has a strong standalone "self-service BI strategy /
semantic-layer governance" course - the leader track (a3, a5) owns that gap.

## Appendix - fetched syllabi URLs

- PL-300 study guide: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/pl-300
- MS Learn paths: data-analytics-microsoft, prepare-data-power-bi, model-data-power-bi, power-bi-effective, manage-secure-power-bi (learn.microsoft.com/en-us/training/paths/...)
- Tableau Desktop Specialist guide (official PDF via authorized partner): https://www.onlc.com/tableau-exam/tableau-desktop-specialist-exam-guide-2020.pdf
- Tableau Certified Data Analyst guide: https://www.onlc.com/tableau-exam/tableau-certified-data-analyst-exam-guide.pdf
- Looker course index: https://docs.cloud.google.com/looker/docs/build-skills-with-courses
- Looker Studio docs root: https://docs.cloud.google.com/looker/docs/studio
- Google BI cert: https://www.coursera.org/professional-certificates/google-business-intelligence
- Few IDD 2e TOC: https://www.analyticspress.com/idd.php
- Storytelling with Data: https://www.wiley.com/en-us/Storytelling+with+Data:+A+Data+Visualization+Guide+for+Business+Professionals-p-9781119002253
- IBCS: https://www.ibcs.com/standards/
- Semantic layer: learn.microsoft.com/fabric/data-warehouse/semantic-models, docs.cloud.google.com/looker/docs/what-is-lookml, docs.getdbt.com/docs/build/about-metricflow
