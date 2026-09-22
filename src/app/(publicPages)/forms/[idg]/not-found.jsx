import Link from 'next/link';
import { ClipboardListIcon, FolderXIcon, HomeIcon } from 'lucide-react';

import StatusPage from '../../../../components/Error/StatusPage';
import { Button } from '../../../../components/ui/button';

/**
 * Rendered when the category page calls notFound(): the id in the URL is not
 * in the student's category list (`m_group`), so it is a dead link rather
 * than an empty category.
 */
export default function GroupNotFound() {
  return (
    <StatusPage
      icon={FolderXIcon}
      title="این دسته‌بندی وجود ندارد"
      description="دسته‌ای با این شناسه در فهرست فرم‌های شما نیست. شاید حذف شده یا آدرس اشتباه باشد."
    >
      <Button asChild className="h-10 px-5">
        <Link href="/forms">
          <ClipboardListIcon className="size-4" />
          دسته‌بندی فرم‌ها
        </Link>
      </Button>
      <Button asChild variant="outline" className="h-10 px-5">
        <Link href="/">
          <HomeIcon className="size-4" />
          خانه
        </Link>
      </Button>
    </StatusPage>
  );
}
