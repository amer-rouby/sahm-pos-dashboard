import { Injectable, signal } from '@angular/core';
import { Order, ProductCategory } from '../models/models';
import { statusLabel } from '../utils/order-utils';

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

type TranslationKey = keyof typeof translations.en;

const translations = {
  ar: {
    operations: 'عمليات سهم فود',
    title: 'مساحة إدارة الطلبات الذكية',
    language: 'English',
    theme: 'الوضع الداكن',
    lightTheme: 'الوضع الفاتح',
    activeOrders: 'الطلبات النشطة',
    kitchenLoad: 'ضغط المطبخ',
    delayed: 'متأخرة',
    queuedActions: 'إجراءات معلقة',
    liveQueue: 'قائمة مباشرة',
    orders: 'الطلبات',
    autoUpdates: 'تحديث تلقائي',
    eta: 'الوقت المتوقع',
    minutes: 'دقيقة',
    ai: 'المساعد',
    advance: 'تقدم الحالة',
    kitchenMonitor: 'مراقبة المطبخ',
    activeTickets: 'تذاكر نشطة',
    averagePrep: 'متوسط التحضير',
    thinking: 'يحلل المخاطر وفرص البيع الإضافي...',
    noRecommendation: 'لا توجد توصية محملة بعد.',
    retry: 'إعادة المحاولة',
    productSearch: 'بحث المنتجات',
    catalog: 'كتالوج الإضافة السريعة',
    results: 'نتائج',
    searchPlaceholder: 'ابحث باسم المنتج أو الوسم أو مسبب الحساسية...',
    recent: 'آخر عمليات البحث:',
    queuedTitle: 'إجراء متفائل معلق',
    queuedText: 'سيتم مزامنة الإجراءات عند عودة الاتصال. الضغط المتكرر لا يكرر العملية.',
    reconnect: 'إعادة الاتصال',
    goOffline: 'قطع الاتصال',
    currency: 'ج.م',
    noAllergy: 'لا توجد ملاحظة حساسية.',
    infoComplete: 'بيانات العميل مكتملة.',
    healthyPriority: 'الأولوية سليمة.',
    strongBasket: 'قيمة الطلب جيدة؛ ركز على السرعة.'
  },
  en: {
    operations: 'Sahm Food Operations',
    title: 'Smart Order Workspace',
    language: 'العربية',
    theme: 'Dark mode',
    lightTheme: 'Light mode',
    activeOrders: 'Active orders',
    kitchenLoad: 'Kitchen load',
    delayed: 'Delayed',
    queuedActions: 'Queued actions',
    liveQueue: 'Live Queue',
    orders: 'Orders',
    autoUpdates: 'Auto updates',
    eta: 'ETA',
    minutes: 'min',
    ai: 'AI',
    advance: 'Advance',
    kitchenMonitor: 'Kitchen Monitor',
    activeTickets: 'active tickets',
    averagePrep: 'Average prep',
    thinking: 'Thinking through risks and opportunities...',
    noRecommendation: 'No recommendation loaded yet.',
    retry: 'Retry',
    productSearch: 'Product Search',
    catalog: 'Fast add catalog',
    results: 'results',
    searchPlaceholder: 'Search product, tag, allergen...',
    recent: 'Recent:',
    queuedTitle: 'optimistic action queued',
    queuedText: 'Actions will sync once the cashier reconnects. Duplicate clicks are ignored.',
    reconnect: 'Reconnect',
    goOffline: 'Go offline',
    currency: 'EGP',
    noAllergy: 'No allergy note detected.',
    infoComplete: 'Customer information is complete.',
    healthyPriority: 'Priority looks healthy.',
    strongBasket: 'Basket value is strong; focus on speed.'
  }
} as const;

@Injectable({ providedIn: 'root' })
export class UiPreferencesService {
  readonly language = signal<Language>('ar');
  readonly theme = signal<Theme>('light');

  t(key: TranslationKey): string {
    return translations[this.language()][key];
  }

  toggleLanguage(): void {
    this.language.update((current) => current === 'ar' ? 'en' : 'ar');
  }

  toggleTheme(): void {
    this.theme.update((current) => current === 'light' ? 'dark' : 'light');
  }

