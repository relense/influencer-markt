import { Modal } from "../../../components/Modal";

const InfoBalanceModal = (params: { onClose: () => void }) => {
  return (
    <div className="flex justify-center">
      <Modal onClose={() => params.onClose()}>
        <div>Info Balance Modal</div>
      </Modal>
    </div>
  );
};

export { InfoBalanceModal };
