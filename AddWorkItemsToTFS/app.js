var csv = require("fast-csv");
var util = require('util');
var fs = require('fs');
var Client = require('vso-client');
var WORKITEM_API_VERSION = "1.0-preview.2";
var environmentDomain = "visualstudio.com";
var accountCollection = "DefaultCollection";
var accountBaseUrl, account, username, password, stream;


var args = process.argv.slice(2);
if (args.length != 5) {
    console.log("A path to the csv file containing the work items must be provided as an argument");
    process.exit(1);
}
stream = fs.createReadStream(args[0]);
account = args[1];
username = args[2];
password = args[3];
project = args[4];
accountBaseUrl = "https://" + account + "." + environmentDomain;





csv
 .fromStream(stream, { headers : true })
 .on("data", function (data) {
    CallVSO(data);    
})
 .on("end", function () {
    console.log("done");
});

function CallVSO(data) {
    var description, operations, title, workItemType;
    
    title = data.Title;
    description = data.Description;
    areaPath = data.AreaPath;
    operations = [];    
    workItemType = "";
    
    if (description) {
        description = description.replace(/\n/g, "<br/>");
    }
    
    addFieldChange(operations, "System.Title", title);
    addFieldChange(operations, "System.AreaPath", areaPath);
    
    switch (data.Type.toLowerCase()) {
        case "pbi":
            workItemType = "Product Backlog Item";
            addFieldChange(operations, "System.Description", description);
            break;
        case "userstory":
            workItemType = "User Story";
            addFieldChange(operations, "System.Description", description);
            break;
        case "requirement":
            workItemType = "Requirement";
            addFieldChange(operations, "System.Description", description);
            break;
        case "task":
            workItemType = "Task";
            addFieldChange(operations, "System.Description", description);
            break;
        case "feature":
            workItemType = "Feature";
            addFieldChange(operations, "System.Description", description);
            break;
        case "impediment":
            workItemType = "Impediment";
            addFieldChange(operations, "System.Description", description);
            break;
        case "bug":
            workItemType = "Bug";
            addFieldChange(operations, "Microsoft.VSTS.TCM.ReproSteps", description);
    }

    runVsoCmd(data, {
        apiVersion: WORKITEM_API_VERSION,
        cmd: function (client) {
            return client.createWorkItem(operations, project, workItemType, function (err, createdWorkItem) {
                if (err) {
                    return handleVsoError(data, err);
                }
                console.log("Work item #" + createdWorkItem.id + (" created on project " + project + ": ") + createdWorkItem._links.html.href);
            });
        }
    });
}

var runVsoCmd;

runVsoCmd = function (msg, _arg) {
    var apiVersion, cmd, collection, url, user;
    url = _arg.url, collection = _arg.collection, cmd = _arg.cmd, apiVersion = _arg.apiVersion, user = _arg.user;
    var client;
    
    client = createVsoClient({
        url: url,
        collection: collection,
        user: user,
        apiVersion: apiVersion
    });
    cmd(client);

};

var addFieldChange;

addFieldChange = function (operations, wi_refName, val, operation) {
    if (operation == null) {
        operation = "add";
    }
    operation = {
        path: "/fields/" + wi_refName,
        op: operation,
        value: val
    };
    return operations.push(operation);
};


var createVsoClient;

createVsoClient = function (_arg) {
    var apiVersion, collection, token, url, user;
    url = _arg.url, collection = _arg.collection, user = _arg.user, apiVersion = _arg.apiVersion;
    url || (url = accountBaseUrl);
    collection || (collection = accountCollection);
    apiVersion || (apiVersion = DEFAULT_API_VERSION);  
    return Client.createClient(url, collection, username, password, {
        apiVersion: apiVersion
    });
};

var handleVsoError;

handleVsoError = function (msg, err) {
    if (err) {
        return console.log("Unable to execute command: " + (util.inspect(err)));
    }
};



console.log(args);