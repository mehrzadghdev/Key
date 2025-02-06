import { CustomValidatorMessagePipe } from './custom-validator-message.pipe';

describe('CustomValidatorMessagePipe', () => {
  it('create an instance', () => {
    const pipe = new CustomValidatorMessagePipe();
    expect(pipe).toBeTruthy();
  });
});
