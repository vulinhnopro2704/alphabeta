'use client';
import { useNetwork } from '@/hooks/use-network';

export default function Home() {
  const [isOnline, _] = useNetwork();
  return (
    <>
      <main>
        <span>Status: {isOnline ? 'Online' : 'Offline'}</span>
      </main>
    </>
  );
}
