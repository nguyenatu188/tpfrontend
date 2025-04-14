import { useState } from "react";
import Modal from "react-modal";

const ForgotpasswordPage = () => {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Call API to reset password here
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Quên mật khẩu</h1>
      <form
        className="bg-white p-6 rounded shadow-md w-80 text-gray-700"
        onSubmit={handleSubmit}
      >
        <input
          type="Nhập mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
          className="border border-gray-300 p-2 mb-4 w-full placeholder-gray-600 rounded "
        />
        <input
          type="Xác nhận mật khẩu"
          placeholder="Xác nhận mật khẩu"
          className="border border-gray-300 p-2 mb-4 w-full placeholder-gray-600 rounded"
        />
        <button
          type="submit"
          className="btn btn-info text-white p-2 rounded w-full"
        >
          Đặt lại mật khẩu
        </button>
      </form>

      <Modal
        isOpen={showModal}
        onRequestClose={handleModalClose}
        contentLabel="Thông báo"
        className="text-gray-700 text-center fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
      >
        <div className="modal-content w-64 h-48 p-4 bg-white rounded shadow-md">
          <div className="modal-header border-b border-gray-200 pb-2">
            <h2 className="modal-title text-lg font-bold">Thông báo</h2>
          </div>
          <div className="modal-body pt-2">
            <p className="text-md">Đặt lại mật khẩu thành công!</p>
          </div>
          <div className="modal-footer pt-2 border-t border-gray-200">
            <button
              className="btn btn-info text-white p-2 rounded w-full"
              onClick={handleModalClose}
            >
              Đồng ý
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ForgotpasswordPage;
