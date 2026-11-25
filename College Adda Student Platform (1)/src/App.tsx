import { useEffect, useRef, useState, type ReactNode } from 'react'
import campusHero from './assets/college-adda-campus.png'
import campusMap from './assets/virtual-campus-map.png'

type Page = 'home' | 'dashboard' | 'social' | 'services' | 'campus' | 'canteen' | 'games' | 'profile'
type CampusOverlay = 'canteen' | 'games' | 'library' | 'garden' | 'sports' | 'plaza'

const paths = {
  home: 'M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  dashboard: 'M4 4h6v6H4zM14 4h6v10h-6zM4 14h6v6H4zM14 18h6v2h-6z',
  social: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M17 3.13a4 4 0 0 1 0 7.75',
  services: 'M4 4h16v16H4zM8 8h8M8 12h8M8 16h5',
  campus: 'M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M8 11h2M14 11h2',
  canteen: 'M6 3v8M3 3v5a3 3 0 0 0 6 0V3M6 11v10M16 3v18M16 3c3 1 5 4 5 8h-5',
  games: 'M8 8h8a5 5 0 0 1 4.8 6.4l-1.2 4a2 2 0 0 1-3.3.9L14 17h-4l-2.3 2.3a2 2 0 0 1-3.3-.9l-1.2-4A5 5 0 0 1 8 8ZM8 12v4M6 14h4M16 13h.01M18 15h.01',
  profile: 'M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
  calendar: 'M6 2v4M18 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  search: 'm21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  clock: 'M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14ZM4 19.5v-14',
  check: 'm5 12 4 4L19 6',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  map: 'm3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15',
  logout: 'M10 17l5-5-5-5M15 12H3M15 3h5a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-5',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z',
  message: 'M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z',
  share: 'M4 12v8h16v-8M12 16V3m0 0L7 8m5-5 5 5',
  image: 'M3 5h18v14H3zM8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm12.5 5-5-5L5 19',
} as const

function Icon({ name, size = 20 }: { name: keyof typeof paths; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}

const Avatar = ({ initials, color = 'violet', size = 'md' }: { initials: string; color?: string; size?: 'sm' | 'md' | 'lg' }) => (
  <span className={`avatar avatar-${color} avatar-${size}`}>{initials}</span>
)

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <button className={`logo ${dark ? 'logo-dark' : ''}`} onClick={() => navigate('home')} aria-label="College Adda home">
      <span className="logo-mark">
        <span />
        <b>CA</b>
      </span>
      <span className="logo-copy"><strong>COLLEGE</strong><b>ADDA</b></span>
    </button>
  )
}

function navigate(page: Page) {
  window.location.hash = page === 'home' ? '' : page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function notify(message: string) {
  window.dispatchEvent(new CustomEvent('college-adda:notice', { detail: message }))
}

function GlobalNotice() {
  const [message, setMessage] = useState('')
  const timer = useRef<number | null>(null)
  useEffect(() => {
    const show = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail)
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setMessage(''), 2800)
    }
    window.addEventListener('college-adda:notice', show)
    return () => {
      window.removeEventListener('college-adda:notice', show)
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])
  return message ? <div className="global-notice" role="status"><Icon name="check" size={16}/><span>{message}</span><button onClick={() => setMessage('')}>×</button></div> : null
}

const navItems: { page: Page; label: string }[] = [
  { page: 'dashboard', label: 'Dashboard' },
  { page: 'social', label: 'Social Hub' },
  { page: 'services', label: 'Student Services' },
  { page: 'campus', label: 'Virtual Campus' },
  { page: 'canteen', label: 'Canteen' },
  { page: 'games', label: 'Gaming Zone' },
  { page: 'profile', label: 'My Profile' },
]

function Sidebar({ active }: { active: Page }) {
  return (
    <aside className="sidebar">
      <Logo dark />
      <nav>
        <p className="side-label">CAMPUS SPACE</p>
        {navItems.map(({ page, label }) => (
          <button key={page} className={active === page ? 'active' : ''} onClick={() => navigate(page)}>
            <Icon name={page} /><span>{label}</span>{page === 'campus' && <i>LIVE</i>}
          </button>
        ))}
      </nav>
      <div className="side-help">
        <span className="help-orbit"><Icon name="users" size={22} /></span>
        <strong>Need a hand?</strong>
        <p>Connect with your campus support team.</p>
        <button onClick={() => notify('Campus support is available Monday–Friday, 9 AM–5 PM.')}>Get support</button>
      </div>
      <button className="logout" onClick={() => { navigate('home'); notify('You have been logged out of the prototype.') }}><Icon name="logout" /> Log out</button>
    </aside>
  )
}

function Topbar({ title }: { title: string }) {
  const [query, setQuery] = useState('')
  const runSearch = () => {
    const value = query.trim().toLowerCase()
    if (!value) return
    if (value.includes('service') || value.includes('note') || value.includes('study group') || value.includes('lost')) navigate('services')
    else if (value.includes('social') || value.includes('community') || value.includes('event')) navigate('social')
    else if (value.includes('canteen') || value.includes('food')) navigate('canteen')
    else if (value.includes('game')) navigate('games')
    else if (value.includes('campus') || value.includes('library')) navigate('campus')
    else if (value.includes('profile') || value.includes('student')) navigate('profile')
    else notify(`No prototype results found for “${query.trim()}”.`)
    setQuery('')
  }
  return (
    <header className="topbar">
      <div className="mobile-logo"><Logo /></div>
      <div><span className="crumb">COLLEGE ADDA</span><h2>{title}</h2></div>
      <div className="top-actions">
        <label className="search"><Icon name="search" size={17} /><input aria-label="Search College Adda" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') runSearch() }} placeholder="Search anything..." /></label>
        <button className="icon-button" aria-label="Notifications" onClick={() => notify('You’re all caught up. No new notifications.')}><Icon name="bell" /><i /></button>
        <button className="student-chip" onClick={() => navigate('profile')}>
          <Avatar initials="AS" />
          <span><strong>Arjun Sharma</strong><small>B.Tech CSE</small></span>
        </button>
      </div>
    </header>
  )
}

