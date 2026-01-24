import ClientAdmin from './ClientAdmin';

// ⚡ PERFORMANCE: Cache this page for 5 minutes
export const revalidate = 300;

export default function AdminDashboard() {
    return <ClientAdmin />;
}
