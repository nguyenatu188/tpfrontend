interface TransportProps {
    id: string;
  }
  
  const Transport: React.FC<TransportProps> = ({ id }) => {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Transport Page</h1>
        <p className="text-gray-500">Trip ID: {id}</p>
      </div>
    );
  };
  
  export default Transport;