// modifications in for.js
self.onmessage = function(event) {
  console.log(event);
  setTimeout(() => {
    postMessage("Hello World!");
  }, 5000);
  //self.postMessage();
  self.close();
};

// 2.put them in a queue, something consume them in the queue
// fetch("/api/routes/fetchone", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({ id: id })
// }).then(res => {
//   if (res.success === false) console.log("bad id");
//   res.json().then(data => {
//     this.processData(data);
//   });
// });