function AppShell({ page, title, children }: { page: Page; title: string; children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar active={page} />
      <main className="main-area"><Topbar title={title} /><div className="page-content">{children}</div></main>
      <nav className="mobile-nav" aria-label="App navigation">
        {navItems.map(({ page: itemPage, label }) => (
          <button key={itemPage} className={page === itemPage ? 'active' : ''} onClick={() => navigate(itemPage)}>
            <Icon name={itemPage} size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Logo />
        <div className="nav-links">
          <a href="#features">Features</a><a href="#community">Community</a><a href="#experience">Experience</a>
        </div>
        <div className="nav-actions"><button onClick={() => navigate('dashboard')}>Log in</button><button className="primary" onClick={() => navigate('dashboard')}>Get started <Icon name="arrow" size={17} /></button></div>
      </nav>
      <section className="hero" id="experience">
        <div className="hero-copy">
          <div className="eyebrow"><span /> Your campus, reimagined</div>
          <h1>College life,<br /><em>all in one place.</em></h1>
          <p>Study smarter, connect with your crew, and explore a living digital campus built around your college life.</p>
          <div className="hero-actions">
            <button className="primary large" onClick={() => navigate('dashboard')}>Explore College Adda <Icon name="arrow" /></button>
            <button className="play" onClick={() => navigate('campus')}><span>▶</span> See virtual campus</button>
          </div>
          <div className="trusted">
            <div className="avatar-stack"><Avatar initials="AK" color="blue" size="sm" /><Avatar initials="MN" color="pink" size="sm" /><Avatar initials="RV" color="amber" size="sm" /><Avatar initials="+" color="dark" size="sm" /></div>
            <span><strong>2,400+ students</strong><small>already hanging out here</small></span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="float-card card-online"><span className="pulse" /><div><strong>Campus is buzzing</strong><small>186 students online</small></div></div>
          <img src={campusHero} alt="Colorful pixel-art College Adda virtual campus" />
          <div className="float-card card-class"><span className="mini-icon"><Icon name="calendar" /></span><div><small>UP NEXT · 10:30 AM</small><strong>Data Structures</strong></div></div>
        </div>
      </section>
      <section className="stats-strip">
        <div><strong>24/7</strong><span>Campus access</span></div><div><strong>50+</strong><span>Student clubs</span></div><div><strong>12k</strong><span>Notes shared</span></div><div><strong>4.9</strong><span>Student rating</span></div>
      </section>
      <section id="features" className="feature-section">
        <div className="section-heading"><span>EVERYTHING YOU NEED</span><h2>Your whole college world,<br />minus the chaos.</h2><p>From attendance to adda, stay on top of it all without jumping between five different apps.</p></div>
        <div className="feature-grid">
          {[
            ['calendar', 'Academic hub', 'Timetables, assignments and exams organized in one calm, clear view.', 'blue'],
            ['campus', 'Virtual campus', 'Walk around, meet friends and explore your college in a playful 2D world.', 'violet'],
            ['users', 'Your community', 'Join clubs, catch announcements and always know what’s happening.', 'pink'],
          ].map(([icon, title, text, color], index) => <article className={`feature-card ${color}`} key={title}><span><Icon name={icon as keyof typeof paths} size={25} /></span><h3>{title}</h3><p>{text}</p><button onClick={() => index === 0 ? navigate('dashboard') : index === 1 ? navigate('campus') : notify('Student clubs and community spaces are coming next.')} >Learn more <Icon name="arrow" size={16} /></button></article>)}
        </div>
      </section>
      <section id="community" className="community">
        <div className="community-card">
          <div><span className="tag">BUILT FOR STUDENTS</span><h2>More than a dashboard.<br />It’s where campus happens.</h2><p>Find your people, share what you know and make every college day count—on campus or off.</p><button className="primary large" onClick={() => navigate('campus')}>Enter the campus <Icon name="arrow" /></button></div>
          <div className="chat-preview">
            <span className="chat-dot c1" /><span className="chat-dot c2" /><span className="chat-dot c3" />
            <div className="bubble b1"><Avatar initials="PK" color="blue" size="sm" /><span><strong>Priya</strong><p>Anyone up for a library session?</p></span></div>
            <div className="bubble b2"><Avatar initials="AR" color="amber" size="sm" /><span><strong>Aarav</strong><p>Meet you there in 10!</p></span></div>
            <div className="bubble b3"><Icon name="users" /><span><strong>Robotics Club</strong><p>Workshop starts at 4 PM</p></span></div>
          </div>
        </div>
      </section>
      <footer><Logo /><p>Your Campus. Your Community. Your Digital World.</p><span>© 2025 College Adda</span></footer>
    </div>
  )
}

const StatCard = ({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: keyof typeof paths }) => (
  <article className={`stat-card ${color}`}><div className="stat-top"><span><Icon name={icon} /></span><small>{label}</small><b>•••</b></div><h3>{value}</h3><p>{sub}</p><div className="stat-line"><i /></div></article>
)

function Dashboard() {
  const classes = [
    ['09:00', 'Operating Systems', 'Dr. Mehta', 'A-204', 'blue'],
    ['10:30', 'Data Structures', 'Prof. Nair', 'Lab 3', 'violet'],
    ['01:30', 'Computer Networks', 'Dr. Sinha', 'B-102', 'pink'],
  ]
  return (
    <AppShell page="dashboard" title="Dashboard">
      <section className="welcome-banner">
        <div><span>MONDAY, 18 AUGUST</span><h1>Good morning, Arjun.</h1><p>You’ve got a productive day ahead. Here’s what’s happening.</p></div>
        <div className="banner-art"><span className="sun" /><span className="cloud" /><span className="building">CA</span></div>
      </section>
      <div className="stat-grid">
        <StatCard label="ATTENDANCE" value="86%" sub="4% above target" color="blue" icon="check" />
        <StatCard label="PENDING WORK" value="04" sub="2 due this week" color="violet" icon="book" />
        <StatCard label="NEXT EXAM" value="12 days" sub="Data Structures" color="amber" icon="calendar" />
      </div>
      <div className="dashboard-grid">
        <section className="panel schedule-panel">
          <div className="panel-head"><div><span>TODAY’S PLAN</span><h3>Monday schedule</h3></div><button onClick={() => notify('Your full weekly timetable is synced and up to date.')}>Full timetable <Icon name="arrow" size={15} /></button></div>
          <div className="class-list">{classes.map(([time, name, teacher, room, color]) => <div className="class-row" key={name}><time>{time}</time><i className={color} /><div><strong>{name}</strong><span>{teacher}</span></div><em>{room}</em><button onClick={() => notify(`${name} is an in-person class in ${room}.`)}>Join class</button></div>)}</div>
        </section>
        <section className="panel announcements">
          <div className="panel-head"><div><span>STAY UPDATED</span><h3>Announcements</h3></div><button onClick={() => notify('All recent campus announcements are already displayed.')}>View all</button></div>
          <div className="notice"><b>18</b><span>AUG</span><div><strong>Mid-semester exam schedule</strong><p>The examination cell has released the dates...</p><small>2 hours ago</small></div></div>
          <div className="notice"><b>17</b><span>AUG</span><div><strong>Annual tech fest registrations</strong><p>Team registrations for Aavishkar are now open.</p><small>Yesterday</small></div></div>
          <div className="notice"><b>15</b><span>AUG</span><div><strong>Library timing update</strong><p>Library will remain open until 10 PM.</p><small>3 days ago</small></div></div>
        </section>
      </div>
      <section className="quick-section"><div className="section-row"><div><span>JUMP BACK IN</span><h3>Quick spaces</h3></div></div>
        <div className="quick-grid">
          {[['campus','Virtual Campus','136 online','blue'],['canteen','Canteen','Lunch menu','pink'],['games','Gaming Zone','8 playing','violet'],['book','Notes Library','2.4k resources','amber']].map(([icon,title,sub,color], i)=><button key={title} onClick={()=>i===3?navigate('services'):navigate(icon as Page)} className={`quick-card ${color}`}><span><Icon name={icon as keyof typeof paths}/></span><div><strong>{title}</strong><small>{sub}</small></div><Icon name="arrow" size={17}/></button>)}
        </div>
      </section>
      <section className="dashboard-services">
        <div className="section-row"><div><span>STUDENT SERVICES</span><h3>Useful campus tools</h3></div><button onClick={() => navigate('services')}>Open services hub <Icon name="arrow" size={15}/></button></div>
        <div className="dashboard-service-grid">
          <button onClick={() => navigate('services')}><span className="blue"><Icon name="book"/></span><div><small>RECENTLY SHARED</small><strong>DSA Graph Notes</strong><p>Uploaded today by Priya Singh</p></div><Icon name="arrow" size={16}/></button>
          <button onClick={() => navigate('services')}><span className="violet"><Icon name="users"/></span><div><small>ACTIVE GROUPS</small><strong>12 study groups</strong><p>4 sessions happening this week</p></div><Icon name="arrow" size={16}/></button>
          <button onClick={() => navigate('services')}><span className="amber"><Icon name="search"/></span><div><small>LOST & FOUND</small><strong>3 recent posts</strong><p>1 item resolved today</p></div><Icon name="arrow" size={16}/></button>
        </div>
      </section>
    </AppShell>
  )
}

type Direction = 'up' | 'down' | 'left' | 'right'
type Position = { x: number; y: number }
type MovingPerson = Position & { direction: Direction; walking: boolean }
type Npc = MovingPerson & { id: string; name: string; className: string; speed: number }

const PixelPerson = ({ className = '', label, player = false, position, direction = 'down', walking = false }: { className?: string; label?: string; player?: boolean; position?: Position; direction?: Direction; walking?: boolean }) => (
  <div
    className={`pixel-person ${className} direction-${direction} ${walking ? 'is-walking' : ''} ${player ? 'current-player' : ''}`}
    style={position ? { left: `${position.x}%`, top: `${position.y}%` } : undefined}
  >
    {label && <em>{label}</em>}
    {player && <strong>YOU</strong>}
    <span className="sprite-shadow" />
    <span className="sprite-hair" />
    <span className="sprite-head"><i /></span>
    <span className="sprite-body"><i /><b /></span>
    <span className="sprite-legs"><i /><b /></span>
  </div>
)

const campusLocations: { type: CampusOverlay; x: number; y: number; prompt: string }[] = [
  { type: 'library', x: 22, y: 33, prompt: 'Enter Library' },
  { type: 'canteen', x: 80, y: 31, prompt: 'Enter Canteen' },
  { type: 'games', x: 79, y: 57, prompt: 'Enter Gaming Zone' },
  { type: 'garden', x: 50, y: 50, prompt: 'Explore Garden' },
  { type: 'sports', x: 76, y: 78, prompt: 'View Sports' },
  { type: 'plaza', x: 25, y: 69, prompt: 'View Events' },
]

const npcWaypoints: Position[] = [
  { x: 18, y: 34 }, { x: 31, y: 38 }, { x: 42, y: 36 }, { x: 52, y: 44 },
  { x: 63, y: 38 }, { x: 80, y: 32 }, { x: 78, y: 58 }, { x: 66, y: 66 },
  { x: 77, y: 79 }, { x: 53, y: 76 }, { x: 37, y: 68 }, { x: 21, y: 70 },
  { x: 12, y: 53 }, { x: 48, y: 57 }, { x: 58, y: 54 },
]

const initialNpcs: Npc[] = [
  { id: 'priya', name: 'Priya', className: 'sprite-pink hair-long', x: 38, y: 43, speed: 2.9, direction: 'down', walking: true },
  { id: 'rohan', name: 'Rohan', className: 'sprite-green hair-curly', x: 59, y: 48, speed: 2.5, direction: 'left', walking: true },
  { id: 'kabir', name: 'Kabir', className: 'sprite-amber hair-cap', x: 22, y: 59, speed: 2.7, direction: 'right', walking: true },
  { id: 'meera', name: 'Meera', className: 'sprite-violet hair-long', x: 77, y: 39, speed: 2.35, direction: 'down', walking: true },
  { id: 'ananya', name: 'Ananya', className: 'sprite-coral hair-curly', x: 69, y: 69, speed: 3.05, direction: 'up', walking: true },
  { id: 'vikram', name: 'Vikram', className: 'sprite-sky hair-cap', x: 14, y: 38, speed: 2.65, direction: 'right', walking: true },
  { id: 'nisha', name: 'Nisha', className: 'sprite-pink', x: 47, y: 31, speed: 2.45, direction: 'down', walking: true },
]

function isTypingTarget(target: EventTarget | null) {
  const element = target as HTMLElement | null
  return !!element && (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName) || element.isContentEditable)
}

function isBlocked(x: number, y: number) {
  const buildings = [
    { left: 33, right: 67, top: 3, bottom: 27 },
    { left: 2, right: 31, top: 6, bottom: 29 },
    { left: 70, right: 98, top: 4, bottom: 27 },
    { left: 71, right: 98, top: 36, bottom: 53 },
  ]
  return buildings.some(area => x > area.left && x < area.right && y > area.top && y < area.bottom)
}

function GameScene({ onOpen, disabled, onNearbyChange, zoom }: { onOpen: (overlay: CampusOverlay) => void; disabled: boolean; onNearbyChange: (location: CampusOverlay | null) => void; zoom: number }) {
  const [player, setPlayer] = useState<MovingPerson>({ x: 49, y: 63, direction: 'down', walking: false })
  const [npcs, setNpcs] = useState<Npc[]>(initialNpcs)
  const playerRef = useRef(player)
  const npcRef = useRef(initialNpcs)
  const keysRef = useRef(new Set<string>())
  const npcPlansRef = useRef(initialNpcs.map((npc, index) => ({
    target: npcWaypoints[(index * 2 + 3) % npcWaypoints.length],
    pauseUntil: 0,
  })))

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (disabled || isTypingTarget(event.target)) return
      const key = event.key.toLowerCase()
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        event.preventDefault()
        keysRef.current.add(key)
      }
    }
    const up = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase())
    const blur = () => keysRef.current.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
    }
  }, [disabled])

  useEffect(() => {
    if (disabled) keysRef.current.clear()
  }, [disabled])

  useEffect(() => {
    let frame = 0
    let previous = performance.now()
    let lastRender = previous
    const tick = (now: number) => {
      const delta = Math.min((now - previous) / 1000, 0.05)
      previous = now

      if (!disabled) {
        const keys = keysRef.current
        let dx = Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft'))
        let dy = Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup'))
        const moving = dx !== 0 || dy !== 0
        if (moving) {
          const length = Math.hypot(dx, dy)
          dx /= length
          dy /= length
          const current = playerRef.current
          const speed = 10.5
          let nextX = Math.max(3, Math.min(95, current.x + dx * speed * delta))
          let nextY = Math.max(7, Math.min(91, current.y + dy * speed * delta))
          if (isBlocked(nextX, current.y)) nextX = current.x
          if (isBlocked(nextX, nextY)) nextY = current.y
          const direction: Direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')
          playerRef.current = { x: nextX, y: nextY, direction, walking: true }
        } else if (playerRef.current.walking) {
          playerRef.current = { ...playerRef.current, walking: false }
        }
      } else if (playerRef.current.walking) {
        playerRef.current = { ...playerRef.current, walking: false }
      }

      npcRef.current = npcRef.current.map((npc, index) => {
        const plan = npcPlansRef.current[index]
        if (now < plan.pauseUntil) return npc.walking ? { ...npc, walking: false } : npc
        const dx = plan.target.x - npc.x
        const dy = plan.target.y - npc.y
        const distance = Math.hypot(dx, dy)
        if (distance < 0.8) {
          let next = npcWaypoints[Math.floor(Math.random() * npcWaypoints.length)]
          while (Math.hypot(next.x - npc.x, next.y - npc.y) < 12) next = npcWaypoints[Math.floor(Math.random() * npcWaypoints.length)]
          plan.target = next
          plan.pauseUntil = now + 1000 + Math.random() * 2000
          return { ...npc, walking: false }
        }
        const step = Math.min(distance, npc.speed * delta)
        const nextX = Math.max(3, Math.min(95, npc.x + (dx / distance) * step))
        const nextY = Math.max(7, Math.min(91, npc.y + (dy / distance) * step))
        if (isBlocked(nextX, nextY)) {
          plan.target = npcWaypoints[Math.floor(Math.random() * npcWaypoints.length)]
          plan.pauseUntil = now + 500 + Math.random() * 700
          return { ...npc, walking: false }
        }
        const direction: Direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')
        return { ...npc, x: nextX, y: nextY, direction, walking: true }
      })

      if (now - lastRender > 32) {
        setPlayer({ ...playerRef.current })
        setNpcs(npcRef.current.map(npc => ({ ...npc })))
        const nearest = campusLocations
          .map(location => ({ ...location, distance: Math.hypot(location.x - playerRef.current.x, location.y - playerRef.current.y) }))
          .sort((a, b) => a.distance - b.distance)[0]
        onNearbyChange(nearest && nearest.distance < 8.5 ? nearest.type : null)
        lastRender = now
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [disabled, onNearbyChange])

  const nearby = campusLocations
    .map(location => ({ ...location, distance: Math.hypot(location.x - player.x, location.y - player.y) }))
    .sort((a, b) => a.distance - b.distance)[0]
  const activeInteraction = nearby?.distance < 8.5 ? nearby : null

  return <div className="campus-scene rich-campus">
    <img className="campus-map-art" style={{ transform: `scale(${zoom})` }} src={campusMap} alt="Detailed top-down pixel-art university campus with academic buildings, gardens and walkways" />
    <div className="sunlight" />
    <button className="building-marker marker-academic" onClick={() => notify('Academic Block directory: classrooms, labs and faculty offices.')}><i><Icon name="campus" size={14} /></i><span><b>Academic Block</b><small>Main building</small></span></button>
    <button className="building-marker marker-library" onClick={() => onOpen('library')}><i><Icon name="book" size={14} /></i><span><b>Central Library</b><small>Open notes</small></span></button>
    <button className="building-marker marker-canteen" onClick={() => onOpen('canteen')}><i><Icon name="canteen" size={14} /></i><span><b>College Café</b><small>Press E to enter</small></span></button>
    <button className="building-marker marker-games" onClick={() => onOpen('games')}><i><Icon name="games" size={14} /></i><span><b>Recreation Hub</b><small>Press E to enter</small></span></button>
    <button className="building-marker marker-garden" onClick={() => onOpen('garden')}><i><Icon name="users" size={14} /></i><span><b>Central Garden</b><small>Social hangout</small></span></button>
    <button className="building-marker marker-sports" onClick={() => onOpen('sports')}><i><Icon name="games" size={14} /></i><span><b>Sports Ground</b><small>View activities</small></span></button>
    <button className="building-marker marker-plaza" onClick={() => onOpen('plaza')}><i><Icon name="calendar" size={14} /></i><span><b>Student Plaza</b><small>Events today</small></span></button>
    <PixelPerson className="sprite-blue" label="Arjun" player position={player} direction={player.direction} walking={player.walking} />
    {npcs.map(npc => <PixelPerson key={npc.id} className={npc.className} label={npc.name} position={npc} direction={npc.direction} walking={npc.walking} />)}
    <div className="campus-minimap">
      <div className="minimap-head"><span>MINIMAP</span><b>North Campus</b></div>
      <div><img src={campusMap} alt="" /><i className="minimap-window" /><span className="minimap-player" style={{ left: `${player.x}%`, top: `${player.y}%` }} /></div>
    </div>
    <div className="activity-indicator"><span><i /></span><div><small>CAMPUS ACTIVITY</small><strong>Quad meetup starting soon</strong></div><b>+12</b></div>
    {activeInteraction && <button className="interaction-prompt" onClick={() => onOpen(activeInteraction.type)}><span>E</span><div><small>NEARBY INTERACTION</small><strong>{activeInteraction.prompt}</strong></div></button>}
  </div>
}

const online = [['PS','Priya Singh','Library','pink'],['RK','Rohan Kumar','Academic Block','blue'],['MN','Meera Nair','Canteen','amber'],['VS','Vikram Shah','Game Zone','violet'],['AN','Ananya Rao','Garden','green']]

type Cart = Record<string, number>
type CanteenTab = 'menu' | 'chat' | 'tables'
type ChatMessage = { id: number; sender: string; text: string; time: string; own?: boolean; color?: string }

const canteenMenu = [
  { id: 'dosa', name: 'Masala Dosa', description: 'Crispy dosa with sambar', price: 60, category: 'Meals', letter: 'D', popular: true },
  { id: 'burger', name: 'Veggie Burger', description: 'Cheese, greens and house sauce', price: 85, category: 'Snacks', letter: 'B', popular: true },
  { id: 'roll', name: 'Paneer Roll', description: 'Spiced paneer in a soft wrap', price: 75, category: 'Meals', letter: 'R', popular: true },
  { id: 'coffee', name: 'Cold Coffee', description: 'Chilled and creamy', price: 50, category: 'Drinks', letter: 'C', popular: true },
  { id: 'samosa', name: 'Samosa Chaat', description: 'Tangy chutney and crunchy sev', price: 45, category: 'Snacks', letter: 'S', popular: false },
  { id: 'thali', name: 'Campus Thali', description: 'Dal, rice, roti and seasonal sabzi', price: 110, category: 'Meals', letter: 'T', popular: false },
  { id: 'lime', name: 'Fresh Lime Soda', description: 'Sweet, salted or mixed', price: 35, category: 'Drinks', letter: 'L', popular: false },
  { id: 'fries', name: 'Masala Fries', description: 'Crispy fries with campus masala', price: 55, category: 'Snacks', letter: 'F', popular: false },
]

const initialMessages: ChatMessage[] = [
  { id: 1, sender: 'Meera', text: 'Who’s joining for lunch?', time: '12:32', color: 'amber' },
  { id: 2, sender: 'Rohan', text: 'Save me a seat near the window.', time: '12:33', color: 'blue' },
  { id: 3, sender: 'Priya', text: 'The masala dosa is really good today.', time: '12:35', color: 'pink' },
]

function CanteenExperience({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<CanteenTab>('menu')
  const [category, setCategory] = useState('Popular')
  const [cart, setCart] = useState<Cart>({})
  const [order, setOrder] = useState<{ id: string; status: 'Order Placed' | 'Preparing' | 'Ready for Pickup'; total: number } | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [draft, setDraft] = useState('')
  const [tables, setTables] = useState([
    { id: 1, available: 2, capacity: 4, occupants: ['Meera', 'Priya'] },
    { id: 2, available: 0, capacity: 4, occupants: ['Rohan', 'Kabir', 'Vikram', 'Nisha'] },
    { id: 3, available: 3, capacity: 6, occupants: ['Ananya', 'Dev', 'Sara'] },
    { id: 4, available: 1, capacity: 2, occupants: ['Ishaan'] },
  ])
  const [joinedTable, setJoinedTable] = useState<number | null>(null)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const replyTimers = useRef<number[]>([])

  useEffect(() => () => replyTimers.current.forEach(window.clearTimeout), [])
  useEffect(() => {
    if (!order) return
    const preparing = window.setTimeout(() => setOrder(current => current ? { ...current, status: 'Preparing' } : current), 2500)
    const ready = window.setTimeout(() => setOrder(current => current ? { ...current, status: 'Ready for Pickup' } : current), 6000)
    return () => { window.clearTimeout(preparing); window.clearTimeout(ready) }
  }, [order?.id])

  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  const subtotal = canteenMenu.reduce((sum, item) => sum + item.price * (cart[item.id] || 0), 0)
  const packaging = cartCount ? 10 : 0
  const total = subtotal + packaging
  const filteredMenu = canteenMenu.filter(item => category === 'Popular' ? item.popular : item.category === category)

  const updateQuantity = (id: string, change: number) => {
    setCart(current => {
      const quantity = Math.max(0, (current[id] || 0) + change)
      const next = { ...current }
      if (quantity === 0) delete next[id]
      else next[id] = quantity
      return next
    })
    setOrder(null)
  }

  const placeOrder = () => {
    if (!cartCount) {
      setNotice({ type: 'error', text: 'Your cart is empty. Add something tasty first.' })
      return
    }
    setOrder({ id: `CA-${Math.floor(100000 + Math.random() * 900000)}`, status: 'Order Placed', total })
    setCart({})
    setNotice({ type: 'success', text: 'Order placed successfully.' })
  }

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(current => [...current, { id: Date.now(), sender: 'You', text, time, own: true }])
    setDraft('')
    const replies = ['I’ll join you in a minute!', 'Nice, see you at the window table.', 'Can someone save me a seat?', 'The lunch rush is starting now.']
    const timer = window.setTimeout(() => {
      setMessages(current => [...current, { id: Date.now(), sender: 'Meera', text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), color: 'amber' }])
    }, 1200)
    replyTimers.current.push(timer)
  }

  const joinTable = (tableId: number) => {
    if (joinedTable === tableId) return
    const table = tables.find(item => item.id === tableId)
    if (!table || table.available === 0) {
      setNotice({ type: 'error', text: `Table ${tableId} is currently full.` })
      return
    }
    if (joinedTable) {
      setNotice({ type: 'error', text: 'Leave your current table before joining another.' })
      return
    }
    setTables(current => current.map(item => item.id === tableId ? { ...item, available: item.available - 1, occupants: [...item.occupants, 'Arjun'] } : item))
    setJoinedTable(tableId)
    setNotice({ type: 'success', text: `You joined Table ${tableId}.` })
  }

  const leaveTable = () => {
    if (!joinedTable) return
    const tableId = joinedTable
    setTables(current => current.map(item => item.id === tableId ? { ...item, available: item.available + 1, occupants: item.occupants.filter(name => name !== 'Arjun') } : item))
    setJoinedTable(null)
    setNotice({ type: 'success', text: `You left Table ${tableId}.` })
  }

  return <section className="campus-modal canteen-modal functional-canteen">
    <div className="modal-head canteen-head"><div><span>COLLEGE CAFÉ · OPEN NOW</span><h2>Canteen</h2><p>28 students here · Fresh food, live chat and shared tables</p></div><div className="canteen-head-actions"><button className="cart-count" onClick={() => setTab('menu')}><Icon name="canteen" size={16}/><span>{cartCount}</span></button><button onClick={onClose} aria-label="Close canteen">×</button></div></div>
    <div className="canteen-tabs">{(['menu','chat','tables'] as CanteenTab[]).map(item => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item === 'menu' ? 'Food & Cart' : item === 'chat' ? 'Live Chat' : 'Find a Table'}{item === 'menu' && cartCount > 0 && <b>{cartCount}</b>}</button>)}</div>
    {notice && <div className={`canteen-notice ${notice.type}`} role="status"><Icon name={notice.type === 'success' ? 'check' : 'bell'} size={15}/><span>{notice.text}</span><button onClick={() => setNotice(null)}>×</button></div>}
    {tab === 'menu' && <div className="ordering-layout">
      <div className="menu-browser">
        <div className="category-row">{['Popular','Snacks','Meals','Drinks'].map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="functional-food-list">{filteredMenu.map(item => <article key={item.id}><span>{item.letter}</span><div><strong>{item.name}</strong><small>{item.description}</small><b>₹{item.price}</b></div>{cart[item.id] ? <div className="quantity-control"><button onClick={() => updateQuantity(item.id,-1)}>−</button><b>{cart[item.id]}</b><button onClick={() => updateQuantity(item.id,1)}>+</button></div> : <button className="add-food" onClick={() => updateQuantity(item.id,1)}>Add to cart</button>}</article>)}</div>
      </div>
      <aside className="cart-panel">
        {order ? <div className="order-confirmation"><span><Icon name="check" size={23}/></span><small>ORDER CONFIRMED</small><h3>{order.id}</h3><p>Total paid <b>₹{order.total}</b></p><div className={`order-progress ${order.status === 'Preparing' ? 'preparing' : order.status === 'Ready for Pickup' ? 'ready' : ''}`}><i/><i/><i/></div><div className="order-steps"><span><b>Order Placed</b><small>Received</small></span><span><b>Preparing</b><small>In the kitchen</small></span><span><b>Ready</b><small>Collect at counter</small></span></div><strong className="current-status">{order.status}</strong><button onClick={() => setOrder(null)}>Start a new order</button></div> : <>
          <div className="cart-title"><div><span>YOUR CART</span><h3>Order summary</h3></div><b>{cartCount} {cartCount === 1 ? 'item' : 'items'}</b></div>
          {cartCount === 0 ? <div className="empty-cart"><span><Icon name="canteen" size={24}/></span><strong>Your cart is empty</strong><p>Add items from the menu to get started.</p></div> : <div className="cart-items">{canteenMenu.filter(item => cart[item.id]).map(item => <div key={item.id}><div><strong>{item.name}</strong><small>₹{item.price} × {cart[item.id]}</small></div><b>₹{item.price * cart[item.id]}</b><button onClick={() => updateQuantity(item.id,-1)}>×</button></div>)}</div>}
          <div className="cart-totals"><p><span>Subtotal</span><b>₹{subtotal}</b></p><p><span>Packaging</span><b>₹{packaging}</b></p><p className="total"><span>Total</span><b>₹{total}</b></p></div>
          <button className="place-order" onClick={placeOrder} disabled={!cartCount}>Place order · ₹{total}</button>
        </>}
      </aside>
    </div>}
    {tab === 'chat' && <div className="functional-chat">
      <div className="chat-room-head"><div><span className="chat-live"><i/> 12 ONLINE</span><h3>Lunch room</h3><p>Chat with students currently in the canteen.</p></div><div className="avatar-stack"><Avatar initials="MN" color="amber" size="sm"/><Avatar initials="RK" color="blue" size="sm"/><Avatar initials="PS" color="pink" size="sm"/></div></div>
      <div className="functional-messages">{messages.map(message => <div key={message.id} className={message.own ? 'own' : ''}>{!message.own && <Avatar initials={message.sender.slice(0,2).toUpperCase()} color={message.color || 'blue'}/>}<div><span><b>{message.sender}</b><small>{message.time}</small></span><p>{message.text}</p></div></div>)}</div>
      <form className="functional-chat-input" onSubmit={event => { event.preventDefault(); sendMessage() }}><input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Message the canteen..."/><button type="submit" disabled={!draft.trim()}><Icon name="arrow" size={18}/></button></form>
    </div>}
    {tab === 'tables' && <div className="tables-view">
      <div className="tables-intro"><div><span>SEATING AREA</span><h3>Find your table</h3><p>Join friends or pick a table with an open seat.</p></div>{joinedTable && <button onClick={leaveTable}>Leave Table {joinedTable}</button>}</div>
      <div className="table-grid">{tables.map(table => <article key={table.id} className={`${table.available === 0 ? 'full' : ''} ${joinedTable === table.id ? 'joined' : ''}`}><div className="table-visual"><span>{table.id}</span>{Array.from({length:table.capacity}).map((_,i)=><i key={i} className={i >= table.capacity-table.available ? 'open' : ''}/>)}</div><div className="table-info"><span>{table.available === 0 ? 'FULL' : joinedTable === table.id ? 'YOUR TABLE' : 'AVAILABLE'}</span><h4>Table {table.id}</h4><p>{table.available} of {table.capacity} seats available</p><small>{table.occupants.join(' · ')}</small></div><button disabled={joinedTable === table.id} aria-disabled={table.available === 0} onClick={() => joinTable(table.id)}>{joinedTable === table.id ? 'Joined' : table.available === 0 ? 'Table full' : 'Join table'}</button></article>)}</div>
    </div>}
  </section>
}

function CampusModal({ type, onClose }: { type: CampusOverlay; onClose: () => void }) {
  const simpleContent: Record<Exclude<CampusOverlay, 'canteen' | 'games'>, { eyebrow: string; title: string; text: string; items: string[] }> = {
    library: { eyebrow: 'CENTRAL LIBRARY', title: 'Study materials & notes', text: 'Find course resources shared by your department and classmates.', items: ['Data Structures — Unit 4', 'Operating Systems — Handwritten notes', 'Computer Networks — Practice set'] },
    garden: { eyebrow: 'CENTRAL GARDEN', title: 'Garden hangout', text: 'A relaxed social space around the fountain.', items: ['12 students at Fountain Walk', 'Photography Club meetup at 4:00 PM', 'Open acoustic jam this evening'] },
    sports: { eyebrow: 'SPORTS GROUND', title: 'Recreational activities', text: 'Join a casual game or check today’s fixtures.', items: ['Football practice — 4:30 PM', 'Badminton court — 2 slots free', 'Morning runners group — 6:30 AM'] },
    plaza: { eyebrow: 'STUDENT PLAZA', title: 'Events & announcements', text: 'Everything happening at the heart of campus.', items: ['Tech Fest registrations are open', 'Robotics demo — 3:00 PM', 'Club orientation booths until 5:00 PM'] },
  }
  if (type === 'canteen') return <div className="campus-modal-backdrop" onMouseDown={onClose}><div onMouseDown={event => event.stopPropagation()}><CanteenExperience onClose={onClose}/></div></div>
  if (type === 'games') return <div className="campus-modal-backdrop" onMouseDown={onClose}><section className="campus-modal games-modal" onMouseDown={e=>e.stopPropagation()}>
    <div className="modal-head"><div><span>RECREATION HUB · 8 PLAYING</span><h2>Gaming Zone</h2><p>Quick games, campus rivals, and bragging rights.</p></div><button onClick={onClose} aria-label="Close gaming zone">×</button></div>
    <div className="gaming-modal-grid"><div className="mini-tic"><span>QUICK MATCH</span><h3>Tic-tac-toe</h3><div>{['X','O','','','X','','O','','X'].map((v,i)=><button disabled key={i} className={v.toLowerCase()}>{v}</button>)}</div><b>Preview board</b></div><div className="game-lobby"><span>SIMULATED GAME LOBBY</span><h3>Available games</h3>{[['Word Rush','3 waiting'],['Chess Club','2 playing'],['Quiz Arena','5 waiting']].map(([name,status])=><button key={name} onClick={() => navigate('games')}><i><Icon name="games" size={15}/></i><span><b>{name}</b><small>{status}</small></span><em>Open</em></button>)}</div><div className="mini-leaderboard"><span>SIMULATED LEADERBOARD</span><h3>Top players</h3>{[['1','Vikram','2,840 XP'],['2','Priya','2,490 XP'],['3','Rohan','2,260 XP']].map(([rank,name,xp])=><div key={name}><b>{rank}</b><span>{name}</span><em>{xp}</em></div>)}</div></div>
  </section></div>
  const content = simpleContent[type]
  return <div className="campus-modal-backdrop" onMouseDown={onClose}><section className="campus-modal info-modal" onMouseDown={e=>e.stopPropagation()}>
    <div className="modal-head"><div><span>{content.eyebrow}</span><h2>{content.title}</h2><p>{content.text}</p></div><button onClick={onClose} aria-label="Close">×</button></div>
    <div className="location-list">{content.items.map((item,i)=><button key={item} onClick={() => notify(`${item} selected in the frontend prototype.`)}><i>{String(i+1).padStart(2,'0')}</i><span>{item}</span><Icon name="arrow" size={16}/></button>)}</div>
  </section></div>
}

function VirtualCampus({ initialOverlay }: { initialOverlay?: CampusOverlay }) {
  const [overlay, setOverlay] = useState<CampusOverlay | null>(initialOverlay ?? null)
  const [nearby, setNearby] = useState<CampusOverlay | null>(null)
  const [zoom, setZoom] = useState(1)
  const [friendQuery, setFriendQuery] = useState('')
  const shellPage: Page = initialOverlay === 'canteen' ? 'canteen' : 'campus'
  useEffect(() => {
    setOverlay(initialOverlay ?? null)
  }, [initialOverlay])
  useEffect(() => {
    const openNearby = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return
      if (event.key.toLowerCase() === 'e' && !overlay && nearby) setOverlay(nearby)
      if (event.key === 'Escape') setOverlay(null)
    }
    window.addEventListener('keydown', openNearby)
    return () => window.removeEventListener('keydown', openNearby)
  }, [nearby, overlay])
  return <AppShell page={shellPage} title={shellPage === 'canteen' ? 'Canteen' : 'Virtual Campus'}>
    <div className="game-layout campus-layout">
      <section className="game-card campus-game">
        <div className="game-toolbar campus-toolbar"><div><span className="live-pill"><i/> LIVE</span><strong>North Campus</strong><small> · 136 students exploring</small></div><div><button onClick={() => setZoom(1)}><Icon name="map" size={17}/> Full map</button><button aria-label="Zoom out" onClick={() => setZoom(value => Math.max(.9, +(value-.1).toFixed(1)))}>−</button><small className="zoom-value">{Math.round(zoom*100)}%</small><button aria-label="Zoom in" onClick={() => setZoom(value => Math.min(1.3, +(value+.1).toFixed(1)))}>+</button></div></div>
        <GameScene onOpen={setOverlay} disabled={!!overlay} onNearbyChange={setNearby} zoom={zoom} />
        <div className="controls campus-controls"><div><i>W</i><span><i>A</i><i>S</i><i>D</i></span></div><p><strong>Explore campus</strong><small>Use WASD or arrow keys to move</small></p></div>
        <div className="location-chip campus-location"><span className="location-pin"><Icon name="map" size={16}/></span><span><small>CURRENT LOCATION</small><strong>Central Garden · Fountain Walk</strong></span></div>
      </section>
      <aside className="online-panel">
        <div className="online-head"><div><span>ONLINE NOW</span><h3>Campus friends</h3></div><b>136</b></div>
        <label className="friend-search"><Icon name="search" size={16}/><input value={friendQuery} onChange={event => setFriendQuery(event.target.value)} placeholder="Find a student"/></label>
        <div className="online-list">{online.filter(([,name,place]) => `${name} ${place}`.toLowerCase().includes(friendQuery.toLowerCase())).map(([ini,name,place,color])=><button key={name} onClick={() => notify(`${name} is currently at ${place}.`)}><span className="online-avatar"><Avatar initials={ini} color={color}/><i/></span><span><strong>{name}</strong><small>{place}</small></span><b>···</b></button>)}</div>
        <button className="invite" onClick={() => notify('A simulated campus invite was sent to your friends.')}><Icon name="users"/> Invite friends</button>
        <div className="activity-card"><div><span className="activity-wave"><i /><i /><i /></span><b>Campus is active</b></div><p>34 students are gathering near the central fountain.</p><button onClick={() => setOverlay('garden')}>View activity</button></div>
        <div className="campus-tip"><span><Icon name="map"/></span><div><strong>Campus tip</strong><p>Walk close to a building to enter it.</p></div></div>
      </aside>
    </div>
    {overlay && <CampusModal type={overlay} onClose={() => setOverlay(null)} />}
  </AppShell>
}

