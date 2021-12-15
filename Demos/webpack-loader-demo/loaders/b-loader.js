function bLoader(content, map, meta) {
    console.log("开始执行bLoader Normal Loader");
    return content + "bLoader->";
}

bLoader.pitch = function (remainingRequest, precedingRequest, data) {
    console.log("开始执行bLoader Pitching Loader");
    console.log(remainingRequest, precedingRequest, data);
    return "bLoader Pitching Loader->";
};

module.exports = bLoader;
