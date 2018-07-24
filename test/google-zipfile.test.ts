import { checkCodeBundle } from "./tests";
import * as path from "path";

const kb = 1024;

checkCodeBundle(
    "Package google https function with bundling",
    "google",
    "https-bundle",
    20 * kb
);

checkCodeBundle(
    "Package google https function with package.json",
    "google",
    "https-package",
    20 * kb,
    {},
    "test/package.json"
);

checkCodeBundle(
    "Package google queue function with bundling",
    "google",
    "queue-bundle",
    700 * kb,
    {
        useQueue: true
    }
);

checkCodeBundle(
    "Package google queue function with package.json",
    "google",
    "queue-package",
    20 * kb,
    {
        useQueue: true
    },
    "test/package.json"
);

checkCodeBundle(
    "Package google emulator https function",
    "google-emulator",
    "emulator-https-bundle",
    20 * kb
);