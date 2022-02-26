import Carriage from './Carriage';

const TrainCarriages = ({ carriageCapacities }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '0.5fr repeat(6, 1fr)',
        gap: 0,
        width: '100%',
        padding: 8,
      }}
    >
      <div style={{ lineHeight: '40px', marginRight: 8 }}>
        <div
          style={{ backgroundColor: '#ADD8E6', height: '100%', width: '100%' }}
        >
          👨‍✈️
        </div>
      </div>
      {carriageCapacities.slice(0, 6).map((capacity) => {
        return (
          <div>
            <Carriage percentage={capacity} />
          </div>
        );
      })}
    </div>
  );
};

export default TrainCarriages;
