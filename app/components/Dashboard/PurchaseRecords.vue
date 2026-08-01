<script setup>
import {ref, watch, onMounted} from 'vue'
import {useDisplay} from 'vuetify';

const {$objectIsEmpty} = useNuxtApp()
const props = defineProps({
  additional: {
    type: String,
    required: false,
    default: ''
  }
})
const router = useRouter()
const {t} = useI18n()
const toast = useToast()
const customizer = useCustomizerStore()
const {$numberWithSeparator} = useNuxtApp()
const Invoices = ref([])
const Invoice = ref([])
const Transactions = ref([])
const dialog = ref(false)
const dialogAcc = ref(false)
const roundedTheme = ref(true)
const language = ref(customizer.language)
const dateString = ref(customizer.dateString)
const successBtnText = ref('')
const successBtnLink = ref('')
const successBtnParameter = ref(false)
const btnLoadingPayment = ref(false)
const description = ref('')
const dialogTransactions = ref(false)
const dialogReturnedGoods = ref(false)
const dialogChangeStatus = ref(false)
const returnData = ref([])
const returnReasons = ref([])
const {smAndDown} = useDisplay()
const loadingList = ref(false)
const loadingInvoice = ref(false)

watch(() => customizer.language, () => {
  language.value = customizer.language
  dateString.value = customizer.dateString
})

const getPurchasesList = (status) => {
  Invoices.value = []
  loadingList.value = true
  useGarnetApiFetch('invoices/indexByUser', {
    conditions: {
      status: status
    }
  }).then(
      response => {
        if (response.code === 2000) {
          Invoices.value = response.Invoices
          loadingList.value = false
        }
      }).catch((error) => {
    toast.error({title: t('error'), message: t(error)})
  }).finally(() => {
    loadingList.value = false
  })
}

const showInvoice = (item) => {
  loadingInvoice.value = true
  useGarnetApiFetch('invoices/show', {
    invoice_id: item.id
  }).then(
      response => {
        if (response.code === 2000) {
          Invoice.value = response.Invoice
          Transactions.value = response.Transactions
          dialog.value = true
          loadingInvoice.value = false
        }
      }).catch((error) => {
    toast.error({title: t('error'), message: t(error)})
  })
}

const getStatusColor = (status) => {
  let returnColor
  switch (status) {
    case 0:
      returnColor = 'red darken-1'
      break
    case 1:
      returnColor = 'warning'
      break
    case 2:
      returnColor = 'info'
      break
    case 3:
      returnColor = 'blue'
      break
    case 6:
      returnColor = 'green'
      break
    case 7:
      returnColor = 'error'
      break
    case 9:
      returnColor = 'indigo'
      break
    case 10:
      returnColor = 'deep-purple-darken-1'
      break
    case 11:
      returnColor = 'blue-accent-3'
      break
    case 12:
      returnColor = 'deep-orange-darken-4'
      break
    default:
      returnColor = 'blue-grey-darken-1'
  }
  return returnColor
}

const goPayment = (item) => {
  if(item.presenter_id) {
    toast.warning({message: "جهت پرداخت قسط، لطفاً با نماینده خود هماهنگ فرمایید."})
    return
  }
  
  btnLoadingPayment.value = true
  const sendUrl = 'wallets/paymentInstallment'
  const sendData = {
    selectedPaymentProcedure: 170,
    selectedGateway: 1,
    transactions_id: item.wallet_transactions_id
  }
  useGarnetApiFetch(sendUrl, sendData).then(response => {
    btnLoadingPayment.value = false
    const gatewayTitle = response.GatewayTitle;
    const paymentUrl =
        response.GatewayResult?.payment_url ||
        response.GatewayResult?.data?.payment_url ||
        response.GatewayResult?.url;
    if (["jibit", "zibal", "zarinpal", "saman", "free", "wallet"].includes(gatewayTitle)) {
      if (paymentUrl) {
        window.location.replace(paymentUrl);
      } else {
        toast.error({
          title: t("error"),
          message: t("payment_url_not_found"),
        });
      }
    } else {
      toast.error({title: t("error"), message: t("gateway_not_supported")});
    }
  }).catch(error => {
    btnLoadingPayment.value = false
    toast.error({title: t('error'), message: t(error)})
  })
}

onMounted(() => {
  if (customizer.userInfo.status === 3) {
    router.push('/dashboard')
    return
  }
  if (props.additional !== '' && props.additional) {
    const obj = JSON.parse(props.additional)
    roundedTheme.value = 'roundedTheme' in obj && obj.roundedTheme === 'true'
    successBtnText.value = 'successBtnText' in obj && obj.successBtnText !== '' ? obj.successBtnText : successBtnText.value
    successBtnLink.value = 'successBtnLink' in obj && obj.successBtnLink !== '' ? obj.successBtnLink : successBtnLink.value
    successBtnParameter.value = 'successBtnParameter' in obj && obj.successBtnParameter === 'true'
  }
  loadReturnItems()
  getPurchasesList([2, 3, 4, 5, 8]);
})

function openDialogReturnedGoods() {
  returnData.value = Invoice.value.invoice_details.map(item => ({
    product_id: item.products.id,
    product: item.products,
    amount: item.amount,
    return: 0,
    return_amount: item.return_amount,
    max_return_amount: item.amount - item.return_amount,
    id: item.id,
    return_reason: '',
    description: '',
    price_kind: item.price_kind,
    invoice_id: Invoice.value.id
  }));
  dialogReturnedGoods.value = true
}

const submitReturnLoading = ref(false)

async function submitReturnItems() {
  if (submitReturnLoading.value) return;

  const items = Invoice.value.invoice_details || []
  if (!items.length) {
    return;
  }

  if (!returnData.value || !Array.isArray(returnData.value)) {
    return;
  }

  if (!Invoice.value || !Invoice.value.id) {
    return;
  }

  const returnItem = returnData.value.filter(item => item.return > 0);

  for (let item of returnItem) {
    if (!item.return_reason || !item.return_description) {
      toast.error({title: t('error'), message: 'لطفا دلیل و توضیحات مرجوعی را وارد کنید'})
      return;
    }
  }

  if (returnItem.length === 0) {
    return
  }

  const return_detail = returnItem.map(item => ({
    product_id: item.product.id,
    amount: item.amount,
    invoice_detail_id: item.id,
    return_reason: item.return_reason,
    description: item.return_description,
  }));

  const payload = {
    invoice_id: Invoice.value.id,
    return_detail: return_detail,
  };

  submitReturnLoading.value = true;

  useGarnetApiFetch("invoices/saveReturn", payload)
    .then(response => {
      if (response.code === 2000) {
        toast.success({ message: "ثبت شد" });
        dialogReturnedGoods.value = false;
        getPurchasesList();
      } else {
        toast.error({ message: t(response.error) });
      }
    })
    .catch(() => {
      toast.error({ message: "error in invoices/saveReturn" });
    })
    .finally(() => {
      submitReturnLoading.value = false;
    });
}

