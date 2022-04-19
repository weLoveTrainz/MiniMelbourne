import Carriage from './Carriage';
/*
Carriage capacity card, to be removed


*/

const TrainCarriages = ({ carriageCapacities }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '0.5fr repeat(6, 1fr)',
        gap: 0,
        width: '100%',
      }}
    >
      <div style={{ lineHeight: '44px' }}>
        <div
          style={{
            height: '100%',
            width: '100%',
            fontSize: 44,
          }}
        >
          🚈
        </div>
      </div>
      {carriageCapacities.slice(0, 6).map((capacity) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <svg
              viewBox="0 0 48 48"
              xmlns="https://www.w3.org/2000/svg"
              style={{ fill: '#C9D5DE' }}
            >
              <circle cx="24" cy="24" r="12" />
            </svg>
            <Carriage percentage={capacity} />
          </div>
        );
      })}
    </div>
  );
};

export default TrainCarriages;
