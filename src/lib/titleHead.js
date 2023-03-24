export function titlePage(data = {}) {
  data.title = data.title || "To Do List Yan";
  document.title = data.title;
}
