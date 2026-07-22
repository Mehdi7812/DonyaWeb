// app/composables/useDashboard.js
// منبع داده موقت پنل کاربری — بعداً باید با API واقعی (احراز هویت، بیلینگ، تیکتینگ) جایگزین شود.

const user = {
  name: 'علی محمدی',
  email: 'ali.mohammadi@example.com',
  phone: '۰۹۱۲۳۴۵۶۷۸۹',
  initials: 'ع.م',
  joinDate: '۱۴۰۲/۰۵/۱۰',
  company: 'فروشگاه دیجی‌کالا کوچک'
}

const services = [
  {
    id: 'srv-1001',
    type: 'hosting',
    typeLabel: 'هاست ابری',
    name: 'هاست حرفه‌ای',
    identifier: 'example.ir',
    status: 'active',
    renewDate: '۱۴۰۳/۰۹/۱۵',
    price: '۱۲۹,۰۰۰',
    cycle: 'ماهانه'
  },
  {
    id: 'srv-1002',
    type: 'vps',
    typeLabel: 'VPS ابری',
    name: 'VPS 2',
    identifier: '185.231.XX.XX',
    status: 'active',
    renewDate: '۱۴۰۳/۰۸/۰۲',
    price: '۴۹۰,۰۰۰',
    cycle: 'ماهانه'
  },
  {
    id: 'srv-1003',
    type: 'domain',
    typeLabel: 'دامنه',
    name: 'example.com',
    identifier: 'example.com',
    status: 'expiring',
    renewDate: '۱۴۰۳/۰۷/۲۸',
    price: '۸۹,۰۰۰',
    cycle: 'سالانه'
  },
  {
    id: 'srv-1004',
    type: 'hosting',
    typeLabel: 'هاست ابری',
    name: 'هاست پایه',
    identifier: 'myblog.ir',
    status: 'suspended',
    renewDate: '۱۴۰۳/۰۶/۰۱',
    price: '۴۹,۰۰۰',
    cycle: 'ماهانه'
  },
  {
    id: 'srv-1005',
    type: 'domain',
    typeLabel: 'دامنه',
    name: 'shop-example.ir',
    identifier: 'shop-example.ir',
    status: 'active',
    renewDate: '۱۴۰۴/۰۲/۱۰',
    price: '۴۵,۰۰۰',
    cycle: 'سالانه'
  }
]

const invoices = [
  { id: 'INV-1042', service: 'هاست حرفه‌ای', amount: '۱۲۹,۰۰۰', date: '۱۴۰۳/۰۴/۱۵', status: 'paid' },
  { id: 'INV-1041', service: 'VPS 2', amount: '۴۹۰,۰۰۰', date: '۱۴۰۳/۰۴/۰۲', status: 'paid' },
  { id: 'INV-1040', service: 'example.com', amount: '۸۹,۰۰۰', date: '۱۴۰۳/۰۳/۲۸', status: 'pending' },
  { id: 'INV-1039', service: 'هاست پایه', amount: '۴۹,۰۰۰', date: '۱۴۰۳/۰۳/۰۱', status: 'failed' },
  { id: 'INV-1038', service: 'shop-example.ir', amount: '۴۵,۰۰۰', date: '۱۴۰۳/۰۲/۱۰', status: 'paid' },
  { id: 'INV-1037', service: 'هاست حرفه‌ای', amount: '۱۲۹,۰۰۰', date: '۱۴۰۳/۰۳/۱۵', status: 'paid' }
]

const tickets = [
  {
    id: 'TCK-501',
    subject: 'مشکل در اتصال SSH به VPS',
    department: 'پشتیبانی فنی',
    status: 'open',
    priority: 'high',
    date: '۱۴۰۳/۰۴/۱۸',
    messages: [
      { from: 'user', name: 'علی محمدی', text: 'سلام، از دیروز نمی‌تونم با SSH به VPS خودم وصل بشم. خطای Connection Refused می‌گیرم.', date: '۱۴۰۳/۰۴/۱۸ - ۱۰:۲۰' },
      { from: 'support', name: 'رضا کریمی', text: 'سلام وقت بخیر، در حال بررسی سرویس شما هستیم. لطفاً چند دقیقه صبر کنید.', date: '۱۴۰۳/۰۴/۱۸ - ۱۱:۰۵' }
    ]
  },
  {
    id: 'TCK-498',
    subject: 'سوال درباره ارتقا پلن هاست',
    department: 'فروش و سفارش‌ها',
    status: 'answered',
    priority: 'normal',
    date: '۱۴۰۳/۰۴/۱۰',
    messages: [
      { from: 'user', name: 'علی محمدی', text: 'می‌خوام از پلن پایه به حرفه‌ای ارتقا بدم، هزینه اضافه چقدر می‌شه؟', date: '۱۴۰۳/۰۴/۱۰ - ۰۹:۱۵' },
      { from: 'support', name: 'مریم رضایی', text: 'سلام، هزینه ارتقا به‌صورت تناسبی محاسبه و در فاکتور بعدی اعمال می‌شود. می‌تونید از پنل سرویس‌ها اقدام کنید.', date: '۱۴۰۳/۰۴/۱۰ - ۱۰:۴۰' }
    ]
  },
  {
    id: 'TCK-490',
    subject: 'درخواست فاکتور رسمی',
    department: 'مالی و صورت‌حساب',
    status: 'closed',
    priority: 'low',
    date: '۱۴۰۳/۰۳/۲۰',
    messages: [
      { from: 'user', name: 'علی محمدی', text: 'برای فاکتور INV-1037 نیاز به فاکتور رسمی با کد اقتصادی دارم.', date: '۱۴۰۳/۰۳/۲۰ - ۱۴:۰۰' },
      { from: 'support', name: 'رضا کریمی', text: 'فاکتور رسمی صادر و به ایمیل شما ارسال شد.', date: '۱۴۰۳/۰۳/۲۱ - ۰۹:۳۰' }
    ]
  }
]

