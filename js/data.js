// Site content that is built by script: the two hero logo bands and the Memory
// Lane TIMELINE (events, interstitial text, photos and captions). Edit freely —
// the page rebuilds itself from this file. (The hero name, tagline and intro
// are plain HTML in index.html, so they are readable without JavaScript.)

// "Products Delivered" auto-scrolling band. A few logos stand for more than
// one product built on the same platform (Wholesale Console, Remote
// Colleagues), so those get an extra derived icon in the same visual
// language as the original mark rather than text edited into the logo file.
// whiteBg: true gives that one logo a white rounded backdrop so a dark/thin
// mark (like the Remote Colleagues wordmark) stays legible on the dark page.
const PRODUCTS = [
  { src: "assets/logos/wholesale-console-badge.svg", w: 512, h: 512, alt: "Wholesale Console", caption: "Wholesale Console Web Application" },
  { src: "assets/logos/market-research-intelligence.svg", w: 512, h: 512, alt: "Market Research Intelligence", caption: "Wholesale Console: Market Research Intelligence" },
  { src: "assets/logos/content-management-system.svg", w: 512, h: 512, alt: "Content Management System", caption: "Wholesale Console: Content Management System" },
  { src: "assets/logos/remote-colleagues-wordmark.webp", w: 256, h: 75, alt: "Remote Colleagues", caption: "Remote Colleagues Website", whiteBg: true },
  { src: "assets/logos/hr-tool.svg", w: 512, h: 512, alt: "HR Tool", caption: "Remote Colleagues HR Web Application" },
  { src: "assets/logos/aarushree-logo.webp", w: 256, h: 246, alt: "Aarushree", caption: "Aarushree Website" },
  { src: "assets/logos/shakta-logo.webp", w: 355, h: 134, alt: "Shakta", caption: "Shakta Technology Website" },
  { src: "assets/logos/att-orange-circle.webp", w: 218, h: 218, alt: "Anytime Toilet", caption: "Anytime Toilet Mobile Application" },
  { src: "assets/logos/fleet-automation.svg", w: 512, h: 512, alt: "Fleet Automation", caption: "Fleet Automation Python Scripts" },
  { src: "assets/logos/foodieplace-logo.webp", w: 222, h: 256, alt: "Foodieplace", caption: "Foodieplace Mobile and Web Applications" }
];

// "Multiple awards winner" auto-scrolling band.
const AWARDS = [
  { src: "assets/logos/deakin-logo.webp", w: 256, h: 86, alt: "Deakin University", caption: "Vice-Chancellor's Professional Excellence Program" },
  { src: "assets/logos/sutc-icons.webp", w: 256, h: 102, alt: "SUTC", caption: "Smart Urban Technology Challenge" },
  { src: "assets/logos/aiesec-logo.svg", w: 211, h: 30, alt: "AIESEC", caption: "Action for SDGs" },
  { src: "assets/logos/deakin-logo.webp", w: 256, h: 86, alt: "Deakin University", caption: "Bowater Business Challenge" },
  { src: "assets/logos/deakin-logo.webp", w: 256, h: 86, alt: "Deakin University", caption: "Outstanding Mentor" },
  { src: "assets/logos/indian-embassy-logo.webp", w: 236, h: 83, alt: "Indian Embassy", caption: "Silver Jubilee Award" },
  { src: "assets/logos/hult-prize-malaysia.webp", w: 256, h: 185, alt: "Hult Prize", caption: "Regional Representative at Malaysia 2018 for KU" },
  { src: "assets/logos/xavier-college-logo.webp", w: 200, h: 200, alt: "St. Xavier's College", caption: "Father MDM SJ Memorial Award: Coursework Excellence" }
];

