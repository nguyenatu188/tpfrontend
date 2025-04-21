interface AccommodationProps {
  id: string;
}

const Accommodation: React.FC<AccommodationProps> = ({ id }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Accommodation Page</h1>
      <p className="text-gray-500">Trip ID: {id}</p>
    </div>
  );
};

export default Accommodation;
