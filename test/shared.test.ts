import { tmpdir } from "os";
import * as path from "path";
import * as uuidv4 from "uuid/v4";
import { exists, rmrf, createWriteStream, mkdir } from "../src/fs-promise";
import { deepCopyUndefined } from "../src/wrapper";

describe("shared module tests", () => {
    test("Copy of undefined properties", () => {
        const obj = { prop: undefined };
        const obj2 = {};
        deepCopyUndefined(obj2, obj);
        expect(obj2).toEqual(obj);
    });

    test("Deep copy of undefined properties", () => {
        const obj = { outer: { inner: undefined } };
        const obj2 = { outer: {} };
        deepCopyUndefined(obj2, obj);
        expect(obj2).toEqual(obj);
    });

    test("Deep copy of undefined properties should not infinitely recurse on cyclical references", () => {
        const obj = { ref: {} };
        obj.ref = obj;

        const obj2 = { ref: {} };
        obj2.ref = obj2;

        deepCopyUndefined(obj2, obj);
        expect(obj2).toEqual(obj);
    });

    test("Deep copy should not fail when objects are not shaped similarly", () => {
        const obj = { geometry: { theorem: { name: "Pythagorean" } } };
        const obj2 = { hypothesis: "Riemann" };
        deepCopyUndefined(obj2, obj);
    });

    test(`rmrf deletes directory recursively`, async () => {
        const tmp = path.join(tmpdir(), uuidv4());
        const subdir = path.join(tmp, "subdir");
        await mkdir(tmp);
        await mkdir(subdir);
        const file = path.join(subdir, "file.txt");
        const stream = createWriteStream(file);
        await new Promise((resolve, reject) =>
            stream.write("hello", err => (err ? reject(err) : resolve()))
        );
        stream.close();
        expect(await exists(file)).toBe(true);
        expect(await exists(subdir)).toBe(true);
        expect(await exists(tmp)).toBe(true);
        await rmrf(tmp);
        expect(await exists(file)).toBe(false);
        expect(await exists(subdir)).toBe(false);
        expect(await exists(tmp)).toBe(false);
    });
});
