'use client';

import FormsBrowser from '../../../features/forms/FormsBrowser';
import { getFormsByCategory, CATEGORY_COMPLAINT } from '../../../features/forms/sampleForms';
import { getSection } from '../../../lib/navigation/sections';

export default function ComplaintsPage() {
  const section = getSection('complaints');
  // Sample data for now — swap for useFormData('m_forms') when the endpoint is ready.
  const forms = getFormsByCategory(CATEGORY_COMPLAINT);

  return (
    <FormsBrowser
      title={section.title}
      description="پیگیری مشکلات آموزشی و رفاهی تا رسیدن به نتیجه"
      icon={section.icon}
      forms={forms}
      loginReason="برای ثبت شکایت باید وارد حساب دانشجویی خود شوید."
    />
  );
}
