import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DeleteButton from '@/components/admin/DeleteButton';
import ExperienceForm from '@/components/admin/ExperienceForm';
import { getExperienceBySlug } from '@/lib/server/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edit experience',
  robots: { index: false, follow: false },
};

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = getExperienceBySlug(slug);
  if (!experience) notFound();

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Content"
        title={`Edit ${experience.name}`}
        description="Changes go live on the public site as soon as you save."
        action={
          <DeleteButton
            url={`/api/admin/experiences/${encodeURIComponent(experience.slug)}`}
            label="Delete experience"
            confirmMessage={`Delete “${experience.name}”? This cannot be undone.`}
            redirectTo="/admin/experiences"
          />
        }
      />
      <ExperienceForm experience={experience} />
    </div>
  );
}
