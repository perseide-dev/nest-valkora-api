import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { StandardResponseInterceptor } from './standard-response.interceptor';

class MockEntity {
  id: number;
  name: string;
  constructor(partial: Partial<MockEntity>) {
    Object.assign(this, partial);
  }
}

class MockRelatedEntity {
  id: number;
  type: string;
  constructor(partial: Partial<MockRelatedEntity>) {
    Object.assign(this, partial);
  }
}

describe('StandardResponseInterceptor', () => {
  let interceptor: StandardResponseInterceptor<any>;

  beforeEach(() => {
    interceptor = new StandardResponseInterceptor();
  });

  const mockExecutionContext = (query: any = {}): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => ({
        query,
      }),
    }),
  } as any);

  const mockCallHandler = (data: any): CallHandler => ({
    handle: () => of(data),
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should return null or undefined as is within success wrapper', (done) => {
    const context = mockExecutionContext();
    const handler = mockCallHandler(null);

    interceptor.intercept(context, handler).subscribe({
      next: (result) => {
        expect(result).toEqual({ success: true, data: null });
        done();
      },
    });
  });

  it('should format a simple message object', (done) => {
    const context = mockExecutionContext();
    const handler = mockCallHandler({ message: 'Success action' });

    interceptor.intercept(context, handler).subscribe({
      next: (result) => {
        expect(result).toEqual({ success: true, message: 'Success action' });
        done();
      },
    });
  });

  it('should format a simple class instance into standard entity response', (done) => {
    const context = mockExecutionContext();
    const data = new MockEntity({ id: 1, name: 'Test' });
    const handler = mockCallHandler(data);

    interceptor.intercept(context, handler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          success: true,
          data: {
            entity: 'MockEntity',
            attributes: { id: 1, name: 'Test' },
            relationships: undefined,
          },
        });
        done();
      },
    });
  });

  it('should handle paginated responses', (done) => {
    const context = mockExecutionContext();
    const data = {
      data: [new MockEntity({ id: 1, name: 'Test' })],
      meta: { total: 1, page: 1 },
    };
    const handler = mockCallHandler(data);

    interceptor.intercept(context, handler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          success: true,
          data: [
            {
              entity: 'MockEntity',
              attributes: { id: 1, name: 'Test' },
              relationships: undefined,
            },
          ],
          meta: { total: 1, page: 1 },
        });
        done();
      },
    });
  });

  it('should resolve nested relationships when included in query', (done) => {
    const context = mockExecutionContext({ include: 'relation' });
    const relation = new MockRelatedEntity({ id: 2, type: 'Nested' });
    const data = new MockEntity({ id: 1, name: 'Test' });
    (data as any).relation = relation; // Inject relation

    const handler = mockCallHandler(data);

    interceptor.intercept(context, handler).subscribe({
      next: (result) => {
        expect(result.data.relationships).toBeDefined();
        expect(result.data.relationships.relation).toEqual({
          entity: 'MockRelatedEntity',
          attributes: { id: 2, type: 'Nested' },
          relationships: undefined,
        });
        done();
      },
    });
  });

  it('should omit nested relationships when NOT included in query', (done) => {
    const context = mockExecutionContext({}); // No include query
    const relation = new MockRelatedEntity({ id: 2, type: 'Nested' });
    const data = new MockEntity({ id: 1, name: 'Test' });
    (data as any).relation = relation; 

    const handler = mockCallHandler(data);

    interceptor.intercept(context, handler).subscribe({
      next: (result) => {
        // relation will be ignored from attributes and relationships because it is not an allowed include
        expect(result.data.relationships).toBeUndefined();
        expect(result.data.attributes.relation).toBeUndefined();
        done();
      },
    });
  });
});
