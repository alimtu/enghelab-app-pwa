'use client';
import { Button } from '../components/ui/button';

export default function Error({ error, reset }) {
  return (
    <div className="h-full w-full min-h-screen flex flex-col items-center justify-center gap-8">
      <h2 className="text-danger-500 text-2xl font-bold">صفحه پیدا نشد</h2>
      <Button
        onClick={() => reset()}
        className="px-4 py-2"
      >
        تلاش مجدد
      </Button>
    </div>
  );
}
