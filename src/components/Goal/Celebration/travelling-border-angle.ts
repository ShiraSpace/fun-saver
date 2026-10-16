import { TRAVELLING_BORDER_ANGLE } from './constants';

const ALREADY_REGISTERED = 'InvalidModificationError';

function alreadyRegistered(error: unknown): boolean {
  return error instanceof DOMException && error.name === ALREADY_REGISTERED;
}

export function registerTravellingBorderAngle(): void {
  if (typeof CSS === 'undefined' || !('registerProperty' in CSS)) {
    return;
  }

  try {
    CSS.registerProperty({
      name: TRAVELLING_BORDER_ANGLE,
      syntax: '<angle>',
      inherits: false,
      initialValue: '0deg',
    });
  } catch (error) {
    if (!alreadyRegistered(error)) {
      throw error;
    }
  }
}
