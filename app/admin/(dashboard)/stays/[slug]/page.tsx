import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DeleteButton from '@/components/admin/DeleteButton';
import StayForm from '@/components/admin/StayForm';
import { getStayBySlug } from '@/lib/server/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edit stay',
  robots: { index: false, follow: false },
};

export default async function EditStayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stay = getStayBySlug(slug);
  if (!stay) notFound();

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Content"
        title={`Edit ${stay.name}`}
        description="Changes go live on the public site as soon as you save."
        action={
          <DeleteButton
            url={`/api/admin/stays/${encodeURIComponent(stay.slug)}`}
            label="Delete stay"
            confirmMessage={`Delete “${stay.name}”? This cannot be undone.`}
            redirectTo="/admin/stays"
          />
        }
      />
      <StayForm stay={stay} />
    </div>
  );
}