// "Social Work" event's two-image gallery card captions (grammar/spelling
// corrected from the originally supplied text: "Eduation" -> "Education",
// "Non Refugee" -> "Non-Refugee", "integrate in the society" -> "integrate
// into society", "And, collaborated..." -> "We also collaborated..." to
// give that clause a subject).
const SOCIAL_WORK_CAPTION_1 =
  "Partnership in Education: Daily Individual and Group Social Work with Grade 8 to 10 Cohort/Young Students/'My Guys' from informal settlement areas, helping them navigate academic and social challenges.";
const SOCIAL_WORK_CAPTION_2 =
  "HSYWE: Weekly Individual Case Management and Group Classes with Refugee and Non-Refugee Women from the community to help them upskill and integrate into society. We also collaborated to successfully complete a 200+ participant Walkathon event.";

// "Projects & Events Management" gallery captions. Grammar/spelling
// corrected from the originally supplied text (typos like "on going" ->
// "ongoing", "delivereddelivered" -> "delivered", "SEEDs" -> "Seeds",
// "premiere league" -> "Premier League", "desitantion" -> "destination",
// "compettion" -> "competition", missing articles/colons/hyphens added)
// without adding or removing any of the actual content.
const DAYA_FOUNDATION_CAPTION_PREFIX =
  "Daya Foundation: Project Lead: Ideated and delivered an ongoing Project/Programme with a team of three aimed at bringing students from Government Schools for engagement sessions outside academics. Engagement session: ";
const CONSTITUTION_WEEK_CAPTION_PREFIX =
  "Program Coordinator: Constitution Week Celebration: Led the program with multiple sub-committees and brought together many stakeholders to celebrate the Constitution. One of the many parts of the program: ";

const PROJECTS_EVENTS_CAPTION_1 = DAYA_FOUNDATION_CAPTION_PREFIX + "Introduction Session.";
const PROJECTS_EVENTS_CAPTION_2 = DAYA_FOUNDATION_CAPTION_PREFIX + "Artist Session.";
const PROJECTS_EVENTS_CAPTION_3 = DAYA_FOUNDATION_CAPTION_PREFIX + "Discussion Session.";
const PROJECTS_EVENTS_CAPTION_4 = DAYA_FOUNDATION_CAPTION_PREFIX + "Barista.";
const PROJECTS_EVENTS_CAPTION_5 = DAYA_FOUNDATION_CAPTION_PREFIX + "Drone and Robotics.";
const PROJECTS_EVENTS_CAPTION_6 =
  "Seeds Nepal: Continued Program from Daya Foundation to Seeds Nepal. Project Lead: Ideated and delivered an ongoing Project/Programme with a team of three aimed at bringing students from Government Schools for engagement sessions outside academics: Another Group Session.";
const PROJECTS_EVENTS_CAPTION_7 =
  "Seeds Nepal: Project Lead: Ideated and delivered with a team of three and over 10 college ambassadors a couple of fundraisers: Book Sale and World Cup Prediction, raising over a hundred thousand NRs to fund Solar Lanterns for a rural village in Nepal.";
const PROJECTS_EVENTS_CAPTION_8 = CONSTITUTION_WEEK_CAPTION_PREFIX + "Cultural Dance.";
const PROJECTS_EVENTS_CAPTION_9 = CONSTITUTION_WEEK_CAPTION_PREFIX + "Stakeholder Interview.";
const PROJECTS_EVENTS_CAPTION_10 =
  "Event Lead: Promotional Event For StudyHub Consultancy: Ideated and Delivered a Fantasy Premier League to build a community of young people interested in football who might need future support in educational endeavours.";
const PROJECTS_EVENTS_CAPTION_11 =
  "Event Lead: Promotional Event For Impact Hub: Ideated and Delivered a promotional event at Cargo Cafe of Impact Hub to promote the location, which was developed as a shared working space for startups.";
const PROJECTS_EVENTS_CAPTION_12 =
  "Event Lead: Promotional Event For Hotel Himalayan Inn: Ideated and Delivered a promotional event to promote the hotel located at a place called Pokhara (a major tourist destination in Nepal) by asking people to write about Pokhara, tag the hotel on a social media post, and the highest likes would win the competition.";

