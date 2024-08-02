import {describe, expect, it, jest} from '@jest/globals';
import {UpdateResourceHandler} from '../../src/CloudFormationResponse/UpdateResourceHandler';
import {
  CustomResourceCreateRequest,
  CustomResourceUpdateRequest,
  RequestType
} from '../../src/CloudFormationResponse/Types';
import {CreateResourceHandler} from '../../src/CloudFormationResponse/CreateResourceHandler';

const event: CustomResourceUpdateRequest = {
  RequestType: RequestType.Update,
  ResponseURL: 'http://localhost',
  StackId: 'stack-id',
  RequestId: 'request-id',
  LogicalResourceId: 'logical-resource-id',
  ResourceType: 'Custom::Resource',
  PhysicalResourceId: 'physical-resource-id',
  OldResourceProperties: {
    key: 'old-value'
  },
  ResourceProperties: {
    key: 'new-value'
  }
};
describe('UpdateResourceHandler', () => {
  it('Should notify success when the callable is successful', async () => {
    const callable = (event: CustomResourceUpdateRequest) =>
      Promise.resolve({key: 'value'});

    jest.spyOn(global, 'fetch').mockImplementation(
      () =>
        Promise.resolve({
          ok: true
        }) as any
    );

    const handler = new UpdateResourceHandler(event);
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
    const callable = (event: CustomResourceUpdateRequest) =>
      Promise.resolve({key: 'value'});

    jest.spyOn(global, 'fetch').mockImplementation(
      () =>
        Promise.resolve({
          ok: true
        }) as any
    );

    const handler = new UpdateResourceHandler(event);
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
  it('Should fail when the request to S3 fails', async () => {
    const callable = (event: CustomResourceUpdateRequest) =>
      Promise.reject(new Error('error message'));

    jest.spyOn(global, 'fetch').mockImplementation(
      () =>
        Promise.resolve({
          ok: false,
          statusText: 'Not Found'
        }) as any
    );

    const handler = new UpdateResourceHandler(event);
    await expect(handler.handle(callable)).rejects.toThrow(
      'Failed to notify S3: Not Found'
    );
  });
});
