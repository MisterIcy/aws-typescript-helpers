import {HandlerInterface} from './HandlerInterface';
import {
  CustomResourceFailedResponse,
  CustomResourceRequest,
  CustomResourceResponse,
  CustomResourceStatus,
  CustomResourceSuccessResponse,
  ResourceProperties
} from './Types';

export abstract class AbstractHandler implements HandlerInterface {
  constructor(protected readonly event: CustomResourceRequest) {}

  abstract handle(
    callable: (event: CustomResourceRequest) => Promise<ResourceProperties>
  ): Promise<void>;

  protected async notify(response: ResourceProperties): Promise<void> {
    const body = JSON.stringify(response);

    const s3Response = await fetch(this.event.ResponseURL, {
      method: 'PUT',
      headers: {
        'Content-Type': '',
        'Content-Length': body.length.toString()
      },
      body: body
    });

    if (!s3Response.ok) {
      throw new Error(`Failed to notify S3: ${s3Response.statusText}`);
    }
  }

  protected async notifySuccess(properties: ResourceProperties): Promise<void> {
    const response: CustomResourceSuccessResponse = {
      Status: CustomResourceStatus.Success,
      PhysicalResourceId: this.event.RequestId,
      StackId: this.event.StackId,
      RequestId: this.event.RequestId,
      LogicalResourceId: this.event.LogicalResourceId,
      Data: properties
    };

    await this.notify(response);
  }

  protected async notifyFailure(error: Error): Promise<void> {
    const response: CustomResourceFailedResponse = {
      Status: CustomResourceStatus.Failed,
      PhysicalResourceId: this.event.RequestId,
      StackId: this.event.StackId,
      RequestId: this.event.RequestId,
      LogicalResourceId: this.event.LogicalResourceId,
      Reason: error.message
    };

    await this.notify(response);
  }
}
