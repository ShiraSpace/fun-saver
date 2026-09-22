/**
 * @jest-environment node
 */
import { NextRequest, type NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { LOGIN_PATH } from '@/lib/constants';
import { proxy } from '../proxy';

const APP_ORIGIN = 'https://fun-saver.vercel.app';
const SESSION_COOKIES = [
  ['production', '__Secure-authjs.session-token'],
  ['dev and the e2e suites', 'authjs.session-token'],
];

describe('proxy', () => {
  describe('a request with no session cookie', () => {
    let response: NextResponse;

    beforeEach(() => {
      response = proxy(new NextRequest(APP_ORIGIN));
    });

    it('is redirected', () => {
      expect(response.status).toBe(StatusCodes.TEMPORARY_REDIRECT);
    });

    it('is sent to the login page', () => {
      expect(response.headers.get('location')).toBe(
        `${APP_ORIGIN}${LOGIN_PATH}`
      );
    });
  });

  describe.each(SESSION_COOKIES)(
    'a request carrying the cookie %s sets',
    (_, cookieName) => {
      let response: NextResponse;

      beforeEach(() => {
        response = proxy(
          new NextRequest(APP_ORIGIN, {
            headers: { cookie: `${cookieName}=a-signed-token` },
          })
        );
      });

      it('is not sent to the login page', () => {
        expect(response.headers.get('location')).toBeNull();
      });
    }
  );
});
