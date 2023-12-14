package com.sinosoft.ms.application.utils;


import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LabelConverter {
    /**
     * 匹配 {$1:$2} 不包含 {}
     */
    private static String PATTERN = "(?<=\\{)(.+?):(.+?)(?=\\})";

    public static Map<String, List<String>> extract(String content) {
        Pattern r = Pattern.compile(PATTERN);
        Matcher m = r.matcher(content);
        Map<String, List<String>> labels = new HashMap<>();
        while (m.find()) {
            System.out.println(m.group());
            String[] s = m.group().split(":");
            List<String> values = labels.get(s[0]);
            if(values == null) {
                values = new ArrayList<>();
            }
            values.add(s[1]);
            labels.put(s[0], values);
        }

        return labels;
    }
}