function loadReturnItems() {
  useGarnetApiFetch("dynamicKinds/showByType", {
    type: "Return",
  }).then(
      response => {
        returnReasons.value = response.DynamicKinds
      })
}

const convertToEnglishNumbers = (input) => {
  const persianToEnglish = {
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9'
  };
  if (input) {
    return input.replace(/[۰-۹]/g, (match) => persianToEnglish[match]);
  }
};

const formatInput = (item) => {
  item.return = String(item.return);
  item.return = convertToEnglishNumbers(item.return);
  if (item.return.length > 1 && item.return.startsWith('0')) {
    item.return = item.return.replace(/^0/, '')
  }
  return Math.min(parseInt(item.return), parseInt(item.max_return_amount))
};

const tab = ref('stores');

function sliderColor(tab) {
  switch (tab) {
    case 'stores':
      return 'green';
    case 'invoices':
      return 'blue';
    case 'returned_invoices':
      return 'orange';
    case 'canceled_invoices':
      return 'red';
    default:
      return 'green';
  }
}

function openDialogChangeStatus() {
  dialogChangeStatus.value = true
}

function updateStatus(id, status) {
  const sendData = {}
  sendData.invoice_id = id
  sendData.newStatus = status
  sendData.description = 'درخواست لغو مرجوعی از سمت کاربر'
  // console.log(sendData)
  useGarnetApiFetch("invoices/updateStatus", sendData).then(
      response => {
        if (response.code === 2000) {
          toast.success({message: t('status_change_saved')})
        } else {
          toast.error('error in invoices/updateStatus')
        }
      })
}

watch(tab, (newTab) => {
  if (newTab === 'stores') {
    getPurchasesList([2, 3, 4, 5, 8]);
  } else if (newTab === 'invoices') {
    getPurchasesList([6]);
  } else if (newTab === 'returned_invoices') {
    getPurchasesList([9, 10, 11, 12]);
  } else if (newTab === 'canceled_invoices') {
    getPurchasesList([7]);
  }
});

const isAllReturned = computed(() => {
  return returnData.value.every(item => item.return_amount === item.amount);
});

</script>

