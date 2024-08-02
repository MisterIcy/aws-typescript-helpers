import {CustomResourceRequest, ResourceProperties} from './Types';

export interface HandlerInterface {
  handle(
    callable: (event: CustomResourceRequest) => Promise<ResourceProperties>
  ): Promise<void>;
}
