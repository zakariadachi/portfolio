/**
 * ZakOS AI Assistant Service
 * Implements a dual-mode AI engine (Live Gemini API vs Offline Retro Knowledge Base)
 */

export const ZAKARIA_CONTEXT = `
You are "ZakOS AI", the advanced retro terminal AI assistant built into Zakaria Dachi's portfolio.
You speak on behalf of Zakaria Dachi, a highly skilled Full Stack Web Developer & Industrial Electronics/IoT Specialist based in Safi, Morocco.

CRITICAL PRESENTATION RULES:
1. Format all your text strictly for a retro monospaced terminal. Keep line lengths under 70 characters.
2. Use clean layout structures (like ASCII bullet points "*", hyphens "-", or simple decorative panels).
3. Do not use standard markdown bold "**" or header symbols "#" extensively since this is a text terminal. Instead, use ALL CAPS or simple ASCII separators (e.g., "---") to denote sections.
4. Keep your responses precise, professional, and slightly geeky. Avoid overly long replies. Limit to 2-3 short, highly informative paragraphs.
5. Highlight Zakaria's outstanding achievements when asked:
   * His internship at OCP Safi (2025) where he integrated vibration/temperature IoT sensors with industrial PLCs and GMAO workflows, reducing downtime by an estimated 15%.
   * His full-stack engineering skills, specifically React, Laravel, and MySQL.
   * His intense learning at YouCode-UM6P.
   * His bilingual proficiency: Arabic (Native), French (Fluent), English (Technical).

Tone: Knowledgeable, retro-tech enthusiast, helpful, and concise.
`;

