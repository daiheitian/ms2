package com.sinosoft.ms.application.security;

import cn.hutool.core.util.CharsetUtil;
import cn.hutool.crypto.Mode;
import cn.hutool.crypto.Padding;
import cn.hutool.crypto.asymmetric.KeyType;
import cn.hutool.crypto.asymmetric.RSA;
import cn.hutool.crypto.symmetric.AES;
import cn.hutool.crypto.symmetric.SymmetricAlgorithm;
import cn.hutool.crypto.symmetric.SymmetricCrypto;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;


@Component
@ConfigurationProperties(prefix = "security")
public class SecurityHelper {
    private static SymmetricCrypto aes;
    private static RSA rsa;

    private static String aesKey;
    private static String publicKey;
    private static String privateKey;
    public static Map<String , String> captchas = new HashMap<>();


    public void setAesKey(String aesKey) {
        SecurityHelper.aesKey = aesKey;
    }

    public void setPublicKey(String publicKey) {
        SecurityHelper.publicKey = publicKey;
    }

    public void setPrivateKey(String privateKey) {
        SecurityHelper.privateKey = privateKey;
    }

    //TODO 此处应改成redis存储
    private static Set<String> tokens = new HashSet<>();



    public static boolean checkToken(String token) {
        return tokens.contains(token);
    }

    public static void addToken(String token) {
        tokens.add(token);
    }

    public static void removeToken(String token) {
        tokens.remove(token);
    }
    /**
     * 无效密码
     */
    public final static String INVALID_PASSWORD_MSG = "请输入8~20位密码，必须包含至少1个小写字母、大写字母、数字和特殊字符";

    public static UsernamePasswordAuthenticationToken getToken() {
        return (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
    }

    public static String getUsername() {
        return getToken().getName();
    }

    public static String getRole() {
        return getToken().getAuthorities().toArray()[0].toString();
    }

    public static String getDepartment() {
        Object[] array = getToken().getAuthorities().toArray();
        if(array.length >= 3) {
            return array[2].toString();
        }
        return null;
    }

    public static String getName() {
        Object[] array = getToken().getAuthorities().toArray();
        if(array.length >= 5) {
            return array[4].toString();
        }
        return null;
    }

    /**
     * 密码规则
     * ^表示字符串的起始字符。
     * （？=.*[0-9]） 表示一个数字必须至少出现一次。
     * （？=.*[a-z]） 表示小写字母表必须至少出现一次。
     * （？=.*[A-Z]） 表示必须至少出现一次的大写字母。
     * （？=.*[@#$%^&-+=（）] 表示必须至少出现一次的特殊字符。
     * （？=\S+$） 整个字符串中不允许使用空格。
     * .{8， 20}表示至少 8 个字符，最多 20 个字符。
     * $表示字符串的末尾。
     * @param password
     * @return
     */
    public static Boolean checkPassword(String password) {
        String regex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$";
        return Pattern.matches(regex, password);
    }


    public static String encodePassword(String password) {
        if(aes == null) {
            aes = new SymmetricCrypto(SymmetricAlgorithm.AES, aesKey.getBytes());
        }
        return aes.encryptHex(password);
    }

    public static String decodeClientPass(String password) {
        if(rsa == null) {
            rsa = new RSA(privateKey, null);
        }
        return rsa.decryptStr(password, KeyType.PrivateKey);
    }
}
