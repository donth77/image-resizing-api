import { resize } from '../imageHelpers';
import path from 'path';

describe('Test image helper functions', () => {
  const assetsDir = path.join(path.resolve(__dirname, '..'), 'assets');
  const testFile = 'fjord';
  const fileExt = 'jpg';
  const filePath = path.join(assetsDir, 'full', `${testFile}.${fileExt}`);
  const newFilePath = path.join(assetsDir, 'thumb', `${testFile}.${fileExt}`);

  it('should resize image successfully', async () => {
    await expectAsync(resize(filePath, newFilePath, 200, 200)).toBeResolved();
  });

  it('should throw input file missing error', async () => {
    await expectAsync(
      resize(path.join(assetsDir, 'nonexistingfile'), newFilePath, 200, 200)
    ).toBeRejected();
  });
});