// "Social Ideas & Technology" gallery captions. Same pattern as the
// Projects & Events Management gallery: one caption per photo,
// grammar/spelling corrected from the originally supplied text
// ("Cofounder" -> "Co-founder", "Ride Sharing...trainings" ->
// "ride-sharing...training", "onbaording" -> "onboarding", "Wordress" ->
// "WordPress", "yoast" -> "Yoast", missing articles added, em dashes
// replaced with plain punctuation) without adding or removing any of the
// actual content.
const SOCIAL_IDEAS_TECH_CAPTION_ANYTIME_TOILET =
  "Co-founder: Anytime Toilet: App partnering with restaurants for restrooms for commuters of all abilities. Won: Action for SDGs by AIESEC, and Smart Urban Technology Challenge.";
const SOCIAL_IDEAS_TECH_CAPTION_TV_INTERVIEW =
  "Represented ATT on national television, sharing ideas and perspectives on social entrepreneurship, SDGs, and ATT.";
const SOCIAL_IDEAS_TECH_CAPTION_SARARA =
  "Provided strategic support for Sarara Nepal on their payment gateway implementation and ride-sharing rider training and onboarding.";
const SOCIAL_IDEAS_TECH_CAPTION_FOODIEPLACE =
  "Worked as a Product Assistant/Assistant to the CEO of Foodieplace, a product of Braindigit, in optimising the application, partnering and onboarding restaurants, and running discovery that surfaced the need for quality pictures, which led to a massive photo campaign, followed by social media promotion of those photos, generating over 1,000 orders.";
const SOCIAL_IDEAS_TECH_CAPTION_FREELANCE_WEBSITES =
  "Worked as a Freelancer to deliver two websites (Shakta Technology, with its logo, and Aarushree Life Sciences, an e-commerce site), also configuring and establishing foundational SEO with WordPress, Search Console, Google Analytics, and Yoast, using methods preached by Neil Patel. (Note: these are the new versions of the sites; my versions were since updated by the client.)";
const SOCIAL_IDEAS_TECH_CAPTION_HULT_PRIZE =
  "Represented Kathmandu University as a runner-up, with a team of three, at the Hult Prize Regional Malaysia, for a Drone Medicine Delivery Concept.";

// "MBA & Work at Carbar" gallery captions. Same pattern as the other
// galleries: grammar/spelling corrected from the originally supplied text
// ("submiting" -> "submitting", "10 plus" -> "10+", "Spare part
// management system" -> "a spare parts management system", missing
// articles added, em dash removed) without adding or removing any of the
// actual content.
const MBA_CARBAR_CAPTION_COMMON_GROUND =
  "Deakin Placement: Worked as an Analyst for Common Ground on Climate, submitting a report analysing over 500 green ideas to identify the one with the best scalability, feasibility, commercial viability, and environmental impact.";
const MBA_CARBAR_CAPTION_MENTOR =
  "Deakin Student Mentor: Mentored 10+ new fellow scholars on transitioning into a new university, with a new setup, both digital and physical, and was awarded the Outstanding Student Mentor Award.";
const MBA_CARBAR_CAPTION_FREELANCING_HUB =
  "Deakin Freelancing Hub Consultancy Experience: Worked with Nunawading Toy Library, Victoria, in a team of six, providing the library with local marketing strategies, membership engagement programs, a spare parts management system, and social media marketing posts.";
const MBA_CARBAR_CAPTION_BOWATER =
  'Deakin Competition: Runner-up for the Deakin Bowater Business Challenge, working with a team member on "The Koko Black Employee Value Proposition: premium chocolate by accomplished chocolatiers."';
const MBA_CARBAR_CAPTION_FLEET_ADMIN =
  "Administered a fleet of 1,500+ vehicles (invoicing, renewals, stock monitoring, catalogue maintenance), resolving complex vehicle transfer and fines issues with state authorities.";
