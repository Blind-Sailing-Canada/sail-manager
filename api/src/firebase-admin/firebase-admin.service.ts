import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

import { GetFilesOptions } from '@google-cloud/storage';
import {
  Injectable, NotFoundException
} from '@nestjs/common';
import { ServiceAccount } from 'firebase-admin';
import { DOMAIN } from '../auth/constants';

@Injectable()
export class FirebaseAdminService {
  private readonly firebaseAdmin;

  constructor() {

    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_ADMIN_SDK_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_SDK_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_SDK_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    this.firebaseAdmin = admin
      .initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });

  }

  public createAdminUser() {
    return admin.auth()
      .createUser({
        email: process.env.ADMIN_USER_EMAIL || 'admin@admin.admin',
        password: process.env.ADMIN_USER_PASSWORD || 'password',
      });
  }

  public generatePasswordResetLink(email) {
    return admin.auth().generatePasswordResetLink(email, { url: `${DOMAIN}/login` });
  }

  public createUser(name: string, email: string, password: string) {
    return admin.auth()
      .createUser({
        displayName: name,
        email: email,
        password: password,
      });
  }

  public validateFirebaseAuthToken(idToken) {
    return admin.auth().verifyIdToken(idToken);
  }

  public listFiles(query?: GetFilesOptions): Promise<string[]> {
    const storage: admin.storage.Storage = this.firebaseAdmin.storage();
    const bucket = storage.bucket();

    return bucket
      .getFiles(query)
      .then((response) => response[0])
      .then((files) => files.map(file => file.name));
  }

  public async getFileUrl(filePath: string): Promise<string> {
    const storage: admin.storage.Storage = this.firebaseAdmin.storage();
    const bucket = storage.bucket();
    const file = bucket.file(filePath);

    const exists = await file.exists().then(exists => exists[0]);

    if (!exists) {
      throw new NotFoundException();
    }

    const isPublic = await file.isPublic().then(result => result[0]);

    if (!isPublic) {
      await file.makePublic();
    }

    return file.publicUrl();
  }

  public async uploadCleanFile(prefix: string, filenameFolder: string, filename: string, contentType: string, stream) {
    const storage: admin.storage.Storage = this.firebaseAdmin.storage();
    const bucket = storage.bucket();

    await bucket.deleteFiles({
      force: true,
      prefix: `${prefix}/${filenameFolder}`,
    });

    return this.uploadFile(`${prefix}/${filenameFolder}/${filename}`, contentType, stream);
  }

  public async uploadFile(destination: string, contentType: string, stream): Promise<string> {
    const storage: admin.storage.Storage = this.firebaseAdmin.storage();
    const bucket = storage.bucket();

    const file = bucket.file(destination);
    const uuid = uuidv4();

    return file
      .save(stream, {
        public: true,
        resumable: false,
        gzip: true,
        predefinedAcl: 'publicRead',
        metadata: {
          contentType,
          cacheControl: 'public, max-age=31536000',
          metadata: { firebaseStorageDownloadTokens: uuid },
        },
      })
      .then(() => console.log('finished uploadFile....', destination, contentType))
      .then(() => destination)
      .catch((error) => {
        console.log('error uploading file', destination);
        console.error(error);
        throw error;
      });
  }

  public deleteFile(destination: string): Promise<string> {
    const lastSlash = destination.lastIndexOf('/');
    const prefix = destination.substring(0, lastSlash).replace(/^cdn\/files\//, '');

    const storage: admin.storage.Storage = this.firebaseAdmin.storage();
    const bucket = storage.bucket();

    return bucket
      .deleteFiles({
        force: true,
        prefix,
      })
      .then(() => 'deleted');
  }
}
