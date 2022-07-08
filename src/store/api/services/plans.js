import client from "./http";

export default {
  post(plan) {
    return client
      .post("/api/v2/plan", plan)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },
  getAll(filter = "") {
    return client
      .get("/api/v2/plans?" + filter)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },
  get(id) {
    return client
      .get("/api/v2/plan/" + id)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },
  edit(plan) {
    return client
      .put("/api/v2/plan/" + plan.id, plan)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },
  delete(id) {
    return client
      .delete("/api/v2/plan/" + id)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  },
  insertProjectIntoPlan(object) {
    return client
      .put(`/api/v2/plan/${object.planId}/addProject`, {
        project: object.projectId
      })
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error));
  }
};
