// لایه‌ی مشترک «سفارش + پرداخت» بین صفحات checkout-vps / checkout-host / checkout-domain
// و پرداخت فاکتورهای پنل کاربری. فعلاً به‌جای درگاه بانکی و بک‌اند واقعی، سفارش‌ها
// در sessionStorage مرورگر نگه‌داری می‌شوند (فقط برای دموی همین جلسه‌ی کاربر).
// بعداً باید createOrder با فراخوانی API واقعی ثبت سفارش، و صفحه‌ی درگاه با
// ریدایرکت واقعی به بانک (زرین‌پال/آیدی‌پی و ...) جایگزین شود.

const ORDERS_STORAGE_KEY = 'donyaweb_orders_v1'

function readOrders() {
  if (!import.meta.client) return {}
  try {
    return JSON.parse(sessionStorage.getItem(ORDERS_STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeOrders(orders) {
  if (!import.meta.client) return
  try {
    sessionStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  } catch {
    // sessionStorage در دسترس نیست (مثلاً حالت خصوصی مرورگر) — بی‌صدا رد می‌شویم
  }
}

const TYPE_PREFIX = { vps: 'VPS', hosting: 'CLD', domain: 'DOM', invoice: 'PAY', cart: 'CART' }
const TYPE_LABEL = { vps: 'VPS ابری', hosting: 'هاست ابری', domain: 'دامنه' }

function generateOrderId(type) {
  const prefix = TYPE_PREFIX[type] || 'ORD'
  const rand = Math.floor(100 + Math.random() * 900)
  return `${prefix}-${Date.now().toString().slice(-6)}${rand}`
}

export function useCheckout() {
  const { addService, addInvoice, markInvoicePaid, hasEnoughWalletBalance, payFromWallet } = useDashboard()

  // یک سفارش جدید می‌سازد و در sessionStorage ذخیره می‌کند
  function createOrder(payload) {
    const id = generateOrderId(payload.type)
    const order = {
      id,
      status: 'pending', // pending | paid | failed
      createdAt: new Date().toISOString(),
      ...payload
    }
    const orders = readOrders()
    orders[id] = order
    writeOrders(orders)
    return order
  }

  function getOrder(id) {
    if (!id) return null
    const orders = readOrders()
    return orders[id] || null
  }

  function updateOrder(id, patch) {
    const orders = readOrders()
    if (!orders[id]) return null
    orders[id] = { ...orders[id], ...patch }
    writeOrders(orders)
    return orders[id]
  }

  // بعد از پرداخت موفق: فاکتور موجود را «پرداخت‌شده» می‌کند، یا برای سفارش تازه
  // (تکی یا چندآیتمی از سبد خرید) فاکتور و سرویس‌های متناظر را در پنل کاربری می‌سازد
  function finalizeOrder(order) {
    if (order.type === 'invoice' && order.invoiceId) {
      markInvoicePaid(order.invoiceId)
      return
    }

    if (order.type === 'cart' && Array.isArray(order.items)) {
      addInvoice({
        id: `INV-${order.id}`,
        service: order.items.length > 1 ? `سبد خرید (${order.items.length} مورد)` : order.items[0]?.title,
        amount: order.amount.toLocaleString('fa-IR'),
        date: 'اکنون',
        status: 'paid'
      })

      order.items.forEach((item, index) => {
        addService({
          id: `srv-${order.id}-${index + 1}`,
          type: item.type,
          typeLabel: TYPE_LABEL[item.type] || item.type,
          name: item.title,
          identifier: item.identifier,
          status: 'active',
          renewDate: '—',
          price: item.amount.toLocaleString('fa-IR'),
          cycle: item.cycleLabel
        })
      })
      return
    }

    addInvoice({
      id: `INV-${order.id}`,
      service: order.title,
      amount: order.amount.toLocaleString('fa-IR'),
      date: 'اکنون',
      status: 'paid'
    })

    addService({
      id: `srv-${order.id}`,
      type: order.type,
      typeLabel: TYPE_LABEL[order.type] || order.type,
      name: order.title,
      identifier: order.identifier,
      status: 'active',
      renewDate: '—',
      price: order.amount.toLocaleString('fa-IR'),
      cycle: order.cycleLabel
    })
  }

  // پرداخت از کیف‌پول داخلی — بلافاصله (بدون رفتن به صفحه درگاه) نتیجه مشخص می‌شود
  function payWithWallet(order) {
    const ok = payFromWallet(order.amount, `پرداخت ${order.title}`)
    if (ok) {
      updateOrder(order.id, { status: 'paid', paidWith: 'wallet' })
      finalizeOrder(getOrder(order.id))
    }
    return ok
  }

  // نتیجه‌ی برگشت از صفحه‌ی شبیه‌ساز درگاه بانکی
  function confirmGatewaySuccess(id) {
    const order = updateOrder(id, { status: 'paid', paidWith: 'gateway' })
    if (order) finalizeOrder(order)
    return order
  }

  function confirmGatewayFailure(id, reason = 'bank_declined') {
    return updateOrder(id, { status: 'failed', failReason: reason })
  }

  return {
    createOrder,
    getOrder,
    updateOrder,
    payWithWallet,
    confirmGatewaySuccess,
    confirmGatewayFailure,
    hasEnoughWalletBalance
  }
}
