import React, { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Users, UserCog, CreditCard, ShoppingCart, LogIn, LogOut, Coffee, Sandwich, CupSoda, Star, Shield, Monitor, Plus, Minus, Search, Menu, Clock, BadgeCheck } from 'lucide-react'
import Spline from '@splinetool/react-spline'
import './index.css'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const palette = {
  bg: 'from-[#0b0b1a] via-[#0a0820] to-[#050513]',
  card: 'bg-[#0e0c1f]/80 backdrop-blur',
  border: 'border border-white/10',
  text: 'text-white/90',
  accent: 'text-[#a78bfa]',
  neon: 'text-[#7c3aed]',
}

function GradientBackground({ children }) {
  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${palette.bg} relative overflow-hidden`}> 
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.2),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(236,72,153,0.15),transparent_40%)]" />
      <div className="absolute inset-0 opacity-20">
        <Spline scene="https://prod.spline.design/sHDPSbszZja1qap3/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 shadow shadow-purple-500/30" />
      <div>
        <p className="text-white font-bold tracking-wide">Aradabiya</p>
        <p className="text-xs text-white/60 -mt-1">Cafenet Management</p>
      </div>
    </div>
  )
}

function Navbar({ onLogout, role }) {
  return (
    <div className="sticky top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Brand />
        <div className="flex items-center gap-6 text-white/80">
          <Link to="/" className="hover:text-white flex items-center gap-2"><Home size={18}/> Home</Link>
          {role && <span className="px-2 py-1 text-xs rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30">{role.toUpperCase()}</span>}
          {onLogout && (
            <button onClick={onLogout} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-white">
              <LogOut size={16}/> Logout
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function AuthGuard({ children, allow }){
  const user = JSON.parse(localStorage.getItem('aradabiya_user')||'null')
  if(!user || (allow && !allow.includes(user.role))) return <Navigate to="/login" replace />
  return children
}

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleLogin(e){
    e.preventDefault()
    setError('')
    try{
      const res = await fetch(`${API}/auth/login`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username, password})})
      if(!res.ok) throw new Error('Gagal login')
      const data = await res.json()
      localStorage.setItem('aradabiya_user', JSON.stringify(data))
      if(data.role === 'admin') navigate('/admin')
      else if(data.role === 'staff') navigate('/staff')
      else navigate('/customer')
    }catch(err){
      setError('Username atau password salah')
    }
  }

  return (
    <GradientBackground>
      <div className="max-w-md mx-auto pt-20 pb-10">
        <div className={`${palette.card} ${palette.border} p-6 rounded-2xl shadow-xl`}> 
          <div className="text-center mb-6">
            <Brand />
            <p className="mt-4 text-white/70">Masuk untuk mengelola Aradabiya</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
            <input type="password" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"><LogIn size={18}/> Masuk</button>
          </form>
        </div>
      </div>
    </GradientBackground>
  )
}

function Layout({ children }){
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('aradabiya_user')||'null')
  function onLogout(){ localStorage.removeItem('aradabiya_user'); navigate('/login') }
  return (
    <GradientBackground>
      <Navbar onLogout={onLogout} role={user?.role} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </GradientBackground>
  )
}

function StatCard({ title, value, icon:Icon, badge }){
  return (
    <div className={`${palette.card} ${palette.border} rounded-2xl p-5 hover:bg-white/10 transition`}> 
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
          <Icon size={20}/>
        </div>
      </div>
      {badge && <span className="mt-3 inline-block text-xs px-2 py-1 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30">{badge}</span>}
    </div>
  )
}

function DataTable({ columns, data }){
  return (
    <div className={`${palette.card} ${palette.border} rounded-2xl overflow-hidden`}> 
      <table className="w-full text-left">
        <thead className="bg-white/5 text-white/70">
          <tr>
            {columns.map(col => <th key={col.key} className="px-4 py-3 text-sm font-medium">{col.label}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-white/5">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-white/80">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Admin Overview
function AdminDashboard(){
  const [overview, setOverview] = useState(null)

  useEffect(()=>{
    fetch(`${API}/admin/overview`).then(r=>r.json()).then(setOverview)
  },[])

  if(!overview) return <Layout><p className="text-white/70">Loading dashboard...</p></Layout>

  return (
    <Layout>
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Customer" value={overview.customers.length} icon={Users} />
        <StatCard title="Staff" value={overview.staff.length} icon={UserCog} />
        <StatCard title="Ruang Tersedia (Reg)" value={overview.available_rooms.regular} icon={Monitor} />
        <StatCard title="Ruang Tersedia (Prem)" value={overview.available_rooms.premium} icon={Star} />
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-white/80 mb-3 font-semibold">Akun Customer</h3>
          <DataTable columns={[
            {key:'name', label:'Nama'},
            {key:'username', label:'Username'},
          ]} data={overview.customers} />
        </div>
        <div>
          <h3 className="text-white/80 mb-3 font-semibold">Akun Staff</h3>
          <DataTable columns={[
            {key:'name', label:'Nama'},
            {key:'username', label:'Username'},
          ]} data={overview.staff} />
        </div>
        <div>
          <h3 className="text-white/80 mb-3 font-semibold">Transaksi Terkini</h3>
          <DataTable columns={[
            {key:'created_at', label:'Waktu'},
            {key:'total', label:'Total'},
            {key:'payment_code', label:'Kode'},
          ]} data={overview.recent} />
        </div>
        <div>
          <h3 className="text-white/80 mb-3 font-semibold">Ruangan</h3>
          <DataTable columns={[
            {key:'name', label:'Nama'},
            {key:'room_type', label:'Tipe', render:(v)=> <span className={`px-2 py-1 rounded-full text-xs border ${v==='premium'?'bg-purple-600/20 text-purple-300 border-purple-500/40':'bg-blue-600/20 text-blue-300 border-blue-500/40'}`}>{v}</span>},
            {key:'is_occupied', label:'Status', render:(v)=> <span className={`px-2 py-1 rounded-full text-xs border ${v?'bg-red-600/20 text-red-300 border-red-500/40':'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'}`}>{v?'Dipakai':'Kosong'}</span>},
          ]} data={overview.rooms} />
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          {label:'Kelola Ruangan', icon: Monitor, to:'/admin/rooms'},
          {label:'Kelola Staff', icon: UserCog, to:'/admin/staff'},
          {label:'Kelola Customer', icon: Users, to:'/admin/customers'},
          {label:'Lihat Semua Transaksi', icon: CreditCard, to:'/admin/transactions'},
          {label:'Isi Billing', icon: Clock, to:'/staff/billing'},
        ].map((b)=> (
          <Link key={b.label} to={b.to} className={`${palette.card} ${palette.border} rounded-xl px-4 py-3 text-white/80 hover:bg-white/10 flex items-center gap-2`}>
            <b.icon size={18}/> {b.label}
          </Link>
        ))}
      </div>
    </Layout>
  )
}

// Staff
function StaffDashboard(){
  const [customers, setCustomers] = useState([])
  const [rooms, setRooms] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [packageType, setPackageType] = useState('regular')
  const [hours, setHours] = useState(2)

  useEffect(()=>{
    fetch(`${API}/users?role=customer`).then(r=>r.json()).then(setCustomers)
    fetch(`${API}/rooms`).then(r=>r.json()).then(setRooms)
  },[])

  async function createBilling(){
    if(!selectedCustomer || !selectedRoom) return
    await fetch(`${API}/billing`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({customer_id:selectedCustomer, room_id:selectedRoom, package: packageType, duration_hours: hours})})
    alert('Billing dibuat!')
  }

  return (
    <Layout>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className={`${palette.card} ${palette.border} rounded-2xl p-6`}>
          <h3 className="text-white font-semibold mb-4">Isi Billing</h3>
          <div className="space-y-3">
            <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" value={selectedCustomer} onChange={e=>setSelectedCustomer(e.target.value)}>
              <option value="">Pilih Customer</option>
              {customers.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" value={selectedRoom} onChange={e=>setSelectedRoom(e.target.value)}>
              <option value="">Pilih Ruangan</option>
              {rooms.filter(r=>!r.is_occupied).map(r=> <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <div className="flex items-center gap-3">
              <button onClick={()=>setPackageType('regular')} className={`px-3 py-2 rounded-lg border ${packageType==='regular'?'bg-blue-600/20 text-blue-300 border-blue-500/40':'bg-white/5 text-white/70 border-white/10'}`}>Regular</button>
              <button onClick={()=>setPackageType('premium')} className={`px-3 py-2 rounded-lg border ${packageType==='premium'?'bg-purple-600/20 text-purple-300 border-purple-500/40':'bg-white/5 text-white/70 border-white/10'}`}>Premium</button>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={()=>setHours(Math.max(1,hours-1))} className="px-2 py-2 rounded-lg bg-white/5 text-white/70 border border-white/10"><Minus size={16}/></button>
              <span className="text-white">{hours} jam</span>
              <button onClick={()=>setHours(hours+1)} className="px-2 py-2 rounded-lg bg-white/5 text-white/70 border border-white/10"><Plus size={16}/></button>
            </div>
            <button onClick={createBilling} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg">Buat Billing</button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-white/80 mb-3 font-semibold">Akun Customer</h3>
          <DataTable columns={[{key:'name', label:'Nama'},{key:'username', label:'Username'}]} data={customers} />
        </div>
      </div>
    </Layout>
  )
}

// Customer
function ProductCard({ p, add }){
  return (
    <div className={`${palette.card} ${palette.border} rounded-2xl overflow-hidden`}> 
      <img src={`${p.image}?auto=format&fit=crop&w=600&q=60`} alt={p.title} className="h-36 w-full object-cover" />
      <div className="p-4">
        <p className="text-white font-semibold">{p.title}</p>
        <p className="text-white/60 text-sm mt-1">Rp {p.price.toLocaleString('id-ID')}</p>
        <button onClick={()=>add(p)} className="mt-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg py-2 flex items-center justify-center gap-2"><ShoppingCart size={16}/> Tambah ke Keranjang</button>
      </div>
    </div>
  )
}

function CustomerDashboard(){
  const [billing, setBilling] = useState(null)
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('makanan')
  const [cart, setCart] = useState([])
  const user = JSON.parse(localStorage.getItem('aradabiya_user')||'null')

  useEffect(()=>{
    fetch(`${API}/billing?customer_id=${user?.id}&active=true`).then(r=>r.json()).then(d=>setBilling(d[0]||null))
  },[])

  useEffect(()=>{ fetch(`${API}/products?category=${category}`).then(r=>r.json()).then(setProducts) },[category])

  function addToCart(p){
    setCart(prev => {
      const idx = prev.findIndex(i=>i.id===p.id)
      if(idx>=0){ const copy=[...prev]; copy[idx].qty+=1; return copy }
      return [...prev, {id:p.id, title:p.title, price:p.price, qty:1}]
    })
  }

  async function checkout(){
    const items = cart.map(c=>({product_id:c.id, qty:c.qty}))
    const res = await fetch(`${API}/checkout`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({customer_id:user?.id, items})})
    const data = await res.json()
    alert(`Kode Pembayaran: ${data.payment_code}\nTotal: Rp ${data.total.toLocaleString('id-ID')}`)
    setCart([])
  }

  return (
    <Layout>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className={`${palette.card} ${palette.border} rounded-2xl p-6`}>
          <h3 className="text-white font-semibold">Status Pemakaian</h3>
          {billing ? (
            <div className="mt-3 space-y-2 text-white/80">
              <div className="flex items-center justify-between"><span>Paket</span><span className="px-2 py-1 rounded-full text-xs border bg-purple-600/20 text-purple-300 border-purple-500/40">{billing.package}</span></div>
              <div className="flex items-center justify-between"><span>Sisa Waktu</span><span>{billing.remaining_hours} jam</span></div>
              <div className="flex items-center justify-between"><span>Lokasi</span><span>{billing.room_id}</span></div>
            </div>
          ) : (
            <p className="text-white/60 mt-3">Belum ada billing aktif</p>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="flex gap-3 mb-4">
            {['makanan','minuman','cemilan'].map(cat => (
              <button key={cat} onClick={()=>setCategory(cat)} className={`px-4 py-2 rounded-full border ${category===cat?'bg-purple-600/20 text-purple-300 border-purple-500/40':'bg-white/5 text-white/70 border-white/10'}`}>{cat[0].toUpperCase()+cat.slice(1)}</button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map(p=> <ProductCard key={p.id} p={p} add={addToCart} />)}
          </div>
        </div>
      </div>

      <div className="mt-8 ${palette.card} ${palette.border} rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><ShoppingCart size={18}/> Keranjang</h3>
        {cart.length===0 ? (
          <p className="text-white/60">Keranjang kosong</p>
        ) : (
          <div className="space-y-2">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between text-white/80">
                <div>{item.title}</div>
                <div className="flex items-center gap-3">
                  <div className="text-white/60">x{item.qty}</div>
                  <div>Rp {(item.price*item.qty).toLocaleString('id-ID')}</div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-white">
              <div>Total</div>
              <div>Rp {cart.reduce((a,c)=>a+c.price*c.qty,0).toLocaleString('id-ID')}</div>
            </div>
            <button onClick={checkout} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg">Checkout & Dapatkan Kode</button>
          </div>
        )}
      </div>
    </Layout>
  )
}

function HomeHero(){
  const navigate = useNavigate()
  return (
    <GradientBackground>
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">Aradabiya
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Cafenet Management</span>
            </h1>
            <p className="mt-4 text-white/70">UI/UX premium bergaya neon tech-café. Kelola ruangan, billing, staff, dan menu dengan visual futuristik.</p>
            <div className="mt-8 flex gap-3">
              <button onClick={()=>navigate('/login')} className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center gap-2"><LogIn size={18}/> Masuk</button>
              <a href="https://www.pinterest.com" target="_blank" className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">Lihat Referensi</a>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/20">
            <Spline scene="https://prod.spline.design/sHDPSbszZja1qap3/scene.splinecode" style={{ width: '100%', height: '480px' }} />
          </div>
        </div>
      </div>
    </GradientBackground>
  )
}

function AppRouter(){
  return (
    <Routes>
      <Route path="/" element={<HomeHero />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AuthGuard allow={['admin']}><AdminDashboard/></AuthGuard>} />
      <Route path="/staff" element={<AuthGuard allow={['staff']}><StaffDashboard/></AuthGuard>} />
      <Route path="/customer" element={<AuthGuard allow={['customer']}><CustomerDashboard/></AuthGuard>} />
    </Routes>
  )
}

export default function App(){
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}