type GameMark = 'X' | 'O' | null
type MatchResult = { winner: 'X' | 'O' | 'draw'; line: number[] } | null
type GameStats = { xp: number; gamesPlayed: number; gamesWon: number; history: { id: number; game: string; result: string; xp: number }[] }
type PreviewGame = 'word' | 'chess' | 'quiz'

const winningLines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

function getMatchResult(board: GameMark[]): MatchResult {
  for (const line of winningLines) {
    const [a,b,c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { winner: board[a] as 'X' | 'O', line }
  }
  return board.every(Boolean) ? { winner: 'draw', line: [] } : null
}

function getStrategicMove(board: GameMark[]) {
  const available = board.map((cell, index) => cell ? -1 : index).filter(index => index >= 0)
  const immediateMove = (mark: 'X' | 'O') => available.find(index => {
    const test = [...board]
    test[index] = mark
    return getMatchResult(test)?.winner === mark
  })
  const winningMove = immediateMove('O')
  if (winningMove !== undefined) return winningMove
  const blockingMove = immediateMove('X')
  if (blockingMove !== undefined) return blockingMove
  if (board[4] === null) return 4
  const corner = [0,2,6,8].find(index => board[index] === null)
  return corner ?? available[0]
}

function loadGameStats(): GameStats {
  const fallback = { xp: 1720, gamesPlayed: 28, gamesWon: 18, history: [] }
  try {
    const saved = localStorage.getItem('college-adda-game-stats')
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback
  } catch {
    return fallback
  }
}

function GamePreview({ game, onClose, onReward }: { game: PreviewGame; onClose: () => void; onReward: (game: string, won: boolean, xp: number) => void }) {
  const [answer, setAnswer] = useState('')
  const [complete, setComplete] = useState(false)
  const [message, setMessage] = useState('')
  const [matching, setMatching] = useState(false)
  const [matchFound, setMatchFound] = useState(false)
  const matchTimer = useRef<number | null>(null)
  useEffect(() => () => { if (matchTimer.current) window.clearTimeout(matchTimer.current) }, [])

  const submitWord = () => {
    if (complete) return
    const correct = answer.trim().toUpperCase() === 'CAMPUS'
    setComplete(true)
    setMessage(correct ? 'Correct! You unscrambled the word.' : 'The answer was CAMPUS. Try the next round!')
    onReward('Word Rush', correct, correct ? 60 : 10)
  }
  const answerQuiz = (option: string) => {
    if (complete) return
    const correct = option === 'Virtual DOM'
    setComplete(true)
    setMessage(correct ? 'Correct answer! Great round.' : 'Not quite. React uses a Virtual DOM.')
    onReward('Quiz Arena', correct, correct ? 50 : 10)
  }
  const findChessMatch = () => {
    setMatching(true)
    matchTimer.current = window.setTimeout(() => { setMatching(false); setMatchFound(true) }, 1200)
  }

  return <div className="game-preview-backdrop" onMouseDown={onClose}><section className="game-preview-modal" onMouseDown={event => event.stopPropagation()}>
    <div className="game-preview-head"><div><span>GAME LOBBY</span><h2>{game === 'word' ? 'Word Rush' : game === 'chess' ? 'Chess Club' : 'Quiz Arena'}</h2></div><button onClick={onClose}>×</button></div>
    {game === 'word' && <div className="word-preview"><span>ROUND 01 · CAMPUS LIFE</span><p>Unscramble the letters</p><div className="scramble">S U P M A C</div><form onSubmit={event => { event.preventDefault(); submitWord() }}><input value={answer} onChange={event => setAnswer(event.target.value)} placeholder="Type your answer..." disabled={complete}/><button disabled={!answer.trim() || complete}>Submit</button></form>{message && <div className={`preview-result ${message.startsWith('Correct') ? 'success' : ''}`}>{message}</div>}</div>}
    {game === 'chess' && <div className="chess-preview"><div className="mini-chessboard">{Array.from({length:64}).map((_,i)=><i key={i}>{i===0?'♜':i===7?'♜':i===56?'♖':i===63?'♖':''}</i>)}</div><div><span>SIMULATED QUICK PAIRING</span><h3>{matchFound ? 'Match found!' : 'Ready for a challenge?'}</h3><p>{matchFound ? 'Meera Nair · Level 11 is ready to play in this simulated lobby.' : 'We’ll simulate pairing you with a student at a similar level.'}</p>{matchFound ? <button onClick={() => { notify('Simulated chess room opened. Full chess gameplay is not implemented yet.'); onClose() }}>Enter match room</button> : <button onClick={findChessMatch} disabled={matching}>{matching ? <><i className="loading-dot"/> Finding player...</> : 'Find a match'}</button>}</div></div>}
    {game === 'quiz' && <div className="quiz-preview"><span>COMPUTER SCIENCE · 10 XP</span><h3>Which concept helps React update the UI efficiently?</h3><div>{['Virtual DOM','SQL Index','DNS Cache','Binary Heap'].map(option=><button key={option} disabled={complete} onClick={() => answerQuiz(option)}>{option}</button>)}</div>{message && <div className={`preview-result ${message.startsWith('Correct') ? 'success' : ''}`}>{message}</div>}</div>}
  </section></div>
}

function GamingZone() {
  const [board, setBoard] = useState<GameMark[]>(Array(9).fill(null))
  const [turn, setTurn] = useState<'X' | 'O'>('X')
  const [result, setResult] = useState<MatchResult>(null)
  const [thinking, setThinking] = useState(false)
  const [stats, setStats] = useState<GameStats>(loadGameStats)
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly')
  const [preview, setPreview] = useState<PreviewGame | null>(null)
  const [toast, setToast] = useState<{ type: 'win' | 'loss' | 'info'; text: string } | null>(null)
  const rewardedMatch = useRef(false)

  useEffect(() => {
    localStorage.setItem('college-adda-game-stats', JSON.stringify(stats))
  }, [stats])

  const recordGame = (game: string, won: boolean, xp: number, resultLabel?: string) => {
    setStats(current => ({
      xp: current.xp + xp,
      gamesPlayed: current.gamesPlayed + 1,
      gamesWon: current.gamesWon + (won ? 1 : 0),
      history: [{ id: Date.now(), game, result: resultLabel || (won ? 'Won' : 'Played'), xp }, ...current.history].slice(0, 5),
    }))
    setToast({ type: won ? 'win' : 'info', text: `${won ? 'Nice work!' : 'Game complete.'} +${xp} XP` })
  }

  const finishTicTacToe = (outcome: NonNullable<MatchResult>) => {
    setResult(outcome)
    if (rewardedMatch.current) return
    rewardedMatch.current = true
    if (outcome.winner === 'X') recordGame('Tic-tac-toe', true, 120, 'Won')
    else if (outcome.winner === 'O') { recordGame('Tic-tac-toe', false, 15, 'Lost'); setToast({ type: 'loss', text: 'Priya won this round. +15 XP' }) }
    else recordGame('Tic-tac-toe', false, 40, 'Draw')
  }

  const playCell = (index: number) => {
    if (board[index] || turn !== 'X' || result || thinking) return
    const next = [...board]
    next[index] = 'X'
    setBoard(next)
    const outcome = getMatchResult(next)
    if (outcome) finishTicTacToe(outcome)
    else setTurn('O')
  }

  useEffect(() => {
    if (turn !== 'O' || result) return
    setThinking(true)
    const timer = window.setTimeout(() => {
      const move = getStrategicMove(board)
      if (move === undefined) { setThinking(false); return }
      const next = [...board]
      next[move] = 'O'
      setBoard(next)
      setThinking(false)
      const outcome = getMatchResult(next)
      if (outcome) finishTicTacToe(outcome)
      else setTurn('X')
    }, 500)
    return () => window.clearTimeout(timer)
  }, [turn, result, board])

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn('X')
    setResult(null)
    setThinking(false)
    setToast(null)
    rewardedMatch.current = false
  }

  const level = 9 + Math.floor(stats.xp / 500)
  const nextLevelAt = (level - 8) * 500
  const levelProgress = (stats.xp % 500) / 5
  const winRate = stats.gamesPlayed ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0
  const rankingBase = period === 'monthly'
    ? [{name:'Vikram Shah',xp:2840,color:'violet'},{name:'Priya Singh',xp:2490,color:'pink'},{name:'Rohan Kumar',xp:2260,color:'blue'},{name:'Meera Nair',xp:1580,color:'green'}]
    : [{name:'Priya Singh',xp:920,color:'pink'},{name:'Vikram Shah',xp:870,color:'violet'},{name:'Rohan Kumar',xp:690,color:'blue'},{name:'Meera Nair',xp:540,color:'green'}]
  const userPeriodXp = period === 'monthly' ? stats.xp : 620 + (stats.xp - 1720)
  const leaderboard = [...rankingBase,{name:'Arjun Sharma',xp:userPeriodXp,color:'amber'}].sort((a,b)=>b.xp-a.xp)
  const statusText = result?.winner === 'X' ? 'You won the match!' : result?.winner === 'O' ? 'Priya won this round' : result?.winner === 'draw' ? 'It’s a draw' : thinking ? 'Priya is thinking...' : 'Your turn'
  const lobbyGames = [
    { id:'ttt', title:'TIC TAC TOE', desc:'Classic 3 × 3 strategy match', count:'3 playing', color:'blue', art:'X O X', status:'LIVE' },
    { id:'word', title:'WORD RUSH', desc:'Unscramble words before time runs out', count:'8 playing', color:'violet', art:'A B C', status:'JOINING' },
    { id:'chess', title:'CHESS CLUB', desc:'Pair with a campus chess player', count:'2 playing', color:'amber', art:'♜ ♞', status:'OPEN' },
    { id:'quiz', title:'QUIZ ARENA', desc:'Fast campus knowledge challenges', count:'5 waiting', color:'pink', art:'? !', status:'OPEN' },
  ]

  return <AppShell page="games" title="Gaming Zone">
    {toast && <div className={`game-toast ${toast.type}`}><Icon name={toast.type === 'win' ? 'check' : 'games'} size={17}/><span>{toast.text}</span><button onClick={() => setToast(null)}>×</button></div>}
    <section className="gaming-hero"><div><span>PLAYER LOUNGE</span><h1>Take a break. <em>Play a round.</em></h1><p>Challenge friends, climb the leaderboard, and earn campus bragging rights.</p></div><div className="level-card"><span>YOUR LEVEL</span><strong>{level}</strong><div><i style={{width:`${levelProgress}%`}}/></div><small>{Math.max(0,nextLevelAt-stats.xp)} XP to level {level+1}</small></div></section>
    <section className="player-game-profile">
      <div><Avatar initials="AS" color="blue"/><span><small>PLAYER</small><strong>Arjun Sharma</strong></span></div>
      <div><small>TOTAL XP</small><strong>{stats.xp.toLocaleString()}</strong></div><div><small>GAMES PLAYED</small><strong>{stats.gamesPlayed}</strong></div><div><small>GAMES WON</small><strong>{stats.gamesWon}</strong></div><div><small>WIN RATE</small><strong>{winRate}%</strong></div>
      <div className="recent-history"><small>RECENT MATCHES</small>{stats.history.length ? <span>{stats.history.slice(0,3).map(item=><i key={item.id} className={item.result.toLowerCase()} title={`${item.game}: ${item.result}`}>{item.result.slice(0,1)}</i>)}</span> : <em>No matches yet</em>}</div>
    </section>
    <div className="games-grid">
      <section className="panel ttt-card interactive-ttt" id="ttt-game"><div className="panel-head"><div><span>QUICK MATCH</span><h3>Tic-tac-toe</h3></div><span className={`match-live ${result ? 'finished' : ''}`}><i/> {result ? 'Match finished' : 'Match in progress'}</span></div>
        <div className="players"><div><Avatar initials="AS" color="blue"/><span><strong>You</strong><small>Playing as X</small></span></div><b>VS</b><div><span><strong>Priya AI</strong><small>Playing as O</small></span><Avatar initials="PS" color="pink"/></div></div>
        <div className="ttt-board">{board.map((value,index)=><button key={index} aria-label={`Cell ${index+1}${value ? `: ${value}` : ''}`} disabled={!!value || turn !== 'X' || !!result || thinking} onClick={() => playCell(index)} className={`${value ? value.toLowerCase() : ''} ${result?.line.includes(index) ? 'winning' : ''}`}>{value}</button>)}</div>
        <div className={`game-result-banner ${result?.winner === 'X' ? 'won' : result?.winner === 'O' ? 'lost' : ''}`}><span>{thinking && <i className="loading-dot"/>}{statusText}</span><div><button onClick={resetGame}>Restart game</button>{result && <button className="new-match" onClick={resetGame}>New match</button>}</div></div>
      </section>
      <section className="panel leaderboard dynamic-leaderboard"><div className="panel-head"><div><span>SIMULATED · {period === 'monthly' ? 'THIS MONTH' : 'THIS WEEK'}</span><h3>Top players</h3></div><div className="period-filter"><button className={period==='weekly'?'active':''} onClick={()=>setPeriod('weekly')}>Week</button><button className={period==='monthly'?'active':''} onClick={()=>setPeriod('monthly')}>Month</button></div></div>
        {leaderboard.map((player,index)=><div className={`rank-row ${player.name==='Arjun Sharma'?'you':''}`} key={player.name}><b>{index+1}</b><Avatar initials={player.name.split(' ').map(part=>part[0]).join('')} color={player.color}/><span><strong>{player.name==='Arjun Sharma'?'You':player.name}</strong><small>{player.name==='Arjun Sharma'?'Current campus rank':'Campus player'}</small></span><em>{player.xp.toLocaleString()} XP</em></div>)}
      </section>
    </div>
    <section className="available-games"><div className="section-row"><div><span>SIMULATED MATCHMAKING</span><h3>Game lobby</h3></div><b className="lobby-status"><i/> 18 simulated players</b></div><div className="game-cards interactive-game-cards">
      {lobbyGames.map(game=><article className={game.color} key={game.id}><div className="game-art"><span>{game.art}</span></div><div><span>{game.status} · {game.count}</span><h4>{game.title}</h4><p>{game.desc}</p><button onClick={()=>game.id==='ttt'?document.getElementById('ttt-game')?.scrollIntoView({behavior:'smooth',block:'center'}):setPreview(game.id as PreviewGame)}>{game.id==='ttt'?'Play now':'Join game'} <Icon name="arrow" size={16}/></button></div></article>)}
    </div></section>
    {preview && <GamePreview game={preview} onClose={()=>setPreview(null)} onReward={recordGame}/>}
  </AppShell>
}

