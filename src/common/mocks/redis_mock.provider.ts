import RedisMock from 'ioredis-mock';

export const RedisMockProvider = {
  provide: 'RedisClient',
  useFactory: () => {
    return new RedisMock();
  },
};
