## Add Work Items to VSO
Script to add Work Items to VS Online from a csv file

### Introduction

Node script written in javascript that uploads work items from a csv file to VSO.

The script needs to be passed command line arguments.  The script also needs a VSO user setup with alternate credentials in order to invoke the rest api's.

### Installation

To install, create and then navigate to a new directiory.

```
npm install add-workitems-to-tfs
```

### Arguments
The following command line arguments must be passed.

+ Path to the CSV file e.g. "c:\users\rob\mycsv.csv"
+ Account - The name of the VSO Account e.g. robmaher.  This will be prepended to .visualstudio.com
+ Username - The username to login with
+ Password - The password to login with (Note these are the alternate credentials)
+ Project - The name of the Team Project

So to invoke the script it might look like

```
node.exe app.js "c:\users\rob\mytest.csv", "robmaher", "robmaher", "robpwd", "myProjectName"
```
###The CSV File
The csv file has a header row and then multiple data rows.  Only a , is supported as the delimeter.

An example might be

```
"Type", "Title","Description","AreaPath"
"UserStory","First WIT", "Great Description
that has line breaks", "agiletemplate"
```
"Bug","Second WIT", "Another great description", "agiletemplate"
