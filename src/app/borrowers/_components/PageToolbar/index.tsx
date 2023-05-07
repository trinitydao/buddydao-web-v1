'use client';
import { Button } from '@/components/ui/Button';
import { Toolbar } from '@/components/ui/Toolbar';
import { useAccount } from 'wagmi';
import { useNewModalStore } from '../NewModal';

export function PageToolbar() {
  const { isConnected } = useAccount();

  const { open } = useNewModalStore();

  function handleOpen() {
    if (!isConnected) {
      alert('Please connect your wallet');
      return;
    }
    open();
  }
  return (
    <Toolbar>
      <Button variant="contained" size="large" shape="square" onClick={handleOpen}>
        NEW BORROWER
      </Button>
    </Toolbar>
  );
}
