package com.sinosoft.ms.application.conf;

import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;

/**
 * 应用静态常量类
 * @author 肖雄
 *
 */
@Component
@ConfigurationProperties(prefix = "system.config")
public class SystemConfig {
	static String appId;
	static String signingKey;
	static Key signKey;

	public void setAppId(String appId) {
		SystemConfig.appId = appId;
	}

	public void setSigningKey(String signingKey) {
		SystemConfig.signingKey = signingKey;
	}

	public static String getAppId() {
		return SystemConfig.appId;
	}

	public static Key getSigningKey() {
		if(signKey == null) {
			SignatureAlgorithm sa = SignatureAlgorithm.HS256;
			byte[] ksBytes = DatatypeConverter.parseBase64Binary(SystemConfig.signingKey);
			signKey = new SecretKeySpec(ksBytes, sa.getJcaName());
		}
		return signKey;
	}
}
