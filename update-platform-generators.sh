#!/bin/bash

update_angular() {
    local tmp=$(mktemp -d)
    local name="my-angular-app"
    pushd $tmp
    npx @angular/cli new $name --defaults
    cd $name
    rm -rf node_modules package-lock.json yarn.lock
    cat >>README.md.tmp <<'EOT'
# platform-angular

Created by the Cloud App Generator

Now that the application has been generated it can be deployed in the currently active project on OpenShift by running:

```
$ ./gap deploy
```

Now the only thing that is left to do is push the project's code to OpenShift to be run. To push the sources and
have the project be built on OpenShift you can do the following:

```
$ ./gap push
```

EOT
    cat README.md >>README.md.tmp
    mv README.md.tmp README.md
    jq '.name = "{{.nodejs.name}}" | .version = "{{.nodejs.version}}"' package.json > package.json.tmp
    mv package.json.tmp package.json
    find . \( -name "*.ts" -o -name "*.json" -o -name "*.html" \) -exec sed -i "s/$name/\{\{.nodejs.name\}\}/g" '{}' \;
    popd
    cp -a $tmp/my-angular-app/* catalog/generators/platform-angular/files/
    rm -rf $tmp
}

update_react() {
    local tmp=$(mktemp -d)
    local name="my-react-app"
    pushd $tmp
    npx create-react-app $name
    cd $name
    rm -rf node_modules package-lock.json yarn.lock
    cat >>README.md.tmp <<'EOT'
# platform-react

Created by the Cloud App Generator

Now that the application has been generated it can be deployed in the currently active project on OpenShift by running:

```
$ ./gap deploy
```

Now the only thing that is left to do is push the project's code to OpenShift to be run. To push the sources and
have the project be built on OpenShift you can do the following:

```
$ ./gap push
```

EOT
    cat README.md >>README.md.tmp
    mv README.md.tmp README.md
    jq '.name = "{{.nodejs.name}}" | .version = "{{.nodejs.version}}"' package.json > package.json.tmp
    mv package.json.tmp package.json
    popd
    cp -a $tmp/my-react-app/* catalog/generators/platform-react/files/
    rm -rf $tmp
}

update_angular
update_react

