
const test = require('tape');
const {writeFileSync, readFileSync} = require('fs-extra');
const {fileSync} = require('tmp');
const {mergePoms} = require('../lib/core/maven');

test('merge poms', function (t) {
    t.plan(1);

    // Write target (original) file
    const targetFile = fileSync();
    writeFileSync(targetFile.name,
        `<project>
            <dependencies>
                <dependency>
                    <groupId>a</groupId>
                    <artifactId>b</artifactId>
                    <version>1.0</version>
                </dependency>
            </dependencies>
        </project>`, 'utf8');

    // Write source file
    const sourceFile = fileSync();
    writeFileSync(sourceFile.name,
        `<project>
            <dependencies>
                <dependency>
                    <groupId>c</groupId>
                    <artifactId>d</artifactId>
                    <version>2.0</version>
                </dependency>
            </dependencies>
        </project>`, 'utf8');

    mergePoms(targetFile.name, sourceFile.name)
        .then(() => {
            const result = readFileSync(targetFile.name, 'utf8');
            const expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<project>\n  <dependencies>\n    <dependency>\n      <groupId>a</groupId>\n      <artifactId>b</artifactId>\n      <version>1.0</version>\n    </dependency>\n    <dependency>\n      <groupId>c</groupId>\n      <artifactId>d</artifactId>\n      <version>2.0</version>\n    </dependency>\n  </dependencies>\n</project>\n\n";

            t.is(result, expected);
        });
});
