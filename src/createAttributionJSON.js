// @ts-check

// @ts-ignore
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.createAttributionJSON = void 0;

const child_process = require("child_process");
const path = __importDefault(require("path"));
const fs = __importDefault(require("fs"));
const crypto = __importDefault(require("crypto"));
const prettier = require("prettier");

const createAttributionJSON = (files, opts) => {
    
    const handleDupeNames = (str) => str;

    // Being first gets you a free x commits
    const getOriginalAuthor = (filepath) => {
        const creator = child_process.execSync(`git log --follow --format="%an | %aE"  --diff-filter=A "${filepath}"`)
            .toString()
            .trim();
        return {
            name: creator.split(" | ")[0],
            email: creator.split(" | ")[1],
        };
    };

    // Gets the rest of the authors for a file
    const getAuthorsForFile = (filepath) => {
        const cmd = `git log --follow --format="%an | %aE" "${filepath}"`;
        const contributors = child_process.execSync(cmd).toString().trim();
        const allContributions = contributors.split("\n").map((c) => {
            return {
                name: handleDupeNames(c.split(" | ")[0]),
                email: c.split(" | ")[1],
            };
        });
        // Keep a map of all found authors,
        const objs = new Map();
        allContributions.forEach(c => {
            const id = c.name.toLowerCase().replace(/\s/g, "");
            const existing = objs.get(id);
            if (existing) {
                objs.set(id, {
                    name: c.name,
                    gravatar: existing.gravatar,
                    count: existing.count + 1,
                });
            }
            else {
                const email = c.email || "NOOP";
                objs.set(id, {
                    name: c.name,
                    gravatar: crypto.default.createHash("md5").update(email).digest("hex"),
                    count: 1,
                });
            }
        });
        return [...objs.values()];
    };

    
    // Convert it to { "file": { ... } }
    const json = {};
    files.forEach((fullPath) => {
        const originalRef = { top: [], total: 0, count: 0, name: "" };
        const first = getOriginalAuthor(fullPath);
        const rest = getAuthorsForFile(fullPath);
        const firstInRest = rest.find((a) => a.name === first.name);
        if (firstInRest) {
            firstInRest.count += 5;
        }

        originalRef.top.forEach((r) => {
            const inRest = rest.find((a) => a.name === r.name);
            if (inRest)
                inRest.count += r.count;
            else
                rest.push(r);
        });

        rest.sort((l, r) => r.count - l.count);

        const relativePath = fullPath.replace(opts.cwd, "");
        json[relativePath] = { top: rest.slice(0, 5), total: rest.length + originalRef.total };
    });

    const outputJSON = path.posix.join(opts.cwd, opts.output);
    fs.default.writeFileSync(outputJSON, prettier.format(JSON.stringify(json), { filepath: outputJSON }));
};

exports.createAttributionJSON = createAttributionJSON;

