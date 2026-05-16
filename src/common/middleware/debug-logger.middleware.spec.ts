import { DebugLoggerMiddleware } from './debug-logger.middleware';
import { Request, Response, NextFunction } from 'express';

describe('DebugLoggerMiddleware', () => {
  let middleware: DebugLoggerMiddleware;

  beforeEach(() => {
    middleware = new DebugLoggerMiddleware();
    // Spy on console.log
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should log request details and call next()', () => {
    const req = {
      method: 'GET',
      path: '/api/test',
      headers: { authorization: 'Bearer token' },
      body: { data: 'test' },
    } as unknown as Request;
    
    const res = {} as Response;
    const next: NextFunction = jest.fn();

    middleware.use(req, res, next);

    expect(console.log).toHaveBeenCalledWith('--- [DEBUG REQUEST LOG] ---');
    expect(console.log).toHaveBeenCalledWith('Method: GET | Path: /api/test');
    expect(console.log).toHaveBeenCalledWith('Headers:', JSON.stringify(req.headers, null, 2));
    expect(console.log).toHaveBeenCalledWith('Body:', JSON.stringify(req.body, null, 2));
    expect(next).toHaveBeenCalledTimes(1);
  });
});