const MBA_CARBAR_CAPTION_AUTOMATION =
  "Built local automation scripts that saved 4+ hours daily across fleet renewals, toll assignments, invoicing, and monthly statements, while maintaining data security, and created a script that helped with fleet data migration during acquisition.";
const MBA_CARBAR_CAPTION_INSPECTION_TOOL =
  "Designed a Condition Report/Inspection Tool that can be used by Fleet Ops to submit condition reports. Presented the concept to the CEO; time constraints prevented in-house development and led to pursuing a vendor collaboration instead.";
const MBA_CARBAR_CAPTION_SALE_EVENT =
  "Represented the company at a Sale/Event promoting novated leasing and subscription, and also designed a QR-code-based game to award the winner with company merch.";
const MBA_CARBAR_CAPTION_FINES_PROCESS =
  'Streamlined the "do as it happens" fines process into a structured ticket, email and Slack system, training and leading a fines team of 6+ floating members to process 100+ monthly nominations with zero errors or deadline breaches. Transferable to building lightweight process systems and coaching distributed teams as a Product Owner.';
const MBA_CARBAR_CAPTION_CONTENT_EDITOR =
  "Fun Project: Worked as Content Editor for the podcast, creating thumbnails, social media plans, and editing videos, shorts, and short bite-sized videos.";
const MBA_CARBAR_CAPTION_LAUNCHED_PODCAST =
  "Fun Project: Launched a podcast with my brother, handling all the content creation, from recording and editing to publishing across digital media in different formats.";

// "Launched Products" gallery captions (grammar/spelling corrected from the
// supplied text without adding or removing content).
const LAUNCHED_CAPTION_RC =
  "Launched a service to help Australian businesses find remote collaborators and contractors from overseas. Worked with 4 different clients.";
const LAUNCHED_CAPTION_HR_TOOL =
  "Worked with a squad of 4 members to deliver an HR tool to manage remote collaborator operations, acting as an admin between collaborators and businesses, with specific systems built for all three user types.";
const LAUNCHED_CAPTION_WC_LAUNCH =
  "Launched Wholesale Console as a case study product to demonstrate the abilities of our remote collaborators, working with 3 more squads of 5-6 members each.";
const LAUNCHED_CAPTION_WC_DATA =
  "Wholesale Console consolidated Australian automobile auction data with the help of a Python-based research engine, where the data was dispatched through the web application.";
const LAUNCHED_CAPTION_WC_CONDITION =
  "Condition Report Marketplace inside Wholesale Console.";
const LAUNCHED_CAPTION_WC_CMS =
  "Created a content management system to create media pages and SEO/GEO-targeted pages to promote the application.";

// "Volunteering and Looking for New Opportunities" gallery captions
// (grammar corrected from the supplied text without changing the content).
const MITE_CAPTION_TRENDS =
  "Digital Product and Growth Volunteer, MITE Radio: Researching trends using data from Google Analytics, Search Console, Bing Webmaster and Google Ads, and using the Ads planner to convert that data into new adverts. Transferable to data-informed roadmap decisions as a Product Owner.";
const MITE_CAPTION_GROWTH =
  "Digital Product and Growth Volunteer, MITE Radio: Reviewing and improving growth strategy with Google Ads, maximising the benefits of a $10,000 per month Google Ad Grant. Transferable to growth strategy and budget-accountable decision making as a Product Owner.";
const MITE_CAPTION_MONITORING =
  "Digital Product and Growth Volunteer, MITE Radio: Monitoring and maintaining Google Search Console, Google Analytics and the website separately, concurrently and together. Transferable to continuous platform monitoring and reporting cadence as a Product Owner.";
const MITE_CAPTION_DISCOVERY =
  "Digital Product and Growth Volunteer, MITE Radio: Reviewing on-air programs, social media, website and distribution platforms, recommending improvements and identifying new partnerships for the radio's sustainability. Transferable to product discovery and partnership strategy as a Product Owner.";
