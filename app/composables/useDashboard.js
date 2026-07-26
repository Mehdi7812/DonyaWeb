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
      { from: 'user', name: 'علی محمدی', text: 'سلام، از دیروز نمی‌تونم با SSH به VPS خودم وصل بشم. خطای Connection Refused می‌گیرم.', date: '۱۴۰۳/۰۴/۱۸ - ۱۰:۲۰', attachments: [{ name: 'error-screenshot.png', size: 184320 }] },
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
    { id: 'TXN-2199', type: 'withdraw', amount: -150000, date: '۱۴۰۳/۰۴/۰۸', status: 'pending', method: 'شماره کارت ۶۰۳۷-...-۴۴۱۸' },
    { id: 'TXN-2198', type: 'topup', amount: 150000, date: '۱۴۰۳/۰۳/۲۰', status: 'paid', method: 'درگاه زرین‌پال' },
    { id: 'TXN-2190', type: 'usage', amount: -89000, date: '۱۴۰۳/۰۳/۲۸', status: 'paid', method: 'پرداخت فاکتور example.com' }
  ]
}

const giftCards = [
  { code: 'DWGIFT-2K9X-7QRT', amount: 100000, status: 'active', issuedDate: '۱۴۰۳/۰۲/۰۵' },
  { code: 'DWGIFT-8M3P-1LZS', amount: 50000, status: 'used', issuedDate: '۱۴۰۲/۱۱/۱۸' }
]

// جزئیات فنی VPSها (وضعیت روشن/خاموش، منابع مصرفی، سیستم‌عامل، دسترسی روت)
const vpsDetails = {
  'srv-1002': {
    powerStatus: 'running', // running | stopped | rebooting
    ip: '185.231.45.12',
    os: 'Ubuntu 24.04 LTS',
    rootPassword: 'Xk9#mQ2vLp7z',
    cpu: { cores: 4, used: 38 },
    ram: { total: 8, used: 3.1 },
    disk: { total: 100, used: 46 },
    bandwidth: { total: 2000, used: 640 }
  }
}

const vpsOsOptions = ['Ubuntu 24.04 LTS', 'Ubuntu 22.04 LTS', 'Debian 12', 'CentOS Stream 9', 'AlmaLinux 9', 'Windows Server 2022']

const vpsPlanOptions = [
  { id: 'vps1', name: 'VPS 1', cpu: 2, ram: 4, disk: 50, price: '۲۹۰,۰۰۰' },
  { id: 'vps2', name: 'VPS 2', cpu: 4, ram: 8, disk: 100, price: '۴۹۰,۰۰۰' },
  { id: 'vps3', name: 'VPS 3', cpu: 6, ram: 16, disk: 200, price: '۸۹۰,۰۰۰' },
  { id: 'vps4', name: 'VPS 4', cpu: 8, ram: 32, disk: 400, price: '۱,۴۹۰,۰۰۰' }
]

// جزئیات فنی سرویس‌های هاست (فضا، پهنای‌باند، دیتابیس، ایمیل، بک‌آپ)
const hostingDetails = {
  'srv-1001': {
    disk: { total: 20, used: 4.3 },
    bandwidth: { total: 200, used: 68 },
    databases: [
      { name: 'example_wp', size: '128 MB' },
      { name: 'example_shop', size: '340 MB' }
    ],
    emailAccounts: [
      { address: 'info@example.ir', usage: '1.2 گیگابایت از 5 گیگابایت' },
      { address: 'sales@example.ir', usage: '450 مگابایت از 5 گیگابایت' }
    ],
    backups: [
      { id: 'bkp-3201', date: '۱۴۰۳/۰۴/۱۰', size: '3.1 گیگابایت' },
      { id: 'bkp-3150', date: '۱۴۰۳/۰۳/۱۰', size: '2.9 گیگابایت' }
    ]
  },
  'srv-1004': {
    disk: { total: 5, used: 4.8 },
    bandwidth: { total: 50, used: 47 },
    databases: [{ name: 'myblog_db', size: '85 MB' }],
    emailAccounts: [],
    backups: []
  }
}