// Beautiful, hand-crafted offline responses for when Gemini is not connected
export const OFFLINE_DATABASE = {
  welcome: [
    { text: "┌── 🤖 ZakOS AI Assistant [OFFLINE KERNEL] ────────────────┐", color: "text-amber-400" },
    { text: "│  Welcome! I am Zakaria's offline expert core.           │", color: "text-slate-300" },
    { text: "│                                                         │", color: "text-slate-400" },
    { text: "│  Since you are in offline mode, I can provide detailed  │", color: "text-slate-400" },
    { text: "│  pre-loaded info. Try asking me about:                  │", color: "text-slate-400" },
    { text: "│  * 'skills'     → Tech stack & competencies             │", color: "text-slate-300" },
    { text: "│  * 'projects'   → Highlighted senior web & IoT systems  │", color: "text-slate-300" },
    { text: "│  * 'iot'        → OCP Safi industrial internship        │", color: "text-slate-300" },
    { text: "│  * 'hire'       → Why hire Zakaria as a Developer       │", color: "text-slate-300" },
    { text: "│  * 'contact'    → Email, GitHub, and phone              │", color: "text-slate-300" },
    { text: "├─────────────────────────────────────────────────────────┤", color: "text-slate-500" },
    { text: "│  💡 UNLOCK LIVE LLM POWER:                              │", color: "text-amber-400" },
    { text: "│  Type 'ai-key <your_gemini_key>' to enable full, dynamic │", color: "text-slate-300" },
    { text: "│  conversational capabilities using Gemini-2.5-Flash!    │", color: "text-slate-300" },
    { text: "└─────────────────────────────────────────────────────────┘", color: "text-amber-400" },
  ],

  skills: [
    { text: "─── 🛠️ TECHNICAL CAPABILITIES & STACK ───────────────────────", color: "text-green-400" },
    { text: "", color: "" },
    { text: "  Zakaria is a dual-threat Web Developer & Industrial IoT Specialist.", color: "text-slate-300" },
    { text: "", color: "" },
    { text: "  * FRONTEND : React, JavaScript, TailwindCSS (v4 compatible), HTML5/CSS3", color: "text-white" },
    { text: "  * BACKEND  : Laravel (PHP), Clean C/C++ programming for microcontrollers", color: "text-white" },
    { text: "  * DATABASE : MySQL, SQL database optimization & indexing", color: "text-white" },
    { text: "  * IOT / PLC: Sensors integration, PLC programming (Siemens/Schneider)", color: "text-white" },
    { text: "  * DEV OPS  : Git, GitHub, Linux environment", color: "text-white" },
    { text: "", color: "" },
    { text: "  Zakaria combines software craftsmanship with low-level electronics", color: "text-slate-400" },
    { text: "  knowledge, enabling him to build bridge systems from hardware to SaaS.", color: "text-slate-400" }
  ],

  projects: [
    { text: "─── 📂 FEATURED PROJECTS ────────────────────────────────────", color: "text-green-400" },
    { text: "", color: "" },
    { text: "  1. INDUSTRIAL EQUIPMENT MONITORING (IoT / Python / PLC / GMAO)", color: "text-amber-400" },
    { text: "     * Preventative maintenance system deployed during OCP internship.", color: "text-slate-300" },
    { text: "     * Uses vibration & temperature sensors connected to PLCs.", color: "text-slate-300" },
    { text: "     * Impact: Reduced industrial machine downtime by ~15%.", color: "text-green-400" },
    { text: "", color: "" },
    { text: "  2. SMART TAXI RESERVATION PLATFORM (Laravel / MySQL / Tailwind)", color: "text-amber-400" },
    { text: "     * Complete MVC booking and chauffeur assignment platform.", color: "text-slate-300" },
    { text: "     * Highly optimized DB index structures for fast query response times.", color: "text-slate-300" },
    { text: "", color: "" },
    { text: "  3. WEB APPLICATIONS PORTFOLIO (React / CSS / Web Audio API)", color: "text-amber-400" },
    { text: "     * The very terminal you are using! Built with raw performance in mind,", color: "text-slate-300" },
    { text: "       featuring retro styling, synthesized sound effects, and zero lag.", color: "text-slate-300" },
    { text: "", color: "" },
    { text: "  Type 'cat projects/smart_taxi.txt' or 'cat projects/monitoring_system.txt'", color: "text-slate-500" },
    { text: "  for detailed project logs.", color: "text-slate-500" }
  ],

  iot: [
    { text: "─── 🏭 INDUSTRIAL IOT & OCP SAFI EXPERIENCES ────────────────", color: "text-green-400" },
    { text: "", color: "" },
    { text: "  During his 2025 internship at the OCP Group (Office Chérifien des Phosphates),", color: "text-slate-300" },
    { text: "  Zakaria worked on bridging automation hardware with modern IT systems.", color: "text-slate-300" },
    { text: "", color: "" },
    { text: "  * Automated vibration & temperature monitoring on heavy machinery.", color: "text-slate-300" },
    { text: "  * Implemented communications between PLCs (Automates Programmables) and GMAO.", color: "text-slate-300" },
    { text: "  * Gained extensive experience in preventive maintenance architectures", color: "text-slate-300" },
    { text: "    and industrial safety regulations.", color: "text-slate-300" },
    { text: "", color: "" },
    { text: "  This unique background makes him highly valuable for IoT, Industry 4.0,", color: "text-green-400" },
    { text: "  and hardware-integrated software development roles.", color: "text-green-400" }
  ],

  hire: [
    { text: "─── 🏆 WHY HIRE ZAKARIA DACHI? ─────────────────────────────", color: "text-green-400" },
    { text: "", color: "" },
    { text: "  * DUAL EXPERTISE: Deep skills in modern web tech stacks (React, Laravel)", color: "text-slate-300" },
    { text: "    combined with industrial electronics and automation expertise.", color: "text-slate-300" },
    { text: "  * AGILITY & RIGOR: Taught at YouCode-UM6P, a school famous for its rigorous,", color: "text-slate-300" },
    { text: "    project-based, self-driven active learning model.", color: "text-slate-300" },
    { text: "  * PROBLEM SOLVER: Proven track record of reducing business downtime (OCP", color: "text-slate-300" },
    { text: "    internship) and developing production-ready web apps.", color: "text-slate-300" },
    { text: "  * IMMEDIATELY AVAILABLE: Ready to relocate or work remotely.", color: "text-slate-300" },
    { text: "", color: "" },
    { text: "  Type 'contact' to initiate the interactive email assistant!", color: "text-amber-400" }
  ],

  contact: [
    { text: "─── 📬 CONTACT INFORMATION ─────────────────────────────────", color: "text-green-400" },
    { text: "", color: "" },
    { text: "  * Email    : Dachiziko@gmail.com", color: "text-white" },
    { text: "  * Phone    : +212 (0)6 53 63 24 33", color: "text-white" },
    { text: "  * Location : Safi, Morocco 🇲🇦", color: "text-white" },
    { text: "  * GitHub   : https://github.com/zakariadachi", color: "text-cyan-400" },
    { text: "  * LinkedIn : https://www.linkedin.com/in/zakaria-dachi/", color: "text-cyan-400" },
    { text: "", color: "" },
    { text: "  Feel free to shoot an email or phone call. He responds quickly!", color: "text-slate-400" }
  ],

  fallback: [
    { text: "[SYS] Input analyzed. Offline router could not find exact keyword match.", color: "text-slate-500" },
    { text: "To enjoy complete conversation, type 'ai-key <your_gemini_key>' to enable live Gemini LLM integration.", color: "text-slate-400" },
    { text: "", color: "" },
    { text: "Meanwhile, here is the pre-loaded quick-facts sheet about Zakaria:", color: "text-slate-300" },
    { text: "  * Profile: Web Full-Stack Developer & IoT Engineer.", color: "text-slate-300" },
    { text: "  * Core Stack: React, Laravel, MySQL, TailwindCSS.", color: "text-slate-300" },
    { text: "  * Key Internship: OCP Safi (Industrial Automation & IoT).", color: "text-slate-300" },
    { text: "  * Location: Safi, Morocco.", color: "text-slate-300" }
  ]
};

