import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import { askGemini, getOfflineResponse } from './ai'

/* ─── ASCII banner ─────────────────────────────────────────── */
const BANNER = `
███████╗  █████╗ ██╗  ██╗  █████╗ ██████╗ ██╗  █████╗     ██████╗ ███████╗██████╗ ██╗  ██╗██╗
╚══ ███╔╝██╔══██╗██║  ██╔╝██╔══██╗██╔══██╗██║╗██╔══██╗    ██╔══██╗██╔══██╗██╔════╝██║  ██║██║
  ███╔╝  ███████║██████╔╝ ███████║██████╔ ██║║███████║    ██║  ██║███████║██║     ███████║██║
███╔╝    ██╔══██║██╔══██╗ ██╔══██║██╔══██ ██║║██╔══██║    ██║  ██║██╔══██║██║     ██╔══██║██║
███████╗ ██║  ██║██║  ██ ╗██║  ██║██║  ██║██║ ██║  ██║    ██████╔╝██║  ██║██████╗ ██║  ██║██║
╚══════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═╝  ╚═╝╚═╝  ╚═╝═╝  ╚═╝  ╚═╝    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝`;

/* ─── Boot sequence lines ───────────────────────────────────── */
const BOOT_LINES = [
  { text: BANNER, color: 'text-green-400', pre: true },
  { text: '  Développeur Web Full Stack', color: 'text-cyan-400' },
  { text: '', color: '' },
  { text: '┌─────────────────────────────────────────────┐', color: 'text-slate-500' },
  { text: '│  OS      : Windows 10 / Ubuntu Subsystem    │', color: 'text-slate-400' },
  { text: '│  Shell   : zsh / bash                       │', color: 'text-slate-400' },
  { text: '│  Stack   : React, Laravel, MySQL, TailwindCSS│', color: 'text-slate-400' },
  { text: '│  Status  : ● Available for opportunities    │', color: 'text-slate-400' },
  { text: '└─────────────────────────────────────────────┘', color: 'text-slate-500' },
  { text: '', color: '' },
  { text: "  Type 'help' to see available commands.", color: 'text-amber-400' },
  { text: '', color: '' },
]

/* ─── Command responses ─────────────────────────────────────── */
const COMMANDS = {
  help: [
    { text: 'Available commands:', color: 'text-amber-400' },
    { text: '', color: '' },
    { text: '  about      →  Professional bio & background', color: 'text-slate-300' },
    { text: '  skills     →  Technical competencies & visual charts', color: 'text-slate-300' },
    { text: '  projects   →  Featured senior projects & metrics', color: 'text-slate-300' },
    { text: '  contact    →  Start interactive email assistant', color: 'text-slate-300' },
    { text: '  quote      →  Start project quote/estimation wizard', color: 'text-slate-300' },
    { text: '  theme      →  Change styling color theme (theme <name>)', color: 'text-slate-300' },
    { text: '  crt        →  Toggle CRT monitor retro filter effects', color: 'text-slate-300' },
    { text: '  matrix     →  Open retro falling code matrix animation', color: 'text-slate-300' },
    { text: '  game       →  Play retro terminal geek trivia quiz', color: 'text-slate-300' },
    { text: '  sound      →  Toggle mechanical keyboard click sounds', color: 'text-slate-300' },
    { text: '  neofetch   →  Show retro system info & stats', color: 'text-slate-300' },
    { text: '  cowsay     →  Make an ASCII cow speak (cowsay <text>)', color: 'text-slate-300' },
    { text: '  resume     →  Show printable CV & open Canva CV link', color: 'text-slate-300' },
    { text: '  ls         →  List files & folders in virtual directory', color: 'text-slate-300' },
    { text: '  cd         →  Change directory (cd <dir> or cd ..)', color: 'text-slate-300' },
    { text: '  cat        →  View file content in virtual directory', color: 'text-slate-300' },
    { text: '  clear      →  Clear the terminal screen', color: 'text-slate-300' },
    { text: '  exit       →  Exit current mode (game/contact/quote)', color: 'text-slate-300' },
    { text: '', color: '' },
  ],

  about: [
    { text: '$ whoami', color: 'text-cyan-400' },
    { text: '', color: '' },
    { text: '  Zakaria DACHI', color: 'text-green-400' },
    { text: '  Développeur Web Full Stack & Spécialiste Électronique/IoT', color: 'text-slate-300' },
    { text: '', color: '' },
    { text: '  Développeur full-stack passionné et rigoureux, spécialisé dans le', color: 'text-slate-400' },
    { text: '  développement d\'applications web robustes et interactives (React, Laravel,', color: 'text-slate-400' },
    { text: '  MySQL). Actuellement en formation Développement Web Full Stack à YouCode-UM6P.', color: 'text-slate-400' },
    { text: '', color: '' },
    { text: '  Récemment stagiaire en maintenance électronique industrielle à l\'OCP,', color: 'text-slate-400' },
    { text: '  où j\'ai combiné développement et ingénierie via des capteurs IoT,', color: 'text-slate-400' },
    { text: '  des automates programmables (PLC) et la gestion GMAO.', color: 'text-slate-400' },
    { text: '', color: '' },
    { text: '  Localisation : Safi, Maroc 🇲🇦', color: 'text-slate-500' },
    { text: '  Langues      : Arabe (Langue maternelle), Français (Courant), Anglais (Technique)', color: 'text-slate-500' },
    { text: '', color: '' },
  ],

  skills: [
    { text: '$ cat skills.json', color: 'text-cyan-400' },
    { text: '', color: '' },
    { text: '  [FRONTEND]', color: 'text-amber-400' },
    { text: '  React        [██████████████░░░] 80% (Avancé)', color: 'text-green-400' },
    { text: '  JavaScript   [████████████████░] 90% (Expert)', color: 'text-green-400' },
    { text: '  TailwindCSS  [████████████████░] 90% (Expert)', color: 'text-green-400' },
    { text: '  HTML5/CSS3   [████████████████░] 90% (Expert)', color: 'text-green-400' },
    { text: '', color: '' },
    { text: '  [BACKEND]', color: 'text-amber-400' },
    { text: '  Laravel      [████████████████░] 90% (Expert)', color: 'text-green-400' },
    { text: '  PHP / C      [██████████████░░░] 80% (Avancé)', color: 'text-green-400' },
    { text: '', color: '' },
    { text: '  [DATABASES, TOOLS & IOT]', color: 'text-amber-400' },
    { text: '  MySQL / SQL  [██████████████░░░] 80% (Avancé)', color: 'text-green-400' },
    { text: '  IoT / PLC    [████████████░░░░░] 70% (Maîtrisé)', color: 'text-green-400' },
    { text: '  Git / GitHub [██████████████░░░] 80% (Avancé)', color: 'text-green-400' },
    { text: '', color: '' },
  ],

  projects: [
    { text: '$ ls -la ~/projects/', color: 'text-cyan-400' },
    { text: '', color: '' },
    { text: '  Total projects completed: 23', color: 'text-amber-400' },
    { text: '', color: '' },

    { text: '┌── 🚕 Smart Taxi Reservation Platform ───────────────────┐', color: 'text-slate-500' },
    { text: '│  Tags    : [Laravel] [MySQL] [Tailwind CSS] [JavaScript] │', color: 'text-cyan-400' },
    { text: '│  ● Problématique : Absence d\'une gestion moderne des     │', color: 'text-slate-400' },
    { text: '│    réservations de trajets et affectations de chauffeurs.│', color: 'text-slate-400' },
    { text: '│  ● Solution      : Plateforme MVC complète, recherche de  │', color: 'text-slate-300' },
    { text: '│    trajets intelligente et dashboard d\'administration.   │', color: 'text-slate-300' },
    { text: '│  ● Impact        : Réservation en moins de 3 clics,       │', color: 'text-green-400' },
    { text: '│    temps de réponse BDD optimisé par indexation.          │', color: 'text-green-400' },
    { text: '│  ● GitHub Code   : https://github.com/zakariadachi       │', color: 'text-cyan-400', link: 'https://github.com/zakariadachi' },
    { text: '└─────────────────────────────────────────────────────────┘', color: 'text-slate-500' },
    { text: '', color: '' },

    { text: '┌── 🏭 Industrial Equipment Monitoring System ────────────┐', color: 'text-slate-500' },
    { text: '│  Tags    : [IoT] [PLC] [GMAO] [Sensors] [Python]        │', color: 'text-cyan-400' },
    { text: '│  ● Problématique : Pannes récurrentes causant des temps  │', color: 'text-slate-400' },
    { text: '│    d\'arrêt coûteux chez OCP Safi (internship 2025).      │', color: 'text-slate-400' },
    { text: '│  ● Solution      : Intégration de capteurs de vibrations  │', color: 'text-slate-300' },
    { text: '│    et température reliés aux PLC et flux GMAO.          │', color: 'text-slate-300' },
    { text: '│  ● Impact        : Réduction estimée des arrêts de 15%   │', color: 'text-green-400' },
    { text: '│    par maintenance préventive automatisée.               │', color: 'text-green-400' },
    { text: '└─────────────────────────────────────────────────────────┘', color: 'text-slate-500' },
    { text: '', color: '' },

    { text: '┌── 💻 Web Applications Portfolio ────────────────────────┐', color: 'text-slate-500' },
    { text: '│  Tags    : [React] [Laravel] [MySQL] [Tailwind CSS]     │', color: 'text-cyan-400' },
    { text: '│  ● Problématique : Centraliser plus de 20 applications    │', color: 'text-slate-400' },
    { text: '│    web de façon originale, ergonomique et marquante.     │', color: 'text-slate-400' },
    { text: '│  ● Solution      : Terminal virtuel immersif avec Matrix │', color: 'text-slate-300' },
    { text: '│    rain, sons synthétisés, devis et filesystem réel.    │', color: 'text-slate-300' },
    { text: '│  ● Impact        : Zéro dépendance audio externe,         │', color: 'text-green-400' },
    { text: '│    chargement en <400ms et 100% conforme ESLint.         │', color: 'text-green-400' },
    { text: '│  ● GitHub Code   : https://github.com/zakariadachi/portf │', color: 'text-cyan-400', link: 'https://github.com/zakariadachi' },
    { text: '└─────────────────────────────────────────────────────────┘', color: 'text-slate-500' },
    { text: '', color: '' }
  ],

  contact: [
    { text: '$ cat contact.txt', color: 'text-cyan-400' },
    { text: '', color: '' },
    { text: '  Email    : Dachiziko@gmail.com', color: 'text-green-400' },
    { text: '  Phone    : +212 (0)6 53 63 24 33', color: 'text-green-400' },
    { text: '  Location : Safi, Morocco', color: 'text-green-400' },
    { text: '  GitHub   : https://github.com/zakariadachi', color: 'text-cyan-400', link: 'https://github.com/zakariadachi' },
    { text: '  LinkedIn : https://www.linkedin.com/in/zakaria-dachi/', color: 'text-cyan-400', link: 'https://www.linkedin.com/in/zakaria-dachi/' },
    { text: '', color: '' },
    { text: "  Disponible immédiatement pour des rôles Full-Stack, projets web", color: 'text-slate-400' },
    { text: '  ou collaborations industrielles. Discutons ensemble !', color: 'text-slate-400' },
    { text: '', color: '' },
  ],
}

