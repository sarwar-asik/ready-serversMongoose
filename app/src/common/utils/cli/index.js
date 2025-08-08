#! /usr/bin/env node
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const yargs = require("yargs");
const utils = require("./utils");
// const translate = require('[@vitalets/google-translate-api](http://twitter.com/vitalets/google-translate-api)')
const usage = "\nUsage: tran <lang_name> sentence to be translated";
var sentence = utils.parseSentence(yargs.argv._);

if (yargs.argv._[0] == null) {
    utils.showHelp();
    return;
}

if (yargs.argv.l == true || yargs.argv.languages == true) {
    utils.showAll();
    return;
}
if (yargs.argv._[0]) {
    var language = yargs.argv._[0].toLowerCase(); // stores the language.
    //parsing the language specified to the ISO-639-1 code.                                                                                              
    language = utils.parseLanguage(language);
}

if (sentence == "") {
    console.error("\nThe entered sentence is like John Cena, I can't see it!\n")
    console.log("Enter tran --help to get started.\n")
    return;
}
// translate(sentence, { to: language }).then(res => {
//     console.log("\n" + "\n" + res.text + "\n" + "\n");
// }).catch(err => {
//     console.error(err);
// });

const options = yargs
    .usage(usage)
    .option("l", {
        alias: "languages", describe: "List all supported languages.", type: "boolean", demandOption
            : true
    })
    .help(true)
    .argv;



// eslint-disable-next-line no-console
console.log("Ready CLIs");