const MITE_CAPTION_ONBOARDING =
  "Digital Product and Growth Volunteer, MITE Radio: Assisting with onboarding and exit systems for volunteers alongside other digital and organisational projects. Transferable to onboarding process design, administration and stakeholder systems as a Product Owner.";
const MITE_CAPTION_REPORT =
  "Digital Product and Growth Volunteer, MITE Radio: Highlight: Delivered the radio's digital performance baseline report: a dashboard summarising Google Ads performance across the last 30 days, 3 months and 12 months, alongside a Google Search Console and Analytics summary covering user behaviour, discovery, click sources, and time spent on platform. Transferable to baseline reporting and analytics-led roadmap prioritisation as a Product Owner.";

// Shown as a fixed note at the bottom of the Memory Lane page only, just
// above the music control, for as long as that page is the current one.
const TIMELINE_CREDITS_NOTE =
  "Links to all organisations and credits for the photos are available on the Credits page.";

// Test content for the new scrollytelling timeline section (js/timeline.js),
// inserted right after the hero. Placeholder events/colors for now, to prove
// the scroll mechanic out before real dates/images replace them.
const TIMELINE = [
  {
    range: "2015 to 2016",
    events: [
      {
        label: "Social Work",
        // shown as its own text-only stop right before this event
        textBefore: "Drive to create meaningful Impact, led to Social Work.",
        color: "#2e4a7a",
        images: [
          { src: "assets/timeline/social-work-1.webp", w: 1400, h: 700, caption: SOCIAL_WORK_CAPTION_1 },
          { src: "assets/timeline/social-work-2.webp", w: 1260, h: 980, caption: SOCIAL_WORK_CAPTION_2 }
        ]
      },
      {
        // a non-breaking space (not a plain " ") between "Projects" and
        // "&" keeps them on the same line — js/timeline.js's one-word-per-
        // line split only breaks on plain spaces
        label: "Projects & Events Management",
        textBefore: "Evolving from direct client work toward leading impactful projects and events.",
        color: "#7a3b2e",
        images: [
          { src: "assets/timeline/projects-events-1.webp", w: 1391, h: 1400, caption: PROJECTS_EVENTS_CAPTION_1 },
          { src: "assets/timeline/projects-events-2.webp", w: 1397, h: 1400, caption: PROJECTS_EVENTS_CAPTION_2 },
          { src: "assets/timeline/projects-events-3.webp", w: 1400, h: 977, caption: PROJECTS_EVENTS_CAPTION_3 },
          { src: "assets/timeline/projects-events-4.webp", w: 1400, h: 977, caption: PROJECTS_EVENTS_CAPTION_4 },
          { src: "assets/timeline/projects-events-5.webp", w: 1397, h: 1400, caption: PROJECTS_EVENTS_CAPTION_5 },
          { src: "assets/timeline/projects-events-6.webp", w: 1374, h: 1398, caption: PROJECTS_EVENTS_CAPTION_6 },
          { src: "assets/timeline/projects-events-7.webp", w: 1375, h: 1400, caption: PROJECTS_EVENTS_CAPTION_7 },
          { src: "assets/timeline/projects-events-8.webp", w: 1400, h: 926, caption: PROJECTS_EVENTS_CAPTION_8 },
          { src: "assets/timeline/projects-events-9.webp", w: 1400, h: 860, caption: PROJECTS_EVENTS_CAPTION_9 },
          { src: "assets/timeline/projects-events-10.webp", w: 1400, h: 791, caption: PROJECTS_EVENTS_CAPTION_10 },
          { src: "assets/timeline/projects-events-11.webp", w: 1660, h: 928, caption: PROJECTS_EVENTS_CAPTION_11 },
          { src: "assets/timeline/projects-events-12.webp", w: 1660, h: 902, caption: PROJECTS_EVENTS_CAPTION_12 }
        ]
      },
      {
        // "Social", "Ideas" and "&" are joined with non-breaking spaces so
        // they read as one line under the one-word-per-line rule; only
        // "Technology" wraps to its own line. Kept in this (2015-2016)
        // group rather than the "2022" group below so the year marker
        // lands right after this event, not before it.
        label: "Social Ideas & Technology",
        textBefore: "Evolving from event, fundraising, and term projects into launching sustainable social ventures and digital solutions.",
        color: "#3b7a2e",
        images: [
          { src: "assets/timeline/social-ideas-tech-1.webp", w: 900, h: 802, caption: SOCIAL_IDEAS_TECH_CAPTION_ANYTIME_TOILET },
          { src: "assets/timeline/social-ideas-tech-2.webp", w: 900, h: 802, caption: SOCIAL_IDEAS_TECH_CAPTION_ANYTIME_TOILET },
          { src: "assets/timeline/social-ideas-tech-3.webp", w: 900, h: 802, caption: SOCIAL_IDEAS_TECH_CAPTION_ANYTIME_TOILET },
          { src: "assets/timeline/social-ideas-tech-4.webp", w: 916, h: 540, caption: SOCIAL_IDEAS_TECH_CAPTION_TV_INTERVIEW },
          { src: "assets/timeline/social-ideas-tech-5.webp", w: 1400, h: 938, caption: SOCIAL_IDEAS_TECH_CAPTION_SARARA },
          { src: "assets/timeline/social-ideas-tech-6.webp", w: 2000, h: 1126, caption: SOCIAL_IDEAS_TECH_CAPTION_SARARA },
          { src: "assets/timeline/social-ideas-tech-7.webp", w: 698, h: 955, caption: SOCIAL_IDEAS_TECH_CAPTION_FOODIEPLACE },
          { src: "assets/timeline/social-ideas-tech-8.webp", w: 1400, h: 827, caption: SOCIAL_IDEAS_TECH_CAPTION_FOODIEPLACE },
          { src: "assets/timeline/social-ideas-tech-9.webp", w: 2000, h: 1098, caption: SOCIAL_IDEAS_TECH_CAPTION_FREELANCE_WEBSITES },
          { src: "assets/timeline/social-ideas-tech-10.webp", w: 1400, h: 743, caption: SOCIAL_IDEAS_TECH_CAPTION_FREELANCE_WEBSITES },
          { src: "assets/timeline/social-ideas-tech-11.webp", w: 460, h: 620, caption: SOCIAL_IDEAS_TECH_CAPTION_HULT_PRIZE }
        ]
      }
    ]
  },
  {
    // marker text only ever reads the first word (js/timeline.js) — moved
    // from 2016 to 2022 per direction, third group's "2017" stays as-is
    range: "2022",
    events: [
      {
        // "MBA,"+"Carbar," and "and"+"Fun"+"Projects" are joined with
        // non-breaking spaces so each group reads as one line under the
        // one-word-per-line rule, wrapping to exactly two lines:
        // "MBA, Carbar," / "and Fun Projects"
        label: "MBA, Carbar, and Fun Projects",
        textBefore: "Pursuing an analytics MBA at Deakin while supporting student life through employment at Carbar.",
        color: "#6a2e7a",
        images: [
          { src: "assets/timeline/mba-carbar-1.webp", w: 2000, h: 1161, caption: MBA_CARBAR_CAPTION_COMMON_GROUND },
          { src: "assets/timeline/mba-carbar-2.webp", w: 1400, h: 748, caption: MBA_CARBAR_CAPTION_MENTOR },
          { src: "assets/timeline/mba-carbar-3.webp", w: 1400, h: 1237, caption: MBA_CARBAR_CAPTION_FREELANCING_HUB },
          { src: "assets/timeline/mba-carbar-4.webp", w: 1400, h: 726, caption: MBA_CARBAR_CAPTION_BOWATER },
          { src: "assets/timeline/mba-carbar-5.webp", w: 1400, h: 781, caption: MBA_CARBAR_CAPTION_FLEET_ADMIN },
          { src: "assets/timeline/mba-carbar-6.svg", w: 1200, h: 850, caption: MBA_CARBAR_CAPTION_AUTOMATION },
          { src: "assets/timeline/mba-carbar-7.webp", w: 1182, h: 832, caption: MBA_CARBAR_CAPTION_INSPECTION_TOOL },
          { src: "assets/timeline/mba-carbar-8.webp", w: 1232, h: 832, caption: MBA_CARBAR_CAPTION_INSPECTION_TOOL },
          { src: "assets/timeline/mba-carbar-9.webp", w: 806, h: 725, caption: MBA_CARBAR_CAPTION_INSPECTION_TOOL },
          { src: "assets/timeline/mba-carbar-10.webp", w: 1400, h: 713, caption: MBA_CARBAR_CAPTION_SALE_EVENT },
          { src: "assets/timeline/mba-carbar-11.svg", w: 1200, h: 850, caption: MBA_CARBAR_CAPTION_FINES_PROCESS },
          { src: "assets/timeline/mba-carbar-12.webp", w: 1400, h: 829, caption: MBA_CARBAR_CAPTION_CONTENT_EDITOR },
          { src: "assets/timeline/mba-carbar-13.webp", w: 1229, h: 1400, caption: MBA_CARBAR_CAPTION_LAUNCHED_PODCAST }
        ]
      },
      // the "2017 to 2018" marker/group was removed — this event now
      // continues directly under the "2022" marker instead of getting a
      // year stop of its own
      {
        label: "Launched Products",
        textBefore: "Leaving my job to finalise my visa provided me with the opportunity to focus on my passion as a Product Owner and Builder.",
        color: "#b5892b",
        images: [
          { src: "assets/timeline/launched-products-1.svg", w: 1200, h: 850, caption: LAUNCHED_CAPTION_RC },
          { src: "assets/timeline/launched-products-2.webp", w: 1200, h: 780, caption: LAUNCHED_CAPTION_HR_TOOL },
          { src: "assets/timeline/launched-products-3.webp", w: 1200, h: 820, caption: LAUNCHED_CAPTION_WC_LAUNCH },
          { src: "assets/timeline/launched-products-4.webp", w: 1200, h: 920, caption: LAUNCHED_CAPTION_WC_DATA },
          { src: "assets/timeline/launched-products-5.webp", w: 1200, h: 970, caption: LAUNCHED_CAPTION_WC_CONDITION },
          { src: "assets/timeline/launched-products-6.svg", w: 1200, h: 850, caption: LAUNCHED_CAPTION_WC_CMS }
        ]
      }
    ]
  },
  {
    range: "2026",
    events: [
      {
        // "and"+"Looking"+"for" and "New"+"Opportunities" are joined with
        // non-breaking spaces so each group reads as one line under the
        // one-word-per-line rule, wrapping to exactly three lines:
        // "Volunteering" / "and Looking for" / "New Opportunities"
        textBefore: "With my visa finalised, I am looking for my next role to build and scale innovative products in this new age (age of AI).",
        label: "Volunteering and Looking for New Opportunities",
        color: "#7a2e4a",
        images: [
          { src: "assets/timeline/volunteering-1.svg", w: 1200, h: 850, caption: MITE_CAPTION_TRENDS },
          { src: "assets/timeline/volunteering-2.svg", w: 1200, h: 850, caption: MITE_CAPTION_GROWTH },
          { src: "assets/timeline/volunteering-3.svg", w: 1200, h: 850, caption: MITE_CAPTION_MONITORING },
          { src: "assets/timeline/volunteering-4.svg", w: 1200, h: 850, caption: MITE_CAPTION_DISCOVERY },
          { src: "assets/timeline/volunteering-5.svg", w: 1200, h: 850, caption: MITE_CAPTION_ONBOARDING },
          { src: "assets/timeline/volunteering-6.svg", w: 1200, h: 850, caption: MITE_CAPTION_REPORT }
        ]
      }
    ]
  }
];
