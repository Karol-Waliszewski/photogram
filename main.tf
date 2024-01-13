terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

locals {
  dot_env_file_path = ".env"
  dot_env_regex     = "(?m:^\\s*([^#\\s]\\S*)\\s*=\\s*[\"']?(.*[^\"'\\s])[\"']?\\s*$)"
  dot_env           = { for tuple in regexall(local.dot_env_regex, file(local.dot_env_file_path)) : tuple[0] => sensitive(tuple[1]) }
}

provider "aws" {
  access_key = local.dot_env["AWS_KEY_ID"]
  secret_key = local.dot_env["AWS_SECRET"]
  region     = local.dot_env["AWS_REGION"]
}

resource "aws_s3_bucket" "photogram_bucket" {
  bucket = local.dot_env["AWS_BUCKET_NAME"]
}

resource "aws_s3_bucket_cors_configuration" "photogram_bucket" {
  bucket = aws_s3_bucket.photogram_bucket.id  

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }  
}

resource "aws_s3_bucket_acl" "photogram_bucket" {
    bucket = aws_s3_bucket.photogram_bucket.id
    acl    = "public-read"
    depends_on = [aws_s3_bucket_ownership_controls.s3_bucket_acl_ownership]
}

resource "aws_s3_bucket_ownership_controls" "s3_bucket_acl_ownership" {
  bucket = aws_s3_bucket.photogram_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
  depends_on = [aws_s3_bucket_public_access_block.example]
}

resource "aws_iam_user" "photogram_bucket_user" {
  name = "photogram-user"
}

resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.photogram_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "photogram_bucket_user" {
    bucket = aws_s3_bucket.photogram_bucket.id
    policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Principal = "*"
        Action = [
          "s3:*",
        ]
        Effect = "Allow"
        Resource = [
          "arn:aws:s3:::${aws_s3_bucket.photogram_bucket.id}",
          "arn:aws:s3:::${aws_s3_bucket.photogram_bucket.id}/*"
        ]
      },
      {
        Sid = "PublicReadGetObject"
        Principal = "*"
        Action = [
          "s3:GetObject",
        ]
        Effect   = "Allow"
        Resource = [
          "arn:aws:s3:::${aws_s3_bucket.photogram_bucket.id}",
          "arn:aws:s3:::${aws_s3_bucket.photogram_bucket.id}/*"
        ]
      },
    ]
  })
  
  depends_on = [aws_s3_bucket_public_access_block.example]
}

output "photogram_bucket_name" {
  value = aws_s3_bucket.photogram_bucket.id
}

output "photogram_bucket_url" {
  value = aws_s3_bucket.photogram_bucket.bucket_regional_domain_name
}