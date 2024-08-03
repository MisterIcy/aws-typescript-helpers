import {CreateResourceHandler, UpdateResourceHandler, DeleteResourceHandler} from '@mistericy/aws-typescript-helpers';

async function createResource(event) {
}

async function updateResource(event) {
}

async function deleteResource(event) {
}

export const handler = async (event) => {
    let h = null;
    switch (event.RequestType) {
        case 'Create':
            h = new CreateResourceHandler(event);
            await h.handle(createResource)
            break;
        case 'Update':
            h = new UpdateResourceHandler(event);
            await h.handle(updateResource)
            break;
        case 'Delete':
            h = new DeleteResourceHandler(event);
            await h.handle(deleteResource)
            break;
    }
};
