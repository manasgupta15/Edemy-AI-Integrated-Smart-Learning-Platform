const AssignmentModal = ({ fileUrl, onClose }) => {
  const renderFile = () => {
    if (fileUrl.endsWith(".pdf")) {
      return (
        <embed
          src={fileUrl}
          type="application/pdf"
          width="100%"
          height="600px"
        />
      );
    } else if (fileUrl.match(/\.(jpeg|jpg|png|gif)$/)) {
      return (
        <img src={fileUrl} alt="Assignment" style={{ maxWidth: "100%" }} />
      );
    } else if (fileUrl.endsWith(".txt")) {
      return (
        <iframe src={fileUrl} title="Assignment" width="100%" height="600px" />
      );
    } else {
      return <p>Unsupported file format</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>
        <div className="mt-4">{renderFile()}</div>
      </div>
    </div>
  );
};

export default AssignmentModal;
