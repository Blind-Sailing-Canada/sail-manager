import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

import { GetFilesOptions } from '@google-cloud/storage';
import {
  Injectable, Logger, NotFoundException
} from '@nestjs/common';
import { DOMAIN } from '../auth/constants';

@Injectable()
export class FirebaseAdminService {
  private readonly firebaseAdmin;
  private readonly logger = new Logger(FirebaseAdminService.name);

  constructor() {
    const adminBase64Confirg = Buffer.from(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64, 'base64');
    const adminConfig = JSON.parse(adminBase64Confirg.toString('utf-8'));

    const fireBaseBase64Confirg = Buffer.from(process.env.FIREBASE_CONFIG_BASE64, 'base64');
    const fireBaseConfig = JSON.parse(fireBaseBase64Confirg.toString('utf-8'));

    this.firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(adminConfig),
      storageBucket: fireBaseConfig.storageBucket,
    });
  }

  public createAdminUser() {
    return admin.auth()
      .createUser({
        displayName: 'Admin',
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

  public getFirebaseUser(id: string) {
    return admin.auth().getUser(id);
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

    const date = new Date();
    date.setDate(date.getDate() + 1);

    return await file.getSignedUrl({
      action: 'read',
      expires: date,
    }).then(response => response[0]);
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
      .then(() => this.logger.log(`finished uploadFile.... ${destination} ${contentType}`))
      .then(() => destination)
      .catch((error) => {
        this.logger.log(`error uploading file to ${destination}`);
        this.logger.error(error);
        throw error;
      });
  }

  public deleteFile(destination: string): Promise<string> {
    const lastSlash = destination.lastIndexOf('/');
    const isProd = process.env.NODE_ENV === 'prod';

    const prefix = `${isProd? '' : '/test'}${destination.substring(0, lastSlash).replace(/^cdn\/files\//, '')}/`;

    const storage: admin.storage.Storage = this.firebaseAdmin.storage();
    const bucket = storage.bucket();

    this.logger.log('Firebase trying to delete', prefix);

    return bucket
      .deleteFiles({
        force: true, //this no longer works for deleting entire folders?
        prefix,
      })
      .then((response) => {
        this.logger.log('Firebase delete response:', response);
        return 'deleted';
      });
  }
}
