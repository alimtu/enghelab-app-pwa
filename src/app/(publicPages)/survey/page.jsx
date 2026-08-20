'use client';

import FormsBrowser from '../../../features/forms/FormsBrowser';
import { getFormsByCategory, CATEGORY_SURVEY } from '../../../features/forms/sampleForms';
import { getSection } from '../../../lib/navigation/sections';

export default function SurveyPage() {
  const section = getSection('survey');
  // Sample data for now — swap for useFormData('m_forms') when the endpoint is ready.
  const forms = getFormsByCategory(CATEGORY_SURVEY);

  return (
    <FormsBrowser
      title={section.title}
      description="نظر شما درباره دروس، رویدادها و خدمات دانشگاه"
      icon={section.icon}
      forms={forms}
      loginReason="برای شرکت در نظرسنجی باید وارد حساب دانشجویی خود شوید."
    />
  );
}
