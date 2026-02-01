import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  const mockRequest = {
    method: 'GET',
    url: '/test',
    body: {},
  };

  const mockResponse = {
    statusCode: 200,
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    }),
  } as unknown as ExecutionContext;

  const mockCallHandler: CallHandler = {
    handle: jest.fn().mockReturnValue(of({ data: 'test' })),
  };

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log request and response', (done) => {
    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: () => {
        expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
        done();
      },
    });
  });

  it('should pass through the response data', (done) => {
    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (value) => {
        expect(value).toEqual({ data: 'test' });
        done();
      },
    });
  });

  it('should log request with body when present', (done) => {
    const requestWithBody = {
      ...mockRequest,
      body: { name: 'test' },
    };

    const contextWithBody = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(requestWithBody),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ExecutionContext;

    interceptor.intercept(contextWithBody, mockCallHandler).subscribe({
      next: () => {
        expect(contextWithBody.switchToHttp).toHaveBeenCalled();
        done();
      },
    });
  });

  it('should handle errors and log them', (done) => {
    const error = { status: 404, message: 'Not Found' };
    const errorCallHandler: CallHandler = {
      handle: jest.fn().mockReturnValue(throwError(() => error)),
    };

    interceptor.intercept(mockExecutionContext, errorCallHandler).subscribe({
      error: (err) => {
        expect(err).toEqual(error);
        done();
      },
    });
  });

  it('should handle errors without status code', (done) => {
    const error = { message: 'Internal Error' };
    const errorCallHandler: CallHandler = {
      handle: jest.fn().mockReturnValue(throwError(() => error)),
    };

    interceptor.intercept(mockExecutionContext, errorCallHandler).subscribe({
      error: (err: { message: string }) => {
        expect(err.message).toBe('Internal Error');
        done();
      },
    });
  });

  it('should handle different HTTP methods', (done) => {
    const postRequest = {
      method: 'POST',
      url: '/values',
      body: { name: 'New Value' },
    };

    const postContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(postRequest),
        getResponse: jest.fn().mockReturnValue({ statusCode: 201 }),
      }),
    } as unknown as ExecutionContext;

    interceptor.intercept(postContext, mockCallHandler).subscribe({
      next: () => {
        expect(postContext.switchToHttp).toHaveBeenCalled();
        done();
      },
    });
  });
});
