# sparrow-nfts

#### Start development

From a command line terminal :

1. Install all dependencies
```
 yarn
```
2. Compile smart contracts
```
 yarn sc-compile
```
3. Run local blockchain node 
```
 yarn sc-node
```
4. Deploy contract on node 
```
 yarn sc-deploy
```
5. Run docker for dev (only Redis database)
```
 docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```
6. Start backend
```
 yarn start-back:dev
```
7. Start front end
```
 yarn start-web:dev
```

#### Docker notes
1. Run docker for all (Redis, Backend, Frontend)
```
 docker-compose up -d
```

2. Run docker for ec2 environment (Using for Ec2 with Redis, Backend)
```
 docker-compose -f docker-compose.yml -f docker-compose.back.yml up -d
```

#### Folder Structure
- sc: Using **Hardhat** to write, compile, debug smart contracts.
- frontend: Using **React** to write front end code.
- backend: Using **NestJS** to write back end code.

~ Happy Coding ~
