interface CollectionProps {
  id: string;
}

const Collection: React.FC<CollectionProps> = ({ id }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Collection Page</h1>
      <p className="text-gray-500">Trip ID: {id}</p>
    </div>
  );
};

export default Collection;