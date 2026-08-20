/**
 * Sample forms for local development and preview.
 *
 * The form pages render these until the real `m_forms` endpoint is wired up,
 * so the app is explorable without a backend or an account. The shape mirrors
 * exactly what FormGenerator/FormFlow consume:
 *   form    → { formId, title, category, description?, steps[] }
 *   step    → { stepId, title, numrow, sections[] }   (numrow > 1 = repeatable)
 *   section → { sectionId, title, type, required, placeholder?, options? }
 *
 * Section `type` codes come from FieldRenderer's FIELD_MAP:
 *   0 text · 1 textarea · 3 number · 4 single-select · 5 multi-select
 *   6 date · 7 uploader · 9 masked · 14 time
 *
 * `category` is ours, not the backend's — it routes a form to one of the two
 * form sections in the bottom navigation.
 */
export const CATEGORY_SURVEY = 'survey';
export const CATEGORY_COMPLAINT = 'complaint';

const sampleForms = [
  {
    formId: 'sample-course-survey',
    category: CATEGORY_SURVEY,
    title: 'نظرسنجی کیفیت دروس نیم‌سال',
    description: 'ارزیابی تدریس و محتوای دروس این نیم‌سال',
    steps: [
      {
        stepId: 'course-info',
        title: 'مشخصات درس',
        numrow: 1,
        sections: [
          {
            sectionId: 'course-name',
            title: 'نام درس',
            type: 0,
            required: true,
            placeholder: 'مثلاً ریاضی عمومی ۲',
          },
          {
            sectionId: 'faculty',
            title: 'دانشکده',
            type: 4,
            required: true,
            options: {
              eng: 'فنی و مهندسی',
              sci: 'علوم پایه',
              hum: 'علوم انسانی',
              art: 'هنر و معماری',
            },
          },
          {
            sectionId: 'semester',
            title: 'نیم‌سال تحصیلی',
            type: 4,
            required: true,
            options: { first: 'نیم‌سال اول', second: 'نیم‌سال دوم', summer: 'ترم تابستان' },
          },
        ],
      },
      {
        stepId: 'course-rating',
        title: 'ارزیابی',
        numrow: 1,
        sections: [
          {
            sectionId: 'teaching-quality',
            title: 'کیفیت تدریس استاد',
            type: 4,
            required: true,
            options: {
              5: 'بسیار خوب',
              4: 'خوب',
              3: 'متوسط',
              2: 'ضعیف',
              1: 'بسیار ضعیف',
            },
          },
          {
            sectionId: 'strengths',
            title: 'نقاط قوت درس',
            type: 5,
            required: false,
            placeholder: 'می‌توانید چند گزینه انتخاب کنید',
            options: {
              content: 'محتوای به‌روز',
              practice: 'تمرین‌های کاربردی',
              support: 'پاسخ‌گویی استاد',
              resources: 'منابع آموزشی مناسب',
            },
          },
          {
            sectionId: 'comment',
            title: 'پیشنهاد شما برای بهبود درس',
            type: 1,
            required: false,
            placeholder: 'نظر خود را بنویسید...',
          },
        ],
      },
    ],
  },
  {
    formId: 'sample-dorm-request',
    category: CATEGORY_SURVEY,
    title: 'درخواست خوابگاه دانشجویی',
    description: 'ثبت درخواست اسکان برای نیم‌سال پیش‌رو',
    steps: [
      {
        stepId: 'student-info',
        title: 'اطلاعات دانشجو',
        numrow: 1,
        sections: [
          {
            sectionId: 'student-number',
            title: 'شماره دانشجویی',
            type: 3,
            required: true,
            placeholder: '۴۰۲۱۲۳۴۵۶',
          },
          {
            sectionId: 'entry-year',
            title: 'سال ورود',
            type: 4,
            required: true,
            options: { 1402: '۱۴۰۲', 1403: '۱۴۰۳', 1404: '۱۴۰۴' },
          },
          {
            sectionId: 'home-city',
            title: 'شهر محل سکونت',
            type: 0,
            required: true,
            placeholder: 'مثلاً تبریز',
          },
        ],
      },
      {
        stepId: 'dorm-preferences',
        title: 'ترجیحات',
        numrow: 1,
        sections: [
          {
            sectionId: 'room-type',
            title: 'نوع اتاق درخواستی',
            type: 4,
            required: true,
            options: { two: 'دو نفره', four: 'چهار نفره', six: 'شش نفره' },
          },
          {
            sectionId: 'move-in-date',
            title: 'تاریخ اسکان',
            type: 6,
            required: true,
          },
          {
            sectionId: 'notes',
            title: 'توضیحات تکمیلی',
            type: 1,
            required: false,
            placeholder: 'در صورت نیاز توضیح دهید',
          },
        ],
      },
    ],
  },
  {
    formId: 'sample-event-feedback',
    category: CATEGORY_SURVEY,
    title: 'بازخورد رویداد هفته پژوهش',
    description: 'نظر شما درباره نشست‌های هفته پژوهش',
    steps: [
      {
        stepId: 'attendance',
        title: 'حضور در رویداد',
        numrow: 1,
        sections: [
          {
            sectionId: 'attended-sessions',
            title: 'در کدام نشست‌ها شرکت کردید؟',
            type: 5,
            required: true,
            options: {
              opening: 'نشست افتتاحیه',
              workshop: 'کارگاه مقاله‌نویسی',
              panel: 'میزگرد فناوری',
              closing: 'اختتامیه و تقدیر',
            },
          },
          {
            sectionId: 'arrival-time',
            title: 'ساعت ورود شما',
            type: 14,
            required: false,
          },
          {
            sectionId: 'overall-rating',
            title: 'رضایت کلی از رویداد',
            type: 4,
            required: true,
            options: {
              5: 'کاملاً راضی',
              4: 'راضی',
              3: 'نظری ندارم',
              2: 'ناراضی',
              1: 'کاملاً ناراضی',
            },
          },
          {
            sectionId: 'suggestion',
            title: 'پیشنهاد برای رویدادهای بعدی',
            type: 1,
            required: false,
            placeholder: 'چه موضوعی را دوست دارید ببینید؟',
          },
        ],
      },
    ],
  },
  {
    formId: 'sample-education-complaint',
    category: CATEGORY_COMPLAINT,
    title: 'شکایت از خدمات آموزشی',
    description: 'ثبت شکایت درباره کلاس‌ها، اساتید یا امور آموزش',
    steps: [
      {
        stepId: 'complaint-subject',
        title: 'موضوع شکایت',
        numrow: 1,
        sections: [
          {
            sectionId: 'complaint-area',
            title: 'حوزه شکایت',
            type: 4,
            required: true,
            options: {
              class: 'برگزاری کلاس‌ها',
              exam: 'امتحانات و نمرات',
              registration: 'ثبت‌نام و انتخاب واحد',
              staff: 'برخورد کارکنان',
            },
          },
          {
            sectionId: 'complaint-date',
            title: 'تاریخ وقوع',
            type: 6,
            required: true,
          },
          {
            sectionId: 'complaint-text',
            title: 'شرح شکایت',
            type: 1,
            required: true,
            placeholder: 'موضوع را با جزئیات شرح دهید...',
          },
        ],
      },
      {
        stepId: 'complaint-evidence',
        title: 'مستندات و پیگیری',
        numrow: 1,
        sections: [
          {
            sectionId: 'complaint-file',
            title: 'بارگذاری مستندات',
            type: 7,
            required: false,
            placeholder: 'تصویر یا فایل مرتبط (اختیاری)',
          },
          {
            sectionId: 'contact-method',
            title: 'روش پیگیری نتیجه',
            type: 4,
            required: true,
            options: { sms: 'پیامک', email: 'ایمیل', portal: 'کارتابل سامانه' },
          },
        ],
      },
    ],
  },
  {
    formId: 'sample-facility-complaint',
    category: CATEGORY_COMPLAINT,
    title: 'شکایت از امکانات رفاهی',
    description: 'خوابگاه، تغذیه، حمل‌ونقل و فضاهای عمومی',
    steps: [
      {
        stepId: 'facility-subject',
        title: 'جزئیات',
        numrow: 1,
        sections: [
          {
            sectionId: 'facility-type',
            title: 'بخش مورد شکایت',
            type: 4,
            required: true,
            options: {
              dorm: 'خوابگاه',
              food: 'سلف و تغذیه',
              transport: 'سرویس رفت‌وآمد',
              library: 'کتابخانه',
              sport: 'امکانات ورزشی',
            },
          },
          {
            sectionId: 'facility-urgency',
            title: 'فوریت رسیدگی',
            type: 4,
            required: true,
            options: { low: 'عادی', medium: 'مهم', high: 'فوری' },
          },
          {
            sectionId: 'facility-text',
            title: 'شرح مشکل',
            type: 1,
            required: true,
            placeholder: 'مشکل را توضیح دهید...',
          },
        ],
      },
    ],
  },
];

/** Forms belonging to one bottom-navigation section. */
export function getFormsByCategory(category, forms = sampleForms) {
  return (forms || []).filter((form) => form.category === category);
}

export default sampleForms;
