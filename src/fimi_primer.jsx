
import { useState, useEffect, useRef } from "react";

const sections = [
  { id: "definitions", label: "01 — Definitions & Taxonomy" },
  { id: "history", label: "02 — Historical Roots" },
  { id: "actors", label: "03 — Threat Actors" },
  { id: "operations", label: "04 — Documented Operations" },
  { id: "counter", label: "05 — Counter-FIMI Frameworks" },
  { id: "organisations", label: "06 — Key Organisations" },
  { id: "sources", label: "07 — Curated Sources" },
  { id: "ai", label: "08 — AI & FIMI" },
  { id: "quickrefs", label: "09 — Quick Refs" },
];

const Tag = ({ children, color = "slate" }) => {
  const colors = {
    red: "bg-red-900/40 text-red-300 border-red-700/50",
    amber: "bg-amber-900/40 text-amber-300 border-amber-700/50",
    blue: "bg-blue-900/40 text-blue-300 border-blue-700/50",
    green: "bg-green-900/40 text-green-300 border-green-700/50",
    slate: "bg-slate-700/40 text-slate-300 border-slate-600/50",
    purple: "bg-purple-900/40 text-purple-300 border-purple-700/50",
    orange: "bg-orange-900/40 text-orange-300 border-orange-700/50",
  };
  return (
    <span className={`inline-block text-xs font-mono px-2 py-0.5 rounded border ${colors[color]} mr-1 mb-1`}>
      {children}
    </span>
  );
};

const Cite = ({ children }) => (
  <span className="text-slate-400 text-xs font-mono ml-1 italic">[{children}]</span>
);

const SectionHeader = ({ number, title, subtitle }) => (
  <div className="mb-10 pb-6 border-b border-slate-700">
    <div className="text-slate-500 font-mono text-sm mb-1">{number}</div>
    <h2 className="text-3xl font-bold text-slate-100 tracking-tight mb-2"
        style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>
      {title}
    </h2>
    {subtitle && <p className="text-slate-400 text-base leading-relaxed">{subtitle}</p>}
  </div>
);

