import type { Metadata } from 'next';
import { Mail, MapPin, MessageSquare, Phone, Users } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ListingRequestStatus from '@/components/admin/ListingRequestStatus';
import { getListingRequests } from '@/lib/server/content';
import { regionMap } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin host requests',
  robots: { index: false, follow: false },
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function AdminListingRequestsPage() {
  const requests = getListingRequests();
  const pending = requests.filter((request) => request.status === 'new').length;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Hosts"
        title="Listing requests"
        description={
          requests.length
            ? `${requests.length} ${
                requests.length === 1 ? 'property' : 'properties'
              } submitted through the “List your property” form${
                pending ? ` · ${pending} new` : ''
              }.`
            : 'Properties submitted through the “List your property” form will appear here.'
        }
      />

      {requests.length ? (
        <div className="grid gap-3">
          {requests.map((request) => (
            <article key={request.id} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-[16px] font-semibold tracking-[-0.02em] text-ink">
                    {request.propertyName}
                  </h2>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-mute">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                      {regionMap[request.region as keyof typeof regionMap]?.name ?? request.region}
                    </span>
                    <span>{request.propertyType}</span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" strokeWidth={1.8} />
                      {request.rooms} {request.rooms === 1 ? 'room' : 'rooms'}
                    </span>
                    <span className="text-mute/70">Received {formatDate(request.createdAt)}</span>
                  </p>
                </div>
                <ListingRequestStatus id={request.id} status={request.status} />
              </div>

              <div className="mt-4 grid gap-3 border-t border-line pt-4 text-[12.5px] sm:grid-cols-2">
                <div>
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-mute">
                    Contact
                  </p>
                  <p className="mt-1 font-medium text-ink">{request.contactName}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-mute">
                    <a
                      href={`mailto:${request.email}`}
                      className="inline-flex items-center gap-1 hover:text-forest"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {request.email}
                    </a>
                    <a
                      href={`tel:${request.phone}`}
                      className="inline-flex items-center gap-1 hover:text-forest"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {request.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-mute">
                    Notes
                  </p>
                  {request.notes ? (
                    <p className="mt-1 whitespace-pre-line leading-relaxed text-mute">
                      {request.notes}
                    </p>
                  ) : (
                    <p className="mt-1 text-mute/70">No notes provided.</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-mute/60" strokeWidth={1.5} />
          <p className="mt-3 text-[14px] font-medium text-ink">No host requests yet</p>
          <p className="mt-1 text-[12.5px] text-mute">
            When a host submits their property, it lands here for review.
          </p>
        </div>
      )}
    </div>
  );
}
