import type { Metadata } from 'next';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StayForm from '@/components/admin/StayForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'New stay',
  robots: { index: false, follow: false },
};

export default function NewStayPage() {
  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Content"
        title="Add a stay"
        description="New stays appear on the public site immediately. Prices are in RWF per night."
      />
      <StayForm />
    </div>
  );
}