/* ─── Virtual Filesystem & Contents ────────────────────────── */
const FILE_SYSTEM = {
  children: {
    'about.txt': { type: 'file', contentKey: 'about' },
    'skills.json': { type: 'file', contentKey: 'skills' },
    'contact.txt': { type: 'file', contentKey: 'contact' },
    'projects': {
      type: 'dir',
      children: {
        'smart_taxi.txt': { type: 'file', contentKey: 'project_smart_taxi' },
        'monitoring_system.txt': { type: 'file', contentKey: 'project_monitoring_system' },
        'portfolio.txt': { type: 'file', contentKey: 'project_portfolio' }
      }
    }
  }
}

const FILE_CONTENTS = {
  about: COMMANDS.about,
  skills: COMMANDS.skills,
  contact: COMMANDS.contact,
  project_smart_taxi: [
    { text: '┌── Smart Taxi Reservation Platform ──────────────────────┐', color: 'text-slate-500' },
    { text: '│  Tags    : [Laravel] [MySQL] [Tailwind CSS] [JavaScript] │', color: 'text-cyan-400' },
    { text: '│  ● Problématique : Absence d\'une gestion moderne des     │', color: 'text-slate-400' },
    { text: '│    réservations de trajets et affectations de chauffeurs.│', color: 'text-slate-400' },
    { text: '│  ● Solution      : Plateforme MVC complète, recherche de  │', color: 'text-slate-300' },
    { text: '│    trajets intelligente et dashboard d\'administration.   │', color: 'text-slate-300' },
    { text: '│  ● Impact        : Réservation en moins de 3 clics,       │', color: 'text-green-400' },
    { text: '│    temps de réponse BDD optimisé par indexation.          │', color: 'text-green-400' },
    { text: '│  ● GitHub Code   : https://github.com/zakariadachi       │', color: 'text-cyan-400', link: 'https://github.com/zakariadachi' },
    { text: '└─────────────────────────────────────────────────────────┘', color: 'text-slate-500' }
  ],
  project_monitoring_system: [
    { text: '┌── Industrial Equipment Monitoring System ────────────────┐', color: 'text-slate-500' },
    { text: '│  Tags    : [IoT] [PLC] [GMAO] [Sensors] [Python]        │', color: 'text-cyan-400' },
    { text: '│  ● Problématique : Pannes récurrentes causant des temps  │', color: 'text-slate-400' },
    { text: '│    d\'arrêt coûteux chez OCP Safi (internship 2025).      │', color: 'text-slate-400' },
    { text: '│  ● Solution      : Intégration de capteurs de vibrations  │', color: 'text-slate-300' },
    { text: '│    et température reliés aux PLC et flux GMAO.          │', color: 'text-slate-300' },
    { text: '│  ● Impact        : Réduction estimée des arrêts de 15%   │', color: 'text-green-400' },
    { text: '│    par maintenance préventive automatisée.               │', color: 'text-green-400' },
    { text: '└─────────────────────────────────────────────────────────┘', color: 'text-slate-500' }
  ],
  project_portfolio: [
    { text: '┌── Full-Stack Web Applications Portfolio ─────────────────┐', color: 'text-slate-500' },
    { text: '│  Tags    : [React] [Laravel] [MySQL] [Tailwind CSS]     │', color: 'text-cyan-400' },
    { text: '│  ● Problématique : Centraliser plus de 20 applications    │', color: 'text-slate-400' },
    { text: '│    web de façon originale, ergonomique et marquante.     │', color: 'text-slate-400' },
    { text: '│  ● Solution      : Terminal virtuel immersif avec Matrix │', color: 'text-slate-300' },
    { text: '│    rain, sons synthétisés, devis et filesystem réel.    │', color: 'text-slate-300' },
    { text: '│  ● Impact        : Zéro dépendance audio externe,         │', color: 'text-green-400' },
    { text: '│    chargement en <400ms et 100% conforme ESLint.         │', color: 'text-green-400' },
    { text: '│  ● GitHub Code   : https://github.com/zakariadachi/portf │', color: 'text-cyan-400', link: 'https://github.com/zakariadachi' },
    { text: '└─────────────────────────────────────────────────────────┘', color: 'text-slate-500' }
  ]
}

