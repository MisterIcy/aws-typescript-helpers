import {AbstractHandler} from './AbstractHandler';
import {CustomResourceDeleteRequest, ResourceProperties} from './Types';

export class DeleteResourceHandler extends AbstractHandler {
  constructor(protected readonly event: CustomResourceDeleteRequest) {
    super(event);
  }

  async handle(
    callable: (
      event: CustomResourceDeleteRequest
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
