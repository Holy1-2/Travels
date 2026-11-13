'use client';

import { usePathname } from 'next/navigation';

/**
 * The public site keeps its header and footer, while the admin panel is a
 * separate full-screen workspace.
 */
export default function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin' || pathname?.startsWith('/admin/');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {header}
      {children}
      {footer}
    </>
  );
}