/* ─── Quiz Questions ────────────────────────────────────────── */
const QUIZ_QUESTIONS = [
  {
    q: 'Which React hook is used to run side effects in functional components?',
    a: ['useeffect', 'effect'],
    hint: 'starts with "use" and ends with "fect"'
  },
  {
    q: 'In Tailwind CSS v4, which directive is used to import framework styles inside index.css?',
    a: ['@import "tailwindcss"', 'import tailwindcss', '@import tailwindcss'],
    hint: 'starts with @import'
  },
  {
    q: 'What is the default port number used by Vite development server?',
    a: ['5173'],
    hint: 'starts with 5, ends with 73'
  },
  {
    q: 'What React hook is used to persist values across renders without causing a re-render?',
    a: ['useref', 'ref'],
    hint: 'starts with "use" and ends with "ref"'
  },
  {
    q: 'What React hook is used to memoize the definition of a callback function?',
    a: ['usecallback', 'callback'],
    hint: 'starts with "use" and ends with "callback"'
  },
  {
    q: 'Which PHP framework is named after an elegant city-state and focuses on developer happiness?',
    a: ['laravel'],
    hint: 'starts with "lara" and ends with "vel"'
  },
  {
    q: 'Who is the original creator of the PHP language?',
    a: ['rasmus lerdorf', 'rasmus'],
    hint: 'First name is Rasmus'
  },
  {
    q: 'What programming language was created by Dennis Ritchie at Bell Labs in 1972?',
    a: ['c'],
    hint: 'A single letter of the alphabet'
  },
  {
    q: 'In industrial automation, what does the acronym "PLC" stand for?',
    a: ['programmable logic controller', 'programmable logic controllers'],
    hint: 'P... L... C...'
  },
  {
    q: 'What popular single-board computer is widely used for IoT projects, robotics, and learning?',
    a: ['raspberry pi', 'raspberry', 'raspi'],
    hint: 'A sweet red fruit pie 🍓'
  },
  {
    q: 'What open-source electronics platform is based on easy-to-use hardware, featuring microcontrollers like ATmega328?',
    a: ['arduino'],
    hint: 'starts with "ard" and ends with "uino"'
  },
  {
    q: 'In digital electronics, how many bits make up one byte?',
    a: ['8', 'eight'],
    hint: '2 raised to the power of 3'
  },
  {
    q: 'Which Git command is used to download the history and file contents of a remote repository?',
    a: ['git clone', 'clone'],
    hint: 'starts with "c" and ends with "lone"'
  },
  {
    q: 'What Git command is used to stage changes for the next commit?',
    a: ['git add', 'add'],
    hint: 'A three-letter word starting with "a"'
  },
  {
    q: 'What is the default branch name in modern Git repositories?',
    a: ['main'],
    hint: 'starts with "m" and ends with "n"'
  },
  {
    q: 'In Unix/Linux, which command is used to print the current working directory?',
    a: ['pwd'],
    hint: 'p... w... d...'
  },
  {
    q: 'In the terminal, which command displays the manual page or documentation of another command?',
    a: ['man'],
    hint: 'A three-letter word, also refers to a human male'
  },
  {
    q: 'What protocol is used to securely connect to a remote terminal/server over an encrypted channel?',
    a: ['ssh', 'secure shell'],
    hint: 'starts with "s", ends with "h"'
  },
  {
    q: 'In Bash, what symbol is used to pipe the output of one command as input to another command?',
    a: ['|', 'pipe', 'vertical bar'],
    hint: 'A vertical bar character `|`'
  },
  {
    q: 'What standard query language is used to manage and manipulate relational databases?',
    a: ['sql', 'structured query language'],
    hint: 'S... Q... L...'
  },
  {
    q: 'In SQL, which keyword is used to retrieve data from a database?',
    a: ['select'],
    hint: 'starts with "s" and ends with "ct"'
  },
  {
    q: 'In SQL, which clause is used to filter records based on a specified condition?',
    a: ['where'],
    hint: 'A five-letter question word about location'
  },
  {
    q: "Who is widely recognized as the world's first computer programmer for her work on Babbage's Analytical Engine?",
    a: ['ada lovelace', 'ada'],
    hint: 'Her first name is Ada'
  },
  {
    q: 'What animal is the official mascot of the Linux operating system?',
    a: ['penguin', 'tux'],
    hint: 'A flightless bird that lives in cold regions 🐧'
  },
  {
    q: 'What does HTML stand for?',
    a: ['hypertext markup language', 'hyper text markup language'],
    hint: 'H... T... M... L...'
  },
  {
    q: 'In JavaScript, what keyword is used to declare a block-scoped variable that can be reassigned?',
    a: ['let'],
    hint: 'A three-letter word, also means to allow'
  }
]

/* ─── All Autocomplete Commands ──────────────────────────────── */
const ALL_COMMANDS = ['help', 'about', 'skills', 'projects', 'contact', 'clear', 'exit', 'theme', 'crt', 'matrix', 'game', 'sound', 'neofetch', 'cowsay', 'resume', 'ls', 'cd', 'cat', 'quote', 'ai', 'ai-key']

/* ─── Single output line ────────────────────────────────────── */
function OutputLine({ line }) {
  if (line.pre) {
    return (
      <div className="overflow-x-auto w-full">
        <pre
          className={`font-mono leading-tight whitespace-pre glow-text ${line.color}`}
          style={{ fontSize: 'clamp(0.35rem, 1vw, 0.75rem)' }}
        >
          {line.text}
        </pre>
      </div>
    )
  }
  if (line.link) {
    return (
      <p className={`text-sm glow-text ${line.color}`}>
        {line.text.split('https://')[0]}
        <a
          href={line.link}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white transition-colors"
        >
          https://{line.text.split('https://')[1]}
        </a>
      </p>
    )
  }
  return <p className={`text-sm leading-relaxed glow-text ${line.color}`}>{line.text || '\u00A0'}</p>
}

/* ─── Matrix Rain Overlay Component ─────────────────────────── */
function MatrixRain({ onClose }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    let animationFrameId
    
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&'
    const charArr = chars.split('')
    
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize) + 1
    const drops = Array(columns).fill(1)

    const computedStyle = window.getComputedStyle(canvas)
    const greenColor = computedStyle.getPropertyValue('--color-green').trim() || '#22c55e'

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = greenColor
      ctx.font = `${fontSize}px monospace`
      
      for (let i = 0; i < drops.length; i++) {
        const text = charArr[Math.floor(Math.random() * charArr.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize
        
        ctx.fillText(text, x, y)
        
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
      animationFrameId = requestAnimationFrame(draw)
    }
    
    draw()

    const handleKeyOrClick = () => {
      onClose()
    }

    window.addEventListener('keydown', handleKeyOrClick)
    canvas.addEventListener('click', handleKeyOrClick)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('keydown', handleKeyOrClick)
    }
  }, [onClose])

  return (
    <div className="absolute inset-0 z-50 bg-black overflow-hidden flex flex-col justify-end rounded-b-xl">
      <canvas ref={canvasRef} className="absolute inset-0 block cursor-pointer" />
      <div className="absolute top-4 right-4 z-50 bg-slate-900 border border-green-500 text-green-400 text-xs px-2 py-1 rounded animate-pulse pointer-events-none font-mono">
        Press any key or click to exit
      </div>
    </div>
  )
}

/* ─── Web Audio API Synthesizer ───────────────────────────── */
let audioCtx = null

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function playSound(type, soundEnabled) {
  if (!soundEnabled) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    if (type === 'click') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1000, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.015)

      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.015)
    } else if (type === 'startup') {
      const notes = [261.63, 329.63, 392.00, 523.25]
      notes.forEach((freq, idx) => {
        const time = ctx.currentTime + idx * 0.08
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, time)
        
        gain.gain.setValueAtTime(0, time)
        gain.gain.linearRampToValueAtTime(0.12, time + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35)
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(time)
        osc.stop(time + 0.35)
      })
    } else if (type === 'success') {
      const notes = [523.25, 659.25, 783.99, 1046.50]
      notes.forEach((freq, idx) => {
        const time = ctx.currentTime + idx * 0.06
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, time)
        
        gain.gain.setValueAtTime(0, time)
        gain.gain.linearRampToValueAtTime(0.1, time + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25)
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(time)
        osc.stop(time + 0.25)
      })
    } else if (type === 'error') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(120, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.15)

      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.15)
    }
  } catch (e) {
    console.warn("Audio Context blocked or failed:", e)
  }
}

