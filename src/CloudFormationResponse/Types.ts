/**
 * The operation status of the request.
 */
export enum RequestType {
  /** Create a new resource. */
  Create = 'Create',
  /** Update an existing resource. */
  Update = 'Update',
  /** Delete an existing resource. */
  Delete = 'Delete'
}

export type ResourceProperties = {
  [key: string]: any;
};

/**
 * The base request type that all requests must have.
 */
export type CustomResourceRequest = {
  /** The type of the request, one of `Create`, `Update`, or `Delete`. */
  RequestType: RequestType;
  /** The URL to send the response to, provided by the CloudFormation service. */
  ResponseURL: string;
  /** The ARN that identifies the stack that contains the resource. */
  StackId: string;
  /** A unique ID for the request. */
  RequestId: string;
  /** The type of the resource */
  ResourceType: string;
  /** The logical ID of the resource in the CloudFormation template. */
  LogicalResourceId: string;
  /** The properties of the resource as defined in the CloudFormation template. */
  ResourceProperties: ResourceProperties;
};

/**
 * The request to create a new resource.
 */
export type CustomResourceCreateRequest = {
  RequestType: RequestType.Create;
} & CustomResourceRequest;

/**
 * The request to update an existing resource.
 */
export type CustomResourceUpdateRequest = {
  RequestType: RequestType.Update;
  /** The physical ID of the resource. */
  PhysicalResourceId: string;
  /** The new properties of the resource. */
  OldResourceProperties: ResourceProperties;
} & CustomResourceRequest;

/**
 * The request to delete an existing resource.
 */
export type CustomResourceDeleteRequest = {
  RequestType: RequestType.Delete;
  /** The physical ID of the resource. */
  PhysicalResourceId: string;
} & CustomResourceRequest;

export enum CustomResourceStatus {
  /** The operation completed successfully. */
  Success = 'SUCCESS',
  /** The operation failed. */
  Failed = 'FAILED'
}

export type CustomResourceResponse = {
  Status: CustomResourceStatus;
  PhysicalResourceId: string;
  StackId: string;
  RequestId: string;
  LogicalResourceId: string;
  NoEcho?: boolean;
  Data?: ResourceProperties;
};

export type CustomResourceSuccessResponse = {
  Status: CustomResourceStatus.Success;
  Reason?: string;
} & CustomResourceResponse;

export type CustomResourceFailedResponse = {
  Status: CustomResourceStatus.Failed;
  Reason: string;
} & CustomResourceResponse;
