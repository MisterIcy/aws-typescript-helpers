import {it, expect, describe} from '@jest/globals';
import {RequestType} from '../../src/CloudFormationResponse/Types';

describe('RequestType', () => {
  it('Should contain all the request types', () => {
    expect(RequestType.Create).toBe('Create');
    expect(RequestType.Update).toBe('Update');
    expect(RequestType.Delete).toBe('Delete');
  });
});
