import boto3
from botocore.exceptions import NoCredentialsError

import exceptions
from config import settings


def create_presigned_url(object_name: str, content_type: str, expires_in: int) -> str:
    """Generate a presigned URL to upload a file to S3.

    :param object_name: string
    :param content_type: string
    :param expires_in: duration in seconds for that presigned URL remains valid
    :return: Presigned URL as string. If error, returns None.
    """
    s3_client = boto3.client(
        "s3",
        region_name=settings.AWS_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    try:
        response = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": settings.AWS_S3_BUCKET,
                "Key": object_name,
                "ContentType": content_type,
            },
            ExpiresIn=expires_in,
        )
    except NoCredentialsError:
        return exceptions.INVALID_AWS_CREDENTIALS

    return response
