import { registerTravellingBorderAngle } from './travelling-border-angle';
import { TRAVELLING_BORDER_ANGLE } from './constants';

describe('registerTravellingBorderAngle', () => {
  const mockRegisterProperty = jest.fn();

  beforeEach(() => {
    mockRegisterProperty.mockReset();
    Object.defineProperty(window, 'CSS', {
      value: { registerProperty: mockRegisterProperty },
      configurable: true,
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(window, 'CSS');
  });

  it('tells the browser the travelling border turns by an angle', () => {
    registerTravellingBorderAngle();

    expect(mockRegisterProperty).toHaveBeenCalledWith(
      expect.objectContaining({ name: TRAVELLING_BORDER_ANGLE, syntax: '<angle>' })
    );
  });

  it('leaves an angle the browser already knows alone', () => {
    mockRegisterProperty.mockImplementation(() => {
      throw new DOMException('already registered', 'InvalidModificationError');
    });

    expect(registerTravellingBorderAngle).not.toThrow();
  });

  it('lets any other failure through', () => {
    mockRegisterProperty.mockImplementation(() => {
      throw new TypeError('bad syntax');
    });

    expect(registerTravellingBorderAngle).toThrow(TypeError);
  });
});
