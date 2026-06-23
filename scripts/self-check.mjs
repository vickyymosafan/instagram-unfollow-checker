const followers = new Set(["ana", "budi", "cici"]);
const following = ["ana", "dina", "budi"];
const notFollowingBack = following.filter((username) => !followers.has(username));
const mutuals = following.filter((username) => followers.has(username));
const fans = [...followers].filter((username) => !following.includes(username));

console.assert(notFollowingBack.join() === "dina", "notFollowingBack failed");
console.assert(mutuals.join() === "ana,budi", "mutuals failed");
console.assert(fans.join() === "cici", "fans failed");
console.log("self-check ok");
