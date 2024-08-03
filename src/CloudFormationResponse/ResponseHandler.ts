import {
  CustomResourceCreationRequest,
  CustomResourceDeletionRequest, CustomResourceFailedResponse,
  CustomResourceSuccessResponse,
  CustomResourceUpdateRequest,
  RequestType,
  StatusType
} from './CustomResource';

export interface ResponseHandlerInterface {
  handleSuccess(
    event: CustomResourceCreationRequest | CustomResourceDeletionRequest | CustomResourceUpdateRequest,
    data: Record<string, any>
  ): Promise<void>;

  handleFailure(
    event: CustomResourceCreationRequest | CustomResourceDeletionRequest | CustomResourceUpdateRequest,
    reason: string
  ): Promise<void>;
}

export class ResponseHandler implements ResponseHandlerInterface {
  async handleSuccess(event: CustomResourceCreationRequest | CustomResourceDeletionRequest | CustomResourceUpdateRequest, data: Record<string, any>): Promise<void> {
    const response: CustomResourceSuccessResponse = {
      Status: StatusType.Success,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      Data: data
    };

    switch (event.RequestType) {
      case RequestType.Create:
        response.PhysicalResourceId = event.LogicalResourceId;
        break;
      case RequestType.Update:
      case RequestType.Delete:
        response.PhysicalResourceId = event.PhysicalResourceId;
        break;
    }

    await this.sendToS3(event.ResponseURL, response);
  }

  async handleFailure(event: CustomResourceCreationRequest | CustomResourceDeletionRequest | CustomResourceUpdateRequest, reason: string): Promise<void> {
    const response: CustomResourceFailedResponse = {
      Status: StatusType.Failed,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      Reason: reason
    };

    switch (event.RequestType) {
      case RequestType.Create:
        response.PhysicalResourceId = event.LogicalResourceId;
        break;
      case RequestType.Update:
      case RequestType.Delete:
        response.PhysicalResourceId = event.PhysicalResourceId;
        break;
    }

    await this.sendToS3(event.ResponseURL, response);
  }

  private async sendToS3(url: string, body: any): Promise<void> {
    const requestBody = JSON.stringify(body);
    const s3Response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': '',
        'Content-Length': requestBody.length.toString(),
      },
      body: requestBody,
    });

    if (!s3Response.ok) {
      throw new Error(`Failed to send response to S3: ${s3Response.status} ${s3Response.statusText}`);
    }
  }
}
