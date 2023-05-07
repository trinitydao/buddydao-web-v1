'use client';
import { useNetwork } from 'wagmi';
import { Modal } from '@/components/ui/Modal';
import { ClientService } from '@/services/client';

export const NetworkModal = () => {
  const { chain } = useNetwork();

  const open = Boolean(chain && !ClientService.isAvailableChain(chain?.id));

  const names = ClientService.client.chains?.map((item) => item.name).join(',');

  return (
    <Modal open={open}>
      <div>{`Please use "${names}" Networks`}</div>
    </Modal>
  );
};
