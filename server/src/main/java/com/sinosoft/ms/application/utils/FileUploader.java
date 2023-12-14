package com.sinosoft.ms.application.utils;

import io.minio.MinioClient;
import io.minio.errors.*;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.xmlpull.v1.XmlPullParserException;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Component
@ConfigurationProperties(prefix = "minio")
@Data
@Slf4j
public class FileUploader {

    String url;
    String accessKey;
    String secretKey;
    String bucket;

    private MinioClient init() throws NoSuchAlgorithmException, IOException, InvalidKeyException, XmlPullParserException {
        MinioClient client = null;
        try {
            client = new MinioClient(url, accessKey, secretKey);

            boolean isExist = client.bucketExists(bucket);
            // 判断存储桶是否存在，不存在则创建。
            if (!isExist) {
                client.makeBucket(bucket);
            }
        } catch (MinioException e) {
            log.error("上传文件失败", e);
        }
        return client;
    }

    public void upload(String fileName, String filePath)  throws NoSuchAlgorithmException, IOException, InvalidKeyException, XmlPullParserException {
        MinioClient client = this.init();
        try {
            if (client != null) {
                client.putObject(bucket, fileName, filePath);
            }
        } catch (MinioException e) {
            log.error("上传文件失败", e);
        }
    }

    public void upload(String fileName, InputStream stream, String contentType)  throws NoSuchAlgorithmException, IOException, InvalidKeyException, XmlPullParserException {
        MinioClient client = this.init();
        try {
            if (client != null) {
                client.putObject(bucket, fileName, stream, contentType);
            }
        } catch (MinioException e) {
            log.error("上传文件失败", e);
        }
    }
}
