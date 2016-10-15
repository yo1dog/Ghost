// # Trim Protocol Helper
// Usage: `{{trim_proto url}}`
//
// Removes the http(s):// protocol from the given URL.

trim_proto = function (url) {
    return (url || '').replace(/^https?:\/\//, '');
};

module.exports = trim_proto;
