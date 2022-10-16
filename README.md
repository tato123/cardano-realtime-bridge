# Overview
This serves as a simple proof-of-concept to bridge a cardano node chain-sync events to an external client. Messages are exposed via a Websocket server (see packages/nodejs-websocket-server).

The current implementation utilizes [oura](https://github.com/txpipe/oura) as a messaging bus between a cardano node to a nodejs websocket process. The implementation is a push based implementation (which replicates how systems such as google pubsub work). 

Quick breakdown of how it works
1. cardano node is started with an attached volume and an ipc file handle is created (exposed to local system and shared with other docker containers via a volume)
2. ws-cardano-bridge is started with the same volume as cardano-node so the ipc file handle can be shared.
3. Oura is started in daemon mode and connects to the cardano-node via ipc. Oura is configured to push all incoming messages from cardano to a webhook at http://localhost:9001/events (replicating google pubsub push system)
4. NodeJS application is also started and exposes rest api with `/events` resource route. Messages are `POST` from oura to the nodejs application.
5. NodeJS application exposes a websocket server avilable at `ws://localhost:9001/`
6. On a message push to `/events` nodejs utilizes an event emitter which under the hood is using a read/write stream (no data stored in the filesystem, straight pipe)
7. Websocket server listens to event stream and pushes messages to any websocket connections as a valid JSON string (see example below of running output captured via wscat `wscat -c ws://localhost:9001/`) 

## Running the server
1. `cd packages/nodejs-websocket-server`
1. `docker build -t ws-cardano-bridge:latest .`
1. `cd ../../`
1. `docker-compose up -d`

## Stopping to the server
`docker-compose down`


## Connecting to the websocket server

After running the server you can connect via any websocket client to:

`ws://localhost:9001/`

### Sample output 

```
< {"context":{"block_hash":"d42c841795c805125de3278fb0026daedfd68156644644932e7b57144527ae18","block_number":14598,"slot":15628,"timestamp":1564322976,"tx_idx":null,"tx_hash":null,"input_idx":null,"output_idx":null,"output_address":null,"certificate_idx":null},"block":{"era":"Byron","epoch":0,"epoch_slot":15628,"body_size":633,"issuer_vkey":"29e75f1d7a76480f1a1130449ab5d9a0e014c098850ca15203782adeb7561a81bb3227741749125b32b70ba63c40322f4676a8d657d9a579a0861b7c2f4c0272","tx_count":0,"slot":15628,"hash":"d42c841795c805125de3278fb0026daedfd68156644644932e7b57144527ae18","number":14598,"previous_hash":"324591acc469ed51271e3a7e39d3862af0bb548cce12cf24949e9f3a94715bbb","cbor_hex":null,"transactions":null},"fingerprint":null,"variant":"Block","timestamp":1564322976000}
< {"context":{"block_hash":"9b47fd646ee96f61b336f0f7502f24af286fcf4733413761faddf7c2c6a2975b","block_number":14599,"slot":15629,"timestamp":1564322996,"tx_idx":null,"tx_hash":null,"input_idx":null,"output_idx":null,"output_address":null,"certificate_idx":null},"block":{"era":"Byron","epoch":0,"epoch_slot":15629,"body_size":633,"issuer_vkey":"53a257951dbbc52b486d63a3a5fcea555cb9ae9ef72dad62e739ea36c23de3ec58a4ecc69a5395622605f3c379399f36c0306d975501f40f9b59735ad2809aa6","tx_count":0,"slot":15629,"hash":"9b47fd646ee96f61b336f0f7502f24af286fcf4733413761faddf7c2c6a2975b","number":14599,"previous_hash":"d42c841795c805125de3278fb0026daedfd68156644644932e7b57144527ae18","cbor_hex":null,"transactions":null},"fingerprint":null,"variant":"Block","timestamp":1564322996000}
< {"context":{"block_hash":"a496893b817eee696a50d2d3bd472f3a612c54457a1b7cbd56162ed620abc669","block_number":14600,"slot":15630,"timestamp":1564323016,"tx_idx":null,"tx_hash":null,"input_idx":null,"output_idx":null,"output_address":null,"certificate_idx":null},"block":{"era":"Byron","epoch":0,"epoch_slot":15630,"body_size":633,"issuer_vkey":"cb51d29ab94e50d9a144d4f426564cec700dee4d9e857aacf91d3b689374d81f742a452818cf2489c16dfc186f6e9c76b7df40845b7c450785f02d8809767575","tx_count":0,"slot":15630,"hash":"a496893b817eee696a50d2d3bd472f3a612c54457a1b7cbd56162ed620abc669","number":14600,"previous_hash":"9b47fd646ee96f61b336f0f7502f24af286fcf4733413761faddf7c2c6a2975b","cbor_hex":null,"transactions":null},"fingerprint":null,"variant":"Block","timestamp":1564323016000}
< {"context":{"block_hash":"9f664f907bffea07667f409b5d26f7bd3054ad0cb3efca42b4edd653b6df3bf1","block_number":14601,"slot":15631,"timestamp":1564323036,"tx_idx":null,"tx_hash":null,"input_idx":null,"output_idx":null,"output_address":null,"certificate_idx":null},"block":{"era":"Byron","epoch":0,"epoch_slot":15631,"body_size":633,"issuer_vkey":"9f0f9fc3d7f76e2522059552e87e06daf940b4581a179aec77f3905662a41865afda5afcdb44157a615cec6ff19ad399d9b0328dc82bc7f3513d40910b7f934a","tx_count":0,"slot":15631,"hash":"9f664f907bffea07667f409b5d26f7bd3054ad0cb3efca42b4edd653b6df3bf1","number":14601,"previous_hash":"a496893b817eee696a50d2d3bd472f3a612c54457a1b7cbd56162ed620abc669","cbor_hex":null,"transactions":null},"fingerprint":null,"variant":"Block","timestamp":1564323036000}
< {"context":{"block_hash":"e0f9fb532358a4e43c0267427ce8167c80cdcf96c8e01698efffe3d146628c70","block_number":14602,"slot":15632,"timestamp":1564323056,"tx_idx":null,"tx_hash":null,"input_idx":null,"output_idx":null,"output_address":null,"certificate_idx":null},"block":{"era":"Byron","epoch":0,"epoch_slot":15632,"body_size":633,"issuer_vkey":"dbbe961151576dadfac3bb579ec2b1c147c00aa4cee03c7ebef495a0ea382940aa0603da8699da09c6bdca320fcd68550ba8b2ac7919e7bd33ed58c5d9dacd44","tx_count":0,"slot":15632,"hash":"e0f9fb532358a4e43c0267427ce8167c80cdcf96c8e01698efffe3d146628c70","number":14602,"previous_hash":"9f664f907bffea07667f409b5d26f7bd3054ad0cb3efca42b4edd653b6df3bf1","cbor_hex":null,"transactions":null},"fingerprint":null,"variant":"Block","timestamp":1564323056000}
< {"context":{"block_hash":"5ddad43878f874271a12157405222bebc7b7c814238d758098bf9c492973e3ca","block_number":14603,"slot":15633,"timestamp":1564323076,"tx_idx":null,"tx_hash":null,"input_idx":null,"output_idx":null,"output_address":null,"certificate_idx":null},"block":{"era":"Byron","epoch":0,"epoch_slot":15633,"body_size":633,"issuer_vkey":"1c84905901d3cb521d5c433bb13a590cd2103b46a5148fbe60513ab000f994dd41343cd30d2cc37d479aa0055606f4ff2f92dc1dd473b234609cf70e3a6dbc82","tx_count":0,"slot":15633,"hash":"5ddad43878f874271a12157405222bebc7b7c814238d758098bf9c492973e3ca","number":14603,"previous_hash":"e0f9fb532358a4e43c0267427ce8167c80cdcf96c8e01698efffe3d146628c70","cbor_hex":null,"transactions":null},"fingerprint":null,"variant":"Block","timestamp":1564323076000}
```