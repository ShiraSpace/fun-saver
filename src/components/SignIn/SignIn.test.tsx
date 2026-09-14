import { signIn } from 'next-auth/react';
import { fireEvent, render, screen } from '@/test-utils/render';
import { SignIn } from './SignIn';
import {
  GOOGLE_PROVIDER_ID,
  SIGNED_IN_DESTINATION,
  SIGN_IN_COPY,
  SIGN_IN_TEST_IDS,
} from './constants';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

describe('SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<SignIn />);
  });

  it('offers a single button to continue with Google', () => {
    expect(
      screen.getByTestId(SIGN_IN_TEST_IDS.continueWithGoogle)
    ).toHaveTextContent(SIGN_IN_COPY.continueWithGoogle);
  });

  it('starts the Google sign-in and lands the user on the home page', () => {
    fireEvent.click(screen.getByTestId(SIGN_IN_TEST_IDS.continueWithGoogle));

    expect(signIn).toHaveBeenCalledWith(GOOGLE_PROVIDER_ID, {
      redirectTo: SIGNED_IN_DESTINATION,
    });
  });
});
