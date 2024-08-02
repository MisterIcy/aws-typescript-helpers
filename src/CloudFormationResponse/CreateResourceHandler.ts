import {AbstractHandler} from './AbstractHandler';
import {CustomResourceCreateRequest, ResourceProperties} from './Types';

export class CreateResourceHandler extends AbstractHandler {
  constructor(protected readonly event: CustomResourceCreateRequest) {
    super(event);
  }

  async handle(
    callable: (
      event: CustomResourceCreateRequest
    ) => Promise<ResourceProperties>
  ): Promise<void> {
    try {
      const properties = await callable(this.event);
      await this.notifySuccess(properties);
    } catch (error) {
      if (!(error instanceof Error)) {
        error = new Error(error.toString());
      }

      await this.notifyFailure(error);

      throw error;
    }
  }
}
