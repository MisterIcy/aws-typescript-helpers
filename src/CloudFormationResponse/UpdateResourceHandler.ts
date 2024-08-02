import {AbstractHandler} from './AbstractHandler';
import {CustomResourceUpdateRequest, ResourceProperties} from './Types';

export class UpdateResourceHandler extends AbstractHandler {
  constructor(protected readonly event: CustomResourceUpdateRequest) {
    super(event);
  }

  async handle(
    callable: (
      event: CustomResourceUpdateRequest
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
