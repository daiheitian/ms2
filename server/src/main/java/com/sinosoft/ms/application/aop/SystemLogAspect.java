package com.sinosoft.ms.application.aop;

import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.Executor;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.alibaba.fastjson.JSONObject;
import com.sinosoft.ms.application.entity.OperateLogInfoEntity;
import com.sinosoft.ms.application.entity.UserEntity;
import com.sinosoft.ms.application.security.SecurityHelper;
import com.sinosoft.ms.application.service.OperateLogInfoService;
import com.sinosoft.ms.application.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.NamedThreadLocal;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;


@Aspect
@Component
@Slf4j
public class SystemLogAspect {
	
    /** 记录每个用户刚开始访问方法的时间 */
    private static final ThreadLocal<Date> BEGIN_TIME_THREAD_LOCAL =
            new NamedThreadLocal<Date>("LOG_BEGIN");

    private static final ThreadLocal<OperateLogInfoEntity> LOG_THREAD_LOCAL = new NamedThreadLocal<>("LOG_END");


    @Autowired(required=false)
    private HttpServletRequest request;

    /** spring框架自带的线程池 */
    @Autowired
    private ThreadPoolTaskExecutor threadPoolTaskExecutor;


    @Resource
    private OperateLogInfoService operateLogInfoService;

    @Resource
    private UserService userService;

    public SystemLogAspect() {}

    /**
     * 对使用SystemLog注释的方法进行拦截
     */
    @Pointcut("@annotation(SystemLogAnnation)")
    public void systemLogAspectCtrl(){}


    /**
     * 前置通知 用于拦截记录用户的操作的开始时间
     *
     * @param joinPoint 切点
     * @throws InterruptedException
     */
    @Before("systemLogAspectCtrl()")
    public void doBefore(JoinPoint joinPoint) throws InterruptedException {

        Date beginTime = new Date();

        BEGIN_TIME_THREAD_LOCAL.set(beginTime);

        if (log.isDebugEnabled()){
            log.debug("开始计时: {}，URI: {}", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS")
                    .format(beginTime), getRealAccessUrl(request));
        }
    }

    /**
     * 后置通知 用于拦截用户操作
     *
     * @param joinPoint 切点
     */
    @After("systemLogAspectCtrl()")
    public void doAfter(JoinPoint joinPoint) {
        String username = SecurityHelper.getUsername();
        OperateLogInfoEntity operateLogInfo = new OperateLogInfoEntity();
        operateLogInfo.setUname(SecurityHelper.getName());
        operateLogInfo.setId(UUID.randomUUID().toString());
        operateLogInfo.setUid(username);
        operateLogInfo.setStatus("1");
        operateLogInfo.setAccessIp(getIpAddr(request));
        operateLogInfo.setMethod(request.getMethod());
        operateLogInfo.setUrl(getRealAccessUrl(request));
        operateLogInfo.setLogType("info");
        operateLogInfo.setOperateFunc(getMethodDescription(joinPoint));
        operateLogInfo.setVisitMethod(getMethod(joinPoint));
        operateLogInfo.setMethodCostTime((new Date().getTime() - BEGIN_TIME_THREAD_LOCAL.get().getTime()) / 1000 + "");
        operateLogInfo.setLoginTime(new Date());
        operateLogInfo.setCreateTime(new Date());
        // 开启新线程进行日志记录
        threadPoolTaskExecutor.execute(new SaveLogThread(operateLogInfo, operateLogInfoService));

        LOG_THREAD_LOCAL.set(operateLogInfo);
    }


    /**
     * 获取注解中对方法的描述信息
     *
     * @param joinPoint 切点
     * @return description
     */
    private String getMethodDescription(JoinPoint joinPoint) {

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();

        Method method = signature.getMethod();
        //获取注解反射信息
        SystemLogAnnation systemLog = method.getAnnotation(SystemLogAnnation.class);

        String description = systemLog.description();

        return description;
    }

    private String getMethod(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();

        Method method = signature.getMethod();

        return method.getName();
    }


    /**
     * 异常通知 记录操作报错日志
     *
     * @param joinPoint
     * @param e
     */
    @AfterThrowing(pointcut = "systemLogAspectCtrl()" , throwing = "e")
    public void doAfterThrowing(JoinPoint joinPoint , Throwable e) {

        OperateLogInfoEntity operateLogInfo = LOG_THREAD_LOCAL.get();

        operateLogInfo.setLogType("error");
        operateLogInfo.setVisitMethodErrInfo(e.getMessage());

        threadPoolTaskExecutor.execute(new UpdateLogThread(operateLogInfo , operateLogInfoService));
    }

    /**
     * 保存日志线程
     */
    private static class SaveLogThread implements Runnable {

        private OperateLogInfoEntity operateLogInfo;
        private OperateLogInfoService operateLogInfoService;


        public SaveLogThread(OperateLogInfoEntity operateLogInfo, OperateLogInfoService operateLogInfoService) {
            this.operateLogInfo = operateLogInfo;
            this.operateLogInfoService = operateLogInfoService;
        }

        @Override
        public void run() {
            operateLogInfoService.save(operateLogInfo);
        }
    }

    /**
     * 日志更新线程
     */
    private static class UpdateLogThread extends Thread {

        private OperateLogInfoEntity operateLogInfo;
        private OperateLogInfoService operateLogInfoService;

        public UpdateLogThread(OperateLogInfoEntity operateLogInfo, OperateLogInfoService operateLogInfoService) {
            super(UpdateLogThread.class.getSimpleName());
            this.operateLogInfo = operateLogInfo;
            this.operateLogInfoService = operateLogInfoService;
        }

        @Override
        public void run() {
            operateLogInfoService.updateById(operateLogInfo);
        }
    }
    
    /**
     * 获取访问客户端的真实ip地址
     * @param request
     * @return
     */
    private String getIpAddr(HttpServletRequest request) {  
        String ip = request.getHeader("x-forwarded-for");  
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getHeader("PRoxy-Client-IP");  
        }  
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getHeader("WL-Proxy-Client-IP");  
        }  
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getRemoteAddr();  
        }  
        return ip;
    }  
    
    private String getRealAccessUrl(HttpServletRequest request){
    	String realAccessUrl = "http://" + request.getServerName() //服务器地址  
                + ":"   
                + request.getServerPort()           //端口号  
                + request.getContextPath()      //项目名称  
                + request.getServletPath();      //请求页面或其他地址  
    	return realAccessUrl;
    }
}
