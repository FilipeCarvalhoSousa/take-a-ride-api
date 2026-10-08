import { RidesGateway } from './rides.gateway';

describe('RidesGateway', () => {
  let gateway: RidesGateway;
  let emit: jest.Mock;

  beforeEach(() => {
    gateway = new RidesGateway();
    emit = jest.fn();
    Object.defineProperty(gateway, 'server', {
      value: { emit },
      writable: true,
    });
  });

  it('broadcasts a driver location update to its driver channel', () => {
    const location = { driverId: 'driver-id', lat: -23.56, lng: -46.65 };

    gateway.handleLocationUpdate({} as never, location);

    expect(emit).toHaveBeenCalledWith('driver:location:driver-id', location);
  });

  it('broadcasts new ride offers', () => {
    const ride = { id: 'ride-id' };

    gateway.notifyNewRide(ride);

    expect(emit).toHaveBeenCalledWith('ride:newOffer', ride);
  });

  it('broadcasts ride status updates', () => {
    const ride = { id: 'ride-id', status: 'ACCEPTED' };

    gateway.notifyRideStatusUpdate(ride.id, ride);

    expect(emit).toHaveBeenCalledWith('ride:status:ride-id', ride);
  });
});
