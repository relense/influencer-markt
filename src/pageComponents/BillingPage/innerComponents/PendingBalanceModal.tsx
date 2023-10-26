import { Modal } from "../../../components/Modal";

const PendingBalanceModal = (params: { onClose: () => void }) => {
  return (
    <div className="flex justify-center">
      <Modal onClose={() => params.onClose()}>
        <div>Pending Modal</div>
      </Modal>
    </div>
  );
};

export { PendingBalanceModal };
