interface DiscoverProps {
  tripId: string;
}

const Discover = ({ tripId }: DiscoverProps) => {
  return (
    <div className="discover">
      <h1>Discover</h1>
      <p>Discover new content and features here!</p>
      <h1>Trip ID: {tripId}</h1>
    </div>
  );
};

export default Discover;