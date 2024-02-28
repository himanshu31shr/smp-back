const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { getDefaultRoleAssumerWithWebIdentity } = require("@aws-sdk/client-sts");
const { PutObjectCommand, S3Client, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const Localstorage = require("./mock");

let _s3_client;
module.exports = class StorageService {

    #_client;

    #_localStorage = new Localstorage();

    constructor() {
        this._setup();
    }

    _setup() {

        if (process.env.NODE_ENV !== 'development') {
            const provider = defaultProvider({
                roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity,
            });

            if (!_s3_client) {
                this.#_client = new S3Client({
                    credentialDefaultProvider: provider,
                    region: process.env.AWS_S3_REGION,
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
                    }
                });
            } else {
                this.#_client = _s3_client;
            }
        }
    }

    async save(fileContent, fileName, bucket = process.env.BUCKET_NAME) {

        if (process.env.NODE_ENV !== 'development') {
            return await this.#_client.send(new PutObjectCommand({
                Bucket: bucket,
                Key: fileName,
                Body: fileContent,
                ACL: 'private'
            }));
        }

        return this.#_localStorage.save(fileContent, fileName, bucket = process.env.BUCKET_NAME)
    }


    destroy = (filename) => {
        if (process.env.NODE_ENV !== 'development') {
            const bucketParams = { Bucket: process.env.BUCKET_NAME, Key: filename };
            return this.#_client.send(new DeleteObjectCommand(bucketParams));
        }

        return this.#_localStorage.destroy(filename, bucket = process.env.BUCKET_NAME)

    }

    destroyByFolder = async (folderName) => {
        if (process.env.NODE_ENV !== 'development') {
            const objects = await s3.listObjectsV2({ Bucket: process.env.BUCKET_NAME, Prefix: folderName }).promise();

            if (objects.Contents.length === 0) {
                console.log('Folder is empty.');
                return;
            }

            const deleteParams = {
                Bucket: process.env.BUCKET_NAME,
                Delete: { Objects: [] }
            };

            objects.Contents.forEach(obj => {
                deleteParams.Delete.Objects.push({ Key: obj.Key });
            });

            await s3.deleteObjects(deleteParams).promise();
        }

        return this.#_localStorage.destroyByFolder(folderName, process.env.BUCKET_NAME)
    }

    async get(filename, bucketName) {
        if (process.env.NODE_ENV !== 'development') {
            const bucketParams = { Bucket: bucketName || process.env.BUCKET_NAME, Key: filename };
            return await this.#_client.send(new GetObjectCommand(bucketParams));
        }

        return this.#_localStorage.get(filename, bucketName)

    }
}