type PostCategory = 'General' | 'Academics' | 'Technology' | 'Gaming' | 'Events' | 'Lost & Found'
type SocialComment = { id: number; author: string; initials: string; text: string; time: string }
type SocialPost = {
  id: number
  author: string
  initials: string
  color: string
  department: string
  semester: string
  text: string
  category: PostCategory
  time: string
  image?: string
  likes: number
  liked: boolean
  comments: SocialComment[]
}
type EventAction = { interested: boolean; going: boolean }

const socialCategories: (PostCategory | 'All Posts')[] = ['All Posts','General','Academics','Technology','Gaming','Events','Lost & Found']

const initialSocialPosts: SocialPost[] = [
  { id: 101, author: 'Priya Singh', initials: 'PS', color: 'pink', department: 'Computer Science', semester: 'Semester 5', text: 'Sharing my Data Structures revision sheet for the mid-semester exam. I covered trees, graphs, and the most common complexity questions. Drop your questions below!', category: 'Academics', time: '18 min ago', likes: 34, liked: false, comments: [{ id: 1, author: 'Rohan Kumar', initials: 'RK', text: 'This is exactly what I needed. Thank you!', time: '10 min ago' }] },
  { id: 102, author: 'Rohan Kumar', initials: 'RK', color: 'blue', department: 'Information Technology', semester: 'Semester 5', text: 'North Campus looked incredible after the rain today. The central garden meetup is still happening at 4 PM.', category: 'General', time: '42 min ago', image: 'campus', likes: 57, liked: true, comments: [{ id: 2, author: 'Meera Nair', initials: 'MN', text: 'The fountain area is perfect today!', time: '31 min ago' }, { id: 3, author: 'Ananya Rao', initials: 'AR', text: 'I’ll be there after class.', time: '24 min ago' }] },
  { id: 103, author: 'Meera Nair', initials: 'MN', color: 'amber', department: 'Electronics', semester: 'Semester 3', text: 'Looking for two more players for the inter-department gaming tournament. We’re practicing Quiz Arena and chess this evening.', category: 'Gaming', time: '1 hr ago', likes: 21, liked: false, comments: [] },
  { id: 104, author: 'Ananya Rao', initials: 'AR', color: 'green', department: 'Mechanical Engineering', semester: 'Semester 7', text: 'Found a blue water bottle near Lab 3. I’ve handed it over to the Academic Block reception.', category: 'Lost & Found', time: '2 hrs ago', likes: 12, liked: false, comments: [] },
]

