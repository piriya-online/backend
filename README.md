## Getting Started

* Add file <a href="https://raw.githubusercontent.com/piriya-online/backend/54875aef051f0878b1b773ec9c71e7691dc08adc/config.js" target="_blank">config.js</a> to your project.
* Add data to table Api with this command
```
INSERT INTO Api (apiKey, secretKey, name, description, type, website, addBy)
SELECT NEWID(), 'abc123', 'My API', 'My API Description', 'web', 'test.domain.com', 'Me'
```
