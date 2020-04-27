# Get Started

1. Create **config.json** to the ./etc dir on sheme:

```JSON
{
    "serverPort": "8080",
    "db": {
        "username": "username_db",
        "pass": "pass_bd",
        "host": "host_db",
        "port": "port_db",
        "name": "name_db"
    }
}
```

2. run

```alias
yarn
```

to instal dependencies

3. run

```alias
yarn build
```

to building application files

4. run

```alias
yarn start
```

to start application

## Run to Prod

**Update app.js:**

1. Uncomment

```JavaScript
import https from 'https';
import fs from 'fs';
```

```JavaScript
https.createServer(options, app).listen(serverPort, function() {
  console.log(`Express server listening on port ${serverPort}`);
});
```

```JavaScript
const options = {
  key: fs.readFileSync(path.join(__dirname, './path/to/private.key', 'private.key')),
  cert: fs.readFileSync(path.join(__dirname, './path/to/certificate.srt', 'certificate.srt')),
};
```

2. To comment

```JavaScript
// import http from 'http';
```

```JavaScript
// http.createServer(app).listen(serverPort, function() {
//   console.log(`Express server listening on port ${serverPort}`);
// });
```

3. Create SSL serts in ./path/to/private.key and './path/to/certificate.srt'