<template>

  <div class="garnet-exams-list d-print-none">
    <v-row class="mb-2" justify="center">
      <v-col cols="12">
        <v-sheet
            class="pb-md-9"
            :class="roundedTheme ? 'rounded-lg' : ''"
            elevation="5"
        >
          <div
              :class="roundedTheme ? 'text-white bg-secondary rounded-t-lg' : ''"
          >
            <v-row dense class="d-flex align-center mt-0 py-6 px-3">
              <v-col cols="auto">
                <h3
                    class="heading text-start"
                    :class="{
                    'text-white bg-secondary text-center rounded-t-lg pa-md-5':
                      roundedTheme,
                  }"
                >
                  {{ t('purchase_records') }}
                </h3>
              </v-col>
              <v-spacer/>
            </v-row>
          </div>
          <v-divider v-if="!roundedTheme" class="mb-6"/>
          <v-row class="d-flex align-center">
            <v-col cols="12" class="d-flex align-center justify-center">
              <v-tabs
                  v-model="tab"
                  :slider-color="sliderColor(tab)"
                  :color="sliderColor(tab)"
                  background-color="primary"
                  grow
                  hide-slider
              >
                <v-tab :width="smAndDown ? '35%' : '25%'" value="stores">
                  <p class="text-subtitle-1 font-weight-semibold">
                    {{ t('سفارشات') }}
                  </p>
                </v-tab>
                <v-tab :width="smAndDown ? '35%' : '25%'" value="invoices">
                  <p class="text-subtitle-1 font-weight-semibold">
                    {{ t('فاکتورها') }}
                  </p>
                </v-tab>
                <v-tab :width="smAndDown ? '35%' : '25%'" value="returned_invoices">
                  <p class="text-subtitle-1 font-weight-semibold">
                    {{ t('فاکتورهای مرجوعی') }}
                  </p>
                </v-tab>
                <v-tab :width="smAndDown ? '35%' : '25%'" value="canceled_invoices">
                  <p class="text-subtitle-1 font-weight-semibold">
                    {{ t('فاکتورهای لغوشده') }}
                  </p>
                </v-tab>
              </v-tabs>
            </v-col>
          </v-row>
          <v-divider/>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="stores">
              <v-card class="elevation-0" :class="roundedTheme ? 'rounded-b-lg' : ''" width="100%">
                <v-card-title :class="'bg-'+sliderColor(tab)" class="text-subtitle-1 font-weight-regular ps-md-6">
                  {{ t('سفارشات من') }}
                </v-card-title>
                <v-card-text class="px-0 pb-0">
                  <div
                      class="pa-2"
                      :class="roundedTheme ? '' : 'store-panel-sheet-border'"
                  >
                    <div style="max-height: 300px" v-if="smAndDown" class="overflow-y-auto pb-md-2 pb-0">
                      <v-progress-linear
                          v-if="loadingList"
                          indeterminate
                          class="my-3"
                      />
                      <template v-else>
                        <v-card
                            v-for="c in Invoices"
                            :key="c.id"
                            variant="outlined"
                            rounded="lg"
                            class="mb-2"
                        >
                          <v-card-text class="pa-3">
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'شماره سفارش مرجوعی' : 'شماره سفارش' }}
                              </div>
                              <div class="text-body-2">{{ c.id }}</div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'شماره فاکتور مرجوعی' : 'شماره فاکتور' }}
                              </div>
                              <div class="text-body-2">{{ c.invoice_number ?? '---' }}</div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">{{ t('status') }}</div>
                              <div class="text-body-2" :class="'text-'+getStatusColor(c.status)">{{
                                  t(c.status_text)
                                }}
                              </div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'تاریخ درخواست مرجوعی' : t('date') }}
                              </div>
                              <div class="text-body-2">{{ usePersianDate(c.created_at).toString(dateString) }}</div>
                            </div>
                            <div v-if="!c.status_text.includes('return')"
                                 class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">{{ t('presenter') }}</div>
                              <div class="text-body-2">{{ c.presenter_full_name ?? '---' }}</div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">{{ t('discount') }}</div>
                              <div class="text-body-2">
                                {{
                                  c.discount_price + c.other_price !== 0 ? $numberWithSeparator(c.discount_price + c.other_price) + ' ' + c.currency_name : '---'
                                }}
                              </div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'مبلغ کل قابل استرداد' : t('total_price') }}
                              </div>
                              <div class="text-body-2">
                                {{ $numberWithSeparator(c.total_price) }} {{ c.currency_name }}
                              </div>
                            </div>
                            <v-btn
                                block
                                flat
                                rounded="lg"
                                color="blue-darken-2"
                                class="font-weight-regular"
                                :loading="loadingInvoice"
                                :disabled="loadingInvoice"
                                @click="showInvoice(c)"
                            >
                              جزئیات
                            </v-btn>
                          </v-card-text>
                        </v-card>
                        <div v-if="!loadingList && Invoices.length === 0" class="text-center py-6 text-medium-emphasis">
                          موردی برای نمایش وجود ندارد
                        </div>
                      </template>
                    </div>
                    <template
                        v-else
                    >
                      <div v-if="loadingList">
                        <v-skeleton-loader
                            type="table-row@6"
                            class="pa-0 ma-0"
                        />
                      </div>
                      <v-table
                          v-else-if="!loadingList && Invoices.length > 0"
                          class="mb-10"
                          style="width:100%"
                      >
                        <thead>
                        <tr>
                          <th class="text-no-wrap" style="width: 120px">
                            شماره سفارش
                          </th>
                          <th class="text-no-wrap" style="width: 120px">
                            شماره فاکتور
                          </th>
                          <th>
                            {{ t("status") }}
                          </th>
                          <th>
                            {{ t("date") }}
                          </th>
                          <th>
                            {{ t("presenter") }}
                          </th>
                          <th>
                            {{ t("discount") }}
                          </th>
                          <th>
                            {{ t("total_price") }}
                          </th>
                          <th style="width: 30px">
                            جزئیات
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                            v-for="(item, i) in Invoices"
                            :key="i"
                        >
                          <td>{{ item.id }}</td>
                          <td>{{ item.invoice_number ?? '----' }}</td>
                          <td class="text-no-wrap">{{ t(item.status_text) }}</td>
                          <td>{{ usePersianDate(item.created_at).toString(dateString) }}</td>
                          <td class="text-no-wrap">{{ item.presenter_full_name ?? '----' }}</td>
                          <td>{{ $numberWithSeparator(item.discount_price + item.other_price) }}</td>
                          <td>{{ $numberWithSeparator(item.total_price) }} {{ item.currency_name }}</td>
                          <td>
                            <v-btn
                                variant="text"
                                small
                                icon
                                color="primary"
                                @click="showInvoice(item)"
                            >
                              <Icon
                                  name="garnet:mdi:show"
                                  size="25"
                              />
                            </v-btn>
                          </td>
                        </tr>
                        </tbody>
                      </v-table>
                      <div v-else-if="!loadingList && Invoices.length === 0"
                           class="text-center py-6 text-medium-emphasis">
                        موردی برای نمایش وجود ندارد
                      </div>
                    </template>
                  </div>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>
            <v-tabs-window-item value="invoices">
              <v-card class="elevation-0" :class="roundedTheme ? 'rounded-b-lg' : ''" width="100%">
                <v-card-title :class="'bg-'+sliderColor(tab)" class="text-subtitle-1 font-weight-regular ps-md-6">
                  {{ t('فاکتورهای من') }}
                </v-card-title>
                <v-card-text class="px-0 pb-0">
                  <div
                      class="pa-2"
                      :class="roundedTheme ? '' : 'store-panel-sheet-border'"
                  >
                    <div style="max-height: 300px" v-if="smAndDown" class="overflow-y-auto pb-md-2 pb-0">
                      <v-progress-linear
                          v-if="loadingList"
                          indeterminate
                          class="my-3"
                      />
                      <template v-else>
                        <v-card
                            v-for="c in Invoices"
                            :key="c.id"
                            variant="outlined"
                            rounded="lg"
                            class="mb-2"
                        >
                          <v-card-text class="pa-3">
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'شماره سفارش مرجوعی' : 'شماره سفارش' }}
                              </div>
                              <div class="text-body-2">{{ c.id }}</div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'شماره فاکتور مرجوعی' : 'شماره فاکتور' }}
                              </div>
                              <div class="text-body-2">{{ c.invoice_number ?? '---' }}</div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">{{ t('status') }}</div>
                              <div class="text-body-2" :class="'text-'+getStatusColor(c.status)">{{
                                  t(c.status_text)
                                }}
                              </div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'تاریخ درخواست مرجوعی' : t('date') }}
                              </div>
                              <div class="text-body-2">{{ usePersianDate(c.created_at).toString(dateString) }}</div>
                            </div>
                            <div v-if="!c.status_text.includes('return')"
                                 class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">{{ t('presenter') }}</div>
                              <div class="text-body-2">{{ c.presenter_full_name ?? '---' }}</div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">{{ t('discount') }}</div>
                              <div class="text-body-2">
                                {{
                                  c.discount_price + c.other_price !== 0 ? $numberWithSeparator(c.discount_price + c.other_price) + ' ' + c.currency_name : '---'
                                }}
                              </div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'مبلغ کل قابل استرداد' : t('total_price') }}
                              </div>
                              <div class="text-body-2">
                                {{ $numberWithSeparator(c.total_price) }} {{ c.currency_name }}
                              </div>
                            </div>
                            <v-btn
                                block
                                flat
                                rounded="lg"
                                color="blue-darken-2"
                                class="font-weight-regular"
                                :loading="loadingInvoice"
                                :disabled="loadingInvoice"
                                @click="showInvoice(c)"
                            >
                              جزئیات
                            </v-btn>
                          </v-card-text>
                        </v-card>
                        <div v-if="!loadingList && Invoices.length === 0" class="text-center py-6 text-medium-emphasis">
                          موردی برای نمایش وجود ندارد
                        </div>
                      </template>
                    </div>
                    <template
                        v-else
                    >
                      <div v-if="loadingList">
                        <v-skeleton-loader
                            type="table-row@6"
                            class="pa-0 ma-0"
                        />
                      </div>
                      <v-table
                          v-else-if="!loadingList && Invoices.length > 0"
                          class="mb-10"
                          style="width:100%"
                      >
                        <thead>
                        <tr>
                          <th class="text-no-wrap" style="width: 120px">
                            شماره سفارش
                          </th>
                          <th class="text-no-wrap" style="width: 120px">
                            شماره فاکتور
                          </th>
                          <th>
                            {{ t("status") }}
                          </th>
                          <th>
                            {{ t("date") }}
                          </th>
                          <th>
                            {{ t("presenter") }}
                          </th>
                          <th>
                            {{ t("discount") }}
                          </th>
                          <th>
                            {{ t("total_price") }}
                          </th>
                          <th style="width: 30px">
                            جزئیات
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                            v-for="(item, i) in Invoices"
                            :key="i"
                        >
                          <td>{{ item.id }}</td>
                          <td>{{ item.invoice_number ?? '----' }}</td>
                          <td class="text-no-wrap">{{ t(item.status_text) }}</td>
                          <td>{{ usePersianDate(item.created_at).toString(dateString) }}</td>
                          <td class="text-no-wrap">{{ item.presenter_full_name ?? '----' }}</td>
                          <td>{{ $numberWithSeparator(item.discount_price + item.other_price) }}</td>
                          <td>{{ $numberWithSeparator(item.total_price) }} {{ item.currency_name }}</td>
                          <td>
                            <v-btn
                                variant="text"
                                small
                                icon
                                color="primary"
                                @click="showInvoice(item)"
                            >
                              <Icon
                                  name="garnet:mdi:show"
                                  size="25"
                              />
                            </v-btn>
                          </td>
                        </tr>
                        </tbody>
                      </v-table>
                      <div v-else-if="!loadingList && Invoices.length === 0"
                           class="text-center py-6 text-medium-emphasis">
                        موردی برای نمایش وجود ندارد
                      </div>
                    </template>
                  </div>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>
            <v-tabs-window-item value="returned_invoices">
              <v-card class="elevation-0" :class="roundedTheme ? 'rounded-b-lg' : ''" width="100%">
                <v-card-title :class="'bg-'+sliderColor(tab)" class="text-subtitle-1 font-weight-regular ps-md-6">
                  {{ t('فاکتورهای مرجوعی من') }}
                </v-card-title>
                <v-card-text class="px-0 pb-0">
                  <div
                      class="pa-2"
                      :class="roundedTheme ? '' : 'store-panel-sheet-border'"
                  >
                    <div style="max-height: 300px" v-if="smAndDown" class="overflow-y-auto pb-md-2 pb-0">
                      <v-progress-linear
                          v-if="loadingList"
                          indeterminate
                          class="my-3"
                      />
                      <template v-else>
                        <v-card
                            v-for="c in Invoices"
                            :key="c.id"
                            variant="outlined"
                            rounded="lg"
                            class="mb-2"
                        >
                          <v-card-text class="pa-3">
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'شماره سفارش مرجوعی' : 'شماره سفارش' }}
                              </div>
                              <div class="text-body-2">{{ c.id }}</div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'شماره فاکتور مرجوعی' : 'شماره فاکتور' }}
                              </div>
                              <div class="text-body-2">{{ c.invoice_number ?? '---' }}</div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                شماره فاکتور مرجع
                              </div>
                              <div class="text-body-2">{{ c.return_from_invoice_id ?? '---' }}</div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">{{ t('status') }}</div>
                              <div class="text-body-2" :class="'text-'+getStatusColor(c.status)">{{
                                  t(c.status_text)
                                }}
                              </div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'تاریخ درخواست مرجوعی' : t('date') }}
                              </div>
                              <div class="text-body-2">{{ usePersianDate(c.created_at).toString(dateString) }}</div>
                            </div>
                            <div v-if="!c.status_text.includes('return')"
                                 class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">{{ t('presenter') }}</div>
                              <div class="text-body-2">{{ c.presenter_full_name ?? '---' }}</div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'مبلغ کل قابل استرداد' : t('total_price') }}
                              </div>
                              <div class="text-body-2">
                                {{ $numberWithSeparator(c.total_price) }} {{ c.currency_name }}
                              </div>
                            </div>
                            <v-btn
                                block
                                flat
                                rounded="lg"
                                color="blue-darken-2"
                                class="font-weight-regular"
                                :loading="loadingInvoice"
                                :disabled="loadingInvoice"
                                @click="showInvoice(c)"
                            >
                              جزئیات
                            </v-btn>
                          </v-card-text>
                        </v-card>
                        <div v-if="!loadingList && Invoices.length === 0" class="text-center py-6 text-medium-emphasis">
                          موردی برای نمایش وجود ندارد
                        </div>
                      </template>
                    </div>
                    <template
                        v-else
                    >
                      <div v-if="loadingList">
                        <v-skeleton-loader
                            type="table-row@6"
                            class="pa-0 ma-0"
                        />
                      </div>
                      <v-table
                          v-else-if="!loadingList && Invoices.length > 0"
                          class="mb-10"
                          style="width:100%"
                      >
                        <thead>
                        <tr>
                          <th class="text-no-wrap" style="width: 120px">
                            شماره سفارش مرجوعی
                          </th>
                          <th class="text-no-wrap" style="width: 120px">
                            شماره فاکتور مرجوعی
                          </th>
                          <th class="text-no-wrap" style="width: 120px">
                            شماره فاکتور مرجع
                          </th>
                          <th>
                            {{ t("status") }}
                          </th>
                          <th>
                            تاریخ درخواست مرجوعی
                          </th>
                          <th>
                            مبلغ قابل استرداد
                          </th>
                          <th style="width: 30px">
                            جزئیات
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                            v-for="(item, i) in Invoices"
                            :key="i"
                        >
                          <td>{{ item.id }}
                          </td>
                          <td>{{ item.invoice_number ?? '----' }}</td>
                          <td>{{ item.return_from_invoice_id ?? '----' }}</td>
                          <td class="text-no-wrap">{{ t(item.status_text) }}</td>
                          <td>{{ usePersianDate(item.created_at).toString(dateString) }}</td>
                          <td>{{ $numberWithSeparator(item.total_price) }} {{ item.currency_name }}</td>
                          <td>
                            <v-btn
                                variant="text"
                                small
                                icon
                                color="primary"
                                @click="showInvoice(item)"
                            >
                              <Icon
                                  name="garnet:mdi:show"
                                  size="25"
                              />
                            </v-btn>
                          </td>
                        </tr>
                        </tbody>
                      </v-table>
                      <div
                          v-else-if="!loadingList && Invoices.length === 0"
                          class="text-center py-6 text-medium-emphasis"
                      >
                        موردی برای نمایش وجود ندارد
                      </div>
                    </template>
                  </div>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>
            <v-tabs-window-item value="canceled_invoices">
              <v-card class="elevation-0" :class="roundedTheme ? 'rounded-b-lg' : ''" width="100%">
                <v-card-title :class="'bg-'+sliderColor(tab)" class="text-subtitle-1 font-weight-regular ps-md-6">
                  {{ t('فاکتور های لغو شده من') }}
                </v-card-title>
                <v-card-text class="px-0 pb-0">
                  <div
                      class="pa-2"
                      :class="roundedTheme ? '' : 'store-panel-sheet-border'"
                  >
                    <div style="max-height: 300px" v-if="smAndDown" class="overflow-y-auto pb-md-2 pb-0">
                      <v-progress-linear
                          v-if="loadingList"
                          indeterminate
                          class="my-3"
                      />
                      <template v-else>
                        <v-card
                            v-for="c in Invoices"
                            :key="c.id"
                            variant="outlined"
                            rounded="lg"
                            class="mb-2"
                        >
                          <v-card-text class="pa-3">
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'شماره سفارش مرجوعی' : 'شماره سفارش' }}
                              </div>
                              <div class="text-body-2">{{ c.id }}</div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'شماره فاکتور مرجوعی' : 'شماره فاکتور' }}
                              </div>
                              <div class="text-body-2">{{ c.invoice_number ?? '---' }}</div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">{{ t('status') }}</div>
                              <div class="text-body-2" :class="'text-'+getStatusColor(c.status)">{{
                                  t(c.status_text)
                                }}
                              </div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'تاریخ درخواست مرجوعی' : t('date') }}
                              </div>
                              <div class="text-body-2">{{ usePersianDate(c.created_at).toString(dateString) }}</div>
                            </div>
                            <div v-if="!c.status_text.includes('return')"
                                 class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">{{ t('presenter') }}</div>
                              <div class="text-body-2">{{ c.presenter_full_name ?? '---' }}</div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">{{ t('discount') }}</div>
                              <div class="text-body-2">
                                {{
                                  c.discount_price + c.other_price !== 0 ? $numberWithSeparator(c.discount_price + c.other_price) + ' ' + c.currency_name : '---'
                                }}
                              </div>
                            </div>
                            <div class="d-flex justify-space-between align-center mb-2">
                              <div class="text-caption text-medium-emphasis">
                                {{ c.status_text.includes('return') ? 'مبلغ کل قابل استرداد' : t('total_price') }}
                              </div>
                              <div class="text-body-2">
                                {{ $numberWithSeparator(c.total_price) }} {{ c.currency_name }}
                              </div>
                            </div>
                            <v-btn
                                block
                                flat
                                rounded="lg"
                                color="blue-darken-2"
                                class="font-weight-regular"
                                :loading="loadingInvoice"
                                :disabled="loadingInvoice"
                                @click="showInvoice(c)"
                            >
                              جزئیات
                            </v-btn>
                          </v-card-text>
                        </v-card>
                        <div v-if="!loadingList && Invoices.length === 0" class="text-center py-6 text-medium-emphasis">
                          موردی برای نمایش وجود ندارد
                        </div>
                      </template>
                    </div>
                    <template
                        v-else
                    >
                      <div v-if="loadingList">
                        <v-skeleton-loader
                            type="table-row@6"
                            class="pa-0 ma-0"
                        />
                      </div>
                      <v-table
                          v-else-if="!loadingList && Invoices.length > 0"
                          class="mb-10"
                          style="width:100%"
                      >
                        <thead>
                        <tr>
                          <th class="text-no-wrap" style="width: 120px">
                            شماره سفارش
                          </th>
                          <th class="text-no-wrap" style="width: 120px">
                            شماره فاکتور
                          </th>
                          <th>
                            {{ t("status") }}
                          </th>
                          <th>
                            {{ t("date") }}
                          </th>
                          <th>
                            {{ t("presenter") }}
                          </th>
                          <th>
                            {{ t("discount") }}
                          </th>
                          <th>
                            {{ t("total_price") }}
                          </th>
                          <th style="width: 30px">
                            جزئیات
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                            v-for="(item, i) in Invoices"
                            :key="i"
                        >
                          <td>{{ item.id }}</td>
                          <td>{{ item.invoice_number ?? '----' }}</td>
                          <td class="text-no-wrap">{{ t(item.status_text) }}</td>
                          <td>{{ usePersianDate(item.created_at).toString(dateString) }}</td>
                          <td class="text-no-wrap">{{ item.presenter_full_name ?? '----' }}</td>
                          <td>{{ $numberWithSeparator(item.discount_price + item.other_price) }}</td>
                          <td>{{ $numberWithSeparator(item.total_price) }} {{ item.currency_name }}</td>
                          <td>
                            <v-btn
                                variant="text"
                                small
                                icon
                                color="primary"
                                @click="showInvoice(item)"
                            >
                              <Icon
                                  name="garnet:mdi:show"
                                  size="25"
                              />
                            </v-btn>
                          </td>
                        </tr>
                        </tbody>
                      </v-table>
                      <div v-else-if="!loadingList && Invoices.length === 0"
                           class="text-center py-6 text-medium-emphasis">
                        موردی برای نمایش وجود ندارد
                      </div>
                    </template>
                  </div>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-sheet>
      </v-col>
    </v-row>
  </div>

  <v-dialog
      v-model="dialogAcc"
      persistent
      max-width="1100"
  >
    <v-card
        v-if="dialogAcc"
    >
      <v-card-title class="d-flex justify-space-between px-6 pb-0 mt-4">
        لیست تراکنش ها
        <v-btn
            variant="tonal"
            rounded="lg"
            class="me-md-5"
            @click="dialogAcc = false"
        >
          <p class="pa-0 text-subtitle-1 font-weight-light">
            {{ t("close") }}
          </p>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-table
            style="width:100%"
        >
          <thead>
          <tr>
            <th>
              {{ t("شناسه تراکنش") }}
            </th>
            <th>
              {{ t("نوع تراکنش") }}
            </th>
            <th>
              {{ t("تاریخ سررسید") }}
            </th>
            <th>
              {{ t("مبلغ") }}
            </th>
            <th>
              {{ t("وضیعت") }}
            </th>
            <th class="text-center">
              {{ t("پرداخت") }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in Transactions"
              :key="item.id"
          >
            <td>{{ item.wallet_transactions_id }}</td>
            <td>{{ t(item.kind_text) }}</td>
            <td>{{ usePersianDate(item.document_date).toString(dateString) }}</td>
            <td>{{ $numberWithSeparator(parseInt(item.amount)) }} {{ item.currency_name }}</td>
            <td>
              <v-chip
                  rounded="lg"
                  :color="getStatusColor(item.status)"
              >
                {{ t(item.status_text) }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-btn
                  v-if="item.kind === 8 && (item.status === 1 || item.status === 3)"
                  class="rounded-lg pa-0 ma-1 px-2"
                  density="comfortable"
                  size="x-small"
                  height="32"
                  variant="tonal"
                  color="indigo"
                  :disabled="btnLoadingPayment"
                  :loading="btnLoadingPayment"
                  @click="goPayment(item)"
              >
                {{ t("پرداخت") }}
              </v-btn>
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog
      v-model="dialog"
      persistent
      max-width="900px"
      :fullscreen="smAndDown"
  >
    <v-card
    >
      <v-card-title
          class="d-flex justify-end py-0 pe-2"
      >
        <v-btn
            icon="mdi-close"
            flat
            @click="dialog = false"
        />
      </v-card-title>
      <v-card-text style="max-height: 85dvh" class="overflow-y-auto px-8 py-0">
        <v-row
            class="text-body-2"
        >
          <v-col
              cols="12"
              sm="6"
              class="d-flex px-1 d-sm-block justify-space-between"
          >
            {{ Invoice.status_text.includes('return') ? 'شماره سفارش مرجوعی' : t("order_code") }} :
            <strong>
              {{ Invoice.id }}
            </strong>
          </v-col>
          <v-col
              cols="12"
              sm="6"
              class="d-flex px-1 d-sm-block justify-space-between"
          >
            {{ Invoice.status_text.includes('return') ? 'شماره فاکتور مرجوعی' : t("شماره فاکتور") }} :
            <strong>
              {{ Invoice.invoice_number }}
            </strong>
          </v-col>
          <v-col
              v-if="Invoice.status_text.includes('return')"
              cols="12"
              sm="6"
              class="d-flex px-1 d-sm-block justify-space-between"
          >
            شماره فاکتور مرجع :
            <strong>
              {{ Invoice.return_from_invoice_id }}
            </strong>
          </v-col>
          <v-col
              cols="12"
              sm="6"
              class="d-flex px-1 d-sm-block justify-space-between"
          >
            {{ t("status") }} :
            <strong>
              {{ t(Invoice.status_text) }}
            </strong>
          </v-col>
          <v-col
              cols="12"
              sm="6"
              class="d-flex px-1 d-sm-block justify-space-between"
          >
            {{ Invoice.status_text.includes('return') ? 'تاریخ درخواست مرجوعی' : t('date') }} :
            <strong>
              {{ usePersianDate(Invoice.document_date).toString(dateString) }}
            </strong>
          </v-col>
          <v-col
              v-if="Invoice.send_date"
              cols="12"
              sm="6"
              class="d-flex px-1 d-sm-block justify-space-between"
          >
            {{ t("delivery_date") }} :
            <strong>
              {{ usePersianDate(Invoice.send_date).toString(dateString) }}
            </strong>
          </v-col>
          <v-col
              v-if="Invoice.send_date"
              cols="12"
              sm="6"
              class="d-flex px-1 d-sm-block justify-space-between"
          >
            {{ t("delivery_time") }}:
            <strong>
              {{ Invoice.send_time }}
            </strong>
          </v-col>
          <v-col
              v-if="Invoice.receiver_address"
              cols="12"
              class="px-1"
          >
            {{ t("delivery_address") }}:
            <strong style="line-height: 1.5rem">
              {{ Invoice.receiver_address }}
            </strong>
          </v-col>
        </v-row>
        <v-row class="pa-0" dense v-if="Invoice.status === 9 || Invoice.status === 10">
          <v-col cols="12" class="pa-0">
            <v-card variant="tonal" color="blue" class="pa-0">
              <v-card-title class="text-wrap text-subtitle-2">
                برای درخواست مرجوعی، پس از ارسال ، درخواست شما بررسی می‌شود و در صورتی که تایید شود، فرآیند ثبت و تایید
                مرجوعی انجام خواهد شد.
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-table
              class="border-sm mx-0 border-primary border-opacity-75 rounded-lg my-3"
              style="width:100%"
          >
            <thead>
            <tr>
              <th class="text-no-wrap text-center">
                {{ t("product_title") }}
              </th>
              <th class="text-no-wrap text-center">
                {{ t("brand") }}
              </th>
              <th class="text-no-wrap text-center">
                {{ Invoice.status_text.includes('return') ? 'تعداد مرجوعی' : t("quantity") }}
              </th>
              <th class="text-no-wrap text-center">
                {{ t("price") }}
              </th>
              <th class="text-no-wrap text-center">
                {{ t("discount") }}
              </th>
              <th class="text-no-wrap text-center">
                {{ Invoice.status_text.includes('return') ? 'مبلغ قابل استرداد' : t("total_price") }}
              </th>
              <th class="text-no-wrap text-center">
                نوع پرداخت
              </th>
              <th class="text-no-wrap text-center">
                تعداد اقساط
              </th>
              <th class="text-no-wrap text-center">
                مبلغ هر قسط
              </th>
              <th class="text-no-wrap text-center">
                مبلغ پیش پرداخت
              </th>
            </tr>
            </thead>
            <tbody>
            <template
                v-for="(item, i) in Invoice.invoice_details"
                :key="i"
            >
              <tr :class="item.dynamic_column_01 || (Invoice.status_text.includes('return') && item.description) ? 'no-border' : ''">
                <td class="text-center text-no-wrap">
                  {{ item.price_kind === 0 ? 'خرید' : item.price_kind === 1 ? 'تمدید' : 'تجدید' }}
                  {{
                    item.products.type_code === 1 ? 'محصول' : item.products.type_code === 2 ? 'خدمات' : item.products.type_code === 3 ? 'کارت' : 'دوره'
                  }}
                  {{ item.products['title_' + language] }}
                </td>
                <td class="text-center text-no-wrap">{{ item.products['brand_' + language] }}</td>
                <td class="text-center">{{ item.amount }}</td>
                <td class="text-center">{{ $numberWithSeparator(item.unit_price) }}</td>
                <td class="text-center">{{ $numberWithSeparator(item.discount_price) }}</td>
                <td class="text-center">{{ $numberWithSeparator(item.total_price) }}</td>
                <td class="text-center">{{ item.product_installment_plan_id ? 'قسطی' : 'نقدی' }}</td>
                <td class="text-center">{{ item.product_installment_plan_id ? item.installment_count : '---' }}</td>
                <td class="text-center">
                  {{
                    item.product_installment_plan_id ? $numberWithSeparator(item.installment_amount) : '---'
                  }}
                </td>
                <td class="text-center">
                  {{ item.product_installment_plan_id ? $numberWithSeparator(item.cash_amount) : '---' }}
                </td>
              </tr>
              <tr v-if="Invoice.status_text.includes('return') && item.description" class="dynamic-row pa-2">
                <td
                    colspan="12"
                    class="text-start pa-2"
                    style="max-height: 40px;height: 40px"
                >
              <span class="text-subtitle-2 text-medium-emphasis mb-2 font-weight-regular">
                علت مرجوعی
              </span>
                  <span class="mx-1">
                :
              </span>
                  <template v-if="item.return_reason_title">
                <span
                    class="text-medium-emphasis font-weight-regular text-subtitle-2"
                    style="line-height: 1.5rem; white-space: normal; word-wrap: break-word;"
                >
                 {{ item.return_reason_title }}
                </span>
                    <span class="mx-1">
                  -
                </span>
                  </template>
                  <span class="text-medium-emphasis font-weight-regular text-subtitle-2"
                        style="line-height: 1.5rem; white-space: normal; word-wrap: break-word;">
                {{ item.description }}
              </span>
                </td>
              </tr>
              <tr v-else-if="item.dynamic_column_01" class="dynamic-row">
                <td
                    colspan="2"
                    class="text-center pa-2"
                    style="max-height: 40px;height: 40px;max-width: 120px;border-top: 4px solid #ccd5ae;"
                >
                  <p
                      class="text-medium-emphasis text-caption"
                      style="line-height: 1.5rem"
                  >
                    {{ JSON.parse(item.dynamic_column_01).product_id }} -
                    {{ JSON.parse(item.dynamic_column_01).product_title }}
                  </p>
                </td>
                <td
                    colspan="10"
                    class="text-center ps-0"
                    style="max-height: 40px;height: 40px"
                >
                  <div
                      class="d-flex text-start align-center text-medium-emphasis text-subtitle-1"
                  >
                    <template
                        v-for="i in JSON.parse(item.dynamic_column_01).attibs"
                        class="d-flex align-center"
                    >
                      <v-divider
                          :thickness="1"
                          class="mx-2"
                          vertical
                          style="opacity: 1"
                      />
                      <p
                          class="me-1 text-caption"
                      >
                        {{ i.title }}
                      </p> :
                      <p
                          class="ms-1 text-caption"
                      >
                        {{ i.reslt }}
                      </p>
                    </template>
                  </div>
                </td>
              </tr>
            </template>
            </tbody>
          </v-table>
        </v-row>
        <v-row
            dense
            class="py-3 text-body-2"
        >
          <v-col
              cols="12"
              sm="6"
              class="px-0"
          >
            <v-row v-if="Invoice.description" class="pb-5">
              <v-col cols="12" class="px-1 d-flex justify-space-between">
                {{ t("description") }}:
              </v-col>
              <v-col cols="12" class="px-1 py-0">
                <strong style="line-height: 1.75rem">
                  {{ Invoice.description }}
                </strong>
              </v-col>
            </v-row>
          </v-col>
          <v-col
              cols="12"
              sm="6"
              class="px-0"
          >
            <v-row>
              <v-col
                  cols="12"
                  class="d-flex px-1 justify-space-between"
              >
                <p>
                  {{ t("order_value") }}:
                </p>
                <strong>
                  {{ $numberWithSeparator(Invoice.impure_price) }}
                  {{ t(Invoice.currency_symbol) }}
                </strong>
              </v-col>
              <template v-if="!Invoice.status_text.includes('return')">
                <v-col
                    cols="12"
                    class="d-flex px-1 justify-space-between"
                >
                  <p>
                    {{ t("send_price") }} :
                  </p>
                  <strong>
                    {{ $numberWithSeparator(Invoice.send_price ?? 0) }}
                    {{ t(Invoice.currency_symbol) }}
                  </strong>
                </v-col>
                <v-col
                    cols="12"
                    class="d-flex px-1 justify-space-between"
                >
                  <p>
                    {{ t("تخفیف پایه") }} :
                  </p>
                  <strong>
                    {{ $numberWithSeparator(Invoice.discount_price) }} {{ t(Invoice.currency_symbol) }}
                  </strong>
                </v-col>
                <v-col
                    cols="12"
                    class="d-flex px-1 justify-space-between"
                >
                  <p>
                    {{ t("کد تخفیف") }} :
                  </p>
                  <strong>
                    {{ $numberWithSeparator(Invoice.other_price ?? 0) }} {{ t(Invoice.currency_symbol) }}
                  </strong>
                </v-col>
              </template>
              <v-col
                  cols="12"
                  class="d-flex px-1 justify-space-between"
              >
                <p>
                  {{ Invoice.status_text.includes('return') ? t('مبلغ کل قابل استرداد') : t("total_price") }} :
                </p>
                <strong>
                  {{ $numberWithSeparator(Invoice.total_price) }} {{ t(Invoice.currency_symbol) }}
                </strong>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex align-center justify-center flex-wrap px-3">
        <v-spacer/>
        <v-btn
            v-if="Invoice.status_text.includes('return') && Invoice.status === 9"
            variant="tonal"
            rounded="lg"
            :rounded="roundedTheme"
            color="error"
            @click="openDialogChangeStatus"
        >
          {{ t('لغو مرجوعی') }}
        </v-btn>
        <v-btn
            v-if="Invoice.status === 6 && Invoice.returnable"
            variant="tonal"
            rounded="lg"
            :rounded="roundedTheme"
            color="info"
            @click="openDialogReturnedGoods()"
        >
          {{ t('ثبت مرجوعی') }}
        </v-btn>
        <v-btn
            v-if="successBtnText"
            variant="outlined"
            :rounded="roundedTheme"
            color="green"
            :to="successBtnLink + (successBtnParameter ? '?invoiceID='+Invoice.id : '')"
        >
          {{ t(successBtnText) }}
        </v-btn>
        <v-btn
            v-if="Invoice.status === 3 || Invoice.status === 4 || Invoice.status === 5 || Invoice.status === 6"
            color="warning"
            variant="tonal"
            rounded="lg"
            :rounded="roundedTheme"
            @click="dialogAcc=true"
        >
          تراکنش ها
        </v-btn>
        <PanelPrintInvoice
            v-if="Invoice.status === 11 || Invoice.status === 6"
            :data="Invoice"
            rounded="lg"
            :custom="customizer.allOptions"
            color="blue"
            kind="invoice"
        />
        <v-btn
            variant="tonal"
            rounded="lg"
            :rounded="roundedTheme"
            @click="dialog = false"
        >
          {{ t("close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
      v-model="dialogTransactions"
      persistent
      max-width="90%"
  >
    <v-card v-if="!$objectIsEmpty(Transactions)"
            class="pb-8 pt-0 px-5"
    >
      <v-card-title class="px-0 d-flex justify-space-between">
        <h3 class="py-2">{{ t('transactions') }}</h3>
        <v-spacer/>
        <v-btn
            @click="dialogTransactions = false"
            :ripple="false"
            flat
            density="compact"
            icon="mdi-close"
        />
      </v-card-title>
      <v-card-text
          class="pa-0"
      >
        <v-table
            fixed-header
            height="450"
            :hover="true"
        >
          <thead>
          <tr>
            <th>{{ t('code') }}</th>
            <th>{{ t('status') }}</th>
            <th>{{ t('date') }}</th>
            <th>{{ t('kind') }}</th>
            <th>{{ t('amount') }} ({{ t(Transactions.currency_name) }})</th>
            <th>{{ t('tracking_code') }}</th>
            <th>{{ t('gateway') }}</th>
            <th>{{ t('description') }}</th>
            <th
                class="d-flex pa-0"
            >
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(item , index) in Transactions"
              :key="index"
          >
            <td>{{ item.wallet_transactions_id }}</td>
            <td>
              <v-chip
                  :color="getStatusColor(item.status_text)"
              >
                  <span class="text-subtitle-2">
                    {{ t(item.status_text) }}
                  </span>
              </v-chip>
            </td>
            <td
                class="en-text"
            >
              {{
                usePersianDate(item.document_date).addHour(customizer.garnetTimeZone.H).addMinute(customizer.garnetTimeZone.M).toString(customizer.garnetDateFormat + " HH:mm")
              }}
            </td>
            <td>
              <v-chip
                  :color="getStatusColor(item.kind_text)"
              >
                  <span class="text-subtitle-2">
                    {{ t(item.kind_text) }}
                  </span>
              </v-chip>
            </td>
            <td
                class="en-text text-end"
            >
              {{ numberSeparator(item.amount) }}
            </td>
            <td>{{ item.tracking_code }}</td>
            <td>
              <v-avatar
                  :image="item.gateway_image"
                  tile
                  size="24"
                  class="me-2"
              />
              {{ item.gateway_title }}
            </td>
            <td>{{ item.description }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions
          class="pa-0 pt-5"
      >
        <v-spacer/>
        <v-btn
            variant="tonal"
            :text="t('close')"
            @click="dialogTransactions = false"
        />
      </v-card-actions>
    </v-card>
    <v-card v-else-if="$objectIsEmpty(Transactions)">
      <v-empty-state
          icon="$info"
          :headline="t('no_transactions')"
      />
      <div
          class="text-center my-2"
      >
        <v-btn
            variant="tonal"
            width="15px"
            :text="t('close')"
            @click="dialogTransactions = false"
        />
      </div>
    </v-card>
  </v-dialog>

  <v-dialog
      v-model="dialogReturnedGoods"
      persistent
      max-width="600"
      transition="dialog-bottom-transition"
  >
    <v-card class="pa-4 elevation-12 rounded-lg">
      <v-card-title class="px-0 d-flex justify-space-between align-center">
        <h3 class="text-h6 font-weight-bold">{{ t('select_return_items') }}</h3>
        <v-btn
            @click="dialogReturnedGoods = false"
            :ripple="false"
            flat
            density="compact"
            icon="mdi-close"
        />
      </v-card-title>
      <v-card-item class="px-2 pt-0 overflow-y-auto" style="max-height: 50dvh;">
        <template v-for="item in returnData" :key="item.id">
          <v-card variant="outlined" elevation="1" class="my-4 rounded-lg">
            <v-row no-gutters>
              <v-col cols="5" md="4" class="px-md-4 px-2 py-2 d-flex align-center justify-center">
                <v-img
                    width="100"
                    height="100"
                    rounded="lg"
                    cover
                    :src="item.product.cover_image"
                >
                  <template #placeholder>
                    <v-skeleton-loader class="return-image-card" width="100%" type="image"/>
                  </template>
                </v-img>
              </v-col>
              <v-col cols="7" md="8" class="d-flex align-start">
                <v-row dense class="d-flex align-start">
                  <v-col cols="12">
                    <p class="text-md-subtitle-1 pe-2 text-subtitle-2 pt-2 font-weight-regular">
                      {{ item.product.title_fa }}
                    </p>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="px-4 py-0" dense>
              <v-col cols="12" class="mb-2">
                <v-card variant="tonal" color="info" rounded="lg" class="pa-2">
                  <v-card-title>
                    <p v-if="item.price_kind !== 0" class="text-caption text-medium-emphasis">
                      این ردیف قابل برگشت نیست
                    </p>
                    <p v-else class="text-caption text-medium-emphasis">
                      <template v-if="item.max_return_amount === 0">
                        تمامی {{ item.amount }} عدد از این محصول مرجوع شده است.
                      </template>
                      <template v-else>
                        از مجموع {{ item.amount }} عدد، {{ item.return_amount }} عدد مرجوع شده است.
                      </template>
                    </p>
                  </v-card-title>
                </v-card>
              </v-col>
              <template v-if="item.max_return_amount !== 0 && item.price_kind === 0">
                <v-col md="6" cols="12" class="d-flex align-center">
                  <v-text-field
                      v-model="item.return"
                      type="number"
                      label="تعداد مرجوعی"
                      variant="outlined"
                      density="compact"
                      :min="0"
                      :max="item.max_return_amount"
                      hide-details
                      rounded="lg"
                      class="mb-2"
                      @keyup="item.return = formatInput(item)"
                  />
                </v-col>
                <v-col md="6" cols="12" class="d-flex align-center">
                  <v-select
                      v-model="item.return_reason"
                      variant="outlined"
                      :items="returnReasons"
                      :label="t('return_reason')"
                      item-value="id"
                      item-title="title"
                      density="compact"
                      class="mb-2"
                      rounded="lg"
                      hide-details
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                      v-model="item.return_description"
                      :placeholder="t('description')"
                      :rows="3"
                      outlined
                      hide-details
                      density="compact"
                      rounded="lg"
                      variant="outlined"
                      hide-spin-buttons
                      class="mb-4"
                  />
                </v-col>
              </template>
            </v-row>
          </v-card>
        </template>
      </v-card-item>
      <v-card-actions class="pa-0 pt-5">
        <v-spacer/>
        <v-btn
            variant="tonal"
            class="rounded-lg"
            :text="t('close')"
            @click="dialogReturnedGoods = false"
        />
        <v-btn
            variant="elevated"
            class="rounded-lg"
            color="info"
            flat
            :loading="submitReturnLoading"
            :disabled="isAllReturned || submitReturnLoading"
            :text="t('submit')"
            @click="submitReturnItems()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
      v-model="dialogChangeStatus"
      persistent
      max-width="600"
      transition="dialog-bottom-transition"
  >
    <v-card class="pa-4 elevation-12 rounded-lg">
      <v-card-title class="px-0 d-flex justify-space-between align-center">
        <h3 class="text-h6 font-weight-bold">{{ t('درخواست لغو از مرجوعی') }}</h3>
        <v-btn
            @click="dialogChangeStatus = false"
            :ripple="false"
            flat
            density="compact"
            icon="mdi-close"
        />
      </v-card-title>
      <v-card-text class="px-1">
        آیا از مرجوع کردن محصولات منصرف شده اید؟
      </v-card-text>
      <v-card-actions>
        <v-btn
            variant="tonal"
            color="orange"
            @click="updateStatus(Invoice.id,12)"
        >
          تایید لغو از مرجوعی
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<style>
.no-border td, .no-border th {
  border: none !important;
}

.dynamic-row td {
  border-top: 1px solid #e5e5e5 !important;
}
</style>