/* ─── Main App ──────────────────────────────────────────────── */
export default function App() {
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [booted, setBooted] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const mountTime = useRef(0)
  const startupPlayed = useRef(false)

  /* persistent States */
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('term-theme') || 'matrix'
  })
  const [crtEnabled, setCrtEnabled] = useState(() => {
    return localStorage.getItem('term-crt') !== 'false'
  })
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('term-sound') !== 'false'
  })
  const [currentPath, setCurrentPath] = useState([])

  const [cmdHistory, setCmdHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('term-cmd-history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [matrixActive, setMatrixActive] = useState(false)
  const [gameState, setGameState] = useState(null) // null, or { questionIdx: 0, score: 0 }
  
  /* Interactive form states */
  const [contactState, setContactState] = useState(null) // null, or { step: 0, name: '', email: '', message: '' }
  const [quoteState, setQuoteState] = useState(null) // null, or { step: 0, type: '', auth: '', payment: '' }

  /* Boot sequence — affiche tout d'un coup après un court délai */
  useEffect(() => {
    mountTime.current = Date.now()
    const timer = setTimeout(() => {
      setHistory([{ type: 'output', lines: BOOT_LINES }])
      setBooted(true)
      if (!startupPlayed.current) {
        playSound('startup', localStorage.getItem('term-sound') !== 'false')
        startupPlayed.current = true
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  /* Focus input on click anywhere */
  const focusInput = useCallback(() => inputRef.current?.focus(), [])

  const handleAIQuery = useCallback((question, prompt, interceptedCommand = null) => {
    const queryText = interceptedCommand ? interceptedCommand : question;
    if (!queryText.trim()) {
      setHistory(prev => [
        ...prev,
        prompt,
        {
          type: 'output',
          lines: [
            { text: '  Usage: ai <your question/prompt>', color: 'text-amber-400' },
            { text: '  Example: ai what are Zakaria\'s skills?', color: 'text-slate-300' },
            { text: '', color: '' }
          ]
        }
      ]);
      return;
    }

    // Determine if it's a conversational sentence or standard question
    const queryLower = queryText.toLowerCase().trim();
    const conversationalKeywords = [
      'who', 'what', 'why', 'how', 'where', 'when', 'tell', 'show', 'explain', 'describe', 'can you', 'do you',
      'qui', 'que', 'quoi', 'pourquoi', 'comment', 'ou', 'quand', 'parle', 'explique', 'decrir', 'peux-tu', 'est-ce',
      'hello', 'hi', 'hey', 'salut', 'bonjour', 'yo', 'bonsoir', 'cv', 'ca va', 'comment', 'aide'
    ];
    const isQuestion = queryLower.endsWith('?') || 
                       conversationalKeywords.some(k => queryLower.startsWith(k) || queryLower.includes(' ' + k) || queryLower.startsWith(k + ' '));

    const isIntercepted = !!interceptedCommand;
    let diagnosticLines = [];

    if (isIntercepted) {
      if (isQuestion) {
        // Unrecognized command but looks like a direct question!
        diagnosticLines = [
          { text: `  [SYS] Direct AI Query detected: "${queryText.slice(0, 45)}${queryText.length > 45 ? '...' : ''}"`, color: 'text-cyan-400 animate-pulse' },
          { text: '  [SYS] Routing to natural language parsing core... [OK]', color: 'text-slate-500' }
        ];
      } else {
        // Typical false command (gibberish or typo)
        diagnosticLines = [
          { text: `  bash: ${interceptedCommand}: command not found.`, color: 'text-red-400' },
          { text: `  [SYS] Intercepting false command. Asking ZakOS AI...`, color: 'text-cyan-400 animate-pulse' },
          { text: '  [SYS] Routing to diagnostic parsing core... [OK]', color: 'text-slate-500' }
        ];
      }
    } else {
      // Normal 'ai' prefixed command
      diagnosticLines = [
        { text: `  [SYS] Uplink request received: "${queryText.slice(0, 45)}${queryText.length > 45 ? '...' : ''}"`, color: 'text-slate-400' },
        { text: '  [SYS] Booting natural language parsing core... [OK]', color: 'text-slate-500' }
      ];
    }

    setHistory(prev => [
      ...prev,
      prompt,
      { type: 'output', lines: diagnosticLines }
    ]);

    const activeKey = localStorage.getItem('term-ai-key') || import.meta.env.VITE_GEMINI_API_KEY;

    const startStreaming = (linesArray) => {
      setHistory(prev => [...prev, { type: 'output', lines: [] }]);
      
      let accumulated = [];
      let index = 0;
      const interval = setInterval(() => {
        if (index >= linesArray.length) {
          clearInterval(interval);
          return;
        }
        accumulated.push(linesArray[index]);
        setHistory(prev => {
          if (prev.length === 0) return prev;
          const last = prev[prev.length - 1];
          if (last && last.type === 'output') {
            const updatedLast = {
              ...last,
              lines: [...accumulated]
            };
            return [...prev.slice(0, -1), updatedLast];
          }
          return prev;
        });
        playSound('click', soundEnabled);
        index++;
      }, 70);
    };

    if (activeKey) {
      setHistory(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        if (last && last.type === 'output') {
          // Prevent duplicates under double-triggered renders/updaters
          if (last.lines.some(l => l && l.text && l.text.includes('Routing encrypted query'))) {
            return prev;
          }
          const updatedLast = {
            ...last,
            lines: [
              ...last.lines,
              { text: '  [SYS] Routing encrypted query to Gemini-2.5-Flash... [WAIT]', color: 'text-amber-400 animate-pulse' }
            ]
          };
          return [...prev.slice(0, -1), updatedLast];
        }
        return prev;
      });

      askGemini(queryText, activeKey)
        .then(responseText => {
          setHistory(prev => {
            if (prev.length === 0) return prev;
            const last = prev[prev.length - 1];
            if (last && last.type === 'output') {
              if (last.lines.some(l => l && l.text && l.text.includes('Uplink established'))) {
                return prev;
              }
              const filteredLines = last.lines.filter(l => l && typeof l.text === 'string' && !l.text.includes('[WAIT]'));
              const updatedLast = {
                ...last,
                lines: [
                  ...filteredLines,
                  { text: '  [SYS] Uplink established. Decompressing response stream... [OK]', color: 'text-green-400' },
                  { text: '', color: '' }
                ]
              };
              return [...prev.slice(0, -1), updatedLast];
            }
            return prev;
          });

          const rawLines = responseText.split('\n');
          const formattedLines = rawLines.map(lineText => {
            let color = 'text-green-400';
            if (lineText.startsWith('---') || lineText.startsWith('===')) color = 'text-slate-500';
            else if (lineText.startsWith('*') || lineText.startsWith('-')) color = 'text-cyan-400';
            else if (lineText.toUpperCase() === lineText && lineText.length > 3) color = 'text-amber-400';
            return { text: `  ${lineText}`, color };
          });

          startStreaming(formattedLines);
        })
        .catch(err => {
          console.error("Gemini failed:", err);
          playSound('error', soundEnabled);
          setHistory(prev => {
            if (prev.length === 0) return prev;
            const last = prev[prev.length - 1];
            if (last && last.type === 'output') {
              if (last.lines.some(l => l && l.text && l.text.includes('Link error'))) {
                return prev;
              }
              const filteredLines = last.lines.filter(l => l && typeof l.text === 'string' && !l.text.includes('[WAIT]'));
              const updatedLast = {
                ...last,
                lines: [
                  ...filteredLines,
                  { text: `  [SYS] Link error: ${err.message}`, color: 'text-red-400' },
                  { text: '  [SYS] Falling back to offline retro expert core... [OK]', color: 'text-amber-400' },
                  { text: '', color: '' }
                ]
              };
              return [...prev.slice(0, -1), updatedLast];
            }
            return prev;
          });
          const offlineLines = getOfflineResponse(queryText);
          startStreaming(offlineLines);
        });
    } else {
      setHistory(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        if (last && last.type === 'output') {
          if (last.lines.some(l => l && l.text && l.text.includes('No Gemini API key detected'))) {
            return prev;
          }
          const updatedLast = {
            ...last,
            lines: [
              ...last.lines,
              { text: '  [SYS] No Gemini API key detected. Querying offline database... [OK]', color: 'text-cyan-400' },
              { text: '', color: '' }
            ]
          };
          return [...prev.slice(0, -1), updatedLast];
        }
        return prev;
      });
      const offlineLines = getOfflineResponse(queryText);
      setTimeout(() => {
        startStreaming(offlineLines);
      }, 500);
    }
  }, [soundEnabled]);

  const runCommand = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd && !contactState && !quoteState) return

    setCmdHistory(prev => {
      const updated = [raw.trim(), ...prev.filter(c => c !== raw.trim())].slice(0, 50)
      localStorage.setItem('term-cmd-history', JSON.stringify(updated))
      return updated
    })
    setHistoryIdx(-1)

    const pathStr = currentPath.length > 0 ? `~/${currentPath.join('/')}` : '~'
    
    // Custom prompts logic in history logs
    const prompt = { 
      type: 'prompt', 
      text: raw, 
      path: pathStr, 
      isQuiz: !!gameState,
      isContact: !!contactState,
      isQuote: !!quoteState,
      step: contactState ? contactState.step + 1 : quoteState ? quoteState.step + 1 : 0
    }

    /* ─── Mode Messagerie Interactif Actif ────────────────── */
    if (contactState) {
      const value = raw.trim()
      
      if (value.toLowerCase() === 'exit' || value.toLowerCase() === 'quit') {
        playSound('error', soundEnabled)
        setContactState(null)
        setHistory(prev => [...prev, prompt, { type: 'output', lines: [{ text: '  Messagerie annulée.', color: 'text-slate-400' }] }])
        return
      }

      // Step 0: Name
      if (contactState.step === 0) {
        setContactState({ step: 1, name: value, email: '', message: '' })
        setHistory(prev => [
          ...prev,
          prompt,
          {
            type: 'output',
            lines: [
              { text: `  -> Nom enregistré : "${value}"`, color: 'text-green-400' },
              { text: '', color: '' },
              { text: '  ✉ Étape 2 : Entrez votre adresse email :', color: 'text-white' }
            ]
          }
        ])
        return
      }

      // Step 1: Email
      if (contactState.step === 1) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          playSound('error', soundEnabled)
          setHistory(prev => [
            ...prev,
            prompt,
            {
              type: 'output',
              lines: [
                { text: `  [ERREUR] L'adresse "${value}" est invalide.`, color: 'text-red-400' },
                { text: '  ✉ Veuillez entrer un email valide (ex: contact@entreprise.com) :', color: 'text-amber-400' }
              ]
            }
          ])
          return
        }
        setContactState(prev => ({ ...prev, step: 2, email: value }))
        setHistory(prev => [
          ...prev,
          prompt,
          {
            type: 'output',
            lines: [
              { text: `  -> Email enregistré : "${value}"`, color: 'text-green-400' },
              { text: '', color: '' },
              { text: '  ✍ Étape 3 : Saisissez votre message :', color: 'text-white' }
            ]
          }
        ])
        return
      }

      // Step 2: Message
      if (contactState.step === 2) {
        const finalName = contactState.name
        const finalEmail = contactState.email
        setContactState(null)
        playSound('success', soundEnabled)

        try {
          const mailtoUrl = `mailto:Dachiziko@gmail.com?subject=Contact via Portfolio de la part de ${encodeURIComponent(finalName)}&body=${encodeURIComponent(
            `Bonjour Zakaria,\n\n${value}\n\nCordialement,\n${finalName}\nEmail: ${finalEmail}`
          )}`
          window.open(mailtoUrl, '_self')
        } catch (e) {
          console.warn("Mailto redirection failed:", e)
        }

        setHistory(prev => [
          ...prev,
          prompt,
          {
            type: 'output',
            lines: [
              { text: '  [INFO] Chiffrement de la liaison de contact... [OK]', color: 'text-slate-400' },
              { text: '  [INFO] Préparation de la transmission... [OK]', color: 'text-slate-400' },
              { text: '  [SUCCESS] Message empaqueté avec succès !', color: 'text-green-400' },
              { text: '', color: '' },
              { text: '  [INFO] Votre client mail par défaut a été ouvert pour envoyer le message.', color: 'text-slate-300' },
              { text: '  Destinataire : Dachiziko@gmail.com', color: 'text-cyan-400' },
              { text: '  Si le client mail ne s\'est pas ouvert, vous pouvez envoyer directement à Dachiziko@gmail.com', color: 'text-slate-500' },
              { text: '', color: '' }
            ]
          }
        ])
        return
      }
    }

    /* ─── Mode Estimation de Devis Interactif Actif ───────── */
    if (quoteState) {
      const value = raw.trim().toLowerCase()

      if (value === 'exit' || value === 'quit') {
        playSound('error', soundEnabled)
        setQuoteState(null)
        setHistory(prev => [...prev, prompt, { type: 'output', lines: [{ text: '  Simulateur de devis annulé.', color: 'text-slate-400' }] }])
        return
      }

      // Step 0: Project Type
      if (quoteState.step === 0) {
        if (!['1', '2', '3', '4'].includes(value)) {
          playSound('error', soundEnabled)
          setHistory(prev => [
            ...prev,
            prompt,
            {
              type: 'output',
              lines: [{ text: '  [ERREUR] Choix invalide. Veuillez entrer un nombre entre 1 et 4 :', color: 'text-red-400' }]
            }
          ])
          return
        }
        setQuoteState({ step: 1, type: value, auth: '', payment: '' })
        setHistory(prev => [
          ...prev,
          prompt,
          {
            type: 'output',
            lines: [
              { text: `  -> Choix enregistré : Option ${value}`, color: 'text-green-400' },
              { text: '', color: '' },
              { text: '  🔑 Étape 2 : Votre projet nécessite-t-il des comptes utilisateurs et de l\'authentification ? (y/n) :', color: 'text-white' }
            ]
          }
        ])
        return
      }

      // Step 1: Auth
      if (quoteState.step === 1) {
        if (value !== 'y' && value !== 'n') {
          playSound('error', soundEnabled)
          setHistory(prev => [
            ...prev,
            prompt,
            {
              type: 'output',
              lines: [{ text: '  [ERREUR] Entrée invalide. Veuillez répondre par "y" (oui) ou "n" (non) :', color: 'text-red-400' }]
            }
          ])
          return
        }
        setQuoteState(prev => ({ ...prev, step: 2, auth: value }))
        setHistory(prev => [
          ...prev,
          prompt,
          {
            type: 'output',
            lines: [
              { text: `  -> Authentification : ${value === 'y' ? 'Oui' : 'Non'}`, color: 'text-green-400' },
              { text: '', color: '' },
              { text: '  💳 Étape 3 : Votre projet nécessite-t-il des paiements en ligne (Stripe, CB...) ? (y/n) :', color: 'text-white' }
            ]
          }
        ])
        return
      }

      // Step 2: Payment
      if (quoteState.step === 2) {
        if (value !== 'y' && value !== 'n') {
          playSound('error', soundEnabled)
          setHistory(prev => [
            ...prev,
            prompt,
            {
              type: 'output',
              lines: [{ text: '  [ERREUR] Entrée invalide. Veuillez répondre par "y" (oui) ou "n" (non) :', color: 'text-red-400' }]
            }
          ])
          return
        }

        const finalType = quoteState.type
        const finalAuth = quoteState.auth
        setQuoteState(null)
        playSound('success', soundEnabled)

        // Calculate devis
        let basePrice = 1800
        let typeLabel = 'Application Web Sur-Mesure'
        let stack = 'React + PHP Sur-Mesure'
        let weeks = 3

        if (finalType === '1') {
          basePrice = 2200
          typeLabel = 'Site E-commerce Moderne'
          stack = 'Laravel + MySQL + Stripe'
        } else if (finalType === '2') {
          basePrice = 2600
          typeLabel = 'SaaS / Dashboard Client'
          stack = 'React + Laravel + TailwindCSS'
        } else if (finalType === '3') {
          basePrice = 3000
          typeLabel = 'Solution Automates & IoT'
          stack = 'Python + IoT Sensors + PLC Control'
          weeks = 4
        }

        let optionsPrice = 0
        if (finalAuth === 'y') {
          optionsPrice += 600
          weeks += 1
        }
        if (value === 'y') {
          optionsPrice += 800
          weeks += 1
        }
        const totalPrice = basePrice + optionsPrice

        setHistory(prev => [
          ...prev,
          prompt,
          {
            type: 'output',
            lines: [
              { text: '  [INFO] Analyse des besoins techniques... [OK]', color: 'text-slate-400' },
              { text: '  [INFO] Calcul des ressources et délais... [OK]', color: 'text-slate-400' },
              { text: '', color: '' },
              { text: '╔════════════════════════════════════════════════════════════╗', color: 'text-green-400' },
              { text: '║           ESTIMATION RETRO DE VOTRE PROJET                 ║', color: 'text-green-400' },
              { text: '╠════════════════════════════════════════════════════════════╣', color: 'text-green-400' },
              { text: `║  ● Type de projet   : ${typeLabel.padEnd(36)} ║`, color: 'text-white' },
              { text: `║  ● Système d'accès  : ${(finalAuth === 'y' ? 'Oui (Comptes utilisateurs)' : 'Non').padEnd(36)} ║`, color: 'text-white' },
              { text: `║  ● Transactions     : ${(value === 'y' ? 'Oui (Paiement Stripe/CB)' : 'Non').padEnd(36)} ║`, color: 'text-white' },
              { text: `║  ● Tarif indicatif  : ${(totalPrice + ' € (HT)').padEnd(36)} ║`, color: 'text-cyan-400' },
              { text: `║  ● Délai estimé     : ${(weeks + ' semaines de développement').padEnd(36)} ║`, color: 'text-cyan-400' },
              { text: `║  ● Stack conseillée : ${stack.padEnd(36)} ║`, color: 'text-amber-400' },
              { text: '╚════════════════════════════════════════════════════════════╝', color: 'text-green-400' },
              { text: '  * Cette estimation est indicative. Contactez-moi avec la commande', color: 'text-slate-400' },
              { text: '    "contact" pour affiner et cadrer précisément votre projet !', color: 'text-slate-400' },
              { text: '', color: '' }
            ]
          }
        ])
        return
      }
    }

    /* ─── Mode Quiz Actif ─────────────────────────────────── */
    if (gameState) {
      if (cmd === 'exit' || cmd === 'quit') {
        playSound('error', soundEnabled)
        setGameState(null)
        setHistory(prev => [
          ...prev,
          prompt,
          { type: 'output', lines: [{ text: '  Game exited. Back to terminal.', color: 'text-slate-400' }] }
        ])
        return
      }

      const currentQ = gameState.questions[gameState.questionIdx]
      const isCorrect = currentQ.a.includes(cmd)
      const nextIdx = gameState.questionIdx + 1
      const newScore = isCorrect ? gameState.score + 1 : gameState.score

      if (isCorrect) {
        playSound('success', soundEnabled)
      } else {
        playSound('error', soundEnabled)
      }

      const totalQ = gameState.questions.length

      const answerLine = isCorrect
        ? { text: `  ✔ Correct! +1 Point. Score: ${newScore}/${totalQ}`, color: 'text-green-400' }
        : { text: `  ✘ Incorrect! The answer was: "${currentQ.a[0]}". Score: ${newScore}/${totalQ}`, color: 'text-red-400' }

      if (nextIdx < totalQ) {
        setGameState({ ...gameState, questionIdx: nextIdx, score: newScore })
        setHistory(prev => [
          ...prev,
          prompt,
          {
            type: 'output',
            lines: [
              answerLine,
              { text: '', color: '' },
              { text: `  Question ${nextIdx + 1}: ${gameState.questions[nextIdx].q}`, color: 'text-white' },
              { text: `  (Hint: ${gameState.questions[nextIdx].hint})`, color: 'text-slate-400' },
              { text: '  (type exit pour quitter)', color: 'text-slate-500' },
              { text: '', color: '' }
            ]
          }
        ])
      } else {
        setGameState(null)
        setHistory(prev => [
          ...prev,
          prompt,
          {
            type: 'output',
            lines: [
              answerLine,
              { text: '', color: '' },
              { text: '┌── 🎉 QUIZ COMPLETED! ─────────────────────────────────┐', color: 'text-green-400' },
              { text: `│  Final Score: ${newScore}/${totalQ}                                  │`, color: 'text-white' },
              { text: `│  Rank       : ${newScore === totalQ ? 'TERMINAL MASTER 🏆' : newScore > 0 ? 'GEEK APPRENTICE' : 'NOOB 👾'}                      │`, color: 'text-cyan-400' },
              { text: '└──────────────────────────────────────────────────────┘', color: 'text-green-400' },
              { text: '', color: '' }
            ]
          }
        ])
      }
      return
    }

    /* ─── Mode Terminal Standard ──────────────────────────── */
    if (cmd === 'clear') {
      setHistory([])
      return
    }

    if (cmd === 'exit') {
      setHistory(prev => [
        ...prev,
        prompt,
        {
          type: 'output',
          lines: [
            { text: '  logout', color: 'text-slate-400' },
            { text: '  Connection to portfolio closed.', color: 'text-green-400' },
            { text: '', color: '' },
          ]
        }
      ])
      setTimeout(() => window.close(), 1200)
      return
    }

    if (cmd === 'crt') {
      setCrtEnabled(prev => {
        const next = !prev
        localStorage.setItem('term-crt', String(next))
        return next
      })
      setHistory(prev => [
        ...prev,
        prompt,
        {
          type: 'output',
          lines: [{ text: `  CRT screen filter toggled. State: ${!crtEnabled ? 'ON' : 'OFF'}`, color: 'text-green-400' }]
        }
      ])
      return
    }

    if (cmd === 'sound') {
      setSoundEnabled(prev => {
        const next = !prev
        localStorage.setItem('term-sound', String(next))
        return next
      })
      setHistory(prev => [
        ...prev,
        prompt,
        {
          type: 'output',
          lines: [{ text: `  Sound effects toggled. State: ${!soundEnabled ? 'ON' : 'OFF'}`, color: 'text-green-400' }]
        }
      ])
      return
    }

    if (cmd === 'neofetch') {
      const uptimeSecs = Math.floor((Date.now() - mountTime.current) / 1000)
      const uptimeStr = uptimeSecs < 60
        ? `${uptimeSecs}s`
        : `${Math.floor(uptimeSecs / 60)}m ${uptimeSecs % 60}s`
      const getBrowserName = () => {
        const ua = navigator.userAgent
        if (ua.includes('Firefox')) return 'Firefox'
        if (ua.includes('Chrome')) return 'Chrome'
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
        if (ua.includes('Edge')) return 'Edge'
        return 'Web Browser'
      }
      setHistory(prev => [
        ...prev,
        prompt,
        {
          type: 'output',
          lines: [
            { text: '      /\\         zakaria@portfolio', color: 'text-green-400' },
            { text: '     /  \\        -----------------', color: 'text-green-400' },
            { text: '    /\\  /\\       OS: ZakOS v2.0 (React 19)', color: 'text-green-400' },
            { text: `   /  \\/  \\      Uptime: ${uptimeStr}`, color: 'text-green-400' },
            { text: `  /   ||   \\     Browser: ${getBrowserName()}`, color: 'text-green-400' },
            { text: ` /____||____\\    Resolution: ${window.screen.width}x${window.screen.height}`, color: 'text-green-400' },
            { text: `                 Theme: ${theme}`, color: 'text-cyan-400' },
            { text: '                 Location: Safi, Morocco 🇲🇦', color: 'text-cyan-400' },
            { text: '                 Stack: React, Laravel, MySQL', color: 'text-cyan-400' },
            { text: '', color: '' }
          ]
        }
      ])
      return
    }

    if (cmd.startsWith('cowsay')) {
      const parts = raw.trim().split(' ')
      const msg = parts.slice(1).join(' ') || 'Moo! Type something after cowsay (ex: cowsay hello)'
      const border = '_'.repeat(msg.length + 2)
      const dashes = '-'.repeat(msg.length + 2)
      setHistory(prev => [
        ...prev,
        prompt,
        {
          type: 'output',
          lines: [
            { text: `  ${border}`, color: 'text-slate-300' },
            { text: `  < ${msg} >`, color: 'text-slate-100' },
            { text: `  ${dashes}`, color: 'text-slate-300' },
            { text: '         \\   ^__^', color: 'text-green-400' },
            { text: '          \\  (oo)\\_______', color: 'text-green-400' },
            { text: '             (__)\\       )\\/\\', color: 'text-green-400' },
            { text: '                 ||----w |', color: 'text-green-400' },
            { text: '                 ||     ||', color: 'text-green-400' },
            { text: '', color: '' }
          ]
        }
      ])
      return
    }

    if (cmd === 'resume') {
      try {
        window.open('https://canva.link/isawi3281cxbpmd', '_blank')
      } catch (e) {
        console.warn("CV Link opening blocked or failed:", e)
      }
      setHistory(prev => [
        ...prev,
        prompt,
        {
          type: 'output',
          lines: [
            { text: '┌── 📄 ZAKARIA DACHI ────────────────────────────────────────┐', color: 'text-green-400' },
            { text: '│  Développeur Web Full Stack & Électronicien IoT            │', color: 'text-white' },
            { text: '│  Contact : Dachiziko@gmail.com | +212 (0)6 53 63 24 33      │', color: 'text-cyan-400' },
            { text: '│  Canva CV: https://canva.link/isawi3281cxbpmd               │', color: 'text-cyan-400' },
            { text: '├────────────────────────────────────────────────────────────┤', color: 'text-slate-500' },
            { text: '│  EXPÉRIENCE                                                │', color: 'text-amber-400' },
            { text: '│  ● OCP Safi (2025) : Stage IoT & Électronique GMAO          │', color: 'text-slate-300' },
            { text: '│  ● YouCode-UM6P : Projets Laravel, React & MySQL            │', color: 'text-slate-300' },
            { text: '├────────────────────────────────────────────────────────────┤', color: 'text-slate-500' },
            { text: '│  FORMATION                                                 │', color: 'text-amber-400' },
            { text: '│  ● YouCode-UM6P : Web Development Full Stack               │', color: 'text-slate-300' },
            { text: '│  ● Electronique industrielle & Automatisation              │', color: 'text-slate-300' },
            { text: '└────────────────────────────────────────────────────────────┘', color: 'text-green-400' },
            { text: '  [INFO] Votre CV Canva a été ouvert dans un nouvel onglet.', color: 'text-slate-400' },
            { text: '  Si le lien est bloqué, cliquez ici : https://canva.link/isawi3281cxbpmd', color: 'text-cyan-400', link: 'https://canva.link/isawi3281cxbpmd' },
            { text: '', color: '' }
          ]
        }
      ])
      return
    }

    /* ─── Virtual Filesystem Navigation ───────────────────── */
    if (cmd === 'ls') {
      let currentDir = FILE_SYSTEM
      for (const dirName of currentPath) {
        if (currentDir.children[dirName] && currentDir.children[dirName].type === 'dir') {
          currentDir = currentDir.children[dirName]
        }
      }
      const entries = Object.entries(currentDir.children).map(([name, node]) => {
        if (node.type === 'dir') {
          return { text: `  📁 ${name}/`, color: 'text-cyan-400' }
        } else {
          return { text: `  📄 ${name}`, color: 'text-slate-300' }
        }
      })
      setHistory(prev => [
        ...prev,
        prompt,
        {
          type: 'output',
          lines: entries.length > 0 ? entries : [{ text: '  (empty directory)', color: 'text-slate-500' }]
        }
      ])
      return
    }

    if (cmd.startsWith('cd')) {
      const parts = cmd.split(' ')
      const dest = parts[1]
      if (!dest || dest === '~' || dest === '/') {
        setCurrentPath([])
        setHistory(prev => [...prev, prompt, { type: 'output', lines: [] }])
        return
      }
      if (dest === '..') {
        if (currentPath.length > 0) {
          setCurrentPath(prev => prev.slice(0, -1))
        }
        setHistory(prev => [...prev, prompt, { type: 'output', lines: [] }])
        return
      }
      if (dest === '.') {
        setHistory(prev => [...prev, prompt, { type: 'output', lines: [] }])
        return
      }

      let currentDir = FILE_SYSTEM
      for (const dirName of currentPath) {
        if (currentDir.children[dirName] && currentDir.children[dirName].type === 'dir') {
          currentDir = currentDir.children[dirName]
        }
      }

      if (currentDir.children[dest]) {
        if (currentDir.children[dest].type === 'dir') {
          setCurrentPath(prev => [...prev, dest])
          setHistory(prev => [...prev, prompt, { type: 'output', lines: [] }])
        } else {
          playSound('error', soundEnabled)
          setHistory(prev => [
            ...prev,
            prompt,
            { type: 'output', lines: [{ text: `  cd: not a directory: ${dest}`, color: 'text-red-400' }] }
          ])
        }
      } else {
        playSound('error', soundEnabled)
        setHistory(prev => [
          ...prev,
          prompt,
          { type: 'output', lines: [{ text: `  cd: no such file or directory: ${dest}`, color: 'text-red-400' }] }
        ])
      }
      return
    }

    if (cmd.startsWith('cat')) {
      const parts = cmd.split(' ')
      const filename = parts[1]
      if (!filename) {
        playSound('error', soundEnabled)
        setHistory(prev => [
          ...prev,
          prompt,
          { type: 'output', lines: [{ text: '  Usage: cat <filename>', color: 'text-amber-400' }] }
        ])
        return
      }

      let currentDir = FILE_SYSTEM
      for (const dirName of currentPath) {
        if (currentDir.children[dirName] && currentDir.children[dirName].type === 'dir') {
          currentDir = currentDir.children[dirName]
        }
      }

      if (currentDir.children[filename]) {
        if (currentDir.children[filename].type === 'file') {
          const key = currentDir.children[filename].contentKey
          const content = FILE_CONTENTS[key]
          setHistory(prev => [
            ...prev,
            prompt,
            { type: 'output', lines: content }
          ])
        } else {
          playSound('error', soundEnabled)
          setHistory(prev => [
            ...prev,
            prompt,
            { type: 'output', lines: [{ text: `  cat: ${filename}: Is a directory`, color: 'text-red-400' }] }
          ])
        }
      } else {
        playSound('error', soundEnabled)
        setHistory(prev => [
          ...prev,
          prompt,
          { type: 'output', lines: [{ text: `  cat: ${filename}: No such file or directory`, color: 'text-red-400' }] }
        ])
      }
      return
    }

    if (cmd === 'matrix') {
      setMatrixActive(true)
      return
    }

    if (cmd === 'game') {
      const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5)
      setGameState({ questions: shuffled, questionIdx: 0, score: 0 })
      setHistory(prev => [
        ...prev,
        prompt,
        {
          type: 'output',
          lines: [
            { text: '┌── 🎮 Retro Terminal Quiz v1.0 ────────────────────────┐', color: 'text-amber-400' },
            { text: '│  Answer these 5 random questions to prove your       │', color: 'text-slate-300' },
            { text: '│  geekness! Type "exit" at any time to quit the game. │', color: 'text-slate-300' },
            { text: '└──────────────────────────────────────────────────────┘', color: 'text-amber-400' },
            { text: '', color: '' },
            { text: `  Question 1: ${shuffled[0].q}`, color: 'text-white' },
            { text: `  (Hint: ${shuffled[0].hint})`, color: 'text-slate-400' },
            { text: '  (type exit pour quitter)', color: 'text-slate-500' },
            { text: '', color: '' }
          ]
        }
      ])
      return
    }

    if (cmd === 'contact') {
      setContactState({ step: 0, name: '', email: '', message: '' })
      setHistory(prev => [
        ...prev,
        prompt,
        {
          type: 'output',
          lines: [
            { text: '┌── 📬 Assistant de Contact Interactif ─────────────────┐', color: 'text-yellow-400' },
            { text: '│  Laissez un message professionnel pour Zakaria.      │', color: 'text-slate-300' },
            { text: '│  Saisissez "exit" à tout moment pour annuler.         │', color: 'text-slate-300' },
            { text: '└──────────────────────────────────────────────────────┘', color: 'text-yellow-400' },
            { text: '', color: '' },
            { text: '  👤 Étape 1 : Entrez votre Nom et Prénom :', color: 'text-white' }
          ]
        }
      ])
      return
    }

    if (cmd === 'quote' || cmd === 'devis') {
      setQuoteState({ step: 0, type: '', auth: '', payment: '' })
      setHistory(prev => [
        ...prev,
        prompt,
        {
          type: 'output',
          lines: [
            { text: '┌── 🧮 Simulateur de Devis & Projet ────────────────────┐', color: 'text-cyan-400' },
            { text: '│  Estimez le coût et le délai pour vos développements. │', color: 'text-slate-300' },
            { text: '│  Saisissez "exit" à tout moment pour annuler.         │', color: 'text-slate-300' },
            { text: '└──────────────────────────────────────────────────────┘', color: 'text-cyan-400' },
            { text: '', color: '' },
            { text: '  🖥️ Étape 1 : Quel est le type de votre projet ?', color: 'text-white' },
            { text: '    1 : Site E-commerce Moderne', color: 'text-slate-300' },
            { text: '    2 : Plateforme SaaS / Dashboard Client', color: 'text-slate-300' },
            { text: '    3 : Solution Électronique & Capteurs IoT', color: 'text-slate-300' },
            { text: '    4 : Application Web Sur-Mesure', color: 'text-slate-300' },
            { text: '', color: '' },
            { text: '    Entrez le numéro correspondant (1, 2, 3 ou 4) :', color: 'text-amber-400' }
          ]
        }
      ])
      return
    }

    if (cmd.startsWith('theme')) {
      const parts = cmd.split(' ')
      const chosenTheme = parts[1]
      const validThemes = ['matrix', 'amber', 'dracula', 'classic']
      if (!chosenTheme) {
        setHistory(prev => [
          ...prev,
          prompt,
          {
            type: 'output',
            lines: [
              { text: '  Usage: theme <name>', color: 'text-amber-400' },
              { text: '  Available themes: matrix, amber, dracula, classic', color: 'text-slate-300' }
            ]
          }
        ])
      } else if (validThemes.includes(chosenTheme)) {
        setTheme(chosenTheme)
        localStorage.setItem('term-theme', chosenTheme)
        setHistory(prev => [
          ...prev,
          prompt,
          {
            type: 'output',
            lines: [{ text: `  Theme switched to: ${chosenTheme}`, color: 'text-green-400' }]
          }
        ])
      } else {
        playSound('error', soundEnabled)
        setHistory(prev => [
          ...prev,
          prompt,
          {
            type: 'output',
            lines: [{ text: `  Unknown theme "${chosenTheme}". Available: matrix, amber, dracula, classic`, color: 'text-red-400' }]
          }
        ])
      }
      return
    }

    if (cmd.startsWith('sudo')) {
      const parts = cmd.split(' ')
      const sub = parts.slice(1).join(' ')
      let lines = []
      if (sub === 'rm -rf /') {
        playSound('error', soundEnabled)
        lines = [
          { text: '  [WARNING] ACCESS TO ROOT FILE SYSTEM DENIED.', color: 'text-red-400' },
          { text: '  Nice try, but this system is protected against self-destruction.', color: 'text-slate-300' }
        ]
      } else {
        lines = [
          { text: '  guest is not in the sudoers file. This incident will be reported.', color: 'text-red-400' },
          { text: '  (Just kidding! Guest users have read-only access for security.)', color: 'text-slate-400' }
        ]
      }
      setHistory(prev => [...prev, prompt, { type: 'output', lines }])
      return
    }

    // 1. ai-key command
    if (cmd.startsWith('ai-key')) {
      const parts = raw.trim().split(' ')
      const arg = parts[1]
      
      if (!arg) {
        const storedKey = localStorage.getItem('term-ai-key') || import.meta.env.VITE_GEMINI_API_KEY
        const keyStatus = storedKey 
          ? `ACTIVE (ends in ...${storedKey.slice(-6)})` 
          : 'NOT CONFIGURED (offline mode active)'
        
        setHistory(prev => [
          ...prev,
          prompt,
          {
            type: 'output',
            lines: [
              { text: '┌── 🔑 ZAKOS AI KEY MANAGER ─────────────────────────────┐', color: 'text-amber-400' },
              { text: `│  Current Key Status: ${keyStatus.padEnd(34)} │`, color: 'text-slate-300' },
              { text: '│                                                         │', color: 'text-slate-500' },
              { text: '│  Usage:                                                 │', color: 'text-slate-400' },
              { text: '│    ai-key <your_gemini_key>  → Save key locally         │', color: 'text-slate-300' },
              { text: '│    ai-key remove            → Delete stored key         │', color: 'text-slate-300' },
              { text: '└─────────────────────────────────────────────────────────┘', color: 'text-amber-400' },
              { text: '', color: '' }
            ]
          }
        ])
      } else if (arg.toLowerCase() === 'remove') {
        localStorage.removeItem('term-ai-key')
        playSound('success', soundEnabled)
        setHistory(prev => [
          ...prev,
          prompt,
          {
            type: 'output',
            lines: [
              { text: '  [SUCCESS] Stored Gemini API key has been removed from local storage.', color: 'text-green-400' },
              { text: '  System will fall back to .env key or local mock database.', color: 'text-slate-400' },
              { text: '', color: '' }
            ]
          }
        ])
      } else {
        localStorage.setItem('term-ai-key', arg)
        playSound('success', soundEnabled)
        setHistory(prev => [
          ...prev,
          prompt,
          {
            type: 'output',
            lines: [
              { text: '  [SUCCESS] Gemini API key configured successfully!', color: 'text-green-400' },
              { text: '  It has been stored securely in your browser\'s localStorage.', color: 'text-slate-400' },
              { text: '  Try typing: ai hello', color: 'text-cyan-400' },
              { text: '', color: '' }
            ]
          }
        ])
      }
      return
    }

    // 2. ai command
    if (cmd.startsWith('ai')) {
      const parts = raw.trim().split(' ')
      const question = parts.slice(1).join(' ')
      handleAIQuery(question, prompt)
      return
    }

    if (!COMMANDS[cmd]) {
      // Unrecognized command: intercept with AI!
      handleAIQuery('', prompt, raw.trim())
      return
    }

    const response = { type: 'output', lines: COMMANDS[cmd] }
    setHistory(prev => [...prev, prompt, response])
  }, [gameState, crtEnabled, soundEnabled, currentPath, theme, contactState, quoteState, handleAIQuery])

  const handleKeyDown = useCallback((e) => {
    playSound('click', soundEnabled)
    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1)
      setHistoryIdx(next)
      setInput(cmdHistory[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(historyIdx - 1, -1)
      setHistoryIdx(next)
      setInput(next === -1 ? '' : cmdHistory[next] ?? '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (contactState || quoteState) return // No tab completion inside sequential forms
      const term = input.trim().toLowerCase()
      if (!term) return
      const matches = ALL_COMMANDS.filter(c => c.startsWith(term))
      if (matches.length === 1) {
        setInput(matches[0])
      } else if (matches.length > 1) {
        setHistory(prev => [
          ...prev,
          { 
            type: 'prompt', 
            text: input, 
            path: currentPath.length > 0 ? `~/${currentPath.join('/')}` : '~', 
            isQuiz: !!gameState, 
            isContact: !!contactState, 
            isQuote: !!quoteState 
          },
          { type: 'output', lines: [{ text: `  Matches: ${matches.join(', ')}`, color: 'text-slate-400' }] }
        ])
      }
    }
  }, [input, runCommand, cmdHistory, historyIdx, soundEnabled, currentPath, gameState, contactState, quoteState])

  // Responsive interactive prompts
  let promptUser = 'guest'
  let promptHost = 'portfolio'
  let promptUserColor = 'text-green-400'
  let promptHostColor = 'text-cyan-400'

  if (gameState) {
    promptUser = 'guest'
    promptHost = 'quiz'
    promptUserColor = 'text-amber-400'
    promptHostColor = 'text-red-400'
  } else if (contactState) {
    promptUser = 'guest'
    promptHost = `contact-step${contactState.step + 1}`
    promptUserColor = 'text-amber-400'
    promptHostColor = 'text-yellow-400'
  } else if (quoteState) {
    promptUser = 'guest'
    promptHost = `devis-step${quoteState.step + 1}`
    promptUserColor = 'text-amber-400'
    promptHostColor = 'text-cyan-400'
  }

  return (
    <div className={`w-full max-w-4xl crt-container theme-${theme} ${crtEnabled ? 'crt-screen crt-flicker' : ''} glow-border border border-slate-700 rounded-xl`} onClick={focusInput}>
      {crtEnabled && <div className="crt-vignette" />}
      
      {/* Window chrome */}
      <div className="bg-slate-800 rounded-t-xl px-4 py-3 flex items-center justify-between border-b border-slate-700 relative z-10 select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="ml-4 text-slate-400 text-xs tracking-widest font-mono">
            zakaria@portfolio: {currentPath.length > 0 ? `/${currentPath.join('/')}` : '~'} ({theme} theme)
          </span>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSoundEnabled(prev => {
              const next = !prev
              localStorage.setItem('term-sound', String(next))
              return next
            })
            playSound('click', !soundEnabled)
          }}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer text-sm pr-1"
          title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
          aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Terminal body */}
      <div
        className="terminal-body bg-[#0f172a] rounded-b-xl border border-slate-700 border-t-0 p-4 sm:p-6 min-h-[70vh] max-h-[80vh] flex flex-col relative"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {matrixActive && (
          <MatrixRain onClose={() => setMatrixActive(false)} />
        )}

        <div className="flex-1 overflow-y-auto terminal-body">
          {history.map((entry, i) => (
            <div key={i} className="mb-0.5">
              {entry.type === 'prompt' ? (
                <div className="flex items-center gap-1 text-sm">
                  <span className={entry.isQuiz ? "text-amber-400 shrink-0" : entry.isContact ? "text-amber-400 shrink-0" : entry.isQuote ? "text-amber-400 shrink-0" : "text-green-400 shrink-0"}>guest</span>
                  <span className="text-slate-500">@</span>
                  <span className={entry.isQuiz ? "text-red-400 shrink-0" : entry.isContact ? "text-yellow-400 shrink-0" : entry.isQuote ? "text-cyan-400 shrink-0" : "text-cyan-400 shrink-0"}>
                    {entry.isQuiz ? 'quiz' : entry.isContact ? `contact-step${entry.step}` : entry.isQuote ? `devis-step${entry.step}` : 'portfolio'}
                  </span>
                  <span className="text-slate-500">:</span>
                  <span className="text-cyan-400 shrink-0">{entry.path || '~'}</span>
                  <span className="text-slate-500">$</span>
                  <span className="text-white ml-1">{entry.text}</span>
                </div>
              ) : (
                entry.lines.map((line, j) => <OutputLine key={j} line={line} />)
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input line */}
        {booted && (
          <div className="mt-2 pt-2 border-t border-slate-800 relative z-10">
            {/* Quick Actions badges */}
            <div className="flex flex-wrap gap-2 mb-3 mt-1 items-center select-none">
              <span className="text-xs text-slate-400 font-bold shrink-0">Suggestions :</span>
              {['help', 'about', 'skills', 'projects', 'contact', 'ai', 'ai-key', 'crt', 'matrix', 'game', 'neofetch', 'resume', 'quote'].map(cmd => (
                <button
                  key={cmd}
                  onClick={(e) => {
                    e.stopPropagation()
                    runCommand(cmd)
                  }}
                  className="px-2 py-0.5 text-xs rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer text-slate-300 font-mono"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Terminal input prompt */}
            <div className="flex items-center gap-1 text-sm">
              <span className={`${promptUserColor} shrink-0`}>{promptUser}</span>
              <span className="text-slate-500">@</span>
              <span className={`${promptHostColor} shrink-0`}>{promptHost}</span>
              <span className="text-slate-500">:</span>
              <span className="text-cyan-400 shrink-0">{currentPath.length > 0 ? `~/${currentPath.join('/')}` : '~'}</span>
              <span className="text-slate-500">$</span>
              <div className="relative flex-1 flex items-center ml-1">
                <input
                  ref={inputRef}
                  autoFocus
                  value={input}
                  onChange={e => {
                    setInput(e.target.value)
                    playSound('click', soundEnabled)
                  }}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent outline-none text-white w-full caret-transparent"
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                />
                {/* Blinking cursor */}
                <span
                  className="cursor absolute top-0 bottom-0 w-2 bg-green-400 pointer-events-none"
                  style={{ left: `${input.length}ch` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-slate-600 text-xs mt-3 select-none">
        Press <span className="text-slate-400">Tab</span> to autocomplete | <span className="text-slate-400">↑ ↓</span> to navigate history
      </p>
    </div>
  )
}