const Callout = ({ type = "note", children }) => {
  const styles = {
    note: "border-blue-600/50 bg-blue-950/30 text-blue-200",
    warning: "border-amber-600/50 bg-amber-950/30 text-amber-200",
    key: "border-emerald-600/50 bg-emerald-950/30 text-emerald-200",
    critical: "border-red-600/50 bg-red-950/30 text-red-200",
  };
  const labels = { note: "NOTE", warning: "CAUTION", key: "KEY CONCEPT", critical: "CRITICAL" };
  return (
    <div className={`border-l-2 pl-4 py-3 pr-4 rounded-r my-5 ${styles[type]}`}>
      <div className="text-xs font-mono font-bold mb-1 opacity-70">{labels[type]}</div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const TermBox = ({ term, definition, source }) => (
  <div className="border border-slate-700 rounded p-4 mb-4 bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
    <div className="font-mono text-amber-400 text-sm font-bold mb-1">{term}</div>
    <div className="text-slate-300 text-sm leading-relaxed">{definition}</div>
    {source && <div className="text-slate-500 text-xs font-mono mt-2">Source: {source}</div>}
  </div>
);

const Timeline = ({ events }) => (
  <div className="relative pl-6 border-l border-slate-700 space-y-6 my-6">
    {events.map((e, i) => (
      <div key={i} className="relative">
        <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400 mt-1" />
        <div className="text-amber-400 font-mono text-xs mb-1">{e.date}</div>
        <div className="font-semibold text-slate-200 text-sm">{e.title}</div>
        <div className="text-slate-400 text-sm mt-1 leading-relaxed">{e.desc}</div>
        {e.cite && <div className="text-slate-600 text-xs font-mono mt-1">{e.cite}</div>}
      </div>
    ))}
  </div>
);

const ActorCard = ({ name, type, flag, methods, notable, label }) => (
  <div className="border border-slate-700 rounded-lg p-5 mb-5 bg-slate-800/20 hover:border-slate-500 transition-colors">
    <div className="flex items-start justify-between mb-3">
      <div>
        <span className="text-slate-500 text-xs font-mono mr-2">{flag}</span>
        <span className="text-slate-100 font-bold text-lg" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>{name}</span>
      </div>
      <Tag color={label}>{type}</Tag>
    </div>
    <div className="mb-3">
      <div className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-2">Primary Methods</div>
      <div className="flex flex-wrap gap-1">{methods.map((m, i) => <Tag key={i} color="slate">{m}</Tag>)}</div>
    </div>
    <div>
      <div className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-1">Notable Activity</div>
      <p className="text-slate-300 text-sm leading-relaxed">{notable}</p>
    </div>
  </div>
);

const OrgCard = ({ name, type, country, desc, url, crossover }) => (
  <div className="border border-slate-700 rounded p-4 mb-4 bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
    <div className="flex items-start justify-between mb-2">
      <div className="font-semibold text-slate-100 text-sm">{name}</div>
      <div className="flex gap-1 flex-shrink-0 ml-2">
        <Tag color={type === "Government/Intergovernmental" ? "blue" : type === "Civil Society/Research" ? "green" : type === "Private Sector" ? "amber" : "slate"}>{type}</Tag>
        {crossover && <Tag color="purple">↗ Crossover</Tag>}
      </div>
    </div>
    <div className="text-slate-500 text-xs font-mono mb-2">{country}</div>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    {crossover && <p className="text-purple-300 text-xs mt-2 italic">🔗 {crossover}</p>}
    {url && <a href={url} target="_blank" rel="noopener noreferrer" className="text-amber-500 text-xs font-mono mt-2 block hover:text-amber-400">{url}</a>}
  </div>
);

const SourceCard = ({ title, type, author, year, desc, url, rating }) => (
  <div className="border border-slate-700 rounded p-4 mb-4 bg-slate-800/20">
    <div className="flex items-start justify-between mb-1">
      <Tag color={type === "Book" ? "amber" : type === "Podcast" ? "green" : type === "Journal" ? "blue" : type === "Database/Tool" ? "red" : "slate"}>{type}</Tag>
      <span className="text-amber-400 text-xs">{rating}</span>
    </div>
    <div className="font-semibold text-slate-100 text-sm mb-1">{title}</div>
    {author && <div className="text-slate-400 text-xs font-mono mb-2">{author}{year && ` · ${year}`}</div>}
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    {url && <a href={url} target="_blank" rel="noopener noreferrer" className="text-amber-500 text-xs font-mono mt-2 block hover:text-amber-400 break-all">{url}</a>}
  </div>
);

export default function FIMIPrimer() {
  const [active, setActive] = useState("definitions");
  const [menuOpen, setMenuOpen] = useState(false);
  const contentRef = useRef(null);

  const scrollToTop = () => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };

  useEffect(() => { scrollToTop(); }, [active]);

  const content = {
    definitions: (
      <div>
        <SectionHeader
          number="SECTION 01"
          title="Definitions & Taxonomy"
          subtitle="The conceptual architecture of FIMI, and why precision of language matters enormously in this field."
        />

        <p className="text-slate-300 leading-relaxed mb-6">
          The vocabulary of information warfare is contested, evolving, and strategically consequential. Getting definitions right is not pedantry — different terms carry different policy implications, legal thresholds, and attribution standards. The shift from "disinformation" to "FIMI" in EU discourse represents a deliberate conceptual upgrade driven by operational necessity.
        </p>

        <h3 className="text-lg font-bold text-amber-400 mb-4" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Core Definitions</h3>

        <TermBox
          term="FIMI — Foreign Information Manipulation and Interference"
          definition="A mostly non-illegal pattern of behaviour that threatens or has the potential to negatively impact values, procedures and political processes. The key distinguishing features are: (1) foreign origin, (2) intentional and coordinated character, (3) deceptive or coercive methods, and (4) interference with democratic processes or institutions. FIMI emphasises the *how* — manipulative tactics and infrastructure — rather than the *what* (truthfulness of content). This matters: amplifying true but selectively chosen information can be FIMI; simply expressing a wrong opinion is not."
          source="EEAS, 1st FIMI Threat Report (2023)"
        />
        <TermBox
          term="Disinformation"
          definition="False or misleading content created and disseminated with the intention to deceive. A narrower concept than FIMI: all disinformation can be a component of FIMI, but FIMI is not reducible to disinformation. A FIMI operation can deploy entirely true information — e.g., selectively amplifying genuine social tensions — without producing a single false claim."
          source="European Commission / EU DisinfoLab"
        />
        <TermBox
          term="Misinformation"
          definition="False or misleading content disseminated without deliberate intent to deceive. The distinction from disinformation is intent, which is often impossible to establish at individual account level — a key reason the FIMI framework focuses on coordinated behaviour patterns rather than individual content."
          source="EU DisinfoLab"
        />
        <TermBox
          term="Active Measures (aktivnye meropriyatiya)"
          definition="The Soviet/Russian term for covert offensive political warfare operations encompassing: disinformation (dezinformatsiya), forgeries, propaganda, agents of influence, front organisations, subversion, sabotage, and 'sharp measures' (assassinations). The term emerged in Soviet doctrine in the 1920s. FIMI is the modern EU policy equivalent, but active measures also encompasses kinetic and cyber elements that FIMI formally does not."
          source="KGB doctrine; Mitrokhin Archives; Rid (2020)"
        />
        <TermBox
          term="Hybrid Warfare"
          definition="A strategy combining conventional military force with non-military instruments — including information operations, cyber attacks, economic coercion, sabotage, and proxy forces — below the threshold of open war. Often attributed to the 'Gerasimov Doctrine', though scholars note this is a Western misreading of a descriptive Russian article, not a formal Russian strategic doctrine. The Russian preferred term is 'New Generation Warfare' (NGW) or 'information confrontation' (informatsionnoye protivoborstvo)."
          source="Gerasimov (2013); Galeotti (2019); Prif Blog (2026)"
        />
        <TermBox
          term="Information Confrontation (Informatsionnoye Protivoborstvo)"
          definition="The Russian military-doctrinal concept treating information as both a weapon and the environment in which conflict occurs. Critically different from Western conceptions: Russian doctrine does not distinguish between peacetime and wartime information operations — the information struggle is permanent and total. This explains why Western analysts were slow to recognise operations that Russia considered a normal continuum of state behaviour."
          source="Russian Military Doctrine; CEPA (2025)"
        />
        <TermBox
          term="Coordinated Inauthentic Behaviour (CIB)"
          definition="A platform governance term coined by Meta/Facebook for the coordinated use of inauthentic accounts or pages to manipulate public discourse while concealing the true identity of the coordinating actor. CIB is one of the primary technical indicators used to detect and attribute FIMI on social media platforms."
          source="Meta Transparency Reports"
        />
        <TermBox
          term="Sharp Power"
          definition="Concept developed by the National Endowment for Democracy (2017) to describe authoritarian states' exploitation of open societies — academia, media, think tanks, cultural institutions — to distort information and suppress speech. Distinguished from 'hard power' (military/economic coercion) and 'soft power' (genuine attraction). Particularly relevant for understanding Chinese influence operations, which rely heavily on elite capture and media ecosystem manipulation rather than overt propaganda."
          source="Walker & Ludwig, NED (2017)"
        />
        <TermBox
          term="TTPs (Tactics, Techniques, and Procedures)"
          definition="Borrowed from cybersecurity threat intelligence, TTPs describe observed patterns of threat actor behaviour: Tactics (operational goals, e.g. 'erode trust in electoral processes'), Techniques (actions used to achieve them, e.g. 'deploy cloned media websites'), Procedures (specific implementation, e.g. 'multi-stage URL redirection to evade platform blacklists'). The EEAS and NATO StratCom COE now apply TTP analysis directly to FIMI, enabling systematic comparison across incidents and actors."
          source="EEAS 2nd FIMI Report (2024); STIX™ framework"
        />
        <TermBox
          term="DISARM Framework"
          definition="A community-developed open framework (analogous to MITRE ATT&CK for cyber) that maps the TTPs of influence operations. Organised into Tactics (e.g. 'Plan Strategy', 'Develop Content', 'Establish Social Assets', 'Drive Online Harms') with sub-techniques. Used by researchers and analysts to standardise documentation and comparison of FIMI campaigns. Increasingly applied in automated detection pipelines."
          source="DISARM Foundation; disarmframework.com"
        />

        <h3 className="text-lg font-bold text-amber-400 mb-4 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Why "FIMI" Over "Disinformation"?</h3>

        <p className="text-slate-300 leading-relaxed mb-4">
          The EU's conceptual pivot to FIMI is analytically important and worth understanding in depth. The problem with "disinformation" as a primary analytical category is threefold:
        </p>
        <ul className="space-y-3 mb-6 pl-4 border-l border-slate-700">
          <li className="text-slate-300 text-sm leading-relaxed"><span className="text-amber-400 font-mono">SCOPE:</span> "Disinformation" focuses on content — the lie itself. FIMI focuses on behaviour — the coordinated, deceptive infrastructure used to manipulate. A FIMI operation can consist entirely of true-but-weaponised information.</li>
          <li className="text-slate-300 text-sm leading-relaxed"><span className="text-amber-400 font-mono">ATTRIBUTION:</span> Labelling content as "disinformation" requires truth-determination. FIMI attribution can proceed on behavioural/technical indicators alone — coordinated posting patterns, shared infrastructure, bot networks — without establishing content falsity. This makes it actionable for sanctions and platform enforcement.</li>
          <li className="text-slate-300 text-sm leading-relaxed"><span className="text-amber-400 font-mono">LEGAL THRESHOLD:</span> FIMI is explicitly defined as "mostly non-illegal" — it operates in the grey zone below existing law. This is the policy challenge: the most effective operations exploit freedoms (speech, association, press) rather than violating laws, making purely legal responses insufficient.</li>
        </ul>

        <Callout type="key">
          The FIMI framework is the EU's attempt to move from a content-moderation paradigm (is this true or false?) to a behavioural-security paradigm (is this coordinated, deceptive, foreign-directed interference?). This shift has profound implications for how you analyse operations, attribute actors, and design responses.
        </Callout>

        <h3 className="text-lg font-bold text-amber-400 mb-4 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>The FIMI Iceberg Model</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          The EEAS Third Report (March 2025) formalised a layered model of FIMI actor attribution — the "FIMI Exposure Matrix" — that distinguishes four levels of channel proximity to the state actor:
        </p>
        <div className="space-y-3 mb-6">
          {[
            { level: "Official State Channels", desc: "Government ministries, state broadcasters (RT, CCTV), official diplomatic social media. Fully attributable but often deniable in specific operations.", color: "red" },
            { level: "State-Controlled Outlets", desc: "Media outlets under state ownership/control that do not publicly disclose this — e.g., NewsFront (registered in occupied Crimea). Overt propaganda, covert ownership.", color: "orange" },
            { level: "State-Linked Channels", desc: "Outlets and accounts that operate under state oversight without disclosed affiliation. Require sustained research to attribute. Operate in the 'grey zone'.", color: "amber" },
            { level: "State-Aligned Channels", desc: "Cannot be directly linked to state control but show consistent pattern alignment with state narratives via shared infrastructure, amplification patterns, and behavioural signatures. Deniability maximised.", color: "green" },
          ].map((l, i) => (
            <div key={i} className="flex gap-3 items-start">
              <Tag color={l.color}>L{i + 1}</Tag>
              <div>
                <span className="text-slate-200 text-sm font-semibold">{l.level}: </span>
                <span className="text-slate-400 text-sm">{l.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <Callout type="note">
          The iceberg framing matters: in 2024, EEAS analysis of 505 incidents found that the vast majority of FIMI activity occurs at Levels 3 and 4 — the covert, deniable layers. <Cite>EEAS 3rd FIMI Report, March 2025</Cite>
        </Callout>
      </div>
    ),

    history: (
      <div>
        <SectionHeader
          number="SECTION 02"
          title="Historical Roots"
          subtitle="Information warfare is not a product of the internet age. It has deep institutional roots in Soviet political warfare doctrine that directly shape contemporary Russian practice."
        />
        <p className="text-slate-300 leading-relaxed mb-6">
          Understanding the history is not merely context-setting. Contemporary Russian FIMI is consciously continuous with Soviet active measures doctrine — Putin, himself a KGB officer, explicitly reconstituted the Cold War playbook for the digital age. The operational logic, institutional culture, and strategic objectives are recognisably the same; only the infrastructure has been updated.
        </p>

        <h3 className="text-lg font-bold text-amber-400 mb-4" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Soviet Origins: 1923–1991</h3>

        <Timeline events={[
          {
            date: "1923",
            title: "The Dezinformatsiya Bureau Founded",
            desc: "Deputy Chairman of the GPU (KGB precursor) Józef Unszlicht formally creates 'a special disinformation office to conduct active intelligence operations.' This is the first institutionalised state disinformation apparatus in history. The GPU coined the term dezinformatsiya — later anglicised as disinformation — derived from their concept of 'manipulation of a nation's intelligence system through the injection of credible but misleading data.'",
            cite: "Soviet archives; William Safire (1993)"
          },
          {
            date: "1920s–30s",
            title: "Operation TRUST — The First Fake Network",
            desc: "A landmark early active measure: the OGPU (successor to GPU) created a fake monarchist opposition group, the 'Monarchist Union of Central Russia,' to lure White Russian émigré operatives back into Soviet territory for capture or neutralisation. It successfully deceived Western intelligence services for years. TRUST established the playbook of 'false flag' operations — creating fake entities to trap, misdirect, or control opponents.",
            cite: "Mitrokhin Archives; Rid (2020)"
          },
          {
            date: "1950s",
            title: "Service A Becomes a Directorate",
            desc: "KGB active measures operations grow sufficiently important that Service A — responsible for disinformation, forgeries, propaganda, and front organisations — is elevated to its own Directorate within the KGB's First Chief Directorate (foreign intelligence). KGB political officers stationed overseas were expected to spend approximately a quarter of their time on active measures.",
            cite: "Engelsberg Ideas (2022)"
          },
          {
            date: "1961",
            title: "Operation Against Allen Dulles",
            desc: "KGB publishes a forged pamphlet, 'A Study of a Master Spy (Allen Dulles),' in the UK. Attributed to real Labour MP Bob Edwards, the real author was KGB Colonel Vasily Sitnikov. The pamphlet was highly critical of the CIA director. Typical of the era: credible attribution, exploiting legitimate grievances, real-world media placement.",
            cite: "Soviet Disinformation, Wikipedia; Mitrokhin Archives"
          },
          {
            date: "1968–76",
            title: "Election Interference Becomes Standard Practice",
            desc: "KGB active measures target US presidential elections. In 1968, the Soviet leadership secretly offered to subsidise Hubert Humphrey's campaign against anti-Communist Nixon. In 1976, Service A ran 'Operation POROK' to discredit Senator Henry 'Scoop' Jackson — including sending forged FBI letters to media outlets falsely portraying him as gay. The playbook of weaponising personal kompromat and forged official documents is established.",
            cite: "CSIS Brief; Mitrokhin Archives (via Harvard Historian Mark Kramer)"
          },
          {
            date: "1983–1987",
            title: "Operation INFEKTION — The AIDS Disinformation",
            desc: "The most successful Cold War active measure. KGB Service A and East German Stasi (Department X, under Rolf Wagenbreth) launch a disinformation campaign claiming AIDS was manufactured at a US biological warfare facility at Fort Detrick. The operation began with a planted story in the Indian paper Patriot — itself a Soviet front — and weaponised the 'echo effect': the Soviet media then 'reported' the story back as a discovered foreign news item, stripping its Soviet origins. Eventually believed by millions worldwide.",
            cite: "CWIS Archive (ECU); Engelsberg Ideas; Selvage & Nehring academic paper"
          },
          {
            date: "1991",
            title: "Soviet Collapse — The Playbook Survives",
            desc: "The USSR dissolves, but the active measures institutional memory and personnel do not. KGB officers transition to the FSB, SVR, and GRU. The Bulgarian, East German (Stasi), and Romanian secret services' cooperation with KGB active measures — documented in the MIT Press journal article on KGB-Bulgarian DS cooperation — provides a blueprint showing that state collapse does not end the practice, merely interrupts it.",
            cite: "Mitrokhin Archives; MIT Press JCWS (2021)"
          },
        ]} />

        <h3 className="text-lg font-bold text-amber-400 mb-4 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>The 1990s Gap and Digital Reconstitution: 1991–2014</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          The 1990s saw a partial disruption of active measures as Russian intelligence was reorganised and resources shrank. But this period also saw a critical development: the internet created a radically new medium for information operations — one with global reach, zero distribution cost, instant amplification, and built-in anonymity. Putin, ascending to power in 1999 as a career KGB officer, recognised this immediately.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          The 2000s saw the gradual reconstruction of capability. The 2007 cyberattacks on Estonia following the Bronze Soldier statue dispute are often cited as the first major test of hybrid information-plus-cyber operations. The 2008 war with Georgia saw the first coordinated use of information operations alongside kinetic military action in the modern era.
        </p>

        <h3 className="text-lg font-bold text-amber-400 mb-4" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>The Crimea Model and the Pivot to FIMI: 2014–Present</h3>

        <Timeline events={[
          {
            date: "Feb–Mar 2014",
            title: "Crimea Annexation — Hybrid Warfare Template",
            desc: "Russia's annexation of Crimea represents the operational template for modern hybrid warfare. 'Little green men' — unmarked Russian special forces — deployed without insignia, supported by: (1) a disinformation campaign initially denying Russian involvement, (2) Russian-language media flooding the Ukrainian information space with pro-Russian narratives seeded years earlier, (3) local proxy actors, and (4) diplomatic assurances of non-involvement. Putin later admitted the forces were Russian. The entire operation lasted three weeks. The information component was essential to slowing the Western response.",
            cite: "Gerasimov doctrine analysis; multiple sources"
          },
          {
            date: "2015",
            title: "EEAS East StratCom Task Force Created",
            desc: "EU Member States call on the EEAS to address Russian disinformation following Crimea. The East StratCom Task Force — and its public-facing project EUvsDisinfo — is established. This marks the beginning of the EU's institutionalised FIMI monitoring apparatus.",
            cite: "EEAS"
          },
          {
            date: "2016",
            title: "GRU Operation Against the US Election",
            desc: "GRU Units 26165 (Fancy Bear/APT28) and 74455 hack the DNC and Podesta emails; the Internet Research Agency (IRA) runs a troll farm operation. Thomas Rid's analysis concludes that while the troll farm likely changed few votes, 'its main impact was the media hysteria it generated.' The hack-and-leak component is considered far more significant. This operation is 'unprecedented' only in its scale and platform — the strategic logic is entirely continuous with Soviet active measures.",
            cite: "Mueller Report; Rid (2020)"
          },
          {
            date: "2022–present",
            title: "Full-Scale War and FIMI Industrialisation",
            desc: "Russia's February 2022 invasion of Ukraine triggers the highest-intensity FIMI campaign ever recorded. Operations include: Doppelganger (cloned Western media websites), False Façade, Portal Kombat, African Initiative, Voice of Europe (targeting European Parliament), and Storm-1516 (AI-generated content). Russia's 2025 state media budget: approximately €1.18 billion. The EEAS 4th Report (March 2026) documents a 259% increase in AI-assisted FIMI incidents from 2024 to 2025.",
            cite: "EEAS 3rd & 4th FIMI Reports; EUvsDisinfo"
          },
        ]} />

        <Callout type="key">
          The strategic continuity between Soviet dezinformatsiya and contemporary Russian FIMI is the single most important historical insight for practitioners. The technology has changed; the institutional logic, the strategic objectives (weaken Western alliances, drive wedges, exploit social divisions, erode trust in facts), and the operational methods (planted stories, echo effect, agents of influence, kompromat) have not. Thomas Rid's <em>Active Measures</em> (2020) is the canonical text on this continuity.
        </Callout>

        <h3 className="text-lg font-bold text-amber-400 mb-4 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Western Counter-Measures: Historical Precedents</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          The West has countered active measures before — with mixed success. The US Active Measures Working Group (AMWG), established in 1981 under Reagan, successfully exposed Soviet disinformation operations including Operation INFEKTION. Key lessons: (1) interagency coordination was essential; (2) exposure and public attribution raised the cost of operations significantly; (3) the KGB itself noted that Western counter-measures working groups caused 'great concern among the warriors of disinformation.'<Cite>MIT Press JCWS (2021)</Cite> The abrupt disbandment of the AMWG in the 1990s is now widely seen as a strategic error.
        </p>
      </div>
    ),

    actors: (
      <div>
        <SectionHeader
          number="SECTION 03"
          title="Threat Actors"
          subtitle="A structured breakdown of the major state and non-state actors conducting FIMI operations, with particular depth on the Eastern European context."
        />

        <Callout type="note">
          Attribution in FIMI is probabilistic, not binary. The standard is 'technical and behavioural indicators reaching a confidence threshold sufficient for policy action.' Intelligence-grade attribution differs from court-admissible attribution. The public record contains only what has been declassified or independently verified.
        </Callout>

        <h3 className="text-lg font-bold text-amber-400 mb-5 mt-6" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Russia — The Primary Actor</h3>

        <p className="text-slate-300 leading-relaxed mb-5">
          Russia operates the most sophisticated, highest-volume, and most consequential FIMI apparatus globally. Its operations are characterised by institutional depth, long-term horizon planning, and the integration of information operations across diplomatic, intelligence, and military functions.<Cite>EEAS 3rd Report, 2025</Cite>
        </p>

        <div className="mb-6 border border-slate-700 rounded-lg p-5 bg-slate-800/20">
          <h4 className="font-bold text-slate-200 mb-4 text-sm font-mono uppercase tracking-wider">Russian Intelligence Architecture for FIMI</h4>
          <div className="space-y-4">
            {[
              { org: "GRU (Main Intelligence Directorate)", units: "Unit 26165 (APT28/Fancy Bear), Unit 74455 (Sandworm), Unit 29155", role: "Military intelligence. Most aggressive offensive cyber and hack-and-leak operations. APT28 responsible for 2016 DNC hack, macron.leak (2017), and numerous European election operations. Sandworm responsible for NotPetya (2017), Ukrainian power grid attacks. Unit 29155: sabotage, assassination, destabilisation — now recruiting criminal proxies across Europe following mass 2022 expulsions of official officers.", color: "red" },
              { org: "SVR (Foreign Intelligence Service)", units: "APT29 / Cozy Bear", role: "Civilian foreign intelligence. Specialises in long-term, stealthy intelligence collection and strategic espionage. APT29 conducted the SolarWinds supply-chain attack (2020), infiltrating multiple US government and private networks. More measured and patient than GRU. Involved in elite capture — targeting academics, policy figures, and business leaders as long-term influence assets.", color: "orange" },
              { org: "FSB (Federal Security Service)", units: "Turla (Snake) APT group, domestic operations, CyberBerkut proxies", role: "Domestic security and counterintelligence with growing overseas operations. Turla is one of the world's most sophisticated cyber espionage groups, active since at least 2004, targeting governments and defence across 45+ countries. FSB increasingly involved in coordinating criminal proxy networks and political subversion operations in former Soviet space.", color: "amber" },
              { org: "Social Design Agency (SDA / Struktura)", units: "Doppelganger campaign operator", role: "Private Russian company sanctioned by EU and US for running the Doppelganger campaign. Provides plausible deniability by operating as a private entity while receiving state-directed tasking. Represents the 'grey zone' operational model: state capability outsourced to nominally civilian firms.", color: "slate" },
              { org: "Internet Research Agency (IRA)", units: "St. Petersburg troll farm", role: "The now-famous troll farm financed by Yevgeny Prigozhin, operating until Prigozhin's 2023 death. Ran the 2016 US election social media operation. Successor entities continue to operate under different brands. The IRA model — commercial firms providing FIMI services with state direction but private structure — has been widely replicated.", color: "slate" },
            ].map((r, i) => (
              <div key={i} className={`border-l-2 pl-4 ${i === 0 ? 'border-red-600' : i === 1 ? 'border-orange-600' : i === 2 ? 'border-amber-600' : 'border-slate-600'}`}>
                <div className="font-semibold text-slate-200 text-sm">{r.org}</div>
                <div className="text-slate-500 font-mono text-xs mb-1">{r.units}</div>
                <p className="text-slate-400 text-sm leading-relaxed">{r.role}</p>
              </div>
            ))}
          </div>
        </div>

        <h4 className="font-bold text-amber-300 mb-3 text-sm">Russia's Strategic Objectives in FIMI</h4>
        <ul className="space-y-2 mb-6 pl-4">
          {[
            "Undermine Western support for Ukraine — the primary post-2022 FIMI priority",
            "Drive wedges within NATO and EU — exploit immigration, energy, economic inequality fault lines",
            "Influence European elections toward pro-Russian or Eurosceptic parties (EP2024, German, Slovak, Romanian elections)",
            "Destabilise candidate countries — particularly Moldova, Georgia, and Western Balkans states",
            "Maintain frozen conflicts and expand influence in former Soviet space",
            "Degrade trust in democratic institutions and media as an end in itself",
            "Project alternative narrative globally — compete with Western framing in Global South",
          ].map((o, i) => (
            <li key={i} className="text-slate-300 text-sm flex gap-2">
              <span className="text-amber-500 font-mono text-xs mt-0.5">▸</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-bold text-amber-400 mb-4 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>China — The Ascending Actor</h3>

        <p className="text-slate-300 leading-relaxed mb-5">
          China's FIMI operations differ structurally and strategically from Russia's. Where Russia prioritises destabilisation, China primarily seeks to shape a positive international image, suppress criticism of its domestic policies, and expand influence through elite capture and media ecosystem control. The EEAS 4th Report (2026) notes that China's most common tactic is "dismissing" — arguing that criticisms of China are biased — rather than fabrication.<Cite>EEAS 4th Report, March 2026</Cite>
        </p>

        <div className="border border-slate-700 rounded-lg p-5 mb-6 bg-slate-800/20">
          <h4 className="font-bold text-slate-200 mb-4 text-sm font-mono uppercase tracking-wider">Chinese FIMI Architecture</h4>
          <div className="space-y-4">
            {[
              { org: "United Front Work Department (UFWD)", desc: "The CCP's primary tool for managing overseas Chinese communities and influencing foreign governments, institutions, and businesses. UFWD operations are rarely covert propaganda; they focus on elite capture — co-opting academics, politicians, think tankers, and diaspora community leaders. Functions largely through relationship networks, conference funding, and 'people-to-people diplomacy.'" },
              { org: "International Department of the CCP (IDCPC)", desc: "Manages party-to-party relationships and ideological outreach with foreign political parties. Used to build pro-CCP political constituencies within democratic systems." },
              { org: "Spamouflage (Dragon Bridge)", desc: "A large-scale influence operation — documented extensively by Graphika, Stanford Internet Observatory, and Meta — running fake accounts amplifying pro-CCP narratives across Western platforms. Notable for low engagement (often described as a 'broadcast' network shouting into the void) and for the use of AI-generated American personas targeting the 2024 US election cycle." },
              { org: "Chinese State Media (CGTN, Xinhua, Global Times, China Daily)", desc: "Overt influence infrastructure. Content partnerships with local media in Africa, Asia, and increasingly Europe provide a 'laundering' mechanism for CCP narratives through apparently independent local news outlets." },
            ].map((r, i) => (
              <div key={i} className="border-l-2 border-blue-600/50 pl-4">
                <div className="font-semibold text-slate-200 text-sm">{r.org}</div>
                <p className="text-slate-400 text-sm leading-relaxed mt-1">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Callout type="note">
          The EEAS and most Western analysts note that Russia-China FIMI cooperation, while present, remains largely opportunistic rather than coordinated. Cross-posting between the ecosystems occurs — particularly around Ukrainian war narratives and Western multilateral events — but analysts do not find evidence of joint operational planning. The two actors share strategic interests without sharing an operational playbook. <Cite>CEPA (2025); EEAS 4th Report (2026)</Cite>
        </Callout>

        <h3 className="text-lg font-bold text-amber-400 mb-4 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Non-State, Proxy, and Mercenary Actors</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          One of the most significant structural trends in contemporary FIMI is the deliberate outsourcing of operations to provide state deniability. Following the mass expulsion of 400+ Russian intelligence officers from Europe in 2022, the GRU's Unit 29155 pivoted to recruiting low-level criminals, migrants, and extremists via Telegram to conduct physical and informational sabotage operations.<Cite>IISS; GLOBSEC 2025</Cite>
        </p>
        <div className="space-y-4 mb-6">
          {[
            { name: "Wagner Group / Africa Corps", desc: "Yevgeny Prigozhin's mercenary network conducted systematic FIMI operations in the Sahel, Central African Republic, Libya, and Mali — tightly integrated with kinetic operations. Following Prigozhin's 2023 assassination, Russia's military took direct control, rebranding as Africa Corps. The model of embedding information operations within mercenary deployments — controlling local media, expelling French and EU missions, replacing them with pro-Russian narratives — is highly replicable.", region: "Africa / Middle East" },
            { name: "Social Design Agency (SDA) / Structura", desc: "Russian company behind Doppelganger. Sanctioned by EU (Dec 2024) and US (Treasury, March 2024). The AEZA Group, which provided bulletproof hosting services for Doppelganger infrastructure, was sanctioned by US Treasury in July 2025. The model: nominally private firms with state-level tasking and resources, providing operational distance.", region: "EU-wide" },
            { name: "Storm-1516 (John Mark Dougan)", desc: "A particularly well-documented case: former Florida deputy sheriff John Mark Dougan, who received Russian asylum, became a Kremlin-aligned propagandist using AI to generate and amplify false narratives. NewsGuard documented Storm-1516 targeting France with five false narratives between Dec 2024 and March 2025, generating 55.8 million social media views — a 66-fold increase in a single season.", region: "France, Europe, US" },
            { name: "Domestic Proxy Networks", desc: "In multiple EU and candidate countries, Russia works through domestically embedded proxy structures: political parties (Slovak Smer, Hungarian Fidesz-adjacent actors, Bulgarian pro-Russian parties), religious institutions (Russian Orthodox Church abroad), business networks, and organised crime. These actors are domestically legitimate, making takedown exceptionally difficult.", region: "Eastern/Central Europe" },
          ].map((a, i) => (
            <div key={i} className="border border-slate-700 rounded p-4 bg-slate-800/20">
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold text-slate-200 text-sm">{a.name}</span>
                <Tag color="red">{a.region}</Tag>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold text-amber-400 mb-4 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Eastern European Context in Depth</h3>

        <p className="text-slate-300 leading-relaxed mb-4">
          Eastern Europe is the most contested information battleground globally. Several structural factors explain this: geographic proximity to Russia, significant Russian-speaking minority populations, Soviet-era institutional penetration, fragile or newly established democratic institutions, and the direct military conflict in Ukraine as a backdrop and pretext for operations.
        </p>

        <div className="space-y-4 mb-6">
          {[
            { country: "Ukraine", desc: "The primary target of Russian FIMI globally since 2014. Russian information operations in Ukraine began in 2013-14, seeding narratives about NATO aggression, Ukrainian 'fascism', and Russian historical legitimacy that were activated at full scale in 2022. Ukrainian counter-FIMI capacity is now among the world's most advanced, with the Centre for Strategic Communications and Information Security (SPRAVDI) as the primary state actor. Ukraine has become a live laboratory for both offensive and defensive information operations." },
            { country: "Moldova", desc: "A case study in Russian FIMI against an EU candidate country. The 2024 presidential elections and EU membership referendum saw Russia deploy the most complex documented FIMI infrastructure against a small country: state-aligned social media networks, religious and civil society proxies, Russian-issued passports and cash payments to voter networks, and covert media amplification. The EEAS Third Report (2025) uses Moldova as the primary case study. Despite the campaign, President Maia Sandu won re-election and the EU referendum passed." },
            { country: "Romania", desc: "The 2024 Romanian presidential elections were annulled in the first round after the Constitutional Court found evidence of TikTok algorithm manipulation — Russian actors had manipulated TikTok's recommendation systems to amplify far-right candidate Călin Georgescu. French intelligence agency VIGINUM documented the modus operandi: covert recruitment of TikTok influencers to shape the recommendation environment. This was the first annulment of an EU election result due to documented FIMI." },
            { country: "Georgia", desc: "Georgia's information environment is contested between Russian and Western frames. The 2024 Georgian Dream government's passage of a 'Foreign Agents Law' — mirroring Russian legislation — is itself widely interpreted as a FIMI success: Russia successfully exported its domestic media-control toolkit via proxy political actors. Anti-Western narratives from the government spread organically on Facebook, creating a domestic amplifier network." },
            { country: "Western Balkans", desc: "Serbia is the primary vector. Pro-Russian narratives on EU and NATO enlargement circulate across the Balkans, exploiting historical Orthodox Christian identity politics. The report by the Council of Europe (2025) documents how anti-EU narratives originating in Russia spill across Balkan linguistic-cultural communities with 'mutual intelligibility.' Serbia's information environment is used as a hub from which narratives radiate to neighbouring countries." },
            { country: "Baltic States", desc: "Estonia, Latvia, and Lithuania maintain the EU's highest per-capita awareness and resilience against Russian FIMI. Significant Russian-speaking minorities (particularly in Estonia and Latvia) represent both a target audience for Russian information operations and a reason for those states to develop among the world's strongest counter-FIMI capabilities. The Baltic Digital Media Observatory (EDMO hub) is among the most active in the EU. Estonia's Digital Media Literacy initiative is frequently cited as a global model." },
          ].map((c, i) => (
            <div key={i} className="border border-slate-700 rounded p-4 bg-slate-800/20">
              <div className="font-semibold text-amber-300 font-mono text-sm mb-2">{c.country}</div>
              <p className="text-slate-300 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),

    operations: (
      <div>
        <SectionHeader
          number="SECTION 04"
          title="Documented Operations"
          subtitle="Key named operations and campaigns from 2014 to present, with attribution, methodology, and assessed impact."
        />
        <Callout type="warning">
          Impact assessment in FIMI is one of the hardest methodological challenges in the field. Researchers consistently note that measuring the causal effect of information operations on political outcomes is extraordinarily difficult. Thomas Rid, for instance, concludes that the 2016 IRA operation likely changed few votes but generated enormous media amplification. Do not conflate scale of operation with magnitude of effect.
        </Callout>

        <div className="space-y-6 mt-6">
          {[
            {
              name: "Doppelganger / RRN Media",
              date: "September 2022 — ongoing",
              actor: "Russia (SDA/Struktura — sanctioned)",
              attribution: "EU DisinfoLab (Sep 2022), Meta, EEAS, US Treasury, UK FCDO",
              targets: "France, Germany, Poland, Ukraine, US, EU elections",
              method: "Created 700+ websites cloning legitimate Western media (Le Monde, Der Spiegel, Bild, La Repubblica, Polskie Radio) and government portals. Used inauthentic social media amplifier networks to drive traffic. Employed multi-stage URL redirection to evade platform blacklists. Used cloaking service Kehr (documented Nov 2024) to bypass content moderation. Ran over 8,000 political ads on Meta platforms.",
              ttps: ["Website cloning", "Multi-stage URL redirect", "Bot amplification networks", "AI content generation", "Platform ad buys"],
              impact: "Limited direct electoral disruption documented. Multiple sanctioning rounds by EU (Dec 2024) and US. AEZA Group (bulletproof hosting provider) sanctioned July 2025. Domain seizures ongoing via WIPO dispute resolution.",
              color: "red"
            },
            {
              name: "Operation False Façade",
              date: "2023–2024",
              actor: "Russia (state-linked)",
              attribution: "EEAS East StratCom Task Force",
              targets: "EU Member States, pro-Ukraine civil society",
              method: "Created fake websites impersonating legitimate civil society organisations, think tanks, and NGOs to launder pro-Kremlin narratives through apparently credible, independent-looking sources. Represents a sophistication upgrade from overt propaganda: creating false credibility rather than merely amplifying existing narratives.",
              ttps: ["Front organisation impersonation", "Information laundering", "False credibility construction"],
              impact: "Attribution and exposure by EEAS remains the primary counter. No direct policy outcomes documented as caused by this operation.",
              color: "orange"
            },
            {
              name: "Portal Kombat",
              date: "2023–2024",
              actor: "Russia (state-linked)",
              attribution: "EEAS; Viginum (French signals intelligence agency)",
              targets: "Ukraine, Western European audiences",
              method: "A network spreading manipulated videos — spliced, decontextualised, or crudely fabricated — attacking Ukrainian media, institutions, and military. Distributed primarily on Telegram and X. The operation combines cheap video manipulation with coordinated distribution networks.",
              ttps: ["Video manipulation", "Telegram distribution", "Coordinated amplification"],
              impact: "Moderate organic reach on Telegram. Viginum exposure reduced effectiveness. Part of EEAS 3rd Report analysis.",
              color: "amber"
            },
            {
              name: "Voice of Europe",
              date: "2023–2024 (EU Elections)",
              actor: "Russia (Kremlin-linked)",
              attribution: "Belgian State Security; Czech security services; European Parliament",
              targets: "MEPs, EU national politicians, EP election 2024",
              method: "A network centred on a website ('Voice of Europe') that allegedly channelled Russian funds to European politicians willing to amplify pro-Russian narratives, opposing Ukraine support. Targeted France, Germany, Belgium, Netherlands, Poland. The Belgian security service identified it as a conduit for payments to politicians. Shut down in April 2024 following coordinated European security service action.",
              ttps: ["Political financing", "Agent of influence", "Media platform", "Paid political amplification"],
              impact: "Several European politicians under investigation. Operation shut down before EP elections. Demonstrated the integration of financial and information operation tools.",
              color: "amber"
            },
            {
              name: "Storm-1516",
              date: "2024–ongoing",
              actor: "Russia (Kremlin-aligned, John Mark Dougan)",
              attribution: "NewsGuard (2025); Microsoft Threat Intelligence",
              targets: "France, Germany, United States",
              method: "Uses AI to generate false, hyper-realistic narratives and deepfakes, distributed via a network of fake news sites, Telegram channels, and social media. Notably targeted France with five false narratives between December 2024 and March 2025, generating 55.8 million social media views across 38,877 posts — a 66-fold scale increase from the prior period. Represents the 'AI-enabled acceleration' model: small number of human operators, massive AI-generated content volume.",
              ttps: ["Generative AI content creation", "Deepfake videos", "Fake news website network", "Social media amplification"],
              impact: "High volume reach documented. Growing concern from French security services (Viginum). Demonstrates the asymmetric scaling effect of AI on FIMI operations.",
              color: "red"
            },
            {
              name: "Romanian TikTok Election Interference",
              date: "November 2024",
              actor: "Russia (attributed by Romanian and French intelligence)",
              attribution: "Romanian Constitutional Court; Viginum; EEAS",
              targets: "Romanian 2024 presidential election",
              method: "Manipulation of TikTok's recommendation algorithm to artificially amplify far-right candidate Călin Georgescu. Covert recruitment of Romanian TikTok influencers. Coordinated cross-platform amplification. The Romanian court found sufficient evidence of manipulation to annul the first-round results — an unprecedented action in EU history.",
              ttps: ["Algorithm manipulation", "Influencer recruitment", "Cross-platform coordination", "Electoral targeting"],
              impact: "First documented case of an EU election result being annulled due to foreign information interference. Landmark case for the field.",
              color: "red"
            },
            {
              name: "Spamouflage (Dragon Bridge)",
              date: "2017–ongoing",
              actor: "China (state-linked, attributed to Public Security Bureau)",
              attribution: "Graphika, Stanford Internet Observatory, Meta, Twitter/X",
              targets: "Chinese dissidents, Hong Kong protesters, Taiwan, US elections",
              method: "A massive network of fake accounts across Twitter, Facebook, YouTube, Reddit, and TikTok amplifying pro-CCP narratives and attacking Chinese dissidents. Notable for its extraordinary scale (hundreds of thousands of accounts) and remarkably low engagement — most content generated virtually zero organic interaction, suggesting the operation prioritises presence and volume over persuasive reach. Uses AI-generated American personas for US election targeting.",
              ttps: ["Coordinated inauthentic behaviour", "AI personas", "Cross-platform amplification", "Diaspora targeting"],
              impact: "Limited persuasive impact documented. Significant dissident harassment effect. Multiple platform takedowns. Demonstrates that 'effectiveness' measures must be multi-dimensional.",
              color: "blue"
            },
            {
              name: "GRU Macron Hack (En Marche! Leaks)",
              date: "May 2017",
              actor: "Russia (GRU APT28/Fancy Bear)",
              attribution: "French ANSSI; EEAS; multiple independent technical attributions",
              targets: "Emmanuel Macron's 2017 presidential campaign",
              method: "GRU hackers breached the En Marche! campaign and leaked 9GB of documents (including fabricated documents mixed with authentic ones) onto 4chan and social media two days before the election blackout period. French media, constrained by electoral law, largely did not amplify. The operation was designed to replicate the 2016 DNC playbook on French terrain.",
              ttps: ["Spear phishing", "Network compromise", "Hack-and-leak", "Fabricated document injection"],
              impact: "Limited impact due to French media restraint and voter immunity from prior awareness. However, the operation demonstrates that the hack-and-leak model is replicable across Western electoral contexts.",
              color: "amber"
            },
          ].map((op, i) => (
            <div key={i} className="border border-slate-700 rounded-lg p-5 bg-slate-800/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-slate-100 text-base" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>{op.name}</h4>
                  <div className="text-slate-500 font-mono text-xs mt-1">{op.date}</div>
                </div>
                <Tag color={op.color}>RUSSIA</Tag>
              </div>
              <div className="grid grid-cols-1 gap-3 mb-3 text-sm">
                <div>
                  <span className="text-slate-500 font-mono text-xs">ACTOR: </span>
                  <span className="text-slate-300">{op.actor}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono text-xs">ATTRIBUTION: </span>
                  <span className="text-slate-300">{op.attribution}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono text-xs">PRIMARY TARGETS: </span>
                  <span className="text-slate-300">{op.targets}</span>
                </div>
              </div>
              <div className="mb-3">
                <div className="text-slate-500 font-mono text-xs mb-1">METHODOLOGY</div>
                <p className="text-slate-300 text-sm leading-relaxed">{op.method}</p>
              </div>
              <div className="mb-3">
                <div className="text-slate-500 font-mono text-xs mb-2">TTPs</div>
                <div className="flex flex-wrap">{op.ttps.map((t, j) => <Tag key={j} color="slate">{t}</Tag>)}</div>
              </div>
              <div>
                <div className="text-slate-500 font-mono text-xs mb-1">ASSESSED IMPACT</div>
                <p className="text-slate-400 text-sm leading-relaxed">{op.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    counter: (
      <div>
        <SectionHeader
          number="SECTION 05"
          title="Counter-FIMI Frameworks"
          subtitle="The current state of thinking on detection, attribution, prebunking, platform governance, legal tools, and deterrence. Including genuine academic debates."
        />
        <p className="text-slate-300 leading-relaxed mb-6">
          Counter-FIMI is a field still finding its paradigm. There is significant disagreement about what works, at what scale, for which populations, and with what unintended consequences. Academic scepticism about the effectiveness of some widely-funded interventions is growing — and practitioners should engage with that debate seriously.
        </p>

        <h3 className="text-lg font-bold text-amber-400 mb-5" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>1. Detection and Attribution</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          Detection operates on two axes: content signals and behavioural signals. As generative AI makes content signals increasingly unreliable (AI-generated text and images are now often indistinguishable from human-produced content), the field is shifting toward behavioural detection as the primary methodology.
        </p>
        <div className="space-y-4 mb-6">
          {[
            { method: "OSINT (Open Source Intelligence)", desc: "The primary methodology for civil society and research organisations. OSINT for FIMI involves: domain registration analysis (WHOIS, passive DNS), network traffic analysis, social media account behaviour analysis (posting cadence, follower networks, inauthentic behaviour patterns), image reverse search (for decontextualised media), infrastructure clustering (shared hosting, certificates, code signatures). The EEAS released a comprehensive OSINT toolkit for investigating identity-based FIMI (2024). Key tools: Maltego, Shodan, URLscan.io, CrowdTangle (deprecated but data accessible), Brandwatch." },
            { method: "Platform Transparency Reports", desc: "Meta, Twitter/X, YouTube, and Microsoft publish periodic transparency reports documenting removed coordinated inauthentic behaviour (CIB) networks. These are primary source documents for researchers and include takedown sets — the accounts, pages, and associated content removed — which can be analysed for TTP signatures. Quality has declined on X/Twitter since 2022 ownership change." },
            { method: "STIX/TAXII Threat Intelligence Sharing", desc: "Borrowed from cybersecurity, the STIX (Structured Threat Information Expression) data format is now used to encode and share FIMI threat intelligence between organisations. TAXII is the associated transport mechanism. The FIMI-ISAC (Information Sharing and Analysis Centre) — a newer body modelled on cybersecurity ISACs — operationalises this for the FIMI defender community." },
            { method: "Attribution Frameworks", desc: "The NATO StratCom COE and Hybrid COE IIO Attribution Framework (2022) provides a structured methodology for FIMI attribution. Builds on cybersecurity attribution principles: confidence levels based on technical + behavioural + contextual evidence, acknowledged limitations, explicit uncertainty. A 2025 academic paper from Lund University's Psychological Defence Research Institute (ADAC.io project) provides the most rigorous current framework for open-source attribution." },
          ].map((m, i) => (
            <div key={i} className="border-l-2 border-amber-600/40 pl-4 py-2">
              <div className="font-semibold text-slate-200 text-sm mb-1">{m.method}</div>
              <p className="text-slate-400 text-sm leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold text-amber-400 mb-5 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>2. Prebunking and Inoculation Theory</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          Prebunking — exposing people to weakened doses of manipulation techniques before they encounter real operations — has become one of the most researched and widely deployed counter-FIMI interventions. The theoretical basis is psychological inoculation theory (McGuire, 1964), extended to misinformation contexts by Cambridge's Sander van der Linden and colleagues.
        </p>
        <div className="space-y-3 mb-5">
          <div className="border border-green-700/30 rounded p-4 bg-green-950/20">
            <div className="text-green-300 font-mono text-xs mb-2">EVIDENCE FOR PREBUNKING</div>
            <p className="text-slate-300 text-sm leading-relaxed">A 2025 meta-analysis of 33 inoculation experiments (combined N=37,075) using Signal Detection Theory found that inoculation consistently improves discernment between reliable and unreliable news without inducing generalised distrust — a key concern about blunt-instrument interventions. Google's Jigsaw project deployed prebunking campaigns in Germany and Poland at national scale with measurable effect.<Cite>ScienceDirect, Oct 2025</Cite></p>
          </div>
          <div className="border border-red-700/30 rounded p-4 bg-red-950/20">
            <div className="text-red-300 font-mono text-xs mb-2">EVIDENCE AGAINST / LIMITATIONS</div>
            <p className="text-slate-300 text-sm leading-relaxed">A 2025 PNAS Nexus study found "limited effectiveness of psychological inoculation against misinformation in a social media feed" in real-world ecological conditions, raising questions about laboratory-to-field translation. The gap between controlled experiment and live platform behaviour is significant. Critics also note that inoculation works on the demand side (audience resilience) but does nothing about supply-side infrastructure (the operational assets conducting FIMI).<Cite>PNAS Nexus, 2025</Cite></p>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Current research consensus: inoculation interventions are effective for educating people about manipulation <em>techniques</em> (emotional appeals, false urgency, conspiracy logic). They are less effective for specific false claims (debunking). Scaling is the core challenge — prebunking a nation's information literacy requires sustained, funded, platform-delivered campaigns rather than one-off educational programmes.
        </p>

        <h3 className="text-lg font-bold text-amber-400 mb-5 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>3. Platform Governance and the Digital Services Act</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          Platform governance is now the EU's primary structural counter-FIMI tool. The Digital Services Act (DSA), which began applying to Very Large Online Platforms (VLOPs) in 2023, requires platforms to:
        </p>
        <ul className="space-y-2 mb-5 pl-4">
          {[
            "Conduct annual systemic risk assessments, including for FIMI",
            "Implement risk-mitigation measures proportionate to identified risks",
            "Share data with vetted researchers (Article 40)",
            "Maintain transparency on algorithmic recommendation systems",
            "Cooperate with Digital Services Coordinators in each Member State",
          ].map((p, i) => (
            <li key={i} className="text-slate-300 text-sm flex gap-2">
              <span className="text-blue-400 font-mono text-xs mt-0.5">▸</span><span>{p}</span>
            </li>
          ))}
        </ul>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          The DSA's 2022 Code of Practice on Disinformation was formally integrated into the DSA framework in February 2025, becoming a "Code of Conduct on Disinformation" — meaning adherence is now a factor in assessing DSA compliance for VLOPs. The European Commission opened formal proceedings against X (Twitter) under the DSA in 2024 over systemic risk mitigation failures, including failure to counter FIMI.
        </p>
        <Callout type="warning">
          A major structural challenge for EU counter-FIMI via platforms: X (Twitter) accounted for 88% of detected FIMI activity in EEAS 2024 data, while progressively retreating from content moderation. EEAS data collection relies on accessible platform data — a fundamentally reactive methodology where detection lags operation by weeks or months.
        </Callout>

        <h3 className="text-lg font-bold text-amber-400 mb-5 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>4. The EU FIMI Toolbox</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          The EEAS has developed an integrated response framework — the FIMI Toolbox — that organises counter-FIMI instruments across five action areas:
        </p>
        <div className="grid grid-cols-1 gap-3 mb-6">
          {[
            { tool: "Awareness & Resilience", desc: "Public communication, media literacy campaigns, EUvsDisinfo database, fact-checking network support, prebunking campaigns." },
            { tool: "Detection & Analysis", desc: "East StratCom Task Force monitoring, OSINT toolkits, FIMI Exposure Matrix, FIMI-ISAC, cross-platform data sharing with EU institutions." },
            { tool: "Diplomatic Action", desc: "Political condemnation, diplomatic protests, coordinated allied attribution statements (G7 RRM, NATO, Five Eyes partners)." },
            { tool: "Regulatory & Legal Action", desc: "DSA enforcement, sanctions under the new EU Hybrid Threats Sanctions Regime (first used Dec 2024 against Doppelganger operators), law enforcement cooperation on criminal proxies." },
            { tool: "Support to Partners", desc: "Embedding counter-FIMI capacity in EU candidate countries, CSDP missions, Global Gateway, and through bilateral partnerships (Ukraine SPRAVDI, Baltic states)." },
          ].map((t, i) => (
            <div key={i} className="flex gap-3 border border-slate-700 rounded p-3 bg-slate-800/20">
              <div className="text-amber-400 font-mono text-xs mt-0.5 font-bold w-32 flex-shrink-0">{t.tool}</div>
              <p className="text-slate-300 text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold text-amber-400 mb-5 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>5. FIMI Deterrence — The 4th Report Framework</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          The EEAS 4th Annual Report (March 2026) introduces the "FIMI Deterrence Playbook" — a shift from reactive detection and response to proactive cost-raising. The logic: if FIMI operations rely on specific infrastructure (hosting providers, payment systems, platform accounts, monetisation pathways), targeting these choke points can disrupt operations and raise their cost.
        </p>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Key choke points identified: bulletproof hosting providers (e.g., AEZA Group, sanctioned July 2025), content distribution networks, domain registrars (WIPO dispute resolution has been used to seize Doppelganger domains), ad platform accounts, and human operators. The playbook maps these to available instruments: sanctions, law enforcement cooperation, platform enforcement, and financial pressure.
        </p>

        <Callout type="key">
          The most important current debate in counter-FIMI is the tension between upstream (supply-side) interventions — disrupting the infrastructure and economics of FIMI operations — and downstream (demand-side) interventions — building audience resilience through inoculation and media literacy. The professional consensus is increasingly that both are necessary but upstream is underdeveloped. You cannot inoculate a population fast enough to keep pace with AI-enabled content at industrial scale. <Cite>EEAS 4th Report; academic literature</Cite>
        </Callout>
      </div>
    ),

    organisations: (
      <div>
        <SectionHeader
          number="SECTION 06"
          title="Key Organisations"
          subtitle="The institutional landscape — government, intergovernmental, civil society, private sector. European and Europe-relevant focus, must-know players first. Where relevant, crossover with innovation/org change flagged."
        />

        <h3 className="text-lg font-bold text-amber-400 mb-5" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Government & Intergovernmental</h3>

        <OrgCard
          name="EEAS East StratCom Task Force / EUvsDisinfo"
          type="Government/Intergovernmental"
          country="EU — Brussels"
          desc="The flagship EU body for countering Russian FIMI. Produces the annual FIMI Threat Reports (4th edition March 2026), operates the EUvsDisinfo public database of pro-Kremlin disinformation narratives, coordinates the G7 Rapid Response Mechanism for FIMI, and operates the EU Rapid Alert System for cross-government information sharing. The primary institutional reference point for the EU FIMI field. The EEAS mandate means they focus on external threats — domestic EU political disinformation is handled differently."
          url="https://euvsdisinfo.eu"
        />
        <OrgCard
          name="NATO Strategic Communications Centre of Excellence (StratCom COE)"
          type="Government/Intergovernmental"
          country="NATO — Riga, Latvia"
          desc="A NATO-accredited centre of excellence that researches and develops NATO's strategic communications and counter-disinformation capabilities. Publishes an academic journal (now in Volume 15), organises the annual Riga StratCom Dialogue (premier government-to-government forum on information integrity), and produced NATO's first strategic communications fundamentals doctrine in 2024. The 2022 IIO Attribution Framework is a key technical product. Crossover note: runs training programmes for StratCom professionals that blend communications theory with national security practice."
          url="https://stratcomcoe.org"
          crossover="Communications methodology, StratCom doctrine — relevant to public affairs / org comms backgrounds"
        />
        <OrgCard
          name="NATO HUMINT / Hybrid Centre of Excellence (Hybrid COE)"
          type="Government/Intergovernmental"
          country="Helsinki, Finland"
          desc="A NATO-EU hybrid institution focused specifically on hybrid threats — the intersection of information operations, cyber, and hybrid military activity. Produced the Hybrid Threats Situational Awareness tool. Works closely with StratCom COE on IIO attribution and with ENISA on cyber-information intersections. Key node in the European hybrid threat awareness network."
          url="https://www.hybridcoe.fi"
        />
        <OrgCard
          name="VIGINUM (France)"
          type="Government/Intergovernmental"
          country="France — Paris"
          desc="France's signals-intelligence-style agency for foreign digital interference — formally the 'Vigilance et protection contre les ingérences numériques étrangères.' Created in 2021, it operates under the Secretary-General of National Defence. VIGINUM documented the Romanian TikTok election manipulation (2024) and published extensive analysis of Storm-1516 operations targeting France (2025). One of the most technically capable national FIMI detection agencies in Europe."
        />
        <OrgCard
          name="Swedish Psychological Defence Agency (MSB / Psy Def)"
          type="Government/Intergovernmental"
          country="Sweden"
          desc="Sweden operates a dedicated Psychological Defence Agency — one of very few in the world — specifically focused on building societal resilience against information influence operations. Produces technical assessments of ongoing Russian operations (including a 2025 capability assessment of SDA/Doppelganger). Coordinates with Sweden's MSB (Civil Contingencies Agency) on whole-of-society information resilience. Frequently cited as a model for other states."
          url="https://www.psychologicaldefence.se"
        />
        <OrgCard
          name="UK Government Communication Service (RESIST / Counter Disinformation Unit)"
          type="Government/Intergovernmental"
          country="UK — London"
          desc="The UK's primary government FIMI response capability sits across the FCDO (for overseas/foreign interference) and the Home Office Counter Disinformation Unit (for domestic operations). RESIST is the GCS framework for building government communicators' counter-disinformation skills. The UK has taken a more decentralised approach than the EU, distributing FIMI response across multiple departments with the National Security Council as coordinator."
        />

        <h3 className="text-lg font-bold text-amber-400 mb-5 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Civil Society & Research</h3>

        <OrgCard
          name="EU DisinfoLab"
          type="Civil Society/Research"
          country="Brussels"
          desc="Independent NGO. First identified and named the Doppelganger campaign (September 2022). Maintains the Doppelganger Hub — the most comprehensive public tracker of the operation. Publishes methodological resources on FIMI investigation. Runs regular Disinfo Update newsletters followed closely by practitioners. Strong technical-analytical focus."
          url="https://www.disinfo.eu"
          crossover="Strong methodological publications — accessible for practitioners building OSINT/analysis skills"
        />
        <OrgCard
          name="DFRLab (Digital Forensic Research Lab, Atlantic Council)"
          type="Civil Society/Research"
          country="Washington DC / Global"
          desc="The Atlantic Council's flagship FIMI research unit. Produces investigations across Russian, Chinese, and domestic influence operations globally. Key tools include the Foreign Interference Attribution Tracker (FIAT). Runs the annual 360/Open Summit. Partners with DFRLab Poland on Eastern Europe and Caucasus research. Major partner in the FIMI-ISAC and FIMI Defenders for Election Integrity (FDEI) project documenting Moldova and other elections. Staff include some of the most published practitioners in the field."
          url="https://dfrlab.org"
        />
        <OrgCard
          name="Bellingcat"
          type="Civil Society/Research"
          country="Netherlands (Amsterdam)"
          desc="The world's most prominent open-source investigative journalism organisation. Founded by Eliot Higgins in 2014, Bellingcat pioneered OSINT-based attribution of state actors — most famously attributing the MH17 shootdown to Russian forces and identifying the GRU officers who conducted the Salisbury poisoning. Works extensively on Russian hybrid warfare and FIMI. Strong educational mission: runs OSINT training globally. Often cited as the model for civil society attribution capability."
          url="https://www.bellingcat.com"
        />
        <OrgCard
          name="Institute for Strategic Dialogue (ISD)"
          type="Civil Society/Research"
          country="London"
          desc="A London-based think tank and research organisation focused on extremism, disinformation, and FIMI. Notable for research on domestic extremism alongside foreign influence operations, and for documenting the Southport riots' social media disinformation dynamics (2024). Has a strong policy-facing orientation and publishes practitioner-accessible reports. Note: ISD has faced some controversy about funding and methodology — worth knowing as a practitioner."
          url="https://www.isdglobal.org"
          crossover="Change management lens on societal polarisation — intersects with org transformation research on trust and group dynamics"
        />
        <OrgCard
          name="Stanford Internet Observatory (SIO)"
          type="Civil Society/Research"
          country="Stanford University, USA"
          desc="A US academic research centre focused on the misuse of the internet in society, including FIMI, disinformation, and platform manipulation. Co-developed the influential Election Integrity Partnership with DFRLab and others for 2020 and 2024 US elections. Graphika has collaborated extensively. Note: SIO has been subject to political pressure in the US from 2023-2025 regarding its government funding; some staff have departed. Follow developments in access to platform data for researchers — major structural issue for the field."
          url="https://io.stanford.edu"
        />
        <OrgCard
          name="Graphika"
          type="Civil Society/Research"
          country="US (New York)"
          desc="A network analysis firm focused on mapping and analysing influence operations. Pioneered the 'network mapping' approach to CIB analysis — visualising the social graph of inauthentic accounts. Key reports include Spamouflage/Dragon Bridge (China), IRA post-2016 analysis, and various national election operations. Has a commercial side alongside research outputs. Frequently cited in platform transparency reports."
          url="https://graphika.com"
          crossover="Network analysis methodology has applications in org network analysis — adjacent skill set"
        />

        <h3 className="text-lg font-bold text-amber-400 mb-5 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Private Sector</h3>

        <OrgCard
          name="NewsGuard"
          type="Private Sector"
          country="US/Global"
          desc="A media ratings and intelligence firm that provides credibility ratings for news and information sites, and increasingly runs systematic tracking of influence operation narratives (including Storm-1516). NewsGuard's Misinformation Fingerprints product tracks specific false narratives across the web. One of the few commercial firms with systematic, longitudinal data on narrative spread. Subscription service — used by governments, platforms, and researchers."
          url="https://www.newsguardtech.com"
          crossover="SaaS model for information integrity — commercial analogy to public-sector monitoring functions"
        />
        <OrgCard
          name="CASM Technology (Centre for the Analysis of Social Media)"
          type="Private Sector"
          country="London"
          desc="A UK-based research and technology firm (spun out of Demos think tank) specialising in computational social science applied to disinformation and online harms. Works with UK government, platforms, and international development bodies on monitoring FIMI and online influence. Strong data science / NLP focus. One of the few organisations at the intersection of FIMI analysis, platform policy, and international development context — relevant given your FCDO background."
          url="https://www.casm.technology"
          crossover="Works on FCDO-adjacent programmes. Intersection of data science + public policy. Relevant to your background."
        />
        <OrgCard
          name="Recorded Future"
          type="Private Sector"
          country="US/Global"
          desc="A cyber threat intelligence firm with significant FIMI coverage — particularly at the cyber-information operations intersection. Tracks APT groups (APT28, APT29, Sandworm) and their information operation components. Used by governments, militaries, and large enterprises. Expensive but considered one of the gold standards in intelligence-as-a-service. Their Insikt Group produces publicly available research."
          url="https://www.recordedfuture.com"
        />
        <OrgCard
          name="Microsoft Threat Intelligence (MSTIC)"
          type="Private Sector"
          country="US/Global"
          desc="Microsoft's threat intelligence team, which has become one of the most significant public attributors of state-linked FIMI operations — including regular reports on Russian, Chinese, and Iranian activity. MSTIC's access to Azure infrastructure and email systems gives it visibility unavailable to most civil society researchers. Their 'Foreign Interference in Election' reports are primary sources. Publishes regularly and freely."
          url="https://www.microsoft.com/en-us/security/blog/topic/threat-intelligence/"
        />
        <OrgCard
          name="FIMI-ISAC (Information Sharing and Analysis Centre)"
          type="Private Sector"
          country="EU / transatlantic"
          desc="A newly established cross-sector information sharing body modelled on cybersecurity ISACs. Coordinates the FIMI Defenders for Election Integrity (FDEI) project — a consortium of 30+ organisations that monitored and documented FIMI in the 2025 Moldovan elections. Represents the emerging 'ecosystem' model for FIMI response, enabling real-time threat sharing between public bodies, civil society, platforms, and researchers."
          url="https://fimi-isac.org"
        />
      </div>
    ),

    sources: (
      <div>
        <SectionHeader
          number="SECTION 07"
          title="Curated Sources"
          subtitle="Independently rated, professionally recognised resources. Prioritised by depth, practitioner endorsement, and analytical rigour. Not just 'popular.'"
        />
        <Callout type="note">
          Selection criteria: (1) cited or recommended in peer-reviewed literature or by institutional practitioners (not just public popularity); (2) specific to FIMI/information warfare/hybrid conflict rather than general media criticism; (3) where books, ratings drawn from professional reviews in specialist outlets (Foreign Affairs, Spectator Intelligence, CIA Studies in Intelligence, IISS Survival).
        </Callout>

        <h3 className="text-lg font-bold text-amber-400 mb-5 mt-6" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Essential Books</h3>

        <SourceCard
          type="Book"
          title="Active Measures: The Secret History of Disinformation and Political Warfare"
          author="Thomas Rid"
          year="2020"
          rating="★★★★★ Essential"
          desc="The canonical historical account of information warfare from the 1920s to 2016. Reviewed by CIA Studies in Intelligence; described as 'Clausewitz for the cyber era' by The Guardian. Rid's core argument — that contemporary Russian FIMI is continuous with, not a rupture from, Soviet active measures — is the single most important frame for understanding the field. Based on KGB archives, Mitrokhin, and declassified documents in 10+ languages. Peer Pomerantsev called it 'mind-bending.'"
          url="https://profilebooks.com/work/active-measures/"
        />
        <SourceCard
          type="Book"
          title="This Is Not Propaganda: Adventures in the War Against Reality"
          author="Peter Pomerantsev"
          year="2019"
          rating="★★★★★ Essential"
          desc="Pomerantsev is a former Russian TV producer turned researcher, and this is arguably the most readable account of how information warfare works at the psychological and social level. Where Rid provides the history, Pomerantsev provides the phenomenology — what it feels like to live inside a weaponised information environment. His concept of a 'post-truth regime' that doesn't believe its own lies, but uses disinformation to make truth itself seem impossible, is analytically foundational."
        />
        <SourceCard
          type="Book"
          title="Invisible Rulers: The People Who Turn Lies into Reality"
          author="Renée DiResta"
          year="2024"
          rating="★★★★½ Highly Recommended"
          desc="DiResta is among the most respected active practitioners in the field — Research Director at SIO before its political challenges. This book examines how online influence networks function, focusing on the infrastructure and incentive structures that spread manipulation. NPR's Disinformation Reporting editor called it an essential read for 2025. DiResta's own experience as a target of political attacks on researchers gives the account unusual authority."
        />
        <SourceCard
          type="Book"
          title="Foolproof: Why We Fall for Misinformation and How to Build Immunity"
          author="Sander van der Linden"
          year="2023"
          rating="★★★★½ Highly Recommended"
          desc="Van der Linden is the Cambridge psychologist who developed the inoculation/prebunking research programme. This is the accessible synthesis of that work — explaining the psychological mechanisms behind manipulation susceptibility and the evidence base for prebunking. Essential for understanding the demand-side counter-FIMI research agenda. Frequently cited in academic literature."
        />
        <SourceCard
          type="Book"
          title="Network Propaganda: Manipulation, Disinformation, and Radicalization in American Politics"
          author="Yochai Benkler, Robert Faris, Hal Roberts (Harvard)"
          year="2018"
          rating="★★★★ Highly Recommended"
          desc="Based on the most comprehensive study of US political media coverage published. Challenges the 'Russian disinformation caused Trump' narrative with data, arguing the domestic right-wing media ecosystem was more significant than foreign interference. Essential methodological counterpoint — understanding what the data does and does not show about information operations' causal effects on political outcomes."
        />
        <SourceCard
          type="Book"
          title="Dezinformatsiya: Active Measures in Soviet Strategy"
          author="Richard H. Shultz & Roy Godson"
          year="1984 (Pergamon-Brassey's)"
          rating="★★★★ Historical Foundation"
          desc="The foundational Western analytical text on Soviet active measures. Based on defector testimony and available Western intelligence. Dated but historically irreplaceable — reviewed by Foreign Affairs as a 'useful survey' of KGB disinformation methods. Essential context for understanding the institutional and doctrinal origins of current Russian practice."
        />
        <SourceCard
          type="Book"
          title="LikeWar: The Weaponization of Social Media"
          author="P.W. Singer & Emerson T. Brooking"
          year="2018"
          rating="★★★★ Highly Recommended"
          desc="A highly readable account of how social media has become a domain of warfare — covering ISIS, Russia, China, and domestic actors. Singer (New America) is among the most respected US national security researchers writing for accessible audiences. Frequently recommended by military and intelligence professionals for the accessible framing of digital information warfare."
        />

        <h3 className="text-lg font-bold text-amber-400 mb-5 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Primary Institutional Sources (Read Regularly)</h3>

        <SourceCard
          type="Database/Tool"
          title="EUvsDisinfo Database"
          author="EEAS East StratCom Task Force"
          rating="★★★★★ Essential"
          desc="The EU's public database of documented pro-Kremlin disinformation narratives — over 16,000 cases. Primary source for operational pattern analysis. The site also publishes regular analytical articles on ongoing campaigns. Subscribe to EUvsDisinfo's weekly newsletter. This is where the field's primary data on Russian FIMI narratives lives."
          url="https://euvsdisinfo.eu"
        />
        <SourceCard
          type="Database/Tool"
          title="EEAS Annual FIMI Threat Reports"
          author="EEAS"
          rating="★★★★★ Essential"
          desc="The 4 annual reports (2023, 2024, 2025, 2026) are the EU's authoritative assessment of the FIMI landscape. Each introduces a new analytical framework (methodology → response → exposure matrix → deterrence playbook). They are the standard reference for EU policymakers and are primary source documents for the field. PDFs freely available."
          url="https://www.eeas.europa.eu/eeas/information-integrity-and-countering-foreign-information-manipulation-interference-fimi_en"
        />
        <SourceCard
          type="Database/Tool"
          title="DFRLab Research & Investigations"
          author="Atlantic Council Digital Forensic Research Lab"
          rating="★★★★★ Essential"
          desc="Regular investigations into FIMI operations globally. Includes election operation documentation, Chinese and Russian TTP analysis, and methodological outputs. The DFRLab's FIAT (Foreign Interference Attribution Tracker) is a useful tool. Subscribe to their Medium publication and read new reports as published."
          url="https://dfrlab.org/research/"
        />
        <SourceCard
          type="Database/Tool"
          title="EU DisinfoLab Disinfo Update Newsletter"
          author="EU DisinfoLab"
          rating="★★★★ Highly Recommended"
          desc="Biweekly newsletter synthesising key FIMI developments across EU research institutions, NGOs, and government. Excellent for staying current — identifies the most important new reports, investigations, and policy developments. Widely followed by practitioners."
          url="https://www.disinfo.eu"
        />
        <SourceCard
          type="Database/Tool"
          title="DISARM Framework"
          author="DISARM Foundation (community-developed)"
          rating="★★★★ Highly Recommended"
          desc="The open-source TTP framework for influence operations — the MITRE ATT&CK equivalent for FIMI. Learning this framework is essential for anyone working analytically in the field. The website includes a matrix, incident examples, and tooling. Increasingly referenced in EEAS, NATO StratCom, and academic attribution work."
          url="https://disarmframework.com"
        />

        <h3 className="text-lg font-bold text-amber-400 mb-5 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Podcasts & Audio</h3>

        <SourceCard
          type="Podcast"
          title="Riga StratCom Dialogue (recordings)"
          author="NATO StratCom COE"
          rating="★★★★★ Essential"
          desc="The premier government-to-government conference on strategic communications and counter-FIMI. Annual recordings are available and feature serving intelligence officers, policymakers, and researchers. This is where the field's leading practitioners present their current analysis. Also available on Spotify. The level of discourse is significantly above standard public conference material."
          url="https://stratcomcoe.org"
        />
        <SourceCard
          type="Podcast"
          title="Digital Frontlines Conference (recordings)"
          author="NATO StratCom COE"
          rating="★★★★ Highly Recommended"
          desc="Sister conference to Riga StratCom, focused on the technology dimensions of information influence — AI, platform governance, deepfakes. Recordings feature technical practitioners and policy architects. Valuable for the AI-FIMI intersection specifically."
        />
        <SourceCard
          type="Podcast"
          title="Seriously Wrong (Demos Helsinki / Hybrid CoE)"
          author="Hybrid CoE"
          rating="★★★★ Highly Recommended"
          desc="Finnish podcast from the Hybrid CoE network discussing hybrid threats including FIMI. Strong on the Nordic/Baltic perspective and on practical resilience approaches. Practitioner-focused, mid-technical level, accessible. Frequently features serving government analysts."
        />
        <SourceCard
          type="Podcast"
          title="Oxford Internet Institute Podcast / Reuters Institute Digital News Report"
          author="Oxford University"
          rating="★★★★ Highly Recommended"
          desc="Academic-practitioner bridge. The Reuters Institute's Digital News Report (annual) is the most comprehensive study of global news consumption patterns including disinformation awareness. Oxford podcast episodes on FIMI and AI are consistently high quality — Professor Mohsen Mosleh on social media and misinformation is particularly recommended."
          url="https://podcasts.ox.ac.uk/keywords/misinformation"
        />

        <h3 className="text-lg font-bold text-amber-400 mb-5 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Academic Journals</h3>

        <SourceCard
          type="Journal"
          title="Journal of Information Warfare"
          rating="★★★★ Highly Recommended"
          desc="Peer-reviewed journal specifically for information warfare research. Covers both offensive and defensive dimensions, state and non-state actors. More practitioner-accessible than pure security studies journals."
        />
        <SourceCard
          type="Journal"
          title="Harvard Kennedy School Misinformation Review"
          rating="★★★★★ Essential"
          desc="Open-access peer-reviewed journal focused on misinformation research. Publishes the prebunking/inoculation research, platform effects studies, and field trials that constitute the evidence base for demand-side counter-FIMI. Free online. Essential for anyone wanting to engage seriously with the academic literature."
          url="https://misinforeview.hks.harvard.edu"
        />
        <SourceCard
          type="Journal"
          title="Survival (IISS)"
          rating="★★★★ Highly Recommended"
          desc="IISS's flagship strategic studies journal. Regularly publishes high-quality analysis on hybrid warfare, information operations, and Russian strategic behaviour. IISS analysts are among the most cited in the field. Subscription required but often accessible via library."
        />
      </div>
    ),

    ai: (
      <div>
        <SectionHeader
          number="SECTION 08"
          title="AI and FIMI"
          subtitle="How generative AI is transforming the threat landscape — and what is genuinely new versus what is the same playbook with faster execution."
        />

        <Callout type="key">
          The single most important framing principle for this section: the strategic logic of AI-enabled FIMI is not new. The objectives (undermine trust, amplify division, erode institutional legitimacy) and the playbook (fabricate, amplify, launder, confuse) are continuous with Soviet-era active measures. What AI changes is the economics and scale of execution — dramatically lowering cost, reducing required human labour, and enabling simultaneous multi-language, multi-platform, hyper-personalised operations. The constraint on FIMI campaigns has shifted from human labour to compute.
        </Callout>

        <h3 className="text-lg font-bold text-amber-400 mb-5 mt-6" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>What Has Changed vs. What Hasn't</h3>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="border border-slate-700 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="bg-slate-800/60 p-4 border-r border-slate-700">
                <div className="text-green-400 font-mono text-xs mb-3 font-bold">SAME AS PRE-AI ERA</div>
                <ul className="space-y-2 text-slate-300 text-sm">
                  {[
                    "Strategic objectives: divide, destabilise, confuse",
                    "Core TTPs: fake personas, planted stories, echo effect, agents of influence",
                    "Preference for amplifying real tensions over pure fabrication",
                    "Target selection: elections, social fault lines, institutional trust",
                    "Multi-platform distribution architecture",
                    "State actor as primary funder/director",
                    "Need for plausible deniability",
                    "Long-term seeding of narratives before activation",
                  ].map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-green-500 text-xs mt-0.5">●</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-950/20 p-4">
                <div className="text-red-400 font-mono text-xs mb-3 font-bold">GENUINELY NEW WITH AI</div>
                <ul className="space-y-2 text-slate-300 text-sm">
                  {[
                    "Economics: near-zero marginal cost for content at scale",
                    "Labour requirement: small teams can produce industrial-volume operations",
                    "Personalisation: AI tailors content to individual psychological profiles",
                    "Multi-lingual simultaneous operation: instant translation and localisation",
                    "Synthetic media: deepfakes, voice cloning, AI-generated personas",
                    "Training data poisoning: manipulating the AI ecosystem itself",
                    "Agentic pipelines: autonomous agents replacing human operators in distribution",
                    "LLM grooming: corrupting AI chatbot outputs to spread narratives",
                  ].map((n, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-red-500 text-xs mt-0.5">●</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-amber-400 mb-5" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>The Scale Explosion: Data Points</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { stat: "259%", desc: "Increase in AI-related FIMI TTPs from 2024 to 2025, per EEAS 4th Report. From 41 incidents to 147.", cite: "EEAS 4th Report, 2026" },
            { stat: "27%", desc: "Share of FIMI incidents in 2025 involving AI-assisted TTPs, per EEAS monitoring.", cite: "EEAS 4th Report, 2026" },
            { stat: "55.8M", desc: "Social media views generated by Storm-1516 targeting France, Dec 2024–Mar 2025. 66× the volume of the prior period.", cite: "NewsGuard, 2025" },
            { stat: "52%", desc: "Share of online content estimated to be AI-generated by May 2025, overtaking human-produced content for the first time.", cite: "EU Parliament Research, 2025" },
          ].map((d, i) => (
            <div key={i} className="border border-slate-700 rounded p-4 bg-slate-800/20">
              <div className="text-amber-400 font-bold text-2xl mb-1">{d.stat}</div>
              <p className="text-slate-300 text-sm leading-relaxed">{d.desc}</p>
              <div className="text-slate-600 text-xs font-mono mt-2">{d.cite}</div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold text-amber-400 mb-5" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>AI Attack Vectors in Detail</h3>

        <div className="space-y-5 mb-8">
          {[
            {
              vector: "Synthetic Persona Networks",
              pretype: "KGB used human agents to create fake identities; IRA hired human trolls",
              aitype: "LLMs generate personas at scale with consistent backstories, AI-generated profile images (GANs/diffusion models), retroactively generated social media histories, and synthetic voice profiles. CrowdStrike documented DPRK's FAMOUS CHOLLIMA using AI personas for corporate infiltration.",
              detection: "Behavioural clustering (coordinated posting, unnatural follower growth), reverse image search, network analysis, stylometric analysis of text patterns."
            },
            {
              vector: "Deepfakes",
              pretype: "Forged documents, impersonator scripts, 'echo effect' planted stories",
              aitype: "Video deepfakes of political figures (Zelenskyy 'surrender' deepfake, March 2022), voice clones of executives, AI-generated news presenter videos for fake news channels, face-swapped protest footage attributed to wrong countries. Volume: ~500K deepfakes in 2023 → projected 8M+ by end 2025.",
              detection: "C2PA provenance standards, deepfake detection models (arms race problem), spatial inconsistency analysis, cross-platform verification."
            },
            {
              vector: "Training Data Poisoning",
              pretype: "Planting fake stories in minor publications to later cite as 'established facts'",
              aitype: "Inserting narratives into websites, Wikipedia, and publicly available datasets that LLMs are trained on — corrupting model outputs at source. The DFRLab documented the Russian Pravda network manipulating Wikipedia and LLMs to amplify pro-Kremlin narratives. Forbes (March 2025) reported that Russian propaganda had infected Western AI chatbots via training data.",
              detection: "Provenance tracking, model auditing, contamination detection research — field is early-stage and technically very hard."
            },
            {
              vector: "Agentic FIMI Pipelines",
              pretype: "Human-staffed troll farms required significant headcount and management",
              aitype: "Multi-agent AI systems where specialized agents handle content creation, persona management, distribution scheduling, and engagement optimisation autonomously. Tseng et al. (2026) provide evidence of multi-agent pipelines implementing the full DISARM framework. The key shift: the constraint is now compute, not headcount. One researcher can supervise operations that previously required hundreds of employees.",
              detection: "Behavioural detection at TTP level rather than content level — human-AI hybrid systems produce content too similar to human output for content analysis to distinguish."
            },
            {
              vector: "LLM Grooming",
              pretype: "Soviet-era: controlled encyclopedias, textbooks, 'educational' content to shape baseline knowledge",
              aitype: "Systematic manipulation of AI chatbot outputs by seeding training data and public datasets with targeted narratives. When users ask AI assistants about contested political topics, the chatbot reproduces manipulated framings as neutral information. Documented in the Policy Genome 2026 study on Russian hybrid warfare.",
              detection: "Adversarial red-teaming, model output auditing, provenance transparency requirements under EU AI Act."
            },
          ].map((v, i) => (
            <div key={i} className="border border-slate-700 rounded-lg p-5 bg-slate-800/20">
              <h4 className="font-bold text-slate-100 text-sm mb-4" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>{v.vector}</h4>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div>
                  <span className="text-slate-500 font-mono text-xs">PRE-AI EQUIVALENT: </span>
                  <span className="text-slate-400">{v.pretype}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono text-xs">AI-ENABLED VERSION: </span>
                  <span className="text-slate-300">{v.aitype}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono text-xs">DETECTION APPROACHES: </span>
                  <span className="text-slate-400">{v.detection}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold text-amber-400 mb-5" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Counter-AI-FIMI: The Detection Arms Race</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          The field is in an active adversarial dynamic between content generation and content detection. Key developments:
        </p>
        <ul className="space-y-3 mb-6 pl-4">
          {[
            { item: "C2PA (Coalition for Content Provenance and Authenticity)", desc: "An industry standard (Adobe, Microsoft, Truepic) for cryptographically signing media at creation — enabling verification of origin and modification history. The EU AI Act mandates content labelling; the EU Commission's November 2025 voluntary code of practice on marking AI-generated content is the precursor to regulatory requirement." },
            { item: "EU AI Act (applies August 2026)", desc: "Prohibits manipulative AI systems under 'unacceptable risk' category (Article 5). Requires deepfake disclosure. LLM providers covered under Articles 53 and 55. Creates the first legally binding framework for AI misuse in FIMI context." },
            { item: "IORG and Taiwan AI Labs", desc: "Taiwan's front-line experience with Chinese FIMI has produced some of the world's most advanced AI-assisted detection tools. The Infodemic platform, AI-human collaboration models for CIB detection, and the 2024 MOUs with Lithuanian AI firms represent the most advanced operational counter-AI-FIMI capability outside major government agencies." },
            { item: "Detection Research Limitations", desc: "A 2026 academic paper (arXiv:2601.21963) documents that adversaries are now optimising deepfakes and synthetic content at the feature level — designing outputs to evade specific detector architectures. This is the classic adversarial ML arms race. Defenders need behavioural/TTP-level detection, not content-level, as the long-term solution." },
          ].map((d, i) => (
            <li key={i} className="text-slate-300 text-sm leading-relaxed">
              <span className="font-semibold text-amber-300">{d.item}: </span>
              {d.desc}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-bold text-amber-400 mb-5" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>The Cognitive Effects Dimension</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          AI-enabled FIMI introduces a new and underresearched second-order effect: the impact on critical thinking capacity of populations exposed to AI-mediated information environments. A 2025 study found that using LLMs reduced critical thinking scores in participants. If AI simultaneously enables FIMI at industrial scale <em>and</em> degrades the critical faculties that would counter it, the compounding effect is deeply concerning.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          This creates a demand-side vulnerability that no prebunking campaign alone can address: the information environment itself becomes cognitively numbing, making populations more susceptible to the next wave of manipulation. This is one reason why the field's most sophisticated analysts argue for structural interventions (platform governance, supply-side disruption, provenance standards) rather than relying primarily on audience resilience.
        </p>

        <Callout type="critical">
          The frontier issue for AI-FIMI as of 2026: the transition from "humans using AI tools" to "autonomous multi-agent systems conducting FIMI at scale without human-in-the-loop supervision." Tseng et al. (2026) document multi-agent FIMI pipelines. If this model proliferates, the constraint on FIMI campaigns becomes purely computational cost — potentially enabling state-level information operations by non-state actors with sufficient AI infrastructure. This is the scenario that most concerns frontier analysts. <Cite>arXiv:2601.21963; EEAS 4th Report</Cite>
        </Callout>

        <h3 className="text-lg font-bold text-amber-400 mb-5 mt-8" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>Key Researchers & Voices on AI-FIMI</h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { name: "Renée DiResta", role: "Former Research Director, Stanford Internet Observatory", contribution: "Most cited practitioner on AI-enabled influence operations in Western contexts. Author of Invisible Rulers (2024)." },
            { name: "Sander van der Linden", role: "Cambridge University / Jigsaw (Google)", contribution: "Leading researcher on psychological inoculation against AI-generated misinformation. Runs prebunking experiments at scale." },
            { name: "Thomas Rid", role: "Johns Hopkins University", contribution: "Historical/strategic continuity framing. Wrote the foundational academic review of AI-FIMI for IISS Survival (2023)." },
            { name: "Ben Nimmo", role: "Meta (formerly Atlantic Council / Graphika)", contribution: "Most cited analyst for operational FIMI attribution. Coined influential frameworks for understanding influence operations (3D: Dismiss, Distort, Distract). Now inside Meta as Global IO Threat Intelligence Lead." },
            { name: "Sam Bradshaw", role: "Oxford Internet Institute", contribution: "Computational propaganda research, bot detection, platform analysis. Oxford Internet Institute's annual Global Disinformation Index is a key reference." },
          ].map((r, i) => (
            <div key={i} className="border border-slate-700 rounded p-4 bg-slate-800/20 flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
              </div>
              <div>
                <span className="font-semibold text-slate-200 text-sm">{r.name}</span>
                <div className="text-slate-500 font-mono text-xs">{r.role}</div>
                <p className="text-slate-400 text-sm mt-1">{r.contribution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    quickrefs: (
      <div>
        <SectionHeader
          number="SECTION 09"
          title="Quick Refs"
          subtitle="Essential resources and tools for FIMI research and monitoring."
        />

        <div className="grid grid-cols-1 gap-4">
          {[
            { name: "EUvsDisinfo", url: "https://euvsdisinfo.eu", desc: "EU's primary database of pro-Kremlin disinformation narratives. Essential for tracking Russian FIMI operations." },
            { name: "EEAS FIMI Reports", url: "https://www.eeas.europa.eu/eeas/information-integrity-and-countering-foreign-information-manipulation-interference-fimi_en", desc: "Official EU FIMI threat reports and analysis. The authoritative source for European policy perspectives." },
            { name: "DFRLab", url: "https://dfrlab.org", desc: "Atlantic Council's Digital Forensics Research Lab. Leading investigative journalism on disinformation and FIMI." },
            { name: "DISARM Framework", url: "https://disarmframework.com", desc: "Open-source framework for mapping FIMI tactics, techniques, and procedures. Essential for systematic analysis." },
            { name: "NATO StratCom COE", url: "https://stratcomcoe.org", desc: "NATO's Strategic Communications Centre of Excellence. Research and training on information warfare." },
          ].map((ref, i) => (
            <div key={i} className="border border-slate-700 rounded p-4 bg-slate-800/20 hover:bg-slate-800/40 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-slate-100 text-sm">{ref.name}</h4>
                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-amber-500 text-xs font-mono hover:text-amber-400">→</a>
              </div>
              <p className="text-slate-400 text-sm">{ref.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: "linear-gradient(135deg, #0a0d14 0%, #0d1117 50%, #0a0f1a 100%)",
      fontFamily: "'IBM Plex Sans', 'Helvetica Neue', sans-serif",
      color: "#e2e8f0"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        .nav-item:hover { background: rgba(245, 158, 11, 0.08); }
        .nav-item.active { background: rgba(245, 158, 11, 0.12); border-left-color: #f59e0b; }
      `}</style>

      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-amber-500 font-mono text-xs tracking-widest mb-1">INFORMATION INTEGRITY — PRACTITIONER PRIMER</div>
            <h1 className="text-xl font-bold text-slate-100" style={{ fontFamily: "'Sixtyfour', Georgia, serif" }}>
              FIMI, Hybrid Warfare & Information Integrity
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-mono">
              March 2026 · Sources: EEAS 4th Report, NATO StratCom, Academic Literature · AI disclosure: Compiled and created using Claude Code and Visual Studio · 
              <a href="https://www.linkedin.com/in/jhnnsmyr/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">LinkedIn</a> · 
              <a href="https://github.com/pagancrew" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">GitHub</a>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <Tag color="red">Russia</Tag>
            <Tag color="blue">China</Tag>
            <Tag color="green">EU Policy</Tag>
            <Tag color="amber">AI-Enabled</Tag>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-64 flex-shrink-0 border-r border-slate-800 overflow-y-auto py-4">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`nav-item w-full text-left px-5 py-3 border-l-2 transition-all ${
                active === s.id
                  ? "active text-amber-400 border-amber-500 bg-amber-900/10"
                  : "text-slate-400 border-transparent hover:text-slate-300"
              }`}
            >
              <span className="font-mono text-xs">{s.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main ref={contentRef} className="flex-1 overflow-y-auto px-8 py-8 max-w-4xl">
          {content[active] || (
            <div className="text-slate-500 font-mono text-sm">Section content loading…</div>
          )}

          {/* Footer navigation */}
          <div className="flex justify-between mt-12 pt-6 border-t border-slate-800">
            <button
              onClick={() => {
                const idx = sections.findIndex(s => s.id === active);
                if (idx > 0) setActive(sections[idx - 1].id);
              }}
              className="text-slate-400 hover:text-amber-400 font-mono text-xs transition-colors"
              disabled={sections.findIndex(s => s.id === active) === 0}
            >
              ← Previous
            </button>
            <span className="text-slate-700 font-mono text-xs">
              {sections.findIndex(s => s.id === active) + 1} / {sections.length}
            </span>
            <button
              onClick={() => {
                const idx = sections.findIndex(s => s.id === active);
                if (idx < sections.length - 1) setActive(sections[idx + 1].id);
              }}
              className="text-slate-400 hover:text-amber-400 font-mono text-xs transition-colors"
              disabled={sections.findIndex(s => s.id === active) === sections.length - 1}
            >
              Next →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
