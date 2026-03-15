import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminAdviserSidebar from '@/Components/AdminAdviserSidebar';
import SuperadminSidebar from '@/Components/SuperadminSidebar';
import PageTransition from '@/Components/PageTransition';
import CSGOfficerSidebar from '@/Components/CSGOfficerSidebar';

export default function AuthenticatedLayout({ header, children, ...props }) {
    const inertia = usePage();
    const page = inertia.props;
    const user = page && page.auth ? page.auth.user : null;

    const [isPageReady, setIsPageReady] = useState(false);

    useEffect(() => {
        // When Inertia provides the `auth` prop (even if null), we consider page ready
        if (inertia && Object.prototype.hasOwnProperty.call(inertia.props, 'auth')) {
            setIsPageReady(true);
        }
    }, [inertia]);

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        // show small loading state while Inertia resolves props to avoid flicker
        <div className="min-h-screen bg-gray-100">
            {!isPageReady ? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <p className="text-sm text-gray-500 mt-2">Loading...</p>
                    </div>
                </div>
            ) : null}

            {/* Render sidebar for adviser routes (adjust heuristics as needed) */}
            {(typeof window !== 'undefined' && window.location.pathname.startsWith('/adviser')) && (
                <AdminAdviserSidebar />
            )}

            {/* Render sidebar for sadmin routes */}
            {(typeof window !== 'undefined' && window.location.pathname.startsWith('/sadmin')) && (
                <SuperadminSidebar />
            )}

            {/* Render sidebar for csg routes */}
            {(typeof window !== 'undefined' && window.location.pathname.startsWith('/csg')) && (
                <CSGOfficerSidebar />
            )}

            <div className={(typeof window !== 'undefined' && (window.location.pathname.startsWith('/adviser') || window.location.pathname.startsWith('/sadmin') || window.location.pathname.startsWith('/csg'))) ? 'lg:ml-64' : ''}>
                <main className="pt-14 lg:pt-0">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>
            </div>
        </div>
    );
}
