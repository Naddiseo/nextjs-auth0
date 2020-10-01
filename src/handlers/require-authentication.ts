import { NextApiHandler } from 'next';

import { ISessionStore } from '../session/store';

export type IApiRoute<T = any> = NextApiHandler<T>;

export default function requireAuthentication<T = any>(sessionStore: ISessionStore) {
  return (apiRoute: IApiRoute<T>): IApiRoute<T> => async (req, res): Promise<void> => {
    if (!req) {
      throw new Error('Request is not available');
    }

    if (!res) {
      throw new Error('Response is not available');
    }

    const session = await sessionStore.read(req);
    if (!session || !session.user) {
      res.status(401).json({
        error: 'not_authenticated',
        description: 'The user does not have an active session or is not authenticated'
      });
      return;
    }

    await apiRoute(req, res);
  };
}
