var Dirty = require("dirty");
var format = require("util").format;

var FriendCode = {
    init: function (client, imports) {
        var databaseLocation = client.config("friend-code-database");
        var db = Dirty(databaseLocation);

        return {
            handlers: {
                "!friendcode": function (command) {
                    var friend = command.args[0];

                    var friendcode = db.get(friend);

                    if (friendcode) {
                        return format("Friendcode for %s: %s", friend, friendcode);
                    } else {
                        return format("Friendcode for %s not found.", friend);
                    }
                },

                "!addfriendcode": function (command) {
                    var code = command.args.join(" ");
                    var friend = command.nickname;

                    db.set(friend, code);
                    return format("%s: Friend code set!", friend);
                },

                "!delfriendcode": function (command) {
                    var friend = command.nickname;

                    if (db.get(friend)) {
                        db.rm(friend);
                        return format("%s: Friend Code deleted.", friend);
                    } else {
                        return format("%s: You already have no friend code.", friend);
                    }
                },

                error: function (_) {
                    db.close();
                }
            },

            help: {
                "friendcode": [
                    "friendcode &lt;nickname&gt;",
                    " ",
                    "Lookup the friendcode for that nickname."
                ],

                "addfriendcode": [
                    "addfriendcode &lt;friend-code&gt;",
                    " ",
                    "Add or change your friend code to the bot."
                ],

                "delfriendcode": [
                    "delfriendcode",
                    " ",
                    "Remove your friend code from the bot."
                ]
            },

            commands: ["friendcode, addfriendcode, delfriendcode"]
        };
    }
};

module.exports = FriendCode;