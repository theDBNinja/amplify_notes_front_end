# React and AWS Amplify Front End

This application was inspired by the tutorial on https://serverless-stack.com/

The code from the tutorial has been refactored for newer versions of Node.js and the Bootstrap framework. 

The code in this project is only the React application. Setup of the AWS environment and Lambda functions are in the [amplify_notes_back_end](https://github.com/theDbNinja/amplify_notes_back_end) repo.

The backend of this project will need to be created in order to provide the correct information in config.js

### Deployment

Build the application from the root directory

```bash
npm run build
```

Copy the contents of the build folder to the S3 Site Bucket from back end deployment
```bash
aws s3 cp build s3://PUBLIC_SITE_BUCKET_NAME/ --recursive
```

### Todo
- [ ] Add forgot password functionality
- [ ] Delete attachments in S3 when note is deleted
- [ ] Add delete attachment functionality in note view
