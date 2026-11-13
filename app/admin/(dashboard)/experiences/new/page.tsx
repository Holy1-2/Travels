import type { Metadata } from 'next';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ExperienceForm from '@/components/admin/ExperienceForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'New experience',
  robots: { index: false, follow: false },
};

export default function NewExperiencePage() {
  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Content"
        title="Add an experience"
        description="New experiences appear on the public site immediately. Prices are in RWF per person."
      />
      <ExperienceForm />
    </div>
  );
}