const wallet = {
  balance: 350000,
  history: [
    { id: 'TXN-2201', type: 'topup', amount: 200000, date: '۱۴۰۳/۰۴/۱۲', status: 'paid', method: 'کارت بانکی' },
    { id: 'TXN-2198', type: 'topup', amount: 150000, date: '۱۴۰۳/۰۳/۲۰', status: 'paid', method: 'درگاه زرین‌پال' },
    { id: 'TXN-2190', type: 'usage', amount: -89000, date: '۱۴۰۳/۰۳/۲۸', status: 'paid', method: 'پرداخت فاکتور example.com' }
  ]
}

const giftCards = [
  { code: 'DWGIFT-2K9X-7QRT', amount: 100000, status: 'active', issuedDate: '۱۴۰۳/۰۲/۰۵' },
  { code: 'DWGIFT-8M3P-1LZS', amount: 50000, status: 'used', issuedDate: '۱۴۰۲/۱۱/۱۸' }
]

// جزئیات تکمیلی دامنه‌ها (تنظیمات قفل/حریم‌خصوصی/تمدید خودکار/نیم‌سرورها)
const domainDetails = {
  'example.com': {
    autoRenew: true,
    locked: true,
    privacy: true,
    nameservers: ['ns1.donyaweb.ir', 'ns2.donyaweb.ir']
  },
  'shop-example.ir': {
    autoRenew: true,
    locked: true,
    privacy: false,
    nameservers: ['ns1.donyaweb.ir', 'ns2.donyaweb.ir']
  }
}

// وضعیت انتقال‌های دامنه در جریان
const domainTransfers = [
  { id: 'TRF-301', domain: 'oldproject.com', status: 'pending', date: '۱۴۰۳/۰۴/۱۶', direction: 'incoming' }
]

// مناطق CDN متصل‌شده
const cdnZones = [
  {
    id: 'cdn-1',
    domain: 'example.com',
    status: 'active',
    plan: 'رایگان',
    traffic: '۱۲.۴ گیگابایت',
    requests: '۱۸۲ هزار',
    cacheHitRatio: 94,
    sslStatus: 'active'
  },
  {
    id: 'cdn-2',
    domain: 'shop-example.ir',
    status: 'inactive',
    plan: '—',
    traffic: '—',
    requests: '—',
    cacheHitRatio: 0,
    sslStatus: 'inactive'
  }
]

const affiliate = {
  code: 'ALI-DW2024',
  link: 'https://donyaweb.ir/ref/ALI-DW2024',
  commissionRate: 20,
  stats: {
    referred: 14,
    earned: 4280000,
    pending: 620000
  },
  referrals: [
    { name: 'حسین رضایی', date: '۱۴۰۳/۰۴/۱۰', service: 'هاست حرفه‌ای', commission: '۲۵,۸۰۰', status: 'paid' },
    { name: 'نگار احمدی', date: '۱۴۰۳/۰۴/۰۲', service: 'VPS 2', commission: '۹۸,۰۰۰', status: 'paid' },
    { name: 'کاوه محمودی', date: '۱۴۰۳/۰۳/۲۵', service: 'example.ir', commission: '۹,۰۰۰', status: 'pending' }
  ]
}

export function useDashboard() {
  const stats = {
    activeServices: services.filter((s) => s.status === 'active').length,
    expiringServices: services.filter((s) => s.status === 'expiring').length,
    pendingInvoices: invoices.filter((i) => i.status === 'pending').length,
    openTickets: tickets.filter((t) => t.status === 'open').length
  }

  function getServiceById(id) {
    return services.find((s) => s.id === id) || null
  }

  function getInvoiceById(id) {
    return invoices.find((i) => i.id === id) || null
  }

  function getTicketById(id) {
    return tickets.find((t) => t.id === id) || null
  }

  function getExpiringServices(limit = 3) {
    return services.filter((s) => s.status === 'expiring' || s.status === 'suspended').slice(0, limit)
  }

  function getRecentTickets(limit = 3) {
    return tickets.slice(0, limit)
  }

  function getDomainServices() {
    return services.filter((s) => s.type === 'domain')
  }

  function getDomainDetails(identifier) {
    return (
      domainDetails[identifier] || {
        autoRenew: false,
        locked: false,
        privacy: false,
        nameservers: ['ns1.donyaweb.ir', 'ns2.donyaweb.ir']
      }
    )
  }

  function getCdnZoneByDomain(domain) {
    return cdnZones.find((z) => z.domain === domain) || null
  }

  return {
    user,
    services,
    invoices,
    tickets,
    wallet,
    giftCards,
    affiliate,
    domainTransfers,
    cdnZones,
    stats,
    getServiceById,
    getInvoiceById,
    getTicketById,
    getExpiringServices,
    getRecentTickets,
    getDomainServices,
    getDomainDetails,
    getCdnZoneByDomain
  }
}