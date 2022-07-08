import client from "./http";

export default {
  post(project) {
    return client
      .post("/api/v2/project", project)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },
  getAll(filter = "") {
    return client
      .get("/api/v2/projects?" + filter)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },

  get(id) {
    return client
      .get("/api/v2/project/" + id)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },
  getOwner(id) {
    return client
      .get("/api/v2/projects?owner=" + id)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },

  edit(project) {
    return client
      .put("/api/v2/project/" + project.id, project)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },

  delete(id) {
    return client
      .delete("/api/v2/project/" + id)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },
  insertIntoProject(request) {
    if (!request.plan) {
      return client
        .put("/api/v2/project/addToProject/" + request.projectParentId, {
          project: request.project.id
        })
        .then(response => Promise.resolve(response))
        .catch(error => Promise.reject(error));
    }
  },
  insertPlanIntoProject(request) {
    return client
      .put("/api/v2/project/addToProject/" + request.projectParentId, {
        plan: request.plan.id
      })
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },
  removeFromProject(object) {
    return client
      .put("/api/v2/project/removeFromProject/" + object.parent, {
        project: object._id
      })
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },
  removePlanFromProject(object) {
    if (object.project.id) {
      return client
        .put("/api/v2/project/removeFromProject/" + object.project.id, {
          plan: object._id
        })
        .then(response => Promise.resolve(response))
        .catch(error => Promise.reject(error));
    } else {
      return client
        .put("/api/v2/project/removeFromProject/" + object.project, {
          plan: object._id
        })
        .then(response => Promise.resolve(response))
        .catch(error => Promise.reject(error));
    }
  }
};
