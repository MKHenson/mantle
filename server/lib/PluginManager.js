var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ws = require("ws");
var winston = require("winston");
var events = require("events");
(function (UserEventType) {
    UserEventType[UserEventType["Login"] = 0] = "Login";
    UserEventType[UserEventType["Logout"] = 1] = "Logout";
    UserEventType[UserEventType["Activated"] = 2] = "Activated";
    UserEventType[UserEventType["Removed"] = 3] = "Removed";
})(exports.UserEventType || (exports.UserEventType = {}));
var UserEventType = exports.UserEventType;
/**
* A class for handling events sent from a webinate user server
*/
var PluginManager = (function (_super) {
    __extends(PluginManager, _super);
    /**
    * Creates an instance of the plugin manager
    */
    function PluginManager(cfg) {
        _super.call(this);
        this._cfg = cfg;
    }
    /**
    * Intiailizes the manager
    */
    PluginManager.prototype.init = function () {
        var cfg = this._cfg;
        var that = this;
        return new Promise(function (resolve, reject) {
            var _client = new ws(cfg.usersSocketURL, undefined, { headers: { origin: cfg.usersSocketOrigin } });
            // Opens a stream to the users socket events
            _client.on('open', function () {
                winston.info("Connected to the users socket stream", { process: process.pid });
                return resolve();
            });
            // Report if there are any errors
            _client.on('error', function (err) {
                winston.error("An error occurred when trying to connect to the users socket: " + err.message, { process: process.pid });
                return reject();
            });
            // We have recieved a message from the user socket
            _client.on('message', that.onMessage.bind(that));
        });
    };
    /**
    * Called whenever we get a message from the user socket events
    */
    PluginManager.prototype.onMessage = function (data, flags) {
        if (!flags.binary) {
            try {
                for (var i in UserEventType)
                    i;
            }
            catch (err) {
                winston.error("An error occurred while parsing socket string : '" + err.message + "'", { process: process.pid });
            }
        }
    };
    return PluginManager;
})(events.EventEmitter);
exports.PluginManager = PluginManager;
