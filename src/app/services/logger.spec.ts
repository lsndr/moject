import { Logger } from './logger';
import * as util from 'util';

describe('Logger', () => {
  const time = '2022-01-01T00:00:00.000Z';
  let logger: Logger;

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(time));

    logger = new Logger();
  });

  it('should log', () => {
    const log = jest.spyOn(global.console, 'log');
    log.mockImplementation();

    logger.log('Test message');

    expect(log).toBeCalled();

    log.mockRestore();
  });

  it('should warn', () => {
    const error = jest.spyOn(global.console, 'error');
    error.mockImplementation();

    logger.warn('Test message');

    expect(error).toBeCalled();

    error.mockRestore();
  });

  it('should error', () => {
    const error = jest.spyOn(global.console, 'error');
    error.mockImplementation();

    logger.error('Test message');

    expect(error).toBeCalled();

    error.mockRestore();
  });

  it('should debug', () => {
    const debug = jest.fn<util.DebugLogger, any>();
    const debuglog = jest.spyOn<any, any>(util, 'debuglog');
    debuglog.mockReturnValue(debug);

    logger.debug('section', 'Test message');

    expect(debug).toBeCalled();

    debuglog.mockRestore();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
