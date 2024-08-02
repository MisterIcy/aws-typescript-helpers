import {describe, expect, it, jest} from '@jest/globals';
import {CreateResourceHandler} from '../../src/CloudFormationResponse/CreateResourceHandler';
import {
  CustomResourceCreateRequest,
  RequestType
} from '../../src/CloudFormationResponse/Types';

const event: CustomResourceCreateRequest = {
  RequestType: RequestType.Create,
  ResponseURL: 'http://localhost',
  StackId: 'stack-id',
  RequestId: 'request-id',
  LogicalResourceId: 'logical-resource-id',
  ResourceType: 'Custom::Resource',
  ResourceProperties: {}
};
describe('CreateResourceHandler', () => {
  it('Should notify success when the callable is successful', async () => {
    const callable = (event: CustomResourceCreateRequest) =>
      Promise.resolve({key: 'value'});

    jest.spyOn(global, 'fetch').mockImplementation(
      () =>
        Promise.resolve({
          ok: true
        }) as any
    );

    const handler = new CreateResourceHandler(event);
    await handler.handle(callable);

    expect(fetch).toBeCalledWith('http://localhost', {
      method: 'PUT',
      headers: {
        'Content-Type': '',
        'Content-Length': '165'
      },
      body: JSON.stringify({
        Status: 'SUCCESS',
        PhysicalResourceId: 'request-id',
        StackId: 'stack-id',
        RequestId: 'request-id',
        LogicalResourceId: 'logical-resource-id',
        Data: {key: 'value'}
      })
    });
  });

  it('Should notify failure when the callable throws an error', async () => {
    const callable = (event: CustomResourceCreateRequest) =>
      Promise.reject(new Error('error message'));

    jest.spyOn(global, 'fetch').mockImplementation(
      () =>
        Promise.resolve({
          ok: true
        }) as any
    );

    const handler = new CreateResourceHandler(event);
    await expect(handler.handle(callable)).rejects.toThrow('error message');

    expect(fetch).toBeCalledWith('http://localhost', {
      method: 'PUT',
      headers: {
        'Content-Type': '',
        'Content-Length': '166'
      },
      body: JSON.stringify({
        Status: 'FAILED',
        PhysicalResourceId: 'request-id',
        StackId: 'stack-id',
        RequestId: 'request-id',
        LogicalResourceId: 'logical-resource-id',
        Reason: 'error message'
      })
    });
  });
  it('Should fail when the request to S3 fails', async () => {
    const callable = (event: CustomResourceCreateRequest) =>
      Promise.reject(new Error('error message'));

    jest.spyOn(global, 'fetch').mockImplementation(
      () =>
        Promise.resolve({
          ok: false,
          statusText: 'Not Found'
        }) as any
    );

    const handler = new CreateResourceHandler(event);
    await expect(handler.handle(callable)).rejects.toThrow(
      'Failed to notify S3: Not Found'
    );
  });
});