// رکوردهای DNS هر دامنه (کلید: نام دامنه)
const dnsRecordsStore = {
  'example.com': [
    { id: 'dns-1001', type: 'A', name: '@', value: '185.231.45.12', ttl: 3600 },
    { id: 'dns-1002', type: 'A', name: 'www', value: '185.231.45.12', ttl: 3600 },
    { id: 'dns-1003', type: 'MX', name: '@', value: 'mail.donyaweb.com', ttl: 3600, priority: 10 },
    { id: 'dns-1004', type: 'TXT', name: '@', value: 'v=spf1 include:donyaweb.com ~all', ttl: 3600 },
    { id: 'dns-1005', type: 'CNAME', name: 'cdn', value: 'cdn.donyaweb.com', ttl: 3600 }
  ],
  'shop-example.ir': [
    { id: 'dns-1006', type: 'A', name: '@', value: '185.231.45.20', ttl: 3600 },
    { id: 'dns-1007', type: 'CNAME', name: 'www', value: 'shop-example.ir', ttl: 3600 }
  ]
}

const dnsRecordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS']

// جزئیات تکمیلی دامنه‌ها (تنظیمات قفل/حریم‌خصوصی/تمدید خودکار/نیم‌سرورها)
const domainDetails = {
  'example.com': {
    autoRenew: true,
    locked: true,
    privacy: true,
    nameservers: ['ns1.donyaweb.com', 'ns2.donyaweb.com']
  },
  'shop-example.ir': {
    autoRenew: true,
    locked: true,
    privacy: false,
    nameservers: ['ns1.donyaweb.com', 'ns2.donyaweb.com']
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
  link: 'https://donyaweb.com/ref/ALI-DW2024',
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
        nameservers: ['ns1.donyaweb.com', 'ns2.donyaweb.com']
      }
    )
  }

  function getCdnZoneByDomain(domain) {
    return cdnZones.find((z) => z.domain === domain) || null
  }

  // --- سرویس‌های فنی VPS / هاست ---

  function getVpsDetails(serviceId) {
    return vpsDetails[serviceId] || null
  }

  function getHostingDetails(serviceId) {
    return hostingDetails[serviceId] || null
  }

  // تغییر وضعیت روشن/خاموش/ری‌استارت VPS
  function setVpsPower(serviceId, status) {
    if (vpsDetails[serviceId]) vpsDetails[serviceId].powerStatus = status
    return vpsDetails[serviceId] || null
  }

  // نصب مجدد سیستم‌عامل VPS
  function reinstallVpsOs(serviceId, os) {
    const details = vpsDetails[serviceId]
    if (!details) return null
    details.os = os
    details.powerStatus = 'running'
    details.disk.used = Math.round(details.disk.total * 0.05 * 10) / 10
    return details
  }

  // تولید رمز روت تازه (نمایشی)
  function resetVpsRootPassword(serviceId) {
    const details = vpsDetails[serviceId]
    if (!details) return null
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789#@$'
    details.rootPassword = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    return details.rootPassword
  }

  // ارتقا/تغییر پلن سرویس (VPS یا هاست) — نام و قیمت سرویس و منابع فنی را به‌روزرسانی می‌کند
  function upgradeServicePlan(serviceId, plan) {
    const service = services.find((s) => s.id === serviceId)
    if (!service) return null
    service.name = plan.name
    service.price = plan.price
    const vps = vpsDetails[serviceId]
    if (vps) {
      vps.cpu.cores = plan.cpu
      vps.ram.total = plan.ram
      vps.disk.total = plan.disk
    }
    return service
  }

  function createHostingBackup(serviceId) {
    const details = hostingDetails[serviceId]
    if (!details) return null
    const backup = {
      id: `bkp-${Date.now().toString().slice(-6)}`,
      date: 'همین الان',
      size: `${details.disk.used.toFixed(1)} گیگابایت`
    }
    details.backups.unshift(backup)
    return backup
  }

  function addHostingDatabase(serviceId, name) {
    const details = hostingDetails[serviceId]
    if (!details) return null
    const db = { name, size: '0 مگابایت' }
    details.databases.unshift(db)
    return db
  }

  function addHostingEmail(serviceId, address) {
    const details = hostingDetails[serviceId]
    if (!details) return null
    const account = { address, usage: '0 مگابایت از 5 گیگابایت' }
    details.emailAccounts.unshift(account)
    return account
  }

  // --- تیکت‌های پشتیبانی ---

  // ثبت تیکت جدید (اولین پیام همراه با فایل‌های پیوستی به‌صورت شیء File نگه‌داری می‌شود)
  function addTicket({ subject, department, priority, message, attachments = [] }) {
    const id = `TCK-${Date.now().toString().slice(-6)}`
    const ticket = {
      id,
      subject,
      department,
      status: 'open',
      priority,
      date: 'همین الان',
      messages: [
        { from: 'user', name: user.name, text: message, date: 'همین الان', attachments }
      ]
    }
    tickets.unshift(ticket)
    return ticket
  }

  // افزودن پیام (پاسخ) به یک تیکت موجود
  function addTicketMessage(ticketId, msg) {
    const ticket = tickets.find((t) => t.id === ticketId)
    if (!ticket) return null
    ticket.messages.push(msg)
    if (ticket.status === 'closed') ticket.status = 'open'
    return msg
  }

  // --- مدیریت رکوردهای DNS ---

  function getDnsRecords(domain) {
    if (!dnsRecordsStore[domain]) dnsRecordsStore[domain] = []
    return dnsRecordsStore[domain]
  }

  function addDnsRecord(domain, record) {
    const rec = { id: `dns-${Date.now().toString().slice(-6)}`, ttl: 3600, ...record }
    getDnsRecords(domain).unshift(rec)
    return rec
  }

  function updateDnsRecord(domain, id, patch) {
    const rec = getDnsRecords(domain).find((r) => r.id === id)
    if (rec) Object.assign(rec, patch)
    return rec || null
  }

  function deleteDnsRecord(domain, id) {
    const list = getDnsRecords(domain)
    const idx = list.findIndex((r) => r.id === id)
    if (idx > -1) list.splice(idx, 1)
    return idx > -1
  }

  // --- جهش‌های داده‌ی موقت (بعداً باید با فراخوانی API واقعی جایگزین شوند) ---

  // افزودن سرویس جدید (بعد از تکمیل موفق یک سفارش)
  function addService(service) {
    services.unshift(service)
    return service
  }

  // افزودن فاکتور جدید
  function addInvoice(invoice) {
    invoices.unshift(invoice)
    return invoice
  }

  // علامت‌گذاری یک فاکتور موجود به‌عنوان پرداخت‌شده
  function markInvoicePaid(id) {
    const invoice = invoices.find((i) => i.id === id)
    if (invoice) invoice.status = 'paid'
    return invoice
  }

  function hasEnoughWalletBalance(amount) {
    return wallet.balance >= amount
  }

  // کسر مبلغ از کیف پول داخلی + ثبت تراکنش در تاریخچه
  function payFromWallet(amount, description) {
    if (wallet.balance < amount) return false
    wallet.balance -= amount
    wallet.history.unshift({
      id: `TXN-${Date.now().toString().slice(-6)}`,
      type: 'usage',
      amount: -amount,
      date: 'اکنون',
      status: 'paid',
      method: description || 'پرداخت از کیف پول'
    })
    return true
  }

  // ثبت درخواست برداشت وجه — مبلغ بلافاصله از موجودی کم می‌شود و تراکنش با وضعیت «در انتظار» ثبت می‌شود
  function requestWithdraw(amount, destination) {
    if (amount <= 0 || amount > wallet.balance) return false
    wallet.balance -= amount
    wallet.history.unshift({
      id: `TXN-${Date.now().toString().slice(-6)}`,
      type: 'withdraw',
      amount: -amount,
      date: 'همین الان',
      status: 'pending',
      method: destination || 'کارت بانکی'
    })
    return true
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
    getCdnZoneByDomain,
    addService,
    addInvoice,
    markInvoicePaid,
    hasEnoughWalletBalance,
    payFromWallet,
    requestWithdraw,
    vpsOsOptions,
    vpsPlanOptions,
    dnsRecordTypes,
    getVpsDetails,
    getHostingDetails,
    setVpsPower,
    reinstallVpsOs,
    resetVpsRootPassword,
    upgradeServicePlan,
    createHostingBackup,
    addHostingDatabase,
    addHostingEmail,
    getDnsRecords,
    addDnsRecord,
    updateDnsRecord,
    deleteDnsRecord,
    addTicket,
    addTicketMessage
  }
}