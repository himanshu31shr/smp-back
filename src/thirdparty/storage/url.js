
const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const {
    getSignedUrl,
} = require("@aws-sdk/s3-request-presigner");
const { getDefaultRoleAssumerWithWebIdentity } = require("@aws-sdk/client-sts");
const path = require('path');
/**
 * A class representing a secure URI.
 */
module.exports.SecureUri = class SecureUri {

    /**
    """
    A dictionary containing options for uploading a file to an S3 bucket.
    The options include:
    - bucket: the name of the S3 bucket to upload the file to
    - objectName: the name of the object (file) to be uploaded
    - credentials: an object containing the access key ID and secret access key for the AWS account
    - expiration: the time at which the upload URL will expire
    """
     */
    #_options = {
        bucket: null,
        objectName: null,
        credentials: {
            accessKeyId: null,
            secretAccessKey: null
        },
        expiration: null
    }

    #_client;

    constructor(options = {
        bucket: null,
        objectName: null,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        },
        expiration: 3600
    }) {
        this.#_options = options;
        this.#_setup();
    }

    /**
     * Sets up the S3 client with the given options and default provider.
     * @private
     * @returns None
     */
    #_setup() {
        if (process.env.NODE_ENV !== 'development') {
            const provider = defaultProvider({
                roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity,
            });

            this.#_client = new S3Client({
                credentialDefaultProvider: provider,
                region: process.env.AWS_S3_REGION,
                credentials: this.#_options.credentials
            });
        }
    }

    /**
     * Creates a signed URL for the specified object in the specified S3 bucket.
     * @async
     * @returns {Promise<string>} - A signed URL that can be used to access the object.
     */
    async create() {

        if (process.env.NODE_ENV !== 'development') {
            const command = new GetObjectCommand({
                Bucket: this.#_options.bucket,
                Key: this.#_options.objectName
            });

            return getSignedUrl(this.#_client, command, {
                expiresIn: this.#_options.expiration
            });

        }
        const fileName = path.join('/', this.#_options.bucket, this.#_options.objectName);
        return 'http://localhost:' + (process.env.PORT || 3000) + fileName;
    };
}