function loadSocialPosts() {
  try {
    const saved = localStorage.getItem('college-adda-social-posts')
    return saved ? JSON.parse(saved) as SocialPost[] : initialSocialPosts
  } catch {
    return initialSocialPosts
  }
}

function loadEventActions() {
  try {
    const saved = localStorage.getItem('college-adda-event-actions')
    return saved ? JSON.parse(saved) as Record<number, EventAction> : {}
  } catch {
    return {}
  }
}

function SocialHub() {
  const [posts, setPosts] = useState<SocialPost[]>(loadSocialPosts)
  const [filter, setFilter] = useState<PostCategory | 'All Posts'>('All Posts')
  const [postText, setPostText] = useState('')
  const [postCategory, setPostCategory] = useState<PostCategory>('General')
  const [postImage, setPostImage] = useState<string>('')
  const [composerError, setComposerError] = useState('')
  const [openComments, setOpenComments] = useState<number[]>([])
  const [commentDrafts, setCommentDrafts] = useState<Record<number,string>>({})
  const [eventActions, setEventActions] = useState<Record<number,EventAction>>(loadEventActions)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try { localStorage.setItem('college-adda-social-posts', JSON.stringify(posts)) }
    catch { notify('Posts are too large to save locally. Try a smaller image.') }
  }, [posts])
  useEffect(() => {
    localStorage.setItem('college-adda-event-actions', JSON.stringify(eventActions))
  }, [eventActions])

  const publishPost = () => {
    if (!postText.trim() && !postImage) {
      setComposerError('Write something or attach an image before publishing.')
      return
    }
    const post: SocialPost = {
      id: Date.now(), author: 'Arjun Sharma', initials: 'AS', color: 'blue',
      department: 'Computer Science', semester: 'Semester 5', text: postText.trim(),
      category: postCategory, time: 'Just now', image: postImage || undefined,
      likes: 0, liked: false, comments: [],
    }
    setPosts(current => [post, ...current])
    setPostText('')
    setPostImage('')
    setPostCategory('General')
    setComposerError('')
    setFilter('All Posts')
    notify('Your post is now live in Social Hub.')
  }

  const attachImage = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setComposerError('Choose a valid image file.')
      return
    }
    if (file.size > 1_500_000) {
      setComposerError('Choose an image smaller than 1.5 MB for this prototype.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => { setPostImage(String(reader.result)); setComposerError('') }
    reader.readAsDataURL(file)
  }

  const toggleLike = (postId: number) => setPosts(current => current.map(post => post.id === postId ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) } : post))

  const addComment = (postId: number) => {
    const text = (commentDrafts[postId] || '').trim()
    if (!text) return
    const comment: SocialComment = { id: Date.now(), author: 'Arjun Sharma', initials: 'AS', text, time: 'Just now' }
    setPosts(current => current.map(post => post.id === postId ? { ...post, comments: [...post.comments, comment] } : post))
    setCommentDrafts(current => ({ ...current, [postId]: '' }))
  }

  const sharePost = async (post: SocialPost) => {
    const shareText = `${post.author} on College Adda: ${post.text}`
    try {
      await navigator.clipboard.writeText(shareText)
      notify('Post text copied to your clipboard.')
    } catch {
      notify('Sharing is unavailable in this preview browser.')
    }
  }

  const events = [
    { id: 1, day: '24', month: 'AUG', title: 'Aavishkar Tech Fest', description: 'Build, demo and celebrate student technology projects.', organizer: 'Innovation Cell', interested: 184, going: 76 },
    { id: 2, day: '28', month: 'AUG', title: 'Open Mic at the Plaza', description: 'Music, poetry and comedy under the campus lights.', organizer: 'Cultural Club', interested: 96, going: 42 },
    { id: 3, day: '02', month: 'SEP', title: 'Inter-Department Games', description: 'Football, badminton, chess and Quiz Arena finals.', organizer: 'Sports Committee', interested: 132, going: 58 },
  ]
  const visiblePosts = filter === 'All Posts' ? posts : posts.filter(post => post.category === filter)

  return <AppShell page="social" title="Social Hub">
    <section className="social-hero"><div><span>COLLEGE COMMUNITY</span><h1>What’s happening on campus?</h1><p>Share an update, join a discussion, or find your next campus event.</p></div><div className="social-online"><div className="avatar-stack"><Avatar initials="PS" color="pink" size="sm"/><Avatar initials="RK" color="blue" size="sm"/><Avatar initials="MN" color="amber" size="sm"/></div><span><strong>248 online</strong><small>across campus</small></span></div></section>
    <div className="social-layout">
      <main className="social-feed">
        <section className="post-composer panel">
          <div className="composer-main"><Avatar initials="AS" color="blue"/><textarea value={postText} onChange={event => { setPostText(event.target.value); setComposerError('') }} placeholder="Share something with your campus..."/></div>
          {postImage && <div className="composer-image-preview"><img src={postImage} alt="Post attachment preview"/><button onClick={() => setPostImage('')}>×</button></div>}
          {composerError && <p className="composer-error">{composerError}</p>}
          <div className="composer-actions"><div><select value={postCategory} onChange={event => setPostCategory(event.target.value as PostCategory)} aria-label="Post category">{socialCategories.slice(1).map(category => <option key={category}>{category}</option>)}</select><button onClick={() => fileInput.current?.click()}><Icon name="image" size={16}/> Add image</button><input ref={fileInput} hidden type="file" accept="image/*" onChange={event => attachImage(event.target.files?.[0])}/></div><button className="publish-post" onClick={publishPost}>Publish post</button></div>
        </section>
        <nav className="social-categories" aria-label="Post categories">{socialCategories.map(category => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</nav>
        <div className="feed-list">
          {visiblePosts.length === 0 && <div className="social-empty"><span><Icon name="message" size={25}/></span><strong>No posts in {filter}</strong><p>Be the first student to start this discussion.</p></div>}
          {visiblePosts.map(post => <article className="social-post panel" key={post.id}>
            <header><Avatar initials={post.initials} color={post.color}/><div><strong>{post.author}</strong><span>{post.department} · {post.semester}</span></div><small>{post.time}</small></header>
            <span className="post-category">{post.category}</span>
            {post.text && <p className="post-copy">{post.text}</p>}
            {post.image && <img className="post-image" src={post.image === 'campus' ? campusHero : post.image} alt={`${post.author}'s campus post`}/>}
            <div className="post-stats"><span>{post.likes} likes</span><span>{post.comments.length} comments</span></div>
            <div className="post-actions"><button className={post.liked ? 'liked' : ''} onClick={() => toggleLike(post.id)}><Icon name="heart" size={17}/>{post.liked ? 'Liked' : 'Like'}</button><button onClick={() => setOpenComments(current => current.includes(post.id) ? current.filter(id => id !== post.id) : [...current,post.id])}><Icon name="message" size={17}/>Comment</button><button onClick={() => sharePost(post)}><Icon name="share" size={17}/>Share</button></div>
            {openComments.includes(post.id) && <div className="comments-area">
              {post.comments.length === 0 ? <p className="no-comments">No comments yet. Start the conversation.</p> : post.comments.map(comment => <div className="social-comment" key={comment.id}><Avatar initials={comment.initials} color={comment.author === 'Arjun Sharma' ? 'blue' : 'violet'} size="sm"/><div><span><strong>{comment.author}</strong><small>{comment.time}</small></span><p>{comment.text}</p></div></div>)}
              <form onSubmit={event => { event.preventDefault(); addComment(post.id) }}><Avatar initials="AS" color="blue" size="sm"/><input value={commentDrafts[post.id] || ''} onChange={event => setCommentDrafts(current => ({ ...current, [post.id]: event.target.value }))} placeholder="Write a comment..."/><button type="submit" disabled={!(commentDrafts[post.id] || '').trim()}><Icon name="arrow" size={16}/></button></form>
            </div>}
          </article>)}
        </div>
      </main>
      <aside className="social-rail">
        <section className="panel trending-panel"><div className="social-panel-head"><span>TRENDING NOW</span><h3>Popular discussions</h3></div>{[['#MidSemPrep','84 posts'],['#Aavishkar2025','62 posts'],['#CampusPlacements','47 posts'],['#GameNight','31 posts']].map(([topic,count],index)=><button key={topic} onClick={() => notify(`${topic} has ${count} in this simulated feed.`)}><b>{String(index+1).padStart(2,'0')}</b><span><strong>{topic}</strong><small>{count}</small></span><Icon name="arrow" size={15}/></button>)}</section>
        <section className="panel clubs-panel"><div className="social-panel-head"><span>ACTIVE CLUBS</span><h3>Find your people</h3></div>{[['RC','Robotics Club','148 members','violet'],['CC','Coding Circle','236 members','blue'],['LC','Literary Club','92 members','pink']].map(([initials,name,count,color])=><div key={name}><Avatar initials={initials} color={color}/><span><strong>{name}</strong><small>{count}</small></span><button onClick={() => notify(`Joined ${name} in this frontend prototype.`)}>Join</button></div>)}</section>
        <section className="panel social-events"><div className="social-panel-head"><span>UPCOMING</span><h3>Campus events</h3></div>{events.map(event => { const action = eventActions[event.id] || {interested:false,going:false}; return <article key={event.id}><time><b>{event.day}</b><span>{event.month}</span></time><div><strong>{event.title}</strong><p>{event.description}</p><small>By {event.organizer}</small><div><button className={action.interested ? 'active' : ''} onClick={() => setEventActions(current => ({ ...current, [event.id]: { interested: !action.interested, going: false } }))}>{event.interested + (action.interested ? 1 : 0)} Interested</button><button className={action.going ? 'active going' : ''} onClick={() => setEventActions(current => ({ ...current, [event.id]: { interested: false, going: !action.going } }))}>{event.going + (action.going ? 1 : 0)} Going</button></div></div></article>})}</section>
      </aside>
    </div>
  </AppShell>
}

type ServiceTab = 'notes' | 'groups' | 'lost' | 'resources'
type SharedNote = { id: number; title: string; subject: string; semester: string; department: string; uploader: string; date: string; type: 'PDF' | 'DOC'; source: 'sample' | 'upload'; fileName: string; fileSize?: string }
type StudyGroup = { id: number; name: string; subject: string; description: string; members: number; joined: boolean; meeting: string }
type LostFoundItem = { id: number; kind: 'Lost' | 'Found'; name: string; description: string; location: string; date: string; contact: string; resolved: boolean }

const sampleNotes: SharedNote[] = [
  { id: 1, title: 'Graph Algorithms — Complete Revision', subject: 'Data Structures', semester: 'Semester 5', department: 'Computer Science', uploader: 'Priya Singh', date: 'Today', type: 'PDF', source: 'sample', fileName: 'graph-algorithms-sample.txt' },
  { id: 2, title: 'Operating Systems Unit 3', subject: 'Operating Systems', semester: 'Semester 5', department: 'Computer Science', uploader: 'Rohan Kumar', date: 'Yesterday', type: 'PDF', source: 'sample', fileName: 'operating-systems-unit-3.txt' },
  { id: 3, title: 'Digital Electronics Lab Manual', subject: 'Digital Electronics', semester: 'Semester 3', department: 'Electronics', uploader: 'Meera Nair', date: '16 Aug', type: 'DOC', source: 'sample', fileName: 'digital-electronics-lab.txt' },
  { id: 4, title: 'Thermodynamics Formula Sheet', subject: 'Thermodynamics', semester: 'Semester 3', department: 'Mechanical Engineering', uploader: 'Ananya Rao', date: '15 Aug', type: 'PDF', source: 'sample', fileName: 'thermodynamics-formulas.txt' },
]

const initialStudyGroups: StudyGroup[] = [
  { id: 1, name: 'DSA Problem Solvers', subject: 'Data Structures', description: 'Weekly problem-solving sessions focused on interview patterns and semester preparation.', members: 28, joined: true, meeting: 'Tue & Thu · Library' },
  { id: 2, name: 'OS Study Circle', subject: 'Operating Systems', description: 'Concept discussions, previous papers, and collaborative revision.', members: 16, joined: false, meeting: 'Wednesday · 5 PM' },
  { id: 3, name: 'Frontend Builders', subject: 'Web Development', description: 'Learn React by building small campus-focused projects together.', members: 34, joined: false, meeting: 'Saturday · Lab 2' },
  { id: 4, name: 'Placement Aptitude Crew', subject: 'Aptitude', description: 'Daily quantitative aptitude challenges and mock assessments.', members: 42, joined: true, meeting: 'Daily · 7 PM online' },
]

const initialLostFound: LostFoundItem[] = [
  { id: 1, kind: 'Found', name: 'Blue water bottle', description: 'Metal bottle with a mountain sticker.', location: 'Outside Lab 3', date: 'Today', contact: 'Academic Block reception', resolved: false },
  { id: 2, kind: 'Lost', name: 'Scientific calculator', description: 'Casio FX-991ES Plus with initials AS on the back.', location: 'Central Library', date: 'Yesterday', contact: 'Arjun · Demo contact', resolved: false },
  { id: 3, kind: 'Found', name: 'Student ID card', description: 'ID card belonging to a Semester 3 ECE student.', location: 'College Canteen', date: '16 Aug', contact: 'Canteen counter', resolved: true },
]

const academicResources = [
  { id: 1, title: 'JavaScript Learning Path', category: 'Programming', description: 'A structured progression from syntax to asynchronous JavaScript.', type: 'Guide', url: '' },
  { id: 2, title: 'DSA Pattern Handbook', category: 'DSA', description: 'Common problem-solving patterns with practice prompts.', type: 'PDF', url: '' },
  { id: 3, title: 'Modern React Tutorial', category: 'Web Development', description: 'Components, hooks, state, and practical UI architecture.', type: 'Tutorial', url: 'https://react.dev/learn' },
  { id: 4, title: 'Computer Networks — 2024 Paper', category: 'Question Papers', description: 'Previous-year end-semester question paper.', type: 'PDF', url: '' },
  { id: 5, title: 'Operating Systems Quick Notes', category: 'Subject Notes', description: 'Processes, scheduling, deadlocks, and memory management.', type: 'Notes', url: '' },
  { id: 6, title: 'MDN Web Docs', category: 'Websites', description: 'Reference documentation for HTML, CSS, and JavaScript.', type: 'Website', url: 'https://developer.mozilla.org/' },
] as const

function loadUploadedNotes() {
  try { return JSON.parse(localStorage.getItem('college-adda-uploaded-notes') || '[]') as SharedNote[] }
  catch { return [] }
}
function loadStudyGroups() {
  try { return JSON.parse(localStorage.getItem('college-adda-study-groups') || 'null') as StudyGroup[] || initialStudyGroups }
  catch { return initialStudyGroups }
}
function loadLostFound() {
  try { return JSON.parse(localStorage.getItem('college-adda-lost-found') || 'null') as LostFoundItem[] || initialLostFound }
  catch { return initialLostFound }
}

function downloadDemoResource(fileName: string, title: string) {
  const blob = new Blob([`College Adda demo resource\n\n${title}\n\nThis frontend prototype download represents a sample academic resource. No real university document is included.`], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
  notify('Sample resource downloaded.')
}

function StudentServices() {
  const [tab, setTab] = useState<ServiceTab>('notes')
  const [uploadedNotes, setUploadedNotes] = useState<SharedNote[]>(loadUploadedNotes)
  const [noteSearch, setNoteSearch] = useState('')
  const [noteSemester, setNoteSemester] = useState('All Semesters')
  const [noteDepartment, setNoteDepartment] = useState('All Departments')
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [noteDraft, setNoteDraft] = useState({ title:'', subject:'', semester:'Semester 5', department:'Computer Science' })
  const [noteFile, setNoteFile] = useState<File | null>(null)
  const sessionFiles = useRef<Record<number,File>>({})

  const [groups, setGroups] = useState<StudyGroup[]>(loadStudyGroups)
  const [groupSearch, setGroupSearch] = useState('')
  const [showGroupForm, setShowGroupForm] = useState(false)
  const [groupDraft, setGroupDraft] = useState({ name:'', subject:'', description:'', meeting:'' })

  const [items, setItems] = useState<LostFoundItem[]>(loadLostFound)
  const [itemFilter, setItemFilter] = useState<'All' | 'Lost' | 'Found'>('All')
  const [itemSearch, setItemSearch] = useState('')
  const [showItemForm, setShowItemForm] = useState(false)
  const [itemDraft, setItemDraft] = useState({ kind:'Lost' as 'Lost'|'Found', name:'', description:'', location:'', contact:'' })

  const [resourceSearch, setResourceSearch] = useState('')
  const [resourceCategory, setResourceCategory] = useState('All Resources')

  useEffect(() => { localStorage.setItem('college-adda-uploaded-notes', JSON.stringify(uploadedNotes)) }, [uploadedNotes])
  useEffect(() => { localStorage.setItem('college-adda-study-groups', JSON.stringify(groups)) }, [groups])
  useEffect(() => { localStorage.setItem('college-adda-lost-found', JSON.stringify(items)) }, [items])

  const uploadNote = () => {
    if (!noteDraft.title.trim() || !noteDraft.subject.trim() || !noteFile) {
      notify('Add a title, subject, and local file before uploading.')
      return
    }
    if (noteFile.size > 5_000_000) {
      notify('Demo uploads must be smaller than 5 MB.')
      return
    }
    const id = Date.now()
    const note: SharedNote = {
      id, title: noteDraft.title.trim(), subject: noteDraft.subject.trim(), semester: noteDraft.semester,
      department: noteDraft.department, uploader: 'Arjun Sharma', date: 'Just now',
      type: noteFile.type.includes('pdf') ? 'PDF' : 'DOC', source: 'upload',
      fileName: noteFile.name, fileSize: `${(noteFile.size/1024).toFixed(0)} KB`,
    }
    sessionFiles.current[id] = noteFile
    setUploadedNotes(current => [note,...current])
    setNoteDraft({ title:'',subject:'',semester:'Semester 5',department:'Computer Science' })
    setNoteFile(null)
    setShowNoteForm(false)
    notify('Note metadata saved. The selected file is available only for this browser session.')
  }

  const downloadNote = (note: SharedNote) => {
    if (note.source === 'sample') return downloadDemoResource(note.fileName,note.title)
    const file = sessionFiles.current[note.id]
    if (!file) {
      notify('Uploaded file contents are session-only. Re-select the file to download it again.')
      return
    }
    const url = URL.createObjectURL(file)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = file.name
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const createGroup = () => {
    if (!groupDraft.name.trim() || !groupDraft.subject.trim() || !groupDraft.description.trim()) {
      notify('Complete the group name, subject, and description.')
      return
    }
    setGroups(current => [{ id:Date.now(), name:groupDraft.name.trim(), subject:groupDraft.subject.trim(), description:groupDraft.description.trim(), meeting:groupDraft.meeting.trim() || 'Schedule to be decided', members:1, joined:true },...current])
    setGroupDraft({name:'',subject:'',description:'',meeting:''})
    setShowGroupForm(false)
    notify('Study group created and added to your joined groups.')
  }

  const createItem = () => {
    if (!itemDraft.name.trim() || !itemDraft.description.trim() || !itemDraft.location.trim() || !itemDraft.contact.trim()) {
      notify('Complete all lost-and-found fields.')
      return
    }
    setItems(current => [{ id:Date.now(), ...itemDraft, name:itemDraft.name.trim(), description:itemDraft.description.trim(), location:itemDraft.location.trim(), contact:itemDraft.contact.trim(), date:'Just now', resolved:false },...current])
    setItemDraft({kind:'Lost',name:'',description:'',location:'',contact:''})
    setShowItemForm(false)
    notify(`${itemDraft.kind} item posted successfully.`)
  }

  const notes = [...uploadedNotes,...sampleNotes]
  const visibleNotes = notes.filter(note => `${note.title} ${note.subject}`.toLowerCase().includes(noteSearch.toLowerCase()) && (noteSemester === 'All Semesters' || note.semester === noteSemester) && (noteDepartment === 'All Departments' || note.department === noteDepartment))
  const visibleGroups = groups.filter(group => `${group.name} ${group.subject}`.toLowerCase().includes(groupSearch.toLowerCase()))
  const visibleItems = items.filter(item => (itemFilter === 'All' || item.kind === itemFilter) && `${item.name} ${item.description} ${item.location}`.toLowerCase().includes(itemSearch.toLowerCase()))
  const resourceCategories = ['All Resources','Programming','DSA','Web Development','Question Papers','Subject Notes','Websites']
  const visibleResources = academicResources.filter(resource => (resourceCategory === 'All Resources' || resource.category === resourceCategory) && `${resource.title} ${resource.description}`.toLowerCase().includes(resourceSearch.toLowerCase()))

  return <AppShell page="services" title="Student Services">
    <section className="services-hero"><div><span>STUDENT SERVICES HUB</span><h1>Everything you need to study, connect, and get help.</h1><p>Student-powered resources and practical campus services in one place.</p></div><div><b>{notes.length}</b><span>shared notes</span></div><div><b>{groups.filter(group=>group.joined).length}</b><span>joined groups</span></div><div><b>{items.filter(item=>!item.resolved).length}</b><span>open items</span></div></section>
    <nav className="services-tabs">{([['notes','Notes Sharing','book'],['groups','Study Groups','users'],['lost','Lost & Found','search'],['resources','Academic Resources','services']] as [ServiceTab,string,keyof typeof paths][]).map(([id,label,icon])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><Icon name={icon} size={17}/>{label}</button>)}</nav>

    {tab==='notes' && <section className="service-section">
      <div className="service-toolbar"><div><span>NOTES LIBRARY</span><h2>Shared study notes</h2><p>Sample resources and student-uploaded file metadata.</p></div><button className="service-primary" onClick={()=>setShowNoteForm(value=>!value)}>{showNoteForm?'Cancel upload':'Upload notes'}</button></div>
      {showNoteForm && <div className="service-form note-upload-form"><div><label>Note title<input value={noteDraft.title} onChange={event=>setNoteDraft({...noteDraft,title:event.target.value})} placeholder="e.g. DBMS Unit 4 Notes"/></label><label>Subject<input value={noteDraft.subject} onChange={event=>setNoteDraft({...noteDraft,subject:event.target.value})} placeholder="Subject name"/></label></div><div><label>Semester<select value={noteDraft.semester} onChange={event=>setNoteDraft({...noteDraft,semester:event.target.value})}>{['Semester 1','Semester 3','Semester 5','Semester 7'].map(value=><option key={value}>{value}</option>)}</select></label><label>Department<select value={noteDraft.department} onChange={event=>setNoteDraft({...noteDraft,department:event.target.value})}>{['Computer Science','Electronics','Mechanical Engineering'].map(value=><option key={value}>{value}</option>)}</select></label></div><label className="file-picker">Local file<input type="file" accept=".pdf,.doc,.docx,.txt" onChange={event=>setNoteFile(event.target.files?.[0] || null)}/><small>{noteFile?`${noteFile.name} · ${(noteFile.size/1024).toFixed(0)} KB`:'PDF, DOC, DOCX or TXT · Max 5 MB'}</small></label><div className="demo-limit"><Icon name="bell" size={15}/><p>Demo limitation: file metadata persists, but local file contents are available only until you leave or refresh this module.</p></div><button className="service-primary" onClick={uploadNote}>Save demo upload</button></div>}
      <div className="service-filters"><label><Icon name="search" size={16}/><input value={noteSearch} onChange={event=>setNoteSearch(event.target.value)} placeholder="Search by title or subject"/></label><select value={noteSemester} onChange={event=>setNoteSemester(event.target.value)}>{['All Semesters','Semester 1','Semester 3','Semester 5','Semester 7'].map(value=><option key={value}>{value}</option>)}</select><select value={noteDepartment} onChange={event=>setNoteDepartment(event.target.value)}>{['All Departments','Computer Science','Electronics','Mechanical Engineering'].map(value=><option key={value}>{value}</option>)}</select></div>
      <div className="note-list">{visibleNotes.length?visibleNotes.map(note=><article className="service-card note-card" key={note.id}><span className={`file-type ${note.type.toLowerCase()}`}>{note.type}</span><div><span>{note.subject} · {note.semester}</span><h3>{note.title}</h3><p>{note.department}</p><small>By {note.uploader} · {note.date}{note.fileSize?` · ${note.fileSize}`:''}</small></div><div><b>{note.source==='sample'?'DEMO RESOURCE':'LOCAL UPLOAD'}</b><button onClick={()=>downloadNote(note)}>Download</button></div></article>):<ServiceEmpty text="No notes match these filters."/>}</div>
    </section>}

    {tab==='groups' && <section className="service-section">
      <div className="service-toolbar"><div><span>STUDY TOGETHER</span><h2>Discover study groups</h2><p>Join simulated student groups or create your own.</p></div><button className="service-primary" onClick={()=>setShowGroupForm(value=>!value)}>{showGroupForm?'Cancel':'Create group'}</button></div>
      {showGroupForm && <div className="service-form"><div><label>Group name<input value={groupDraft.name} onChange={event=>setGroupDraft({...groupDraft,name:event.target.value})} placeholder="Group name"/></label><label>Subject<input value={groupDraft.subject} onChange={event=>setGroupDraft({...groupDraft,subject:event.target.value})} placeholder="Primary subject"/></label></div><label>Description<textarea value={groupDraft.description} onChange={event=>setGroupDraft({...groupDraft,description:event.target.value})} placeholder="What will your group study?"/></label><label>Meeting plan<input value={groupDraft.meeting} onChange={event=>setGroupDraft({...groupDraft,meeting:event.target.value})} placeholder="e.g. Friday · Library"/></label><button className="service-primary" onClick={createGroup}>Create study group</button></div>}
      <div className="service-filters single"><label><Icon name="search" size={16}/><input value={groupSearch} onChange={event=>setGroupSearch(event.target.value)} placeholder="Search groups by subject"/></label><span>{groups.filter(group=>group.joined).length} groups joined</span></div>
      <div className="group-grid">{visibleGroups.length?visibleGroups.map(group=><article className={`service-card group-card ${group.joined?'joined':''}`} key={group.id}><div className="group-card-head"><span><Icon name="users"/></span><b>{group.joined?'JOINED':'OPEN GROUP'}</b></div><small>{group.subject}</small><h3>{group.name}</h3><p>{group.description}</p><div><span><strong>{group.members}</strong> members</span><span>{group.meeting}</span></div><button onClick={()=>setGroups(current=>current.map(item=>item.id===group.id?{...item,joined:!item.joined,members:item.members+(item.joined?-1:1)}:item))}>{group.joined?'Leave group':'Join group'}</button></article>):<ServiceEmpty text="No study groups match your search."/>}</div>
    </section>}

    {tab==='lost' && <section className="service-section">
      <div className="service-toolbar"><div><span>CAMPUS HELP DESK</span><h2>Lost & Found</h2><p>Community-reported items with demo contact information.</p></div><button className="service-primary" onClick={()=>setShowItemForm(value=>!value)}>{showItemForm?'Cancel':'Post an item'}</button></div>
      {showItemForm && <div className="service-form"><div><label>Post type<select value={itemDraft.kind} onChange={event=>setItemDraft({...itemDraft,kind:event.target.value as 'Lost'|'Found'})}><option>Lost</option><option>Found</option></select></label><label>Item name<input value={itemDraft.name} onChange={event=>setItemDraft({...itemDraft,name:event.target.value})} placeholder="Item name"/></label></div><label>Description<textarea value={itemDraft.description} onChange={event=>setItemDraft({...itemDraft,description:event.target.value})} placeholder="Color, identifying details, etc."/></label><div><label>Location<input value={itemDraft.location} onChange={event=>setItemDraft({...itemDraft,location:event.target.value})} placeholder="Where was it lost/found?"/></label><label>Demo contact<input value={itemDraft.contact} onChange={event=>setItemDraft({...itemDraft,contact:event.target.value})} placeholder="e.g. Library desk"/></label></div><button className="service-primary" onClick={createItem}>Publish item</button></div>}
      <div className="service-filters single"><label><Icon name="search" size={16}/><input value={itemSearch} onChange={event=>setItemSearch(event.target.value)} placeholder="Search items or locations"/></label><div className="lost-filter">{(['All','Lost','Found'] as const).map(value=><button key={value} className={itemFilter===value?'active':''} onClick={()=>setItemFilter(value)}>{value}</button>)}</div></div>
      <div className="lost-list">{visibleItems.length?visibleItems.map(item=><article className={`service-card lost-card ${item.resolved?'resolved':''}`} key={item.id}><span className={item.kind.toLowerCase()}>{item.kind}</span><div><h3>{item.name}</h3><p>{item.description}</p><small><b>Location:</b> {item.location} · {item.date}</small><small><b>Contact:</b> {item.contact}</small></div><button disabled={item.resolved} onClick={()=>setItems(current=>current.map(entry=>entry.id===item.id?{...entry,resolved:true}:entry))}>{item.resolved?'Resolved':'Mark resolved'}</button></article>):<ServiceEmpty text="No lost-and-found posts match your search."/>}</div>
    </section>}

    {tab==='resources' && <section className="service-section">
      <div className="service-toolbar"><div><span>ACADEMIC LIBRARY</span><h2>Learning resources</h2><p>Curated demo guides, tutorials, papers, notes, and websites.</p></div></div>
      <div className="service-filters single"><label><Icon name="search" size={16}/><input value={resourceSearch} onChange={event=>setResourceSearch(event.target.value)} placeholder="Search academic resources"/></label></div>
      <nav className="resource-categories">{resourceCategories.map(value=><button key={value} className={resourceCategory===value?'active':''} onClick={()=>setResourceCategory(value)}>{value}</button>)}</nav>
      <div className="resource-grid">{visibleResources.length?visibleResources.map(resource=><article className="service-card resource-card" key={resource.id}><span><Icon name={resource.category==='Websites'?'share':'book'}/></span><small>{resource.category} · {resource.type}</small><h3>{resource.title}</h3><p>{resource.description}</p><button onClick={()=>resource.url?window.open(resource.url,'_blank','noopener,noreferrer'):downloadDemoResource(`${resource.title.toLowerCase().split(' ').join('-')}.txt`,resource.title)}>{resource.url?'Open website':'Download demo'} <Icon name="arrow" size={14}/></button></article>):<ServiceEmpty text="No academic resources match these filters."/>}</div>
    </section>}
  </AppShell>
}

function ServiceEmpty({ text }: { text: string }) {
  return <div className="service-empty"><span><Icon name="search" size={23}/></span><strong>Nothing found</strong><p>{text}</p></div>
}

type ProfileDetails = { email: string; phone: string; birthDate: string; department: string; academicYear: string }

function loadProfileDetails(): ProfileDetails {
  const fallback = { email: 'arjun.s@college.edu', phone: '+91 98765 43210', birthDate: '14 September 2004', department: 'Computer Science', academicYear: '2025–26' }
  try {
    const saved = localStorage.getItem('college-adda-profile')
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback
  } catch {
    return fallback
  }
}

function Profile() {
  const [details, setDetails] = useState<ProfileDetails>(loadProfileDetails)
  const [draft, setDraft] = useState<ProfileDetails>(details)
  const [editing, setEditing] = useState(false)
  const beginEdit = () => { setDraft(details); setEditing(true) }
  const cancelEdit = () => { setDraft(details); setEditing(false) }
  const saveProfile = () => {
    if (!draft.email.includes('@') || !draft.phone.trim()) {
      notify('Enter a valid email address and phone number.')
      return
    }
    setDetails(draft)
    localStorage.setItem('college-adda-profile', JSON.stringify(draft))
    setEditing(false)
    notify('Profile details saved locally.')
  }
  const fields: { label: string; key?: keyof ProfileDetails; value?: string }[] = [
    { label: 'STUDENT ID', value: 'CA2023CS184' },
    { label: 'EMAIL ADDRESS', key: 'email' },
    { label: 'PHONE NUMBER', key: 'phone' },
    { label: 'DATE OF BIRTH', key: 'birthDate' },
    { label: 'DEPARTMENT', key: 'department' },
    { label: 'ACADEMIC YEAR', key: 'academicYear' },
  ]
  return <AppShell page="profile" title="My Profile">
    <section className="profile-cover"><div className="cover-pattern"/><div className="profile-id"><Avatar initials="AS" color="blue" size="lg"/><div><span>STUDENT PROFILE</span><h1>Arjun Sharma</h1><p>B.Tech Computer Science & Engineering · Semester 5</p></div><button onClick={editing ? cancelEdit : beginEdit}>{editing ? 'Cancel editing' : 'Edit profile'}</button></div></section>
    <div className="profile-grid">
      <section className="panel personal-info"><div className="panel-head"><div><span>ABOUT YOU</span><h3>Personal information</h3></div><button onClick={editing ? cancelEdit : beginEdit}>{editing ? 'Cancel' : 'Edit'}</button></div>
        <div className={`info-grid ${editing ? 'editing' : ''}`}>{fields.map(field => <div key={field.label}><small>{field.label}</small>{editing && field.key ? <input aria-label={field.label} value={draft[field.key]} onChange={event => setDraft(current => ({ ...current, [field.key as keyof ProfileDetails]: event.target.value }))}/> : <strong>{field.key ? details[field.key] : field.value}</strong>}</div>)}</div>
        {editing && <div className="profile-edit-actions"><button onClick={cancelEdit}>Cancel</button><button onClick={saveProfile}>Save changes</button></div>}
      </section>
      <section className="panel attendance-card"><div className="panel-head"><div><span>CURRENT SEMESTER</span><h3>Attendance</h3></div></div><div className="attendance-ring"><div><strong>86%</strong><small>Overall</small></div></div><p><span><i className="good"/>Present <b>68</b></span><span><i className="bad"/>Absent <b>11</b></span></p><small className="safe">You’re safely above the 75% requirement.</small></section>
    </div>
    <section className="panel academic"><div className="panel-head"><div><span>SEMESTER 5</span><h3>Academic overview</h3></div><button onClick={() => notify('Your semester report card is ready with an 8.7 CGPA.')} >View report card <Icon name="arrow" size={15}/></button></div>
      <div className="academic-stats"><div><span>CGPA</span><strong>8.7</strong><small>Top 18% of class</small></div><div><span>CREDITS EARNED</span><strong>92</strong><small>of 160 total</small></div><div><span>ASSIGNMENTS</span><strong>24/28</strong><small>Submitted on time</small></div><div><span>CLASS RANK</span><strong>#12</strong><small>of 124 students</small></div></div>
    </section>
  </AppShell>
}

export default function App() {
  const getPage = () => {
    const hash = window.location.hash.slice(1) as Page
    return ['dashboard','social','services','campus','canteen','games','profile'].includes(hash) ? hash : 'home'
  }
  const [page, setPage] = useState<Page>(getPage)
  useEffect(() => { const update=()=>setPage(getPage()); window.addEventListener('hashchange',update); return()=>window.removeEventListener('hashchange',update) }, [])
  let content: ReactNode = <Landing />
  if (page === 'dashboard') content = <Dashboard />
  if (page === 'social') content = <SocialHub />
  if (page === 'services') content = <StudentServices />
  if (page === 'campus') content = <VirtualCampus />
  if (page === 'canteen') content = <VirtualCampus initialOverlay="canteen" />
  if (page === 'games') content = <GamingZone />
  if (page === 'profile') content = <Profile />
  return <><GlobalNotice />{content}</>
}
