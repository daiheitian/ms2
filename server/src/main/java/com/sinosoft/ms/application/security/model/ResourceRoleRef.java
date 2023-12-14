package com.sinosoft.ms.application.security.model;
/**
 *资源对应角色
 *
 */
public class ResourceRoleRef {

	private String id;
	private String resourceid;
	private String roleid;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getResourceid() {
		return resourceid;
	}

	public void setResourceid(String resourceid) {
		this.resourceid = resourceid;
	}

	public String getRoleid() {
		return roleid;
	}

	public void setRoleid(String roleid) {
		this.roleid = roleid;
	}
}
