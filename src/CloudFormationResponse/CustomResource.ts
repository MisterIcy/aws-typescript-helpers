export enum RequestType {
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete',
}

export enum StatusType {
  Success = 'SUCCESS',
  Failed = 'FAILED',
}

export type CustomResourceRequest = {
  RequestType: RequestType;
  ResponseURL: string;
  StackId: string;
  RequestId: string;
  ResourceType: string;
  LogicalResourceId: string;
  ResourceProperties: Record<string, any>;
};

export type CustomResourceCreationRequest = {
  RequestType: RequestType.Create;
} & CustomResourceRequest;

export type CustomResourceUpdateRequest = {
  RequestType: RequestType.Update;
  PhysicalResourceId: string;
  OldResourceProperties: Record<string, any>;
} & CustomResourceRequest;

export type CustomResourceDeletionRequest = {
  RequestType: RequestType.Delete;
  PhysicalResourceId: string;
} & CustomResourceRequest;

export type CustomResourceResponse = {
  Status: StatusType;
  Reason?: string;
  PhysicalResourceId?: string;
  StackId: string;
  RequestId: string;
  LogicalResourceId: string;
  NoEcho?: boolean;
  Data?: Record<string, any>;
}

export type CustomResourceSuccessResponse = {
  Status: StatusType.Success;
} & CustomResourceResponse;

export type CustomResourceFailedResponse = {
  Status: StatusType.Failed;
  Reason: string;
} & CustomResourceResponse;
