interface DiscoverProps {
  id: string;
}

const Discover: React.FC<DiscoverProps> = ({ id }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Discover Page</h1>
      <p className="text-gray-500">Trip ID: {id}</p>
    </div>
  );
};

export default Discover;