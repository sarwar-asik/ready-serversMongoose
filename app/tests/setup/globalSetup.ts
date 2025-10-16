import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

class TestDatabase {
  private mongoServer?: MongoMemoryServer;

  async connect() {
    this.mongoServer = await MongoMemoryServer.create();
    const uri = this.mongoServer.getUri();

    await mongoose.connect(uri, {
      dbName: 'test-ready-servers-DB',
    });
  }

  async disconnect() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (this.mongoServer) {
      await this.mongoServer.stop();
    }
  }

  async clearDatabase() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}

export const testDb = new TestDatabase();
