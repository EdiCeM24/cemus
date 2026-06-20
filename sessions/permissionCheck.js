const permission = {
  super_admin: ["*"],
  admin: ["users.read", "users.update"],
  editor: ["posts.create", "posts.update"],
};

// I added it below
export default permission;
