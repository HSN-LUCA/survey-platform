'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLogin from '@/components/AdminLogin';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push('/admin/surveys');
    }
  }, [router]);

  return <AdminLogin />;
}
