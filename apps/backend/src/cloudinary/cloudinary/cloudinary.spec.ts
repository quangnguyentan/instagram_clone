import { CloudinaryProvider } from './cloudinary';

describe('CloudinaryProvider', () => {
  const keys = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ] as const;
  const originalValues = new Map(
    keys.map((key) => [key, process.env[key]]),
  );

  afterEach(() => {
    keys.forEach((key) => {
      const value = originalValues.get(key);
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
  });

  it('uses the standard Cloudinary cloud name variable', () => {
    process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
    process.env.CLOUDINARY_API_KEY = 'test-key';
    process.env.CLOUDINARY_API_SECRET = 'test-secret';

    expect(CloudinaryProvider.useFactory()).toMatchObject({
      cloud_name: 'test-cloud',
      api_key: 'test-key',
      api_secret: 'test-secret',
    });
  });

  it('supports the legacy cloud name variable', () => {
    process.env.CLOUDINARY_CLOUD_NAME = '';
    process.env.CLOUDINARY_NAME = 'legacy-cloud';
    process.env.CLOUDINARY_API_KEY = 'test-key';
    process.env.CLOUDINARY_API_SECRET = 'test-secret';

    expect(CloudinaryProvider.useFactory()).toMatchObject({
      cloud_name: 'legacy-cloud',
    });
  });

  it('fails with the missing environment variable name', () => {
    process.env.CLOUDINARY_CLOUD_NAME = '';
    process.env.CLOUDINARY_NAME = '';
    process.env.CLOUDINARY_API_KEY = 'test-key';
    process.env.CLOUDINARY_API_SECRET = 'test-secret';

    expect(() => CloudinaryProvider.useFactory()).toThrow(
      'Missing Cloudinary configuration: CLOUDINARY_CLOUD_NAME',
    );
  });
});