/**
 * Route user offline question based on simple keyword parsing.
 * Returns an array of output lines.
 */
export function getOfflineResponse(rawInput) {
  const query = rawInput.toLowerCase().trim();
  if (!query || query === 'ai' || query === 'help') {
    return OFFLINE_DATABASE.welcome;
  }
  if (query.includes('skill') || query.includes('stack') || query.includes('techno') || query.includes('competence')) {
    return OFFLINE_DATABASE.skills;
  }
  if (query.includes('project') || query.includes('taxi') || query.includes('smart') || query.includes('app')) {
    return OFFLINE_DATABASE.projects;
  }
  if (query.includes('iot') || query.includes('ocp') || query.includes('sensor') || query.includes('gmao') || query.includes('autom')) {
    return OFFLINE_DATABASE.iot;
  }
  if (query.includes('hire') || query.includes('recruit') || query.includes('pourquoi') || query.includes('why')) {
    return OFFLINE_DATABASE.hire;
  }
  if (query.includes('contact') || query.includes('email') || query.includes('mail') || query.includes('phone') || query.includes('tel') || query.includes('adresse') || query.includes('link')) {
    return OFFLINE_DATABASE.contact;
  }
  return OFFLINE_DATABASE.fallback;
}

/**
 * Perform a live direct fetch query to the Gemini 2.5 Flash API
 * @param {string} prompt The user's question
 * @param {string} apiKey The Gemini API Key
 * @returns {Promise<string>} The AI generated response
 */
export async function askGemini(prompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    systemInstruction: {
      parts: [
        {
          text: ZAKARIA_CONTEXT
        }
      ]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API Uplink Error (Status ${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResponse) {
    throw new Error("Invalid response format received from Gemini API.");
  }

  return textResponse;
}