  themeLabel(): string {
    return this.theme() === 'light' ? this.t('theme') : this.t('lightTheme');
  }

  dir(): 'rtl' | 'ltr' {
    return this.language() === 'ar' ? 'rtl' : 'ltr';
  }

  connectionLabel(value: 'online' | 'offline' | 'recovering'): string {
    if (this.language() === 'en') {
      return value;
    }
    return { online: 'متصل', offline: 'غير متصل', recovering: 'جار الاستعادة' }[value];
  }

  kitchenLabel(value: 'starting' | 'calm' | 'busy' | 'overloaded'): string {
    if (this.language() === 'en') {
      return value;
    }
    return { starting: 'يبدأ', calm: 'هادئ', busy: 'مشغول', overloaded: 'مضغوط' }[value];
  }

  statusLabel(status: Order['status']): string {
    if (this.language() === 'en') {
      return statusLabel(status);
    }
    return {
      received: 'مستلم',
      preparing: 'قيد التحضير',
      ready: 'جاهز',
      delivered: 'تم التوصيل',
      completed: 'مكتمل'
    }[status];
  }

  priorityLabel(priority: Order['priority']): string {
    if (this.language() === 'en') {
      return priority;
    }
    return { normal: 'عادي', rush: 'عاجل', delayed: 'متأخر' }[priority];
  }

  channelLabel(channel: Order['channel']): string {
    if (this.language() === 'en') {
      return channel;
    }
    return { 'walk-in': 'داخل الفرع', delivery: 'توصيل', online: 'أونلاين' }[channel];
  }

  categoryLabel(category: ProductCategory | 'All'): string {
    if (this.language() === 'en') {
      return category;
    }
    return {
      All: 'الكل',
      Burgers: 'برجر',
      Sides: 'إضافات',
      Drinks: 'مشروبات',
      Desserts: 'حلويات',
      Breakfast: 'إفطار'
    }[category];
  }

  assistantStateLabel(state = 'idle'): string {
    if (this.language() === 'en') {
      return state;
    }
    return {
      idle: 'جاهز',
      loading: 'تحميل',
      streaming: 'يتدفق',
      ready: 'مكتمل',
      error: 'خطأ'
    }[state] ?? state;
  }

  productName(name: string): string {
    if (this.language() === 'en') {
      return name;
    }
    return productNamesAr[name] ?? name;
  }

  assistantText(value: string): string {
    if (this.language() === 'en') {
      return value;
    }
    return value
      .replace(/Allergy warning: respect "No sesame"\./g, 'تحذير حساسية: ممنوع استخدام السمسم.')
      .replace(/Missing delivery info: Apartment number\./g, 'بيانات توصيل ناقصة: رقم الشقة.')
      .replace(/Escalate: delayed order needs manager attention\./g, 'تصعيد: الطلب المتأخر يحتاج انتباه المدير.')
      .replace(/Upsell suggestion: add loaded fries or a dessert combo\./g, 'اقتراح بيع إضافي: أضف بطاطس محملة أو كومبو حلوى.')
      .replace(/No allergy note detected\./g, this.t('noAllergy'))
      .replace(/Customer information is complete\./g, this.t('infoComplete'))
      .replace(/Priority looks healthy\./g, this.t('healthyPriority'))
      .replace(/Basket value is strong; focus on speed\./g, this.t('strongBasket'))
      .replace(/AI service timed out while checking delivery risk/g, 'انتهت مهلة المساعد أثناء فحص مخاطر التوصيل');
  }
}

const productNamesAr: Record<string, string> = {
  'Classic Beef Burger': 'برجر لحم كلاسيك',
  'Smoked Mushroom Burger': 'برجر مشروم مدخن',
  'Chicken Ranch Wrap': 'راب دجاج رانش',
  'Breakfast Egg Muffin': 'مافن بيض للإفطار',
  'Falafel Slider Box': 'بوكس سلايدر فلافل',
  'Loaded Fries': 'بطاطس محملة',
  'Crispy Onion Rings': 'حلقات بصل مقرمشة',
  'Iced Lemon Mint': 'ليمون نعناع مثلج',
  'Chocolate Pudding': 'بودينج شوكولاتة',
  'Caramel Date Sundae': 'صنداي تمر بالكراميل'
};
