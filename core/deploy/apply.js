'use strict';

const me = require('.');
const printUsage = require("@core/info").printUsage;

const args = process.argv.slice(2);

if (args.length === 1 && args[0] === "--list") {
    process.stdout.write(`Available capabilities:\n`);
    me.listCapabilities().forEach(c => process.stdout.write(`    ${c.module.slice(14)}\n`));
    process.exit(0);
}

if (args.length === 2 && args[1] === "--help") {
    const CAP = args[0];
    console.log(`yarn run -s apply ${CAP} <project_dir> [<capability_name>] [<json_props>]`);
    console.log(`    capability      - The name of the Capability to apply.`);
    console.log(`                      Use 'yarn run -s apply --list' for a list of available capabilities.`);
    console.log(`    project_dir     - The project directory. Will be created if it doesn't exist.`);
    console.log(`    capability_name - The name that will be given to any OpenShift/K8s resources that will be created.`);
    console.log(`    json_props      - These will be passed to the Capability:`);
    printUsage(me.getCapabilityModule(CAP).info());
    process.exit(0);
}

if (args.length < 2) {
    console.error(`Missing arguments`);
    console.log(`Usage: yarn run -s apply <capability> <project_dir> [<capability_name>] [<json_props>]`);
    console.log(`                         <capability> --help`);
    console.log(`                         --list`);
    console.log(`    capability      - The name of the Capability to apply.`);
    console.log(`                      Use 'yarn run -s apply --list' for a list of available capabilities.`);
    console.log(`    project_dir     - The project directory. Will be created if it doesn't exist.`);
    console.log(`    capability_name - The name that will be given to any OpenShift/K8s resources that will be created.`);
    console.log(`    json_props      - The properties that will be passed to the Capability.`);
    console.log(`                      Use 'yarn run -s apply <capability> --help' for more information.`);
    process.exit(1);
}

const CAP = args[0];
const TARGET_DIR = args[1];
const CAP_NAME = args[2] || CAP;
const PROPS = args[3] || "{}";

me.apply(CAP_NAME, TARGET_DIR, CAP, JSON.parse(PROPS))
    .catch(err => console.error(`Application Error: ${err}